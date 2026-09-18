from fastapi import APIRouter
from pydantic import BaseModel
from app.rag.retrieval import search_similar_assets
from app.rag.generation import generate_script, GENERATION_MODEL
from app.rag.embeddings import EMBEDDING_MODEL
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

    reuse_pct = reuse_info["reuse_percentage"]
    base_cost = provider_choice["recommended_cost"]
    final_cost = round(base_cost * (1 - reuse_pct / 100), 2)
    saving = round(base_cost - final_cost, 2)

    script = await generate_script(request.query, retrieved)

    return {
        "reuse_analysis": reuse_info,
        "provider_decision": provider_choice,
        "cost_analysis": {
            "base_cost": base_cost,
            "final_estimated_cost": final_cost,
            "saving": saving,
            "saving_percentage": reuse_pct,
        },
        "models_used": {
            "embedding_model": EMBEDDING_MODEL,
            "generation_model": GENERATION_MODEL,
        },
        "generated_script": script,
        "based_on": [r["id"] for r in retrieved],
    }   