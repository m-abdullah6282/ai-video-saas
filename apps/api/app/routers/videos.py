from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.rag.retrieval import search_similar_assets
from app.rag.generation import generate_script
from app.rag.reuse_score import calculate_reuse_score
from app.providers.decision_engine import choose_best_provider
from app.rag.video_store import save_video, get_all_videos
from app.auth import get_current_user
import uuid

router = APIRouter(prefix="/videos", tags=["videos"])


class VideoPlanRequest(BaseModel):
    query: str
    sector: str | None = None


@router.post("/plan")
async def video_plan(request: VideoPlanRequest, current_user: dict = Depends(get_current_user)):
    org_id = current_user["organization_id"]

    retrieved = await search_similar_assets(request.query, organization_id=org_id, sector=request.sector, top_k=3)
    reuse_info = calculate_reuse_score(retrieved)
    provider_choice = await choose_best_provider({"description": request.query})

    reuse_pct = reuse_info["reuse_percentage"]
    base_cost = provider_choice["recommended_cost"]
    final_cost = round(base_cost * (1 - reuse_pct / 100), 2)
    saving = round(base_cost - final_cost, 2)

    script = await generate_script(request.query, retrieved)

    video_id = str(uuid.uuid4())[:8]
    save_video(
        video_id=video_id,
        organization_id=org_id,
        title=request.query[:50],
        sector=request.sector or "Other",
        status="ready_for_review",
        reuse_percentage=reuse_pct,
        cost=final_cost,
        script=script,
    )

    return {
        "video_id": video_id,
        "reuse_analysis": reuse_info,
        "provider_decision": provider_choice,
        "cost_analysis": {"base_cost": base_cost, "final_estimated_cost": final_cost, "saving": saving, "saving_percentage": reuse_pct},
        "generated_script": script,
        "based_on": [r["id"] for r in retrieved],
    }


@router.get("/library")
async def get_video_library(current_user: dict = Depends(get_current_user)):
    return get_all_videos(current_user["organization_id"])