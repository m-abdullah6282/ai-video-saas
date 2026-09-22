from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.rag.retrieval import search_similar_assets
from app.rag.asset_store import get_all_assets
from app.auth import get_current_user

router = APIRouter(prefix="/assets", tags=["assets"])


class AssetSearchRequest(BaseModel):
    query: str
    sector: str | None = None
    asset_type: str | None = None
    top_k: int = 3


@router.post("/search")
async def search_assets(request: AssetSearchRequest, current_user: dict = Depends(get_current_user)):
    return await search_similar_assets(
        request.query,
        organization_id=current_user["organization_id"],
        sector=request.sector,
        asset_type=request.asset_type,
        top_k=request.top_k,
    )


@router.get("/browse/{asset_type}")
async def browse_assets(asset_type: str, current_user: dict = Depends(get_current_user)):
    return get_all_assets(current_user["organization_id"], asset_type=asset_type)