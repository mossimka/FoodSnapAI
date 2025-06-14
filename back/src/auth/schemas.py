from pydantic import BaseModel, EmailStr
from typing import Optional


class CreateUserRequest(BaseModel):
    username: str
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: Optional[EmailStr] = None

    model_config = {
        "from_attributes": True 
    }