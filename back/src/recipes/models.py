from sqlalchemy import Column, Integer, String, Text, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from src.database import Base
from src.auth.models import Users
from slugify import slugify

class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String, unique=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    dish_name = Column(String)
    recipe = Column(Text)
    image_path = Column(String)
    is_published = Column(Boolean, default=False)
    estimated_weight_g = Column(Integer)
    total_calories_per_100g = Column(Integer)

    user = relationship("Users", back_populates="recipes")

    ingredients_calories = relationship(
        "IngredientCalories",
        back_populates="recipe",
        cascade="all, delete-orphan"
    )

    def generate_slug(self):
        self.slug = slugify(self.dish_name) + "-" + str(self.id)


class IngredientCalories(Base):
    __tablename__ = "ingredient_calories"

    id = Column(Integer, primary_key=True, index=True)
    recipe_id = Column(Integer, ForeignKey("recipes.id", ondelete="CASCADE"))
    ingredient = Column(String)
    calories = Column(Integer)

    recipe = relationship("Recipe", back_populates="ingredients_calories")
