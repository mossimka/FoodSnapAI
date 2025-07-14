# schemas.py
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from enum import Enum

class SortOrder(str, Enum):
    NEWEST = "newest"
    OLDEST = "oldest"
    NAME_ASC = "name_asc"
    NAME_DESC = "name_desc"

class CategoryCreate(BaseModel):
    name: str

class CategoryResponse(BaseModel):
    id: int
    name: str

    model_config = {"from_attributes": True}

class IngredientCaloriesCreate(BaseModel):
    ingredient: str
    calories: int

class IngredientCaloriesResponse(BaseModel):
    id: int
    ingredient: str
    calories: int

    model_config = {
        "from_attributes": True
    }

class RecipeCreate(BaseModel):
    user_id: int
    dish_name: str
    recipe: str
    ingredients_calories: List[IngredientCaloriesCreate]
    estimated_weight_g: Optional[int] = None
    total_calories_per_100g: Optional[int] = None
    categories: List[str] = []


class UserResponse(BaseModel):
    username: str
    profile_pic: Optional[str] = None

    model_config = {"from_attributes": True}

class RecipeResponse(BaseModel):
    id: int
    slug: str
    user_id: int
    user: UserResponse
    dish_name: str
    recipe: str
    image_path: Optional[str]
    is_published: bool
    ingredients_calories: List[IngredientCaloriesResponse]
    estimated_weight_g: Optional[int] = None
    total_calories_per_100g: Optional[int] = None
    categories: List[CategoryResponse] = []
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}

# Дополнительная схема для AI ответа
class AIRecipeResponse(BaseModel):
    dish_name: str
    recipe: str
    ingredients_calories: dict
    estimated_weight_g: int
    total_calories_per_100g: int
    health_categories: List[str] = []


class RecipeSaveRequest(BaseModel):
    dish_name: str
    recipe: str
    ingredients_calories: List[dict]
    estimated_weight_g: int
    total_calories_per_100g: int
    health_categories: List[str] = []

class RecipePatchRequest(BaseModel):
    dish_name: Optional[str] = None
    publish: Optional[bool] = None

class PaginatedRecipesResponse(BaseModel):
    recipes: List[RecipeResponse]
    total: int
    page: int
    page_size: int
    total_pages: int

#Favorirites
class FavoriteRecipeResponse(BaseModel):
    id: int
    user_id: int
    recipe_id: int
    recipe: RecipeResponse

    model_config = {"from_attributes": True}

class FavoriteRecipeCreate(BaseModel):
    user_id: int
    recipe_id: int

class FavoriteRecipeDelete(BaseModel):
    user_id: int
    recipe_id: int

class FavoriteToggleRequest(BaseModel):
    user_id: int
    recipe_id: int

class PaginatedFavoriteRecipesResponse(BaseModel):
    recipes: List[FavoriteRecipeResponse]
    total: int
    page: int
    page_size: int
    total_pages: int

class FavoriteStatusResponse(BaseModel):
    is_favorited: bool
    recipe_id: int
    message: str

class CategoryListResponse(BaseModel):
    categories: List[CategoryResponse]

    model_config = {"from_attributes": True}