from fastapi import FastAPI
from app.routers import dashboard, assets, videos
from app.rag.asset_store import init_db

app = FastAPI(title="AI Video Creation SaaS API")

init_db()

app.include_router(dashboard.router)
app.include_router(assets.router)
app.include_router(videos.router)


@app.get("/")
async def root():
    return {"status": "AI Video SaaS API running"}