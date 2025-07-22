from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, Form, status, Path, Body, Query
from fastapi.responses import StreamingResponse
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types
from sqlalchemy.orm import Session
from typing import List
import uuid
import json
import re
import requests
from datetime import datetime

from src.auth.service import get_current_user
from src.auth.models import Users
from src.gcs.uploader import upload_large_file_to_gcs
from src.dependencies import get_db
from src.recipes.models import Recipe, IngredientCalories
from src.recipes.schemas import (
    FavoriteStatusResponse,
    RecipeResponse, 
    RecipePatchRequest, 
    PaginatedRecipesResponse, 
    PaginatedFavoriteRecipesResponse,
    FavoriteStatusResponse,
    CategoryResponse,
    CategoryListResponse,
    SortOrder
)
from src.recipes.service import (
    get_recipe_by_slug, 
    get_recipe_response_by_slug, 
    get_recipes_paginated, 
    get_public_recipes_paginated, 
    get_my_recipes_paginated,
    get_favorite_recipes_paginated,
    add_to_favorites,
    remove_from_favorites,
    is_recipe_favorited,
    get_categories,
    create_recipe_with_categories
)
from src.services.redis import (
    redis_client, 
    invalidate_recipe_caches, 
    invalidate_user_caches,
    invalidate_favorite_caches
)

from src.recipes.agents import root_agent, checking_agent
from src.gcs.signed_urls import signed_url_service

# Custom JSON encoder for datetime objects
class DateTimeEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.isoformat()
        return super().default(obj)

APP_NAME = "dish_analysis_app"
session_service = InMemorySessionService()
runner = Runner(
    agent=root_agent,
    app_name=APP_NAME,
    session_service=session_service,
)
checking_runner = Runner(
    agent=checking_agent,
    app_name=APP_NAME,
    session_service=session_service,
)


router = APIRouter(prefix="/dish", tags=["dish"])

@router.get("/", response_model=PaginatedRecipesResponse, status_code=status.HTTP_200_OK)
async def get_all_dishes(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Number of items per page"),
    sort_by: SortOrder = Query(SortOrder.NEWEST, description="Sort order for recipes")
):
    cache_key = f"recipes:page={page}:size={page_size}:sort={sort_by}"
    
    cached_data = await redis_client.get(cache_key)
    if cached_data:
        return PaginatedRecipesResponse(**json.loads(cached_data))

    response: PaginatedRecipesResponse = get_recipes_paginated(db, page=page, page_size=page_size, sort_by=sort_by)

    await redis_client.set(cache_key, json.dumps(response.model_dump(), cls=DateTimeEncoder), ex=300)

    return response

@router.get("/recipes/{slug}/", response_model=RecipeResponse)
async def get_recipe(slug: str, db: Session = Depends(get_db)):
    cache_key = f"recipe:slug={slug}"
    cached_data = await redis_client.get(cache_key)

    if cached_data:
        return RecipeResponse(**json.loads(cached_data))

    recipe_response = get_recipe_response_by_slug(db, slug)
    if not recipe_response:
        raise HTTPException(status_code=404, detail="Recipe not found")

    await redis_client.set(cache_key, json.dumps(recipe_response.model_dump(), cls=DateTimeEncoder), ex=1000)

    return recipe_response

