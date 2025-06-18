from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from src.database import Base
from src.auth.models import Users

class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    dish_name = Column(String)
    ingredients = Column(Text)
    recipe = Column(Text)
    image_path = Column(String)

    user = relationship("Users", back_populates="recipes")

