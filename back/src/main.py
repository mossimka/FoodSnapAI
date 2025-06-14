from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from src.database import SessionLocal, engine, Base
from src import models, service, schemas
from fastapi.middleware.cors import CORSMiddleware
from typing import Annotated
from starlette import status

from src.dependencies import get_db
from src.auth.router import router

app = FastAPI()

origins = [
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
    return {"message": "Welcome to the FoodSnap AI!!"}

