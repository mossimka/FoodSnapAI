from typing import Annotated
from fastapi import Depends
from sqlalchemy.orm import Session

from src.dependencies import get_db
from src.auth.service import get_current_admin_user

AdminUserDependency = Annotated[dict, Depends(get_current_admin_user)]
DatabaseDependency = Annotated[Session, Depends(get_db)] 