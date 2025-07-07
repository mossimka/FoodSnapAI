from src.database import Base
from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship

class Users(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True)
    email = Column(String, unique=True)
    hashed_password = Column(String)
    is_admin = Column(Boolean, default=False, nullable=False)
    profile_pic = Column(String, nullable=True)

    recipes = relationship("Recipe", back_populates="user")
    favorite_recipes = relationship("FavoriteRecipe", back_populates="user", cascade="all, delete-orphan")
