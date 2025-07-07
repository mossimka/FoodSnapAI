from src.recipes.models import Recipe, FavoriteRecipe
from sqlalchemy.orm import Session
from typing import List, Optional
from math import ceil

from src.auth.models import Users
from src.recipes.schemas import (
    RecipeResponse, 
    UserResponse, 
    IngredientCaloriesResponse, 
    PaginatedRecipesResponse,
    PaginatedFavoriteRecipesResponse,
    FavoriteRecipeResponse
)

# Helper functions
def _build_recipe_response(recipe: Recipe) -> RecipeResponse:
    """Helper function to build RecipeResponse from Recipe model"""
    return RecipeResponse(
        id=recipe.id,
        slug=recipe.slug,
        user_id=recipe.user_id,
        user=UserResponse(
            username=recipe.user.username,
            profile_pic=recipe.user.profile_pic
        ),
        dish_name=recipe.dish_name,
        recipe=recipe.recipe,
        image_path=recipe.image_path,
        is_published=recipe.is_published,
        ingredients_calories=[
            IngredientCaloriesResponse.model_validate(i)
            for i in recipe.ingredients_calories
        ],
        estimated_weight_g=recipe.estimated_weight_g,
        total_calories_per_100g=recipe.total_calories_per_100g,
    )

def _build_favorite_recipe_response(favorite_recipe: FavoriteRecipe) -> FavoriteRecipeResponse:
    """Helper function to build FavoriteRecipeResponse from FavoriteRecipe model"""
    return FavoriteRecipeResponse(
        id=favorite_recipe.id,
        user_id=favorite_recipe.user_id,
        recipe_id=favorite_recipe.recipe_id,
        recipe=_build_recipe_response(favorite_recipe.recipe)
    )

# Basic recipe operations
def get_recipes(db: Session) -> List[Recipe]:
    return db.query(Recipe).join(Users).all()

def get_recipe_by_slug(db: Session, slug: str) -> Optional[Recipe]:
    return db.query(Recipe).filter(Recipe.slug == slug).first()

def get_recipe_response_by_slug(db: Session, slug: str) -> Optional[RecipeResponse]:
    """Get recipe by slug and return as RecipeResponse for API"""
    recipe = get_recipe_by_slug(db, slug)
    return _build_recipe_response(recipe) if recipe else None

# Recipe pagination
def get_recipes_paginated(db: Session, page: int = 1, page_size: int = 20) -> PaginatedRecipesResponse:
    """Get all recipes with pagination"""
    offset = (page - 1) * page_size
    
    recipes = db.query(Recipe).join(Users).offset(offset).limit(page_size).all()
    total_recipes = db.query(Recipe).count()
    total_pages = ceil(total_recipes / page_size)
    
    return PaginatedRecipesResponse(
        recipes=[_build_recipe_response(r) for r in recipes],
        total=total_recipes,
        page=page,
        page_size=page_size,
        total_pages=total_pages
    )

# Public & My

def get_public_recipes_paginated(db: Session, page: int = 1, page_size: int = 20) -> PaginatedRecipesResponse:
    """Get public recipes with pagination"""
    offset = (page - 1) * page_size
    
    recipes = db.query(Recipe).join(Users).filter(Recipe.is_published == True).offset(offset).limit(page_size).all()
    total_recipes = db.query(Recipe).filter(Recipe.is_published == True).count()
    total_pages = ceil(total_recipes / page_size)
    
    return PaginatedRecipesResponse(
        recipes=[_build_recipe_response(r) for r in recipes],
        total=total_recipes,
        page=page,
        page_size=page_size,
        total_pages=total_pages
    )

def get_my_recipes_paginated(db: Session, user_id: int, page: int = 1, page_size: int = 20) -> PaginatedRecipesResponse:
    """Get user's recipes with pagination"""
    offset = (page - 1) * page_size
    
    recipes = db.query(Recipe).join(Users).filter(Recipe.user_id == user_id).offset(offset).limit(page_size).all()
    total_recipes = db.query(Recipe).filter(Recipe.user_id == user_id).count()
    total_pages = ceil(total_recipes / page_size)
    
    return PaginatedRecipesResponse(
        recipes=[_build_recipe_response(r) for r in recipes],
        total=total_recipes,
        page=page,
        page_size=page_size,
        total_pages=total_pages
    )

# Favorites operations
def get_favorite_recipes_paginated(db: Session, user_id: int, page: int = 1, page_size: int = 20) -> PaginatedFavoriteRecipesResponse:
    """Get user's favorite recipes with pagination"""
    offset = (page - 1) * page_size

    favorite_recipes = (
        db.query(FavoriteRecipe)
        .join(Recipe)
        .join(Users)
        .filter(FavoriteRecipe.user_id == user_id)
        .offset(offset)
        .limit(page_size)
        .all()
    )

    total_favorite_recipes = db.query(FavoriteRecipe).filter(FavoriteRecipe.user_id == user_id).count()
    total_pages = ceil(total_favorite_recipes / page_size)

    return PaginatedFavoriteRecipesResponse(
        recipes=[
            _build_favorite_recipe_response(fr) for fr in favorite_recipes
        ],
        total=total_favorite_recipes,
        page=page,
        page_size=page_size,
        total_pages=total_pages
    )

def add_to_favorites(db: Session, user_id: int, recipe_id: int) -> bool:
    """Add recipe to user's favorites"""
    recipe = db.query(Recipe).filter(Recipe.id == recipe_id, Recipe.is_published == True).first()
    if not recipe or recipe.user_id == user_id:
        return False
    
    existing = db.query(FavoriteRecipe).filter(
        FavoriteRecipe.user_id == user_id,
        FavoriteRecipe.recipe_id == recipe_id
    ).first()
    
    if existing:
        return False
    
    favorite = FavoriteRecipe(user_id=user_id, recipe_id=recipe_id)
    db.add(favorite)
    db.commit()
    return True

def remove_from_favorites(db: Session, user_id: int, recipe_id: int) -> bool:
    """Remove recipe from user's favorites"""
    favorite = db.query(FavoriteRecipe).filter(
        FavoriteRecipe.user_id == user_id,
        FavoriteRecipe.recipe_id == recipe_id
    ).first()
    
    if not favorite:
        return False
    
    db.delete(favorite)
    db.commit()
    return True

def is_recipe_favorited(db: Session, user_id: int, recipe_id: int) -> bool:
    """Check if recipe is in user's favorites"""
    return db.query(FavoriteRecipe).filter(
        FavoriteRecipe.user_id == user_id,
        FavoriteRecipe.recipe_id == recipe_id
    ).first() is not None

def get_favorites_count(db: Session, user_id: int) -> int:
    """Get total count of user's favorite recipes"""
    return db.query(FavoriteRecipe).filter(FavoriteRecipe.user_id == user_id).count()