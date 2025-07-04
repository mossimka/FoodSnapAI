import httpx
import os
from typing import Optional

RECAPTCHA_SECRET_KEY = os.getenv("RECAPTCHA_SECRET_KEY")
RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify"

async def verify_recaptcha(token: str, remote_ip: Optional[str] = None) -> bool:
    """
    Verify reCAPTCHA token with Google's API
    
    Args:
        token: The reCAPTCHA token from frontend
        remote_ip: Optional IP address of the user
        
    Returns:
        bool: True if verification successful, False otherwise
    """
    if not RECAPTCHA_SECRET_KEY:
        print("Warning: RECAPTCHA_SECRET_KEY not set, skipping verification")
        return True
    
    if not token:
        return False
    
    payload = {
        "secret": RECAPTCHA_SECRET_KEY,
        "response": token
    }
    
    if remote_ip:
        payload["remoteip"] = remote_ip
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(RECAPTCHA_VERIFY_URL, data=payload)
            result = response.json()
            
            success = result.get("success", False)
            
            return success
            
    except Exception as e:
        print(f"reCAPTCHA verification error: {e}")
        return False 