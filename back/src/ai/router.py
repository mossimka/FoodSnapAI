from fastapi import APIRouter, UploadFile, File, HTTPException
from src.gcs.uploader import upload_large_file_to_gcs, BUCKET_NAME
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.adk.agents import Agent
from google.genai import types
import uuid

# --- Агент ---
root_agent = Agent(
    model="gemini-2.0-flash",
    name="root_agent",
    instruction=(
        """
        You are an agent analyzing food photos.
        You will receive an image file. Visually analyze the image and return:
        1. Name of the dish.
        2. List of ingredients.
        3. Step-by-step recipe.
        Output must be a JSON like:
        {
          "dish_name": "string",
          "ingredients": ["string", ...],
          "recipe": "string"
        }
        Make the recipe clear and repeatable.
        """
    ),
    description="Analyze the dish photo and generate recipe.",
)

# --- Сервис сессий и раннер ---
APP_NAME = "dish_analysis_app"
USER_ID = "user_1"
session_service = InMemorySessionService()
runner = Runner(
    agent=root_agent,
    app_name=APP_NAME,
    session_service=session_service,
)

router = APIRouter(prefix="/dish", tags=["dish"])

@router.post("/")
async def analyze_dish(file: UploadFile = File(...)):
    try:
        # Считываем содержимое файла в байты
        image_data = await file.read()

        # Создаем уникальную сессию
        SESSION_ID = str(uuid.uuid4())
        await session_service.create_session(
            app_name=APP_NAME,
            user_id=USER_ID,
            session_id=SESSION_ID,
        )

        # Передаём изображение как Blob
        content = types.Content(
            role="user",
            parts=[types.Part(
                inline_data=types.Blob(
                    mime_type=file.content_type,  # Например, "image/png"
                    data=image_data
                )
            )]
        )

        # Запускаем агента
        final_response = "Agent did not respond"
        async for event in runner.run_async(
            user_id=USER_ID,
            session_id=SESSION_ID,
            new_message=content
        ):
            if event.is_final_response() and event.content and event.content.parts:
                final_response = event.content.parts[0].text
                break

        return {
            "filename": file.filename,
            "analysis": final_response,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to analyze dish: {str(e)}")
