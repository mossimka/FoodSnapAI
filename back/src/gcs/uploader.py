import io
from fastapi import UploadFile, HTTPException
from google.cloud import storage
from google.oauth2 import service_account
import os
from uuid import uuid4


BUCKET_NAME = "foodsnap-bucket"
CHUNK_SIZE = 8 * 1024 * 1024

SERVICE_ACCOUNT_FILE = os.path.join(os.getcwd(), "gcs-config.json")

credentials = service_account.Credentials.from_service_account_file(
    SERVICE_ACCOUNT_FILE
)

def upload_large_file_to_gcs(file: UploadFile, chunk_size: int = CHUNK_SIZE):
    try:
        client = storage.Client(credentials=credentials)
        bucket = client.bucket(BUCKET_NAME)
        blob = bucket.blob(f"recipes/{file.filename}")

        file.file.seek(0, 2)
        file_size = file.file.tell()
        file.file.seek(0)

        if file_size <= chunk_size:
            blob.upload_from_file(file.file, content_type=file.content_type)
            return blob.public_url

        blob.chunk_size = chunk_size
        blob.upload_from_file(file.file, content_type=file.content_type, size=file_size)
        return blob.public_url
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")


def upload_file_in_chunks(file: UploadFile, chunk_size: int):
    try:
        client = storage.Client(credentials=credentials)
        bucket = client.bucket(BUCKET_NAME)
        blob = bucket.blob(f"recipes/{file.filename}")

        file.file.seek(0, 2)
        file_size = file.file.tell()
        file.file.seek(0)

        file_data = io.BytesIO()
        chunks_uploaded = 0
        total_chunks = (file_size + chunk_size - 1) // chunk_size

        while True:
            chunk = file.file.read(chunk_size)
            if not chunk:
                break
            file_data.write(chunk)
            chunks_uploaded += 1

        file_data.seek(0)
        blob.upload_from_file(file_data, content_type=file.content_type, size=file_size)
        return blob.public_url, chunks_uploaded, total_chunks
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chunked upload failed: {str(e)}")


def upload_profile_pic_to_gcs(file: UploadFile, username: str):
    try:
        client = storage.Client(credentials=credentials)
        bucket = client.bucket(BUCKET_NAME)
        blob = bucket.blob(f"profile_pics/{username}")
        
        blob.upload_from_file(file.file, content_type=file.content_type)
        return blob.public_url
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")
