# schemas.py
from pydantic import BaseModel
from typing import List

class RecipeCreate(BaseModel):
    user_id: int
    dish_name: str
    ingredients: List[str]
    recipe: str

class RecipeResponse(BaseModel):
    user_id: int
    dish_name: str
    ingredients: List[str]
    recipe: str

    class Config:
        orm_mode = True