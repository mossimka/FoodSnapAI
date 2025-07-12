from src.recipes.models import Recipe, FavoriteRecipe, Category, HEALTH_CATEGORIES
from sqlalchemy.orm import Session
from typing import List, Optional
from math import ceil

from src.auth.models import Users
from src.recipes.schemas import (
    RecipeResponse, 
    UserResponse, 
    IngredientCaloriesResponse, 
    CategoryResponse,
    PaginatedRecipesResponse,
    PaginatedFavoriteRecipesResponse,
    FavoriteRecipeResponse
)

# Helper functions
def _build_recipe_response(recipe: Recipe) -> RecipeResponse:
    """Helper function to build RecipeResponse from Recipe model"""
    return RecipeResponse(
        id=recipe.id,  # type: ignore
        slug=recipe.slug,  # type: ignore
        user_id=recipe.user_id,  # type: ignore
        user=UserResponse(
            username=recipe.user.username,  # type: ignore
            profile_pic=recipe.user.profile_pic  # type: ignore
        ),
        dish_name=recipe.dish_name,  # type: ignore
        recipe=recipe.recipe,  # type: ignore
        image_path=recipe.image_path,  # type: ignore
        is_published=recipe.is_published,  # type: ignore
        ingredients_calories=[
            IngredientCaloriesResponse.model_validate(i)
            for i in recipe.ingredients_calories
        ],
        estimated_weight_g=recipe.estimated_weight_g,  # type: ignore
        total_calories_per_100g=recipe.total_calories_per_100g,  # type: ignore
        categories=[
            CategoryResponse(id=cat.id, name=cat.name)  # type: ignore
            for cat in recipe.categories
        ]
    )

def _build_favorite_recipe_response(favorite_recipe: FavoriteRecipe) -> FavoriteRecipeResponse:
    """Helper function to build FavoriteRecipeResponse from FavoriteRecipe model"""
    return FavoriteRecipeResponse(
        id=favorite_recipe.id,  # type: ignore
        user_id=favorite_recipe.user_id,  # type: ignore
        recipe_id=favorite_recipe.recipe_id,  # type: ignore
        recipe=_build_recipe_response(favorite_recipe.recipe)
    )

# Category operations
def get_categories(db: Session) -> List[Category]:
    """Get all categories"""
    return db.query(Category).all()

def get_category_by_name(db: Session, name: str) -> Optional[Category]:
    """Get category by name"""
    return db.query(Category).filter(Category.name == name).first()

def create_category(db: Session, name: str) -> Category:
    """Create new category"""
    category = Category(name=name)
    db.add(category)
    db.commit()
    db.refresh(category)
    return category

def get_or_create_category(db: Session, name: str) -> Category:
    """Get category by name or create if doesn't exist"""
    category = get_category_by_name(db, name)
    if not category:
        category = create_category(db, name)
    return category

def validate_categories(category_names: List[str]) -> List[str]:
    """Validate that all category names are in allowed list"""
    print(f"=== VALIDATE CATEGORIES DEBUG ===")
    print(f"Input categories: {category_names}")
    print(f"Available categories: {HEALTH_CATEGORIES}")
    
    valid_categories = []
    for name in category_names:
        if name in HEALTH_CATEGORIES:
            valid_categories.append(name)
            print(f"✓ Valid category: {name}")
        else:
            print(f"✗ Invalid category: {name}")
    
    print(f"Final valid categories: {valid_categories}")
    print(f"================================")
    return valid_categories

# Basic recipe operations
def get_recipes(db: Session) -> List[Recipe]:
    return db.query(Recipe).join(Users).all()

def get_recipe_by_slug(db: Session, slug: str) -> Optional[Recipe]:
    return db.query(Recipe).filter(Recipe.slug == slug).first()  # type: ignore

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
    
    recipes = db.query(Recipe).join(Users).filter(Recipe.is_published == True).offset(offset).limit(page_size).all()  # type: ignore
    total_recipes = db.query(Recipe).filter(Recipe.is_published == True).count()  # type: ignore
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
    
    recipes = db.query(Recipe).join(Users).filter(Recipe.user_id == user_id).offset(offset).limit(page_size).all()  # type: ignore
    total_recipes = db.query(Recipe).filter(Recipe.user_id == user_id).count()  # type: ignore
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
    recipe = db.query(Recipe).filter(Recipe.id == recipe_id, Recipe.is_published == True).first()  # type: ignore
    if not recipe or recipe.user_id == user_id:  # type: ignore
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

# Recipe creation with categories
def create_recipe_with_categories(
    db: Session, 
    user_id: int,
    dish_name: str,
    recipe_text: str,
    image_path: str,
    estimated_weight_g: int,
    total_calories_per_100g: int,
    health_categories: List[str]
) -> Recipe:
    """Create recipe with categories"""
    
    # Validate categories
    valid_categories = validate_categories(health_categories)
    
    # Create recipe
    recipe = Recipe(
        user_id=user_id,
        dish_name=dish_name,
        recipe=recipe_text,
        image_path=image_path,
        estimated_weight_g=estimated_weight_g,
        total_calories_per_100g=total_calories_per_100g,
    )
    
    db.add(recipe)
    db.flush()  # Get recipe ID
    recipe.generate_slug()
    
    # Add categories
    for category_name in valid_categories:
        category = get_or_create_category(db, category_name)
        recipe.categories.append(category)
    
    db.commit()
    db.refresh(recipe)
    return recipe