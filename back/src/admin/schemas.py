from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


class AdminUserResponse(BaseModel):
    id: int
    username: str
    email: Optional[EmailStr] = None
    is_admin: bool
    profile_pic: Optional[str] = None

    model_config = {
        "from_attributes": True 
    }


class UserAdminToggleRequest(BaseModel):
    is_admin: bool


class AdminRecipeResponse(BaseModel):
    id: int
    slug: Optional[str] = None
    user_id: int
    dish_name: str
    is_published: bool
    estimated_weight_g: Optional[int] = None
    total_calories_per_100g: Optional[int] = None
    username: Optional[str] = None
    created_at: Optional[datetime] = None

    model_config = {
        "from_attributes": True 
    }


class AdminStatsResponse(BaseModel):
    total_users: int
    total_admins: int
    total_recipes: int
    published_recipes: int


class AdminDashboardResponse(BaseModel):
    stats: AdminStatsResponse
    recent_users: List[AdminUserResponse]
    recent_recipes: List[AdminRecipeResponse]


class PaginatedUsersResponse(BaseModel):
    users: List[AdminUserResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


class PaginatedRecipesResponse(BaseModel):
    recipes: List[AdminRecipeResponse]
    total: int
    page: int
    page_size: int
    total_pages: int 