from sqlalchemy import Column, Integer, String, Text, ForeignKey, Boolean, UniqueConstraint, Table, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from src.database import Base
from slugify import slugify

HEALTH_CATEGORIES = [
    "High in Fiber", 
    "High Sodium", 
    "High Sugar",
    "High Saturated Fat", 
    "Spicy/Irritant", 
    "Red Meat-Based",
    "Plant-Based", 
    "Dairy-Free", 
    "High Protein",
    "Contains Nuts"
]

recipe_categories = Table(
    'recipe_categories',
    Base.metadata,
    Column('recipe_id', Integer, ForeignKey('recipes.id'), primary_key=True),
    Column('category_id', Integer, ForeignKey('categories.id'), primary_key=True)
)

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
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    is_vegan = Column(Boolean, default=False)
    is_halal = Column(Boolean, default=False)

    user = relationship("Users", back_populates="recipes")
    
    favorited_by = relationship("FavoriteRecipe", back_populates="recipe", cascade="all, delete-orphan")

    ingredients_calories = relationship(
        "IngredientCalories",
        back_populates="recipe",
        cascade="all, delete-orphan"
    )

    categories = relationship(
        "Category",
        secondary=recipe_categories,
        back_populates="recipes"
    )

    def generate_slug(self):
        self.slug = slugify(str(self.dish_name)) + "-" + str(self.id)  # type: ignore


class IngredientCalories(Base):
    __tablename__ = "ingredient_calories"

    id = Column(Integer, primary_key=True, index=True)
    recipe_id = Column(Integer, ForeignKey("recipes.id", ondelete="CASCADE"))
    ingredient = Column(String)
    calories = Column(Integer)

    recipe = relationship("Recipe", back_populates="ingredients_calories")

class FavoriteRecipe(Base):
    __tablename__ = "favorite_recipes"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    recipe_id = Column(Integer, ForeignKey("recipes.id", ondelete="CASCADE"))

    user = relationship("Users", back_populates="favorite_recipes")
    recipe = relationship("Recipe", back_populates="favorited_by")

    __table_args__ = (UniqueConstraint('user_id', 'recipe_id', name='unique_user_recipe_favorite'),)

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)

    recipes = relationship(
        "Recipe",
        secondary=recipe_categories,
        back_populates="categories"
    )