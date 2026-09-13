from fastapi import FastAPI
from app.routers import dashboard, assets

app = FastAPI(title="AI Video Creation SaaS API")

app.include_router(dashboard.router)
app.include_router(assets.router)


@app.get("/")
async def root():
    return {"status": "AI Video SaaS API running"}