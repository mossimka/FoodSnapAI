from src.database import Base
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

class Users(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True)
    email = Column(String, unique=True)
    hashed_password = Column(String)
    profile_pic = Column(String, nullable=True)

    recipes = relationship("Recipe", back_populates="user")
