from fastapi import APIRouter
from pydantic import BaseModel
from app.rag.retrieval import search_similar_assets
from app.rag.generation import generate_script

router = APIRouter(prefix="/videos", tags=["videos"])


class GenerateScriptRequest(BaseModel):
    query: str
    sector: str | None = None


@router.post("/generate-script")
async def generate_script_endpoint(request: GenerateScriptRequest):
    retrieved = await search_similar_assets(request.query, sector=request.sector, top_k=3)
    script = await generate_script(request.query, retrieved)
    return {
        "generated_script": script,
        "based_on": [r["id"] for r in retrieved],
    }