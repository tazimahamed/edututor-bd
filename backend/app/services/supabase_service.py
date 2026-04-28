"""
Supabase Service — Mock Version (Supabase ছাড়া চালানোর জন্য)
"""

async def get_or_create_student(user_id: str, name: str = "", email: str = "", grade: str = "SSC"):
    """
    Supabase ছাড়া mock student data return করে।
    Supabase connect করলে নিচের commented code uncomment করো।
    """
    student = {
        "id": user_id,
        "name": name,
        "email": email,
        "grade": grade,
        "level": grade,
        "bloom_levels": {
            "physics": 1,
            "chemistry": 1,
            "math": 1
        },
        "subjects": ["physics", "chemistry", "math"]
    }
    return student

async def save_session(student_id: str, session_data: dict):
    return {"status": "ok", "session_id": "mock_session"}

async def get_progress(student_id: str):
    return {
        "student_id": student_id,
        "total_sessions": 0,
        "average_score": 0,
        "weak_areas": [],
        "strong_areas": []
    }

async def save_progress(student_id: str, progress_data: dict):
    return {"status": "ok"}

async def get_student(student_id: str):
    return {
        "id": student_id,
        "name": "Student",
        "level": "SSC"
    }

async def register_user(email: str, password: str, name: str):
    return {
        "id": "mock_user_id",
        "email": email,
        "name": name
    }

async def login_user(email: str, password: str):
    return {
        "access_token": "mock_token",
        "user": {
            "id": "mock_user_id",
            "email": email
        }
    }

async def get_progress_report(student_id: str):
    return {
        "student_id": student_id,
        "total_sessions": 0,
        "average_score": 0,
        "weak_areas": [],
        "strong_areas": [],
        "subjects": {
            "physics": {"score": 0, "sessions": 0},
            "chemistry": {"score": 0, "sessions": 0},
            "math": {"score": 0, "sessions": 0}
        }
    }

async def update_student(student_id: str, data: dict):
    return {"status": "ok", "id": student_id}

async def delete_session(session_id: str):
    return {"status": "ok"}
