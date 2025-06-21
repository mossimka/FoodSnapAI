from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, Form, status, Path, Body
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
from src.recipes.models import Recipe
from src.recipes.schemas import RecipeResponse, RecipePatchRequest
from src.recipes.service import get_recipes

from src.recipes.agents import root_agent, checking_agent

APP_NAME = "dish_analysis_app"
session_service = InMemorySessionService()
runner = Runner(
    agent=root_agent,
    app_name=APP_NAME,
    session_service=session_service,
)


router = APIRouter(prefix="/dish", tags=["dish"])

@router.get("/", response_model=List[RecipeResponse], status_code=status.HTTP_200_OK)
async def get_all_dishes(db: Session = Depends(get_db)):
    return get_recipes(db)

@router.post("/")
async def analyze_dish(file: UploadFile = File(...), current_user: Users = Depends(get_current_user)):
    try:
        # Считываем содержимое файла в байты
        image_data = await file.read()

        USER_ID = str(current_user["id"])
        # Создаем уникальную сессию
        SESSION_ID = str(uuid.uuid4())
        await session_service.create_session(
            app_name=APP_NAME,
            user_id=USER_ID,
            session_id=SESSION_ID,
        )

        # Передаём изображение как Blob
        content = types.Content(
            role="user",
            parts=[types.Part(
                inline_data=types.Blob(
                    mime_type=file.content_type,  # Например, "image/png"
                    data=image_data
                )
            )]
        )

        # Запускаем агента
        final_response = "Agent did not respond"
        async for event in runner.run_async(
            user_id=USER_ID,
            session_id=SESSION_ID,
            new_message=content
        ):
            if event.is_final_response() and event.content and event.content.parts:
                final_response = event.content.parts[0].text
                break

        cleaned = re.sub(r"^```(?:json)?\s*|\s*```$", "", final_response.strip(), flags=re.MULTILINE)

        print("👉 Cleaned final response:", cleaned)

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
        ingredients = ", ".join(parsed.get("ingredients", []))
        recipe_text = parsed.get("recipe")

        if not dish_name or not recipe_text:
            raise HTTPException(status_code=400, detail="Invalid recipe format")

        db_recipe = Recipe(
            user_id=current_user["id"],
            dish_name=dish_name,
            ingredients=ingredients,
            recipe=recipe_text,
            image_path=image_url
        )

        db.add(db_recipe)
        db.commit()
        db.refresh(db_recipe)

        return {"message": "Recipe saved successfully", "recipe_id": db_recipe.id}

    except Exception as e:
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
    
    if patch_data.dish_name is not None:
        recipe.dish_name = patch_data.dish_name
    if patch_data.publish is not None:
        recipe.is_published = patch_data.publish

    db.commit()
    db.refresh(recipe)

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

        db.delete(recipe)
        db.commit()

        return {"message": f"Recipe with ID {recipe_id} deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete recipe: {str(e)}")

@router.get("/public/", response_model=List[RecipeResponse])
async def get_public_recipe(db: Session = Depends(get_db)):
    recipes = db.query(Recipe).filter(Recipe.is_published == True).all()
    return [
        RecipeResponse(
            id=r.id, 
            user_id=r.user_id,
            user_name=r.user.username,
            user_avatar=r.user.profile_pic,
            dish_name=r.dish_name,
            ingredients=[i.strip() for i in r.ingredients.split(",")],
            recipe=r.recipe,
            image_path=r.image_path,
            is_published=r.is_published
        )
        for r in recipes
    ]


@router.get("/my/", response_model=List[RecipeResponse])
async def get_my_recipes(current_user: Users = Depends(get_current_user), db: Session = Depends(get_db)):
    recipes = db.query(Recipe).filter(Recipe.user_id == current_user["id"]).all()
    return [
        RecipeResponse(
            id=r.id, 
            user_id=r.user_id,
            user_name=r.user.username,
            user_avatar=r.user.profile_pic,
            dish_name=r.dish_name,
            ingredients=[i.strip() for i in r.ingredients.split(",")],
            recipe=r.recipe,
            image_path=r.image_path,
            is_published=r.is_published
        )
        for r in recipes
    ]
