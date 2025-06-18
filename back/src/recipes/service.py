from src.recipes.models import Recipe
from src.recipes.schemas import RecipeResponse
from sqlalchemy.orm import Session
from typing import List

def get_recipes(db: Session) -> List[RecipeResponse]:
    recipes = db.query(Recipe).all()
    return [
        RecipeResponse(
            user_id=r.user_id,
            dish_name=r.dish_name,
            ingredients=[
                i.strip()
                for i in r.ingredients.split(",")
                if i.strip()
            ],
            recipe=r.recipe,
        )
        for r in recipes
    ]
