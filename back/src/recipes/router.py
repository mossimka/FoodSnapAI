from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, Form, status, Path, Body, Query
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types
from sqlalchemy.orm import Session
from typing import List
import uuid
import json
import re

from src.auth.service import get_current_user
from src.auth.models import Users
from src.gcs.uploader import upload_large_file_to_gcs
from src.dependencies import get_db
from src.recipes.models import Recipe, IngredientCalories
from src.recipes.schemas import RecipeResponse, RecipePatchRequest, PaginatedRecipesResponse
from src.recipes.service import get_recipe_by_slug, get_recipe_response_by_slug, get_recipes_paginated, get_public_recipes_paginated, get_my_recipes_paginated
from src.services.redis import redis_client, invalidate_recipe_caches, invalidate_user_caches

from src.recipes.agents import root_agent, checking_agent

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
    page_size: int = Query(20, ge=1, le=100, description="Number of items per page")
):
    cache_key = f"recipes:page={page}:size={page_size}"
    
    cached_data = await redis_client.get(cache_key)
    if cached_data:
        return PaginatedRecipesResponse(**json.loads(cached_data))

    response: PaginatedRecipesResponse = get_recipes_paginated(db, page=page, page_size=page_size)

    await redis_client.set(cache_key, json.dumps(response.model_dump()), ex=300)

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

    await redis_client.set(cache_key, json.dumps(recipe_response.model_dump()), ex=1000)

    return recipe_response

@router.post("/")
async def analyze_dish(file: UploadFile = File(...), current_user: Users = Depends(get_current_user)):
    try:
        image_data = await file.read()

        USER_ID = str(current_user["id"])
        SESSION_ID = str(uuid.uuid4())
        await session_service.create_session(
            app_name=APP_NAME,
            user_id=USER_ID,
            session_id=SESSION_ID,
        )

        content = types.Content(
            role="user",
            parts=[types.Part(
                inline_data=types.Blob(
                    mime_type=file.content_type,
                    data=image_data
                )
            )]
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
        
        #print("\n=== RAW FINAL RESPONSE ===")
        #print(final_response)
        #print("==========================\n")

        cleaned = re.sub(r"^```(?:json)?\s*|\s*```$", "", (final_response or "").strip(), flags=re.MULTILINE)
        parsed = json.loads(cleaned)

        return {
            "filename": file.filename,
            "analysis": parsed
        }

    except Exception as e:
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


        if not dish_name or not recipe_text or not ingredients_calories:
            raise HTTPException(status_code=400, detail="Invalid recipe format")

        db_recipe = Recipe(
            user_id=current_user["id"],
            dish_name=dish_name,
            recipe=recipe_text,
            image_path=image_url,
            estimated_weight_g=estimated_weight_g,
            total_calories_per_100g=total_calories_per_100g,
        )
        
        db.add(db_recipe)
        db.flush()
        db_recipe.generate_slug()
        db.commit()
        db.refresh(db_recipe)

        for item in ingredients_calories:
            ingredient = item.get("ingredient")
            calories = item.get("calories")
            if not ingredient or calories is None:
                continue

            db_ingredient = IngredientCalories(
                recipe_id=db_recipe.id,
                ingredient=ingredient,
                calories=calories
            )
            db.add(db_ingredient)

        db.commit()

        # Invalidate caches after saving new recipe
        await invalidate_recipe_caches()
        await invalidate_user_caches(current_user["id"])

        return {
            "message": "Recipe saved successfully",
            "recipe_id": db_recipe.id,
            "slug": db_recipe.slug
        }

    except Exception as e:
        import traceback
        print(f"=== SAVE RECIPE ERROR ===")
        print(f"Error type: {type(e).__name__}")
        print(f"Error message: {str(e)}")
        print(f"Full traceback:")
        traceback.print_exc()
        print(f"========================")
        raise HTTPException(status_code=500, detail=f"Saving failed: {str(e)}")

    
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
    page_size: int = Query(20, ge=1, le=100, description="Number of items per page")
):
    cache_key = f"recipes:public:page={page}:size={page_size}"
    
    cached_data = await redis_client.get(cache_key)
    if cached_data:
        return PaginatedRecipesResponse(**json.loads(cached_data))

    response: PaginatedRecipesResponse = get_public_recipes_paginated(db, page=page, page_size=page_size)

    await redis_client.set(cache_key, json.dumps(response.model_dump()), ex=300)

    return response


@router.get("/my/", response_model=PaginatedRecipesResponse)
async def get_my_recipes(
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Number of items per page")
):
    cache_key = f"recipes:my:user_id={current_user['id']}:page={page}:size={page_size}"
    
    cached_data = await redis_client.get(cache_key)
    if cached_data:
        return PaginatedRecipesResponse(**json.loads(cached_data))

    response: PaginatedRecipesResponse = get_my_recipes_paginated(db, current_user["id"], page=page, page_size=page_size)

    await redis_client.set(cache_key, json.dumps(response.model_dump()), ex=300)

    return response

