import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv('SECRET_KEY')
ALGORITHM = 'HS256'
GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')