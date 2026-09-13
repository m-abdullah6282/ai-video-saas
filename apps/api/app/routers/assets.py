from fastapi import APIRouter
from app.schemas import AssetSearchRequest, AssetSearchResult
from app.rag.retrieval import search_similar_assets

router = APIRouter(prefix="/assets", tags=["assets"])


@router.post("/search", response_model=list[AssetSearchResult])
async def search_assets(request: AssetSearchRequest):
    results = await search_similar_assets(
        query=request.query,
        sector=request.sector,
        top_k=request.top_k,
    )
    return results