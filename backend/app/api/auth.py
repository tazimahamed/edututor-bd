"""
Auth API — Mock Authentication (Supabase ছাড়া)
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

class SignUpRequest(BaseModel):
    email: str
    password: str
    name: str
    grade: str
    role: str

class SignInRequest(BaseModel):
    email: str
    password: str

@router.post("/signup")
async def sign_up(req: SignUpRequest):
    try:
        return {
            "success": True,
            "user_id": "mock_user_id",
            "message": f"স্বাগতম {req.name}! অ্যাকাউন্ট তৈরি হয়েছে।"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/signin")
async def sign_in(req: SignInRequest):
    try:
        return {
            "success": True,
            "access_token": "mock_token_123",
            "user_id": "mock_user_id",
            "user_metadata": {"email": req.email}
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail="ইমেইল বা পাসওয়ার্ড সঠিক নয়।")
