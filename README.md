# AI Video Creation SaaS Platform

A multi-tenant SaaS platform that orchestrates AI video generation across
multiple third-party providers (HeyGen, Synthesia, Creatify) while
maximizing reuse of previously generated assets through a RAG-based
intelligence layer — reducing cost and increasing consistency.

> **Core principle:** `SEARCH → REUSE → ADAPT → GENERATE`

---

## Live Demo Flow (Tested & Working)

Full user journey verified end-to-end:

Register/Login → Create Video Wizard (9 steps) →
Backend: RAG search + reuse-scoring + provider-decision + script-generation →
Video saved to org-isolated database →
Dashboard/Library shows real data →
Click video → Video Detail page with script preview


**Verified test cases (real, reproducible):**
- Matching-sector query → 74-75% reuse, cost drops from £4.70 → £1.22
- Non-matching sector → 0% reuse (correctly rejected, no false-positives)
- Multi-tenant isolation → Org-2 cannot see Org-1's data (tested)
- Role-based access → non-admin gets 403 on /admin/* routes

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite (JavaScript) |
| Backend | FastAPI (Python) |
| Embeddings | Google Gemini (`gemini-embedding-001`) |
| Generation | Google Gemini (`gemini-3.6-flash`) |
| Storage | SQLite (single file, JSON-serialized embeddings) |
| Similarity search | NumPy (in-process cosine similarity) |
| Auth | JWT (python-jose + passlib/bcrypt) |

---

## Repo Structure

ai-video-saas-repo/
├── apps/
│ ├── web/ # React + Vite frontend
│ │ └── src/
│ │ ├── pages/
│ │ │ ├── Dashboard.jsx # Real stats/recent-videos, clickable
│ │ │ ├── CreateVideo.jsx # 9-step wizard + video-preview result
│ │ │ ├── VideoLibrary.jsx # All videos, clickable
│ │ │ ├── VideoDetail.jsx # Single video, script preview, versions
│ │ │ ├── AssetLibrary.jsx # Browse/select avatars & backgrounds
│ │ │ ├── AdminPanel.jsx # Org stats, all videos, asset management
│ │ │ └── Login.jsx # Login/register with organization_id
│ │ ├── lib/api.js # All API calls, JWT token handling
│ │ └── components/Layout.jsx # Sidebar nav
│ │
│ └── api/ # FastAPI backend
│ └── app/
│ ├── main.py # Entry point, CORS, all routers mounted
│ ├── schemas.py # Pydantic models
│ ├── auth.py # JWT create/verify, get_current_user, require_admin
│ ├── routers/
│ │ ├── auth.py # /auth/register, /auth/login
│ │ ├── dashboard.py # /dashboard/stats, /recent-videos (real data)
│ │ ├── assets.py # /assets/search, /assets/browse/{type}
│ │ ├── videos.py # /videos/plan, /library, /{id}, /{id}/versions, /{id}/request-change
│ │ └── admin.py # /admin/organizations, /videos, /assets, /users (role-gated)
│ ├── providers/
│ │ ├── base.py # Abstract VideoProvider contract
│ │ ├── heygen_mock.py # Mock adapter (real HeyGen integration pending)
│ │ ├── synthesia_mock.py # Mock adapter
│ │ └── decision_engine.py # Cheapest-provider auto-selection
│ └── rag/
│ ├── embeddings.py # Gemini embedding wrapper, error-handled
│ ├── asset_store.py # SQLite CRUD, org+type filtered
│ ├── retrieval.py # Sector hard-filter + cosine-similarity rank
│ ├── generation.py # RAG script generation, retry-on-429
│ ├── reuse_score.py # Threshold-based reuse % (0.65 cutoff)
│ └── video_store.py # Video CRUD + version history
├── docs/ARCHITECTURE.md
└── docker-compose.yml # Postgres config — NOT currently used (SQLite chosen)


---

## What's Built

- ✅ RAG pipeline: embeddings, persistent storage, sector-filtered semantic search
- ✅ Reuse-percentage calculator with empirically-tuned threshold
- ✅ Provider Adapter Pattern — HeyGen, Synthesia (both mocked)
- ✅ Multi-provider cost-comparison + auto-selection
- ✅ Cost-optimisation engine (reuse-based discount)
- ✅ RAG-based script generation (verified context-dependency)
- ✅ Full 9-step Create Video wizard, connected to backend
- ✅ JWT auth, protected routes, role field (user/admin)
- ✅ Multi-tenancy — organization-level isolation (tested)
- ✅ Super Admin panel — cross-org visibility, asset deletion
- ✅ Avatar/Background asset library with recommendation + manual browse
- ✅ Video Detail page with version-history backend (frontend UI pending)
- ✅ Input validation, error handling, retry-logic for rate-limits

## Not Yet Built / Known Gaps

- Version-history **frontend UI** (backend endpoints exist: `/videos/{id}/versions`, `/{id}/request-change`)
- Avatar/Background selection not yet wired into `/videos/plan` request (recommendation-only currently)
- Real HeyGen/Synthesia API integration — currently mocked (paid-service, deferred decision)
- Creatify provider — paused
- IP restrictions, audit trail, notifications
- Rate-limiting on own API
- Automated test suite (pytest) — only manual test scripts exist
- Deployment (Docker, AWS, CI/CD) — not started
- `.gitignore` — verify `assets.db` is excluded from tracking

---

## Local Setup

### Backend
```bash
cd apps/api
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt
# Create .env: GOOGLE_API_KEY=<key>, JWT_SECRET_KEY=<random-long-string>
uvicorn app.main:app --reload --port 8000
```
`http://localhost:8000/docs` for interactive API testing.

### Frontend
```bash
cd apps/web
npm install
npm run dev
```
`http://localhost:5173`

### Seed Data
```bash
cd apps/api
python test_retrieval.py      # seeds 5 sample scripts (org-1)
python seed_avatars.py        # seeds 3 avatars + 3 backgrounds (org-1)
```

---

## Known Technical Debt / Architecture Notes

- **Database schema-migration:** SQLite `CREATE TABLE IF NOT EXISTS` does not alter existing tables. When adding columns to existing tables during development, `assets.db` was deleted and recreated (acceptable pre-production; would need proper `ALTER TABLE` migrations in production).
- **Cost-saving simulation:** The reuse-discount formula (`final_cost = base_cost × (1 - reuse%)`) approximates savings from asset reuse. The actual mechanism this represents — assembling videos from reused clips via FFmpeg rather than fully re-rendering — is not yet implemented; this is Phase 4 work tied to real provider integration.
- **SQLite similarity search is O(n) linear scan** — acceptable at current scale (dozens of assets), would need pgvector/dedicated vector-DB at production scale (thousands+ assets).

---

## Architecture Deep-Dive

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for detailed reasoning on
the provider adapter pattern, multi-tenant isolation design, and RAG
pipeline decisions.