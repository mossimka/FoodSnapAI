import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv('SECRET_KEY')
ALGORITHM = 'HS256'
GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')

REFRESH_SECRET_KEY = os.getenv('REFRESH_SECRET_KEY')
ACCESS_TOKEN_EXPIRE_MINUTES=  30
REFRESH_TOKEN_EXPIRE_DAYS = 7
IS_DEV = os.getenv('ENV') == 'dev'