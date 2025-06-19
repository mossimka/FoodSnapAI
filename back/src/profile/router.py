from fastapi import APIRouter, UploadFile, File, Depends
from typing import Annotated
from sqlalchemy.orm import Session

from src.gcs.uploader import upload_profile_pic_to_gcs
from src.auth.service import get_current_user
from src.auth.models import Users
from src.dependencies import get_db


router = APIRouter(prefix='/user', tags=['user'])

@router.post("/upload-profile-pic")
async def upload_profile_pic(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
    file: UploadFile = File(...)
):
    username = current_user["username"] 
    image_url = upload_profile_pic_to_gcs(file, username)

    user = db.query(Users).filter(Users.id == current_user["id"]).first()
    user.profile_pic = image_url
    db.commit()
    db.refresh(user)

    return {"profile_pic": image_url}

    