@router.get("/image-proxy/{recipe_id}/")
async def proxy_recipe_image(
    recipe_id: int,
    db: Session = Depends(get_db)
):
    """Proxy recipe image to avoid CORS issues"""
    try:
        recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
        if not recipe:
            raise HTTPException(status_code=404, detail="Recipe not found")
        
        if not recipe.image_path:
            raise HTTPException(status_code=404, detail="Image not found")
        
        # Извлекаем blob name из URL и генерируем подписанный URL
        blob_name = signed_url_service.extract_blob_name_from_url(recipe.image_path)
        if not blob_name:
            raise HTTPException(status_code=400, detail="Invalid image path")
        
        signed_url = signed_url_service.generate_signed_url(blob_name, expiration_minutes=60)
        if not signed_url:
            raise HTTPException(status_code=404, detail="Failed to generate signed URL")
        
        # Загружаем изображение через подписанный URL
        response = requests.get(signed_url, stream=True)
        if response.status_code != 200:
            raise HTTPException(status_code=404, detail="Failed to load image")
        
        # Определяем content type
        content_type = response.headers.get('content-type', 'image/jpeg')
        
        # Возвращаем изображение как поток
        return StreamingResponse(
            response.iter_content(chunk_size=8192),
            media_type=content_type,
            headers={
                'Cache-Control': 'public, max-age=3600',
                'Access-Control-Allow-Origin': '*'
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to proxy image: {str(e)}")

@router.post("/")
async def analyze_dish(
    file: UploadFile = File(...), 
    location: str = Form(None),
    current_user: Users = Depends(get_current_user)
):
    try:
        image_data = await file.read()

        USER_ID = str(current_user["id"])
        SESSION_ID = str(uuid.uuid4())
        await session_service.create_session(
            app_name=APP_NAME,
            user_id=USER_ID,
            session_id=SESSION_ID,
        )

        content_parts = [types.Part(
            inline_data=types.Blob(
                mime_type=file.content_type,
                data=image_data
            )
        )]
        
        if location:
            content_parts.append(types.Part(text=f"User location: {location}"))

        content = types.Content(
            role="user",
            parts=content_parts
        )

        checking_result = "Agent did not respond"
        async for event in checking_runner.run_async(
            user_id=USER_ID,
            session_id=SESSION_ID,
            new_message=content
        ):
            if event.is_final_response() and event.content and event.content.parts:
                checking_result = event.content.parts[0].text
                break

        cleaned_checking = re.sub(r"^```(?:json)?\s*|\s*```$", "", (checking_result or "").strip(), flags=re.MULTILINE)
        checking_data = json.loads(cleaned_checking)

        if not checking_data.get("is_food"):
            return {
                "message": "Not food",
                "description": checking_data.get("description", "Unknown")
            }

        final_response = "Agent did not respond"
        async for event in runner.run_async(
            user_id=USER_ID,
            session_id=SESSION_ID,
            new_message=content
        ):
            if (
                event.is_final_response()
                and event.author == "final_agent"
                and event.content
                and event.content.parts
            ):
                final_response = event.content.parts[0].text
                break
        
        print("\n=== RAW FINAL RESPONSE ===")
        print(final_response)
        print("==========================\n")

        cleaned = re.sub(r"^```(?:json)?\s*|\s*```$", "", (final_response or "").strip(), flags=re.MULTILINE)
        parsed = json.loads(cleaned)

        return {
            "filename": file.filename,
            "analysis": parsed
        }

    except Exception as e:
        print("❌ Error:", str(e))
        raise HTTPException(status_code=500, detail=f"Failed to analyze dish: {str(e)}")

@router.post("/save/")
async def save_recipe(
    file: UploadFile = File(...),
    recipe: str = Form(...),
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        image_url = upload_large_file_to_gcs(file)
        parsed = json.loads(recipe)

        dish_name = parsed.get("dish_name")
        recipe_text = parsed.get("recipe")
        ingredients_calories = parsed.get("ingredients_calories", [])
        estimated_weight_g = parsed.get("estimated_weight_g")
        total_calories_per_100g = parsed.get("total_calories_per_100g")
        health_categories = parsed.get("health_categories", [])
        
        print(f"=== SAVE RECIPE DEBUG ===")
        print(f"Raw health_categories: {health_categories}")
        print(f"Type: {type(health_categories)}")
        print(f"========================")

        if not dish_name or not recipe_text or not ingredients_calories:
            raise HTTPException(status_code=400, detail="Invalid recipe format")

        # Use new function that handles categories
        db_recipe = create_recipe_with_categories(
            db=db,
            user_id=current_user["id"],
            dish_name=dish_name,
            recipe_text=recipe_text,
            image_path=image_url,
            estimated_weight_g=estimated_weight_g,
            total_calories_per_100g=total_calories_per_100g,
            health_categories=health_categories
        )

        # Add ingredients
        for item in ingredients_calories:
            ingredient = item.get("ingredient")
            calories = item.get("calories")
            if not ingredient or calories is None:
                continue

            db_ingredient = IngredientCalories(
                recipe_id=db_recipe.id,  # type: ignore
                ingredient=ingredient,
                calories=calories
            )
            db.add(db_ingredient)

        db.commit()
        db.refresh(db_recipe)  # Обновляем объект после коммита

        # Invalidate caches after saving new recipe
        await invalidate_recipe_caches()
        await invalidate_user_caches(current_user["id"])

        # Возвращаем и recipe_id и slug
        return {
            "message": "Recipe saved successfully", 
            "recipe_id": db_recipe.id,
            "slug": db_recipe.slug  # Добавляем slug в ответ
        }

    except Exception as e:
        print("❌ Error saving recipe:", str(e))
        raise HTTPException(status_code=500, detail=f"Failed to save recipe: {str(e)}")

@router.patch("/recipes/{slug}/", response_model=RecipeResponse)
async def update_recipe(
    slug: str,
    recipe_update: RecipePatchRequest,
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        recipe = db.query(Recipe).filter(Recipe.slug == slug, Recipe.user_id == current_user["id"]).first()
        if not recipe:
            raise HTTPException(status_code=404, detail="Recipe not found or unauthorized")
        
        # Update recipe fields
        update_data = recipe_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(recipe, field, value)
        
        db.commit()
        db.refresh(recipe)
        
        return RecipeResponse.from_orm(recipe)
    except Exception as e:
        import traceback
        print(f"=== UPDATE RECIPE ERROR ===")
        print(f"Error type: {type(e).__name__}")
        print(f"Error message: {str(e)}")
        print(f"Full traceback:")
        traceback.print_exc()
        print(f"========================")
        raise HTTPException(status_code=500, detail=f"Update failed: {str(e)}")

    
@router.patch("/patch/{recipe_id}")
async def patch_recipe(
    recipe_id: int,
    patch_data: RecipePatchRequest = Body(...),
    db: Session = Depends(get_db)
):
    recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    
    # Store old slug for cache invalidation
    old_slug = str(recipe.slug)
    
    # Update recipe fields
    update_data = {}
    if patch_data.dish_name is not None:
        update_data["dish_name"] = patch_data.dish_name
    if patch_data.publish is not None:
        update_data["is_published"] = patch_data.publish
    
    # Update using query
    db.query(Recipe).filter(Recipe.id == recipe_id).update(update_data)
    db.commit()
    db.refresh(recipe)

    # Invalidate caches
    await invalidate_recipe_caches(old_slug)
    if old_slug != str(recipe.slug):  # If slug changed
        await invalidate_recipe_caches(str(recipe.slug))
    
    # Also invalidate user-specific caches
    user_id = getattr(recipe, 'user_id', None)
    if user_id:
        await invalidate_user_caches(user_id)

    return {"message": "Recipe updated", "recipe": {
        "id": recipe.id,
        "name": recipe.dish_name,
        "status": recipe.is_published
    }}

@router.delete("/{recipe_id}/", status_code=status.HTTP_200_OK)
async def delete_recipe(
    recipe_id: int = Path(..., description="ID of the recipe to delete"),
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        recipe = db.query(Recipe).filter(Recipe.id == recipe_id, Recipe.user_id == current_user["id"]).first()
        if not recipe:
            raise HTTPException(status_code=404, detail="Recipe not found or unauthorized")

        recipe_slug = str(recipe.slug)
        
        db.delete(recipe)
        db.commit()

        # Invalidate caches
        await invalidate_recipe_caches(recipe_slug)
        await invalidate_user_caches(current_user["id"])

        return {"message": f"Recipe with ID {recipe_id} deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete recipe: {str(e)}")

@router.get("/public/", response_model=PaginatedRecipesResponse)
async def get_public_recipe(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Number of items per page"),
    sort_by: SortOrder = Query(SortOrder.NEWEST, description="Sort order for recipes")
):
    cache_key = f"recipes:public:page={page}:size={page_size}:sort={sort_by}"
    
    cached_data = await redis_client.get(cache_key)
    if cached_data:
        return PaginatedRecipesResponse(**json.loads(cached_data))

    response: PaginatedRecipesResponse = get_public_recipes_paginated(db, page=page, page_size=page_size, sort_by=sort_by)

    await redis_client.set(cache_key, json.dumps(response.model_dump(), cls=DateTimeEncoder), ex=300)

    return response


@router.get("/my/", response_model=PaginatedRecipesResponse)
async def get_my_recipes(
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Number of items per page"),
    sort_by: SortOrder = Query(SortOrder.NEWEST, description="Sort order for recipes")
):
    cache_key = f"recipes:my:user_id={current_user['id']}:page={page}:size={page_size}:sort={sort_by}"
    
    cached_data = await redis_client.get(cache_key)
    if cached_data:
        return PaginatedRecipesResponse(**json.loads(cached_data))

    response: PaginatedRecipesResponse = get_my_recipes_paginated(db, current_user["id"], page=page, page_size=page_size, sort_by=sort_by)

    await redis_client.set(cache_key, json.dumps(response.model_dump(), cls=DateTimeEncoder), ex=300)

    return response


#Favorites

@router.get("/favorites/", response_model=PaginatedFavoriteRecipesResponse)
async def get_favorite_revipes(
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Number of items per page"),
    sort_by: SortOrder = Query(SortOrder.NEWEST, description="Sort order for recipes")
):
    cache_key = f"favorites:user_id={current_user['id']}:page={page}:size={page_size}:sort={sort_by}"

    cached_data = await redis_client.get(cache_key)
    if cached_data:
        return  PaginatedFavoriteRecipesResponse(**json.loads(cached_data))

    response: PaginatedFavoriteRecipesResponse = get_favorite_recipes_paginated(db, current_user["id"], page=page, page_size=page_size, sort_by=sort_by)

    await redis_client.set(cache_key, json.dumps(response.model_dump(), cls=DateTimeEncoder), ex=300)

    return response

@router.post("/favorites/{recipe_id}/", response_model=FavoriteStatusResponse)
async def add_recipe_to_favorites(
    recipe_id: int = Path(..., description="Recipe ID to add to favorites"),
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Add recipe to user's favorites"""
    try:
        success = add_to_favorites(db, current_user["id"], recipe_id)
        
        if success:
            # Инвалидируем кэш избранного для пользователя
            await invalidate_favorite_caches(current_user["id"])
            
            return FavoriteStatusResponse(
                is_favorited=True,
                recipe_id=recipe_id,
                message="Recipe added to favorites"
            )
        else:
            raise HTTPException(
                status_code=400, 
                detail="Recipe not found, already in favorites, or is your own recipe"
            )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add to favorites: {str(e)}")

@router.delete("/favorites/{recipe_id}/", response_model=FavoriteStatusResponse)
async def remove_recipe_from_favorites(
    recipe_id: int = Path(..., description="Recipe ID to remove from favorites"),
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Remove recipe from user's favorites"""
    try:
        success = remove_from_favorites(db, current_user["id"], recipe_id)
        
        if success:
            # Инвалидируем кэш избранного для пользователя
            await invalidate_favorite_caches(current_user["id"])
            
            return FavoriteStatusResponse(
                is_favorited=False,
                recipe_id=recipe_id,
                message="Recipe removed from favorites"
            )
        else:
            raise HTTPException(status_code=404, detail="Recipe not found in favorites")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to remove from favorites: {str(e)}")

@router.get("/favorites/check/{recipe_id}/", response_model=FavoriteStatusResponse)
async def check_favorite_status(
    recipe_id: int = Path(..., description="Recipe ID to check"),
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Check if recipe is in user's favorites"""
    try:
        is_favorited = is_recipe_favorited(db, current_user["id"], recipe_id)
        
        return FavoriteStatusResponse(
            is_favorited=is_favorited,
            recipe_id=recipe_id,
            message="Favorite status checked"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to check favorite status: {str(e)}")


# Categories endpoints

@router.get("/categories/", response_model=CategoryListResponse)
async def get_all_categories(db: Session = Depends(get_db)):
    """Get all available categories"""
    try:
        categories = get_categories(db)
        return CategoryListResponse(categories=categories) # type: ignore
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get categories: {str(e)}")

@router.get("/categories/health/", response_model=List[str])
async def get_health_categories():
    """Get list of available health categories"""
    from src.recipes.models import HEALTH_CATEGORIES
    return HEALTH_CATEGORIES

@router.get("/image/{recipe_id}/")
async def get_recipe_image_url(
    recipe_id: int,
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get signed URL for recipe image"""
    try:
        recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
        if not recipe:
            raise HTTPException(status_code=404, detail="Recipe not found")
        
        # Проверяем права доступа (только для публичных рецептов или собственных)
        if not recipe.is_published and recipe.user_id != current_user["id"]:
            raise HTTPException(status_code=403, detail="Access denied")
        
        if not recipe.image_path:
            raise HTTPException(status_code=404, detail="Image not found")
        
        # Извлекаем blob name из URL
        blob_name = signed_url_service.extract_blob_name_from_url(recipe.image_path)
        if not blob_name:
            raise HTTPException(status_code=400, detail="Invalid image path")
        
        # Генерируем подписанный URL на 1 час
        signed_url = signed_url_service.generate_signed_url(blob_name, expiration_minutes=60)
        
        return {"signed_url": signed_url}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get image URL: {str(e)}")