from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Tuple
from math import ceil

from src.auth.models import Users
from src.recipes.models import Recipe
from src.admin.schemas import (
    AdminUserResponse, 
    AdminRecipeResponse, 
    AdminStatsResponse,
    PaginatedUsersResponse,
    PaginatedRecipesResponse
)


def get_users_paginated(db: Session, page: int = 1, page_size: int = 20) -> PaginatedUsersResponse:
    """Получить список пользователей с пагинацией"""
    offset = (page - 1) * page_size
    
    users_query = db.query(Users).offset(offset).limit(page_size)
    users = users_query.all()
    
    total_users = db.query(Users).count()
    total_pages = ceil(total_users / page_size)
    
    return PaginatedUsersResponse(
        users=[AdminUserResponse.model_validate(user) for user in users],
        total=total_users,
        page=page,
        page_size=page_size,
        total_pages=total_pages
    )


def get_user_by_id(db: Session, user_id: int) -> AdminUserResponse:
    """Получить пользователя по ID"""
    user = db.query(Users).filter(Users.id == user_id).first()
    if not user:
        return None
    return AdminUserResponse.model_validate(user)


def toggle_user_admin_status(db: Session, user_id: int, is_admin: bool) -> bool:
    """Назначить или снять админские права пользователя"""
    user = db.query(Users).filter(Users.id == user_id).first()
    if not user:
        return False
    
    user.is_admin = is_admin
    db.commit()
    db.refresh(user)
    return True


def delete_user(db: Session, user_id: int) -> bool:
    """Удалить пользователя"""
    user = db.query(Users).filter(Users.id == user_id).first()
    if not user:
        return False
    
    db.delete(user)
    db.commit()
    return True


def get_recipes_paginated(db: Session, page: int = 1, page_size: int = 20) -> PaginatedRecipesResponse:
    """Получить список рецептов с пагинацией"""
    offset = (page - 1) * page_size
    
    recipes_query = (
        db.query(Recipe, Users.username)
        .join(Users, Recipe.user_id == Users.id)
        .offset(offset)
        .limit(page_size)
    )
    recipes_data = recipes_query.all()
    
    total_recipes = db.query(Recipe).count()
    total_pages = ceil(total_recipes / page_size)
    
    recipes = []
    for recipe, username in recipes_data:
        recipe_data = AdminRecipeResponse.model_validate(recipe)
        recipe_data.username = username
        recipes.append(recipe_data)
    
    return PaginatedRecipesResponse(
        recipes=recipes,
        total=total_recipes,
        page=page,
        page_size=page_size,
        total_pages=total_pages
    )


def delete_recipe(db: Session, recipe_id: int) -> bool:
    """Удалить рецепт"""
    recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
    if not recipe:
        return False
    
    db.delete(recipe)
    db.commit()
    return True


def get_admin_stats(db: Session) -> AdminStatsResponse:
    """Получить статистику для админского дашборда"""
    total_users = db.query(Users).count()
    total_admins = db.query(Users).filter(Users.is_admin == True).count()
    total_recipes = db.query(Recipe).count()
    published_recipes = db.query(Recipe).filter(Recipe.is_published == True).count()
    
    return AdminStatsResponse(
        total_users=total_users,
        total_admins=total_admins,
        total_recipes=total_recipes,
        published_recipes=published_recipes
    )


def get_recent_users(db: Session, limit: int = 5) -> List[AdminUserResponse]:
    """Получить последних зарегистрированных пользователей"""
    users = db.query(Users).order_by(Users.id.desc()).limit(limit).all()
    return [AdminUserResponse.model_validate(user) for user in users]


def get_recent_recipes(db: Session, limit: int = 5) -> List[AdminRecipeResponse]:
    """Получить последние созданные рецепты"""
    recipes_data = (
        db.query(Recipe, Users.username)
        .join(Users, Recipe.user_id == Users.id)
        .order_by(Recipe.id.desc())
        .limit(limit)
        .all()
    )
    
    recipes = []
    for recipe, username in recipes_data:
        recipe_data = AdminRecipeResponse.model_validate(recipe)
        recipe_data.username = username
        recipes.append(recipe_data)
    
    return recipes 