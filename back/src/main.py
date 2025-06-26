from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.database import engine, Base
from src.auth.router import router as auth_router
from src.gcs.router import router as gcs_router
from src.recipes.router import router as ai_router
from src.profile.router import router as profile_router

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://localhost:3000/",
    "http://20.215.248.3:3000/",
    "http://20.215.248.3:3000",
    "http://foodsnapai.food",
    "https://foodsnapai.food"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(gcs_router)
app.include_router(ai_router)
app.include_router(profile_router)

Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
    return {"message": "Welcome to the FoodSnap AI!!"}

