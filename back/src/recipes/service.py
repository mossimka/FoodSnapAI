from src.recipes.models import Recipe
from sqlalchemy.orm import Session
from typing import List
from math import ceil

from src.auth.models import Users
from src.recipes.schemas import RecipeResponse, UserResponse, IngredientCaloriesResponse, PaginatedRecipesResponse


def get_recipes(db: Session) -> List[Recipe]:
    return db.query(Recipe).join(Users).all()

def get_recipe_by_slug(db: Session, slug: str) -> Recipe:
    return db.query(Recipe).filter(Recipe.slug == slug).first()


def get_recipes_paginated(db: Session, page: int = 1, page_size: int = 20) -> PaginatedRecipesResponse:
    """Get all recipes with pagination"""
    offset = (page - 1) * page_size
    
    recipes_query = db.query(Recipe).join(Users).offset(offset).limit(page_size)
    recipes = recipes_query.all()
    
    total_recipes = db.query(Recipe).count()
    total_pages = ceil(total_recipes / page_size)
    
    return PaginatedRecipesResponse(
        recipes=[
            RecipeResponse(
                id=r.id,
                slug=r.slug,
                user_id=r.user_id,
                user=UserResponse(
                    username=r.user.username,
                    profile_pic=r.user.profile_pic
                ),
                dish_name=r.dish_name,
                recipe=r.recipe,
                image_path=r.image_path,
                is_published=r.is_published,
                ingredients_calories=[
                    IngredientCaloriesResponse.model_validate(i)
                    for i in r.ingredients_calories
                ],
                estimated_weight_g=r.estimated_weight_g,
                total_calories_per_100g=r.total_calories_per_100g,
            )
            for r in recipes
        ],
        total=total_recipes,
        page=page,
        page_size=page_size,
        total_pages=total_pages
    )


def get_public_recipes_paginated(db: Session, page: int = 1, page_size: int = 20) -> PaginatedRecipesResponse:
    """Get public recipes with pagination"""
    offset = (page - 1) * page_size
    
    recipes_query = db.query(Recipe).join(Users).filter(Recipe.is_published == True).offset(offset).limit(page_size)
    recipes = recipes_query.all()
    
    total_recipes = db.query(Recipe).filter(Recipe.is_published == True).count()
    total_pages = ceil(total_recipes / page_size)
    
    return PaginatedRecipesResponse(
        recipes=[
            RecipeResponse(
                id=r.id,
                slug=r.slug,
                user_id=r.user_id,
                user=UserResponse(
                    username=r.user.username,
                    profile_pic=r.user.profile_pic
                ),
                dish_name=r.dish_name,
                recipe=r.recipe,
                image_path=r.image_path,
                is_published=r.is_published,
                ingredients_calories=[
                    IngredientCaloriesResponse.model_validate(i)
                    for i in r.ingredients_calories
                ],
                estimated_weight_g=r.estimated_weight_g,
                total_calories_per_100g=r.total_calories_per_100g,
            )
            for r in recipes
        ],
        total=total_recipes,
        page=page,
        page_size=page_size,
        total_pages=total_pages
    )


def get_my_recipes_paginated(db: Session, user_id: int, page: int = 1, page_size: int = 20) -> PaginatedRecipesResponse:
    """Get user's recipes with pagination"""
    offset = (page - 1) * page_size
    
    recipes_query = db.query(Recipe).join(Users).filter(Recipe.user_id == user_id).offset(offset).limit(page_size)
    recipes = recipes_query.all()
    
    total_recipes = db.query(Recipe).filter(Recipe.user_id == user_id).count()
    total_pages = ceil(total_recipes / page_size)
    
    return PaginatedRecipesResponse(
        recipes=[
            RecipeResponse(
                id=r.id,
                slug=r.slug,
                user_id=r.user_id,
                user=UserResponse(
                    username=r.user.username,
                    profile_pic=r.user.profile_pic
                ),
                dish_name=r.dish_name,
                recipe=r.recipe,
                image_path=r.image_path,
                is_published=r.is_published,
                ingredients_calories=[
                    IngredientCaloriesResponse.model_validate(i)
                    for i in r.ingredients_calories
                ],
                estimated_weight_g=r.estimated_weight_g,
                total_calories_per_100g=r.total_calories_per_100g,
            )
            for r in recipes
        ],
        total=total_recipes,
        page=page,
        page_size=page_size,
        total_pages=total_pages
    )