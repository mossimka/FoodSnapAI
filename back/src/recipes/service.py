from src.recipes.models import Recipe
from sqlalchemy.orm import Session
from typing import List

from src.auth.models import Users


def get_recipes(db: Session) -> List[Recipe]:
    return db.query(Recipe).join(Users).all()


