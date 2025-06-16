from fastapi import APIRouter, UploadFile, File, HTTPException
from src.gcs.uploader import upload_large_file_to_gcs, upload_file_in_chunks, BUCKET_NAME

router = APIRouter(
    prefix="/gsc",
    tags=["gcs"]
)

@router.post("/")
async def upload_file(file: UploadFile = File(...)):
    try:
        url = upload_large_file_to_gcs(file, BUCKET_NAME)
        return {
            "filename": file.filename,
            "url": url,
            "message": "File uploaded successfully using chunked upload"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/chunked/")
async def upload_file_chunked(file: UploadFile = File(...), chunk_size_mb: int = 8):
    try:
        chunk_size_bytes = chunk_size_mb * 1024 * 1024
        url, chunks_uploaded, total_chunks = upload_file_in_chunks(file, BUCKET_NAME, chunk_size_bytes)
        return {
            "filename": file.filename,
            "url": url,
            "chunk_size_mb": chunk_size_mb,
            "chunks_uploaded": chunks_uploaded,
            "total_chunks": total_chunks,
            "message": f"File uploaded using {chunk_size_mb}MB chunks"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
