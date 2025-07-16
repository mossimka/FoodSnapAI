from datetime import timedelta
from typing import Annotated, List
from fastapi import APIRouter, Depends, HTTPException, Request, Response, Cookie, Body
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from starlette import status
from fastapi.security import OAuth2PasswordRequestForm

from src.auth.models import Users
from src.auth.schemas import CreateUserRequest, Token, UserResponse, UserPatchRequest
from src.auth.service import (
    authenticate_user,
    create_access_token,
    create_refresh_token,
    verify_refresh_token,
    get_users,
    google_auth_flow,
    get_current_user,
    build_user_response,
)
from src.auth.security import bcrypt_context
from src.auth.captcha import verify_recaptcha
from src.dependencies import get_db

from src.config import ACCESS_TOKEN_EXPIRE_MINUTES, REFRESH_TOKEN_EXPIRE_DAYS, IS_DEV

router = APIRouter(prefix="/auth", tags=["auth"])

db_dependency = Annotated[Session, Depends(get_db)]


@router.get("/", response_model=List[UserResponse], status_code=status.HTTP_200_OK)
def get_all_users(
    db: db_dependency,
    current_user: Annotated[dict, Depends(get_current_user)],
):
    users = get_users(db)
    return [build_user_response(user) for user in users]


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_user(
    request: Request, db: db_dependency, create_user_request: CreateUserRequest
):
    # Verify reCAPTCHA if token is provided
    if create_user_request.captcha_token:
        client_ip = request.client.host if request.client else None
        is_captcha_valid = await verify_recaptcha(
            create_user_request.captcha_token, client_ip
        )
        if not is_captcha_valid:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="reCAPTCHA verification failed",
            )

    # Check if username or email already exists
    existing_username = (
        db.query(Users).filter(Users.username == create_user_request.username).first()
    )
    existing_email = db.query(Users).filter(Users.email == create_user_request.email).first()

    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Username already exists"
        )

    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered"
        )

    create_user_model = Users(
        username=create_user_request.username,
        email=create_user_request.email,
        hashed_password=bcrypt_context.hash(create_user_request.password),
    )
    db.add(create_user_model)
    db.commit()
    return {"message": "User created successfully"}


@router.patch("/patch/{user_id}")
async def patch_user(
    user_id: int,
    db: db_dependency,
    current_user: Annotated[dict, Depends(get_current_user)],
    patch_data: UserPatchRequest = Body(...),
):

    if user_id != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized to update this user")

    user = db.query(Users).filter(Users.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if patch_data.username is not None:
        user.username = patch_data.username
    if patch_data.password is not None:
        user.hashed_password = bcrypt_context.hash(patch_data.password)

    db.commit()
    db.refresh(user)

    return {
        "message": "User updated",
        "user": {"id": user.id, "username": user.username},
    }


@router.post("/token", response_model=Token)
async def login_for_access_token(
    response: Response,
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: db_dependency,
):
    user = authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate user")
    access_token = create_access_token({"sub": user.username, "id": user.id})
    refresh_token = create_refresh_token({"sub": user.username, "id": user.id})
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        max_age=REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
        samesite="lax",
        secure=not IS_DEV,
        path="/",
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/google")
async def google_auth(request: Request, db: db_dependency):
    data = await request.json()
    token = data.get("token")
    if not token:
        raise HTTPException(status_code=400, detail="Missing token")

    access_token, refresh_token = google_auth_flow(token, db)
    response = JSONResponse(content={"access_token": access_token})
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        max_age=REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
        samesite="lax",
        secure=not IS_DEV,
        path="/",
    )
    return response


@router.post("/refresh")
async def refresh_token(response: Response, refresh_token: str = Cookie(None)):
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Missing refresh token")
    user_data = verify_refresh_token(refresh_token)
    access_token = create_access_token({"sub": user_data["username"], "id": user_data["id"]})
    return {"access_token": access_token}


@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie("refresh_token")
    return {"message": "Logged out"}


@router.get("/me", response_model=UserResponse)
def read_users_me(current_user: Annotated[dict, Depends(get_current_user)], db: db_dependency):
    user = db.query(Users).filter(Users.id == current_user["id"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return build_user_response(user)


@router.get("/profile-pic/{user_id}/")
async def get_user_profile_pic(
    user_id: int,
    db: db_dependency,
    current_user: Annotated[dict, Depends(get_current_user)]
):
    """Get signed URL for user profile picture"""
    try:
        user = db.query(Users).filter(Users.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        if not user.profile_pic:
            raise HTTPException(status_code=404, detail="Profile picture not found")
        
        # Генерируем подписанный URL
        from src.gcs.signed_urls import signed_url_service
        blob_name = signed_url_service.extract_blob_name_from_url(user.profile_pic)
        
        if not blob_name:
            raise HTTPException(status_code=400, detail="Invalid profile picture path")
        
        signed_url = signed_url_service.generate_signed_url(blob_name, expiration_minutes=60)
        
        if not signed_url:
            raise HTTPException(status_code=404, detail="Failed to generate signed URL")
        
        return {"signed_url": signed_url}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get profile picture: {str(e)}")
