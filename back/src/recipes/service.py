from src.recipes.models import Recipe
from sqlalchemy.orm import Session
from typing import List

from src.auth.models import Users


def get_recipes(db: Session) -> List[Recipe]:
    return db.query(Recipe).join(Users).all()

def get_recipe_by_slug(db: Session, slug: str) -> Recipe:
    return db.query(Recipe).filter(Recipe.slug == slug).first()