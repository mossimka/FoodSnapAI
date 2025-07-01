from fastapi import APIRouter, HTTPException, Query
from starlette import status

from src.admin.dependencies import AdminUserDependency, DatabaseDependency
from src.admin.schemas import (
    AdminUserResponse,
    UserAdminToggleRequest,
    AdminRecipeResponse,
    AdminStatsResponse,
    AdminDashboardResponse,
    PaginatedUsersResponse,
    PaginatedRecipesResponse
)
from src.admin.service import (
    get_users_paginated,
    get_user_by_id,
    toggle_user_admin_status,
    delete_user,
    get_recipes_paginated,
    delete_recipe,
    get_admin_stats,
    get_recent_users,
    get_recent_recipes
)

router = APIRouter(prefix='/admin', tags=['admin'])


# ===== USER MANAGEMENT =====

@router.get("/users", response_model=PaginatedUsersResponse, status_code=status.HTTP_200_OK)
def get_all_users(
    db: DatabaseDependency,
    current_admin: AdminUserDependency,
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Number of items per page")
):
    """Get all users with pagination"""
    return get_users_paginated(db, page=page, page_size=page_size)


@router.get("/users/{user_id}", response_model=AdminUserResponse, status_code=status.HTTP_200_OK)
def get_user_details(
    user_id: int,
    db: DatabaseDependency,
    current_admin: AdminUserDependency
):
    """Get detailed user information"""
    user = get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user


@router.patch("/users/{user_id}/admin", status_code=status.HTTP_200_OK)
def toggle_admin_rights(
    user_id: int,
    admin_toggle: UserAdminToggleRequest,
    db: DatabaseDependency,
    current_admin: AdminUserDependency
):
    """Grant or revoke admin rights for a user"""
    if user_id == current_admin["id"] and not admin_toggle.is_admin:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Cannot remove admin rights from yourself"
        )
    
    success = toggle_user_admin_status(db, user_id, admin_toggle.is_admin)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    action = "granted" if admin_toggle.is_admin else "revoked"
    return {"message": f"Admin rights {action} for user {user_id}"}


@router.delete("/users/{user_id}", status_code=status.HTTP_200_OK)
def delete_user_by_id(
    user_id: int,
    db: DatabaseDependency,
    current_admin: AdminUserDependency
):
    """Delete a user"""
    if user_id == current_admin["id"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Cannot delete yourself"
        )
    
    success = delete_user(db, user_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    return {"message": f"User {user_id} deleted successfully"}


# ===== RECIPE MANAGEMENT =====

@router.get("/recipes", response_model=PaginatedRecipesResponse, status_code=status.HTTP_200_OK)
def get_all_recipes(
    db: DatabaseDependency,
    current_admin: AdminUserDependency,
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Number of items per page")
):
    """Get all recipes with pagination"""
    return get_recipes_paginated(db, page=page, page_size=page_size)


@router.delete("/recipes/{recipe_id}", status_code=status.HTTP_200_OK)
def delete_recipe_by_id(
    recipe_id: int,
    db: DatabaseDependency,
    current_admin: AdminUserDependency
):
    """Delete a recipe"""
    success = delete_recipe(db, recipe_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recipe not found")
    
    return {"message": f"Recipe {recipe_id} deleted successfully"}


# ===== STATISTICS & DASHBOARD =====

@router.get("/stats/users", response_model=AdminStatsResponse, status_code=status.HTTP_200_OK)
def get_user_stats(
    db: DatabaseDependency,
    current_admin: AdminUserDependency
):
    """Get user statistics"""
    return get_admin_stats(db)


@router.get("/stats/recipes", response_model=AdminStatsResponse, status_code=status.HTTP_200_OK)
def get_recipe_stats(
    db: DatabaseDependency,
    current_admin: AdminUserDependency
):
    """Get recipe statistics"""
    return get_admin_stats(db)


@router.get("/dashboard", response_model=AdminDashboardResponse, status_code=status.HTTP_200_OK)
def get_admin_dashboard(
    db: DatabaseDependency,
    current_admin: AdminUserDependency
):
    """Get admin dashboard data"""
    stats = get_admin_stats(db)
    recent_users = get_recent_users(db, limit=5)
    recent_recipes = get_recent_recipes(db, limit=5)
    
    return AdminDashboardResponse(
        stats=stats,
        recent_users=recent_users,
        recent_recipes=recent_recipes
    )