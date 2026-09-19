from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import sqlite3
from app.auth import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])

DB_PATH = "assets.db"


def init_users_db():
    conn = sqlite3.connect(DB_PATH)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS users (
            email TEXT PRIMARY KEY,
            hashed_password TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()


class RegisterRequest(BaseModel):
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


@router.post("/register")
async def register(request: RegisterRequest):
    conn = sqlite3.connect(DB_PATH)
    existing = conn.execute("SELECT email FROM users WHERE email = ?", (request.email,)).fetchone()
    if existing:
        conn.close()
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed = hash_password(request.password)
    conn.execute("INSERT INTO users (email, hashed_password) VALUES (?, ?)", (request.email, hashed))
    conn.commit()
    conn.close()

    token = create_access_token(request.email)
    return {"access_token": token, "token_type": "bearer"}


@router.post("/login")
async def login(request: LoginRequest):
    conn = sqlite3.connect(DB_PATH)
    row = conn.execute("SELECT hashed_password FROM users WHERE email = ?", (request.email,)).fetchone()
    conn.close()

    if not row or not verify_password(request.password, row[0]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token(request.email)
    return {"access_token": token, "token_type": "bearer"}