from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from typing import Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from google.oauth2 import id_token
from google.auth.transport import requests

from src.config import SECRET_KEY, ALGORITHM, GOOGLE_CLIENT_ID
from src.auth.models import Users

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


def create_access_token(username: str, user_id: int, expires_delta: timedelta):
    to_encode = {"sub": username, "id": user_id}
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: Annotated[str, Depends(oauth2_bearer)]):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get('sub')
        user_id: int = payload.get('id')
        if username is None or user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Could not validate user')
        return {'username': username, 'id': user_id}
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Could not validtae user')
    
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

    access_token = create_access_token(user.username, user.id, timedelta(minutes=20))
    return access_token

