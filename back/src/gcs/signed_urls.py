from google.cloud import storage
from google.oauth2 import service_account
from datetime import timedelta
from typing import Optional
import os
import urllib.parse
import re

SERVICE_ACCOUNT_FILE = os.path.join(os.getcwd(), "gcs-config.json")
credentials = service_account.Credentials.from_service_account_file(
    SERVICE_ACCOUNT_FILE
)

class SignedUrlService:
    def __init__(self):
        self.client = storage.Client(credentials=credentials)
        self.bucket_name = "foodsnap-bucket"
    
    def generate_signed_url(self, blob_name: str, expiration_minutes: int = 60) -> str:
        try:
            # Очищаем blob_name от лишних префиксов
            clean_blob_name = self._clean_blob_name(blob_name)
            
            if not clean_blob_name:
                print(f"Warning: Could not extract valid blob name from {blob_name}")
                return ""
            
            bucket = self.client.bucket(self.bucket_name)
            blob = bucket.blob(clean_blob_name)
            
            # Проверим, существует ли файл
            if not blob.exists():
                print(f"Warning: Blob {clean_blob_name} does not exist in bucket {self.bucket_name}")
                return ""
            
            signed_url = blob.generate_signed_url(
                version="v4",
                expiration=timedelta(minutes=expiration_minutes),
                method="GET"
            )
            return signed_url
        except Exception as e:
            print(f"Error generating signed URL for {blob_name}: {e}")
            return ""
    
    def get_profile_pic_signed_url(self, profile_pic_path: str) -> Optional[str]:
        """Генерирует подписанный URL для аватара пользователя"""
        if not profile_pic_path:
            return None
            
        try:
            blob_name = self.extract_blob_name_from_url(profile_pic_path)
            if blob_name:
                return self.generate_signed_url(blob_name, expiration_minutes=60)
            return None
        except Exception as e:
            print(f"Error generating signed URL for profile pic: {e}")
            return None
    
    def _clean_blob_name(self, input_str: str) -> Optional[str]:
        """Очищает и извлекает имя blob из различных форматов"""
        try:
            print(f"Cleaning blob name from: {input_str}")
            
            # Если это уже чистое имя файла
            if not input_str.startswith('http') and '/' in input_str:
                print(f"Already clean blob name: {input_str}")
                return input_str
            
            # Декодируем URL если он закодирован
            decoded = urllib.parse.unquote(input_str)
            print(f"Decoded URL: {decoded}")
            
            # Метод 1: Простое извлечение после bucket name
            if f"storage.googleapis.com/{self.bucket_name}/" in decoded:
                start_idx = decoded.find(f"storage.googleapis.com/{self.bucket_name}/") + len(f"storage.googleapis.com/{self.bucket_name}/")
                end_idx = decoded.find("?", start_idx)
                if end_idx == -1:
                    blob_name = decoded[start_idx:]
                else:
                    blob_name = decoded[start_idx:end_idx]
                print(f"Method 1 - Extracted blob name: {blob_name}")
                return blob_name
            
            # Метод 2: Поиск profiles/ или recipes/ в любом месте
            for prefix in ["profiles/", "recipes/"]:
                if prefix in decoded:
                    start_idx = decoded.find(prefix)
                    end_idx = decoded.find("?", start_idx)
                    if end_idx == -1:
                        blob_name = decoded[start_idx:]
                    else:
                        blob_name = decoded[start_idx:end_idx]
                    print(f"Method 2 - Extracted blob name: {blob_name}")
                    return blob_name
            
            print(f"Could not extract blob name from: {input_str}")
            return None
            
        except Exception as e:
            print(f"Error cleaning blob name from {input_str}: {e}")
            return None

    def extract_blob_name_from_url(self, url: str) -> Optional[str]:
        """Извлекает имя blob из URL"""
        return self._clean_blob_name(url)

signed_url_service = SignedUrlService()
