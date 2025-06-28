from src.recipes.models import Recipe
from sqlalchemy.orm import Session
from typing import List

from src.auth.models import Users


def get_recipes(db: Session) -> List[Recipe]:
    return db.query(Recipe).join(Users).all()

def get_recipe_by_slug_and_id(db:Session, slug: str, recipe_id: int) -> Recipe:
    return db.query(Recipe).filter(Recipe.id == recipe_id, Recipe.slug == slug).first()