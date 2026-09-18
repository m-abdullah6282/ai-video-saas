# AI Video Creation SaaS Platform

A multi-tenant SaaS platform that orchestrates AI video generation across
multiple third-party providers (HeyGen, Synthesia, Creatify) while
maximizing reuse of previously generated assets through a RAG-based
intelligence layer — reducing cost and increasing consistency.

> **Core principle:** `SEARCH → REUSE → ADAPT → GENERATE`
> Before calling any paid AI provider, the system searches its internal
> asset library (RAG) for reusable content, calculates a cost-saving
> estimate, picks the most cost-effective provider, and generates only
> what's missing.

---

## Live Demo Flow (Tested & Working)

A single API call (`POST /videos/plan`) demonstrates the full pipeline:

```json
// Request
{
  "query": "Create a safeguarding video for adult care workers",
  "sector": "Adult Care"
}
```

```json
// Response (abbreviated)
{
  "reuse_analysis": { "reuse_percentage": 73, "usable_assets": [...] },
  "provider_decision": { "recommended_provider": "heygen", "recommended_cost": 4.7 },
  "cost_analysis": { "base_cost": 4.7, "final_estimated_cost": 1.27, "saving": 3.43 },
  "models_used": { "embedding_model": "models/gemini-embedding-001", "generation_model": "gemini-3.6-flash" },
  "generated_script": "..."
}
```

**What happened behind this one call:**
1. Query embedded (Gemini) → semantically searched against stored assets (SQLite)
2. Sector-filtered, then ranked by cosine similarity
3. Reuse-percentage calculated from match quality
4. Cost compared across mock providers (HeyGen, Synthesia) — cheapest chosen
5. Reuse-percentage applied as a cost discount
6. LLM generated a new script using retrieved past scripts as context (RAG)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite (JavaScript) |
| Backend | FastAPI (Python) |
| Embeddings | Google Gemini (`gemini-embedding-001`) |
| Generation | Google Gemini (`gemini-3.6-flash`) |
| Storage (assets/vectors) | SQLite (JSON-serialized embeddings) |
| Similarity search | NumPy (cosine similarity, in-process) |

---

## Repo Structure

ai-video-saas-repo/
├── apps/
│ ├── web/ # React + Vite frontend — dashboard, wizard, library (mock data)
│ └── api/ # FastAPI backend
│ └── app/
│ ├── main.py # Entry point, mounts all routers
│ ├── schemas.py # Pydantic request/response models
│ ├── routers/ # dashboard.py, assets.py, videos.py
│ ├── providers/ # Provider adapter pattern (base.py + HeyGen/Synthesia/Creatify mocks)
│ └── rag/ # embeddings.py, asset_store.py, retrieval.py, generation.py, reuse_score.py
├── docs/ARCHITECTURE.md # Design decisions and reasoning
└── docker-compose.yml # Postgres config (not currently used — SQLite chosen instead)


---

## What's Built

- ✅ RAG pipeline: embedding generation, persistent vector storage, sector-filtered semantic search
- ✅ Reuse-percentage calculation (brief Section 5/8)
- ✅ Provider Adapter Pattern — HeyGen, Synthesia (Creatify pending)
- ✅ Multi-provider cost comparison + decision engine (Section 11)
- ✅ Cost optimisation engine — reuse-based savings (Section 13)
- ✅ RAG-based script generation (retrieved context → LLM)
- ✅ Input validation and error handling on core AI functions

## Not Yet Built

- Remaining wizard steps (currently: Sector selection only, 1 of 9)
- Frontend ↔ backend connection (frontend still runs on mock data)
- Real provider API integration (currently mocked)
- Authentication, multi-tenancy enforcement, RBAC
- Super Admin / RAG management UI
- AWS deployment, CI/CD test suite
- Video versioning, audit trail, notifications

---

## Local Setup

### Backend
```bash
cd apps/api
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt
# Create .env with GOOGLE_API_KEY=your-key (see .env.example)
uvicorn app.main:app --reload --port 8000
```
Visit `http://localhost:8000/docs` for interactive API testing.

### Frontend
```bash
cd apps/web
npm install
npm run dev
```
Visit `http://localhost:5173`.

---

## Architecture Notes

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for detailed reasoning
on the provider adapter pattern, multi-tenant isolation design, and
RAG pipeline decisions.