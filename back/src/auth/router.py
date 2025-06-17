from datetime import timedelta
from typing import Annotated, List
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from starlette import status
from fastapi.security import OAuth2PasswordRequestForm

from src.auth.models import Users
from src.auth.schemas import CreateUserRequest, Token, UserResponse
from src.auth.service import authenticate_user, create_access_token, get_users, google_auth_flow, get_current_user
from src.auth.security import bcrypt_context
from src.dependencies import get_db

router = APIRouter(prefix='/auth', tags=['auth'])

db_dependency = Annotated[Session, Depends(get_db)]

@router.get("/", response_model=List[UserResponse], status_code=status.HTTP_200_OK)
def get_all_users(db: db_dependency):
    return get_users(db)

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_user(db: db_dependency, create_user_request: CreateUserRequest):
    create_user_model = Users(
        username=create_user_request.username,
        email=create_user_request.email,
        hashed_password=bcrypt_context.hash(create_user_request.password),
    )
    db.add(create_user_model)
    db.commit()
    return {"message": "User created"}

@router.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: db_dependency
):
    user = authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Could not validate user')
    token = create_access_token(user.username, user.id, timedelta(minutes=20))
    return {'access_token': token, 'token_type': 'bearer'}

@router.post("/google")
async def google_auth(request: Request, db: db_dependency):
    data = await request.json()
    token = data.get("token")
    if not token:
        raise HTTPException(status_code=400, detail="Missing token")

    access_token = google_auth_flow(token, db)
    return {"access_token": access_token}

@router.get("/me", response_model=UserResponse)
def read_users_me(current_user: Annotated[dict, Depends(get_current_user)], db: db_dependency):
    print("current_user from token:", current_user)

    user = db.query(Users).filter(Users.id == current_user["id"]).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    print("fetched user:", user)
    return user
