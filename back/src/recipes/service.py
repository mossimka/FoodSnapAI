from src.recipes.models import Recipe
from src.recipes.schemas import RecipeResponse
from sqlalchemy.orm import Session
from typing import List

from src.auth.models import Users

def get_recipes(db: Session) -> List[RecipeResponse]:
    recipes = db.query(Recipe).join(Users).all()
    return [
        RecipeResponse(
            user_id=r.user_id,
            user_name=r.user.username,
            user_avatar=r.user.profile_pic,
            dish_name=r.dish_name,
            ingredients=[i.strip() for i in r.ingredients.split(",") if i.strip()],
            recipe=r.recipe,
            image_path=r.image_path,
        )
        for r in recipes
    ]

