# schemas.py
from pydantic import BaseModel
from typing import List, Optional

class RecipeCreate(BaseModel):
    user_id: int
    dish_name: str
    ingredients: List[str]
    recipe: str

class RecipeResponse(BaseModel):
    id: int
    user_id: int
    user_name: str
    user_avatar: Optional[str] = None
    dish_name: str
    ingredients: List[str]
    recipe: str
    image_path: str

    class Config:
        orm_mode = True
    
class RecipePatchRequest(BaseModel):
    dish_name: Optional[str] = None
    publish: Optional[bool] = None