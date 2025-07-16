from google.cloud import storage
from google.oauth2 import service_account

credentials = service_account.Credentials.from_service_account_file("gcs-config.json")
client = storage.Client(credentials=credentials)
bucket = client.bucket("foodsnap-bucket")

blob = bucket.blob("recipes/food11.png")

if blob.exists():
    print("✅ Blob exists")
else:
    print("❌ Blob does NOT exist")
