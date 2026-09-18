from fastapi import APIRouter
from pydantic import BaseModel
from app.rag.retrieval import search_similar_assets
from app.rag.generation import generate_script
from app.rag.reuse_score import calculate_reuse_score
from app.providers.decision_engine import choose_best_provider

router = APIRouter(prefix="/videos", tags=["videos"])


class VideoPlanRequest(BaseModel):
    query: str
    sector: str | None = None


@router.post("/plan")
async def video_plan(request: VideoPlanRequest):
    retrieved = await search_similar_assets(request.query, sector=request.sector, top_k=3)
    reuse_info = calculate_reuse_score(retrieved)
    provider_choice = await choose_best_provider({"description": request.query})
    script = await generate_script(request.query, retrieved)

    return {
        "reuse_analysis": reuse_info,
        "provider_decision": provider_choice,
        "generated_script": script,
        "based_on": [r["id"] for r in retrieved],
    }