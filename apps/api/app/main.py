from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import dashboard, assets, videos
from app.rag.asset_store import init_db

app = FastAPI(title="AI Video Creation SaaS API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()

app.include_router(dashboard.router)
app.include_router(assets.router)
app.include_router(videos.router)


@app.get("/")
async def root():
    return {"status": "AI Video SaaS API running"}