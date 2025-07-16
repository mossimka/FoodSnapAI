from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from typing import Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from google.oauth2 import id_token
from google.auth.transport import requests

from src.config import (
    SECRET_KEY, 
    ALGORITHM, 
    GOOGLE_CLIENT_ID, 
    REFRESH_SECRET_KEY, 
    ACCESS_TOKEN_EXPIRE_MINUTES,
    REFRESH_TOKEN_EXPIRE_DAYS
)
from src.auth.models import Users
from src.dependencies import get_db
from src.gcs.signed_urls import signed_url_service
from src.auth.schemas import UserResponse

bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')

oauth2_bearer = OAuth2PasswordBearer(tokenUrl='auth/token')

def authenticate_user(identifier: str, password: str, db: Session):
    user = (
        db.query(Users)
        .filter((Users.username == identifier) | (Users.email == identifier))
        .first()
    )
    if not user or not bcrypt_context.verify(password, user.hashed_password):
        return None
    return user

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def create_refresh_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, REFRESH_SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: Annotated[str, Depends(oauth2_bearer)]):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get('sub')
        user_id: int = payload.get('id')
        if username is None or user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Could not validate user')
        return {'username': username, 'id': user_id}
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Could not validate user')

def get_current_admin_user(
    token: Annotated[str, Depends(oauth2_bearer)],
    db: Annotated[Session, Depends(get_db)]
):
    current_user = get_current_user(token)
    user = db.query(Users).filter(Users.id == current_user['id']).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='User not found')
    if not user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='Admin access required')
    return {'username': user.username, 'id': user.id, 'is_admin': user.is_admin}

def verify_refresh_token(token: str):
    try:
        payload = jwt.decode(token, REFRESH_SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get('sub')
        user_id: int = payload.get('id')
        if username is None or user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Could not validate user')
        return {'username': username, 'id': user_id}
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid refresh token')

def get_users(db: Session):
    return db.query(Users).all()

def google_auth_flow(token: str, db: Session):
    try:
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), GOOGLE_CLIENT_ID)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid Google token")

    email = idinfo.get("email")
    name = idinfo.get("name") or email.split('@')[0]
    sub = idinfo.get("sub")

    if not email:
        raise HTTPException(status_code=400, detail="Google token missing email")

    user = db.query(Users).filter(Users.email == email).first()

    if not user:
        user = Users(
            username=name,
            email=email,
            hashed_password=bcrypt_context.hash(sub),
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    access_token = create_access_token(data={"sub": user.username, "id": user.id})
    refresh_token = create_refresh_token(data={"sub": user.username, "id": user.id})

    return access_token, refresh_token

def build_user_response(user) -> UserResponse:
    """Создает UserResponse с подписанным URL для аватара"""
    profile_pic_url = None
    
    if user.profile_pic:
        profile_pic_url = signed_url_service.get_profile_pic_signed_url(user.profile_pic)
        # Fallback к оригинальному URL если не удалось сгенерировать подписанный
        if not profile_pic_url:
            profile_pic_url = user.profile_pic
    
    return UserResponse(
        id=user.id,
        username=user.username,
        email=user.email,
        profile_pic=profile_pic_url
    )

