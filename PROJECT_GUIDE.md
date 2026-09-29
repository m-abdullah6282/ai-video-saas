# AI Video Creation SaaS — Project Guide

This document describes the repository as it exists in source code. It is intended as a reliable context file for developers and AI coding agents. When this guide conflicts with implementation, inspect the implementation and update this guide.

## 1. Project at a glance

This is an early-stage, multi-tenant web application for planning AI-assisted video creation. A user enters a video brief; the API searches the user's organization's stored assets, estimates reuse, chooses a low-cost mock video provider, generates a script with Gemini (when configured), and stores a video-plan record. The UI presents the script as a preview. The application does **not** currently render or export an actual video.

The guiding product idea is **Search → Reuse → Adapt → Generate**. The current implementation is a prototype: SQLite persistence, local development URLs, mock provider adapters, and a partly simulated cost model.

## 2. Repository map

```text
.
├── README.md                         # Existing high-level overview and local setup
├── PROJECT_GUIDE.md                  # This source-oriented project reference
├── docs/ARCHITECTURE.md              # Architecture rationale and intended principles
├── docker-compose.yml                # Optional PostgreSQL service; application does not use it
├── package.json                      # npm workspace root
├── package-lock.json
├── apps/
│   ├── web/                           # React + Vite browser application
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── vite.config.js
│   │   ├── tailwind.config.js
│   │   ├── postcss.config.js
│   │   └── src/
│   │       ├── main.jsx               # React entry point
│   │       ├── App.jsx                # Routes and token-presence route guard
│   │       ├── index.css
│   │       ├── components/Layout.jsx  # Authenticated shell/sidebar
│   │       ├── lib/api.js             # Browser fetch wrappers and token storage
│   │       ├── lib/mockData.js        # Static/mock UI data
│   │       └── pages/                 # Dashboard, wizard, library, assets, admin, auth
│   └── api/                           # FastAPI service
│       ├── requirements.txt
│       ├── .env.example
│       ├── assets.db                  # Present local SQLite database; contains mutable app data
│       ├── app/
│       │   ├── main.py                # FastAPI app, CORS, DB initialization, router mounts
│       │   ├── auth.py                # Password hashing, JWT, current-user/admin dependencies
│       │   ├── schemas.py             # Shared response/request Pydantic schemas
│       │   ├── routers/               # HTTP endpoints
│       │   ├── rag/                   # SQLite stores, retrieval, generation, cost helpers
│       │   └── providers/             # Provider contract, mock adapters, chooser
│       ├── seed_avatars.py            # Seeds sample avatar/background assets
│       ├── test_*.py                  # Standalone/manual scripts, not a configured test suite
│       └── list_models.py             # Gemini model inspection utility
└── packages/shared-types/src/index.js # JSDoc-style shared concepts/provider method list
```

## 3. Technology and runtime

| Area | Current implementation |
|---|---|
| Browser app | React 18, JavaScript/JSX, React Router 6, Vite 5 |
| UI styling/icons | Tailwind CSS 3, Lucide React |
| API | Python 3, FastAPI, Uvicorn, Pydantic 2 |
| Persistent store | SQLite database at the relative path `assets.db` |
| Embeddings/similarity | Google Generative AI SDK and NumPy cosine similarity |
| Text generation | Google Generative AI SDK |
| Authentication | JWT HS256, Passlib bcrypt password hashing |
| Workspace | npm workspaces (`apps/*`, `packages/*`) |

The API's SQLite path is relative to the process working directory. The documented development command runs from `apps/api`, so the database is `apps/api/assets.db`. Starting Uvicorn from another directory may create/use a different database. The frontend API base is hard-coded as `http://localhost:8000` in `apps/web/src/lib/api.js`.

## 4. Main user journey

1. A user registers with email, password, and an organization ID, or logs in.
2. The API stores a bcrypt password hash and issues a 60-minute JWT. The token contains email (`sub`), organization (`org`), role, and expiry.
3. The web app saves the token in `localStorage`; protected frontend routes only check that a token exists.
4. The user completes a nine-screen wizard: sector, country, audience, tone, culture, video type, format, duration, and description.
5. On submit, the current frontend sends **only** description and sector to `POST /videos/plan`; the other wizard choices are not persisted or sent.
6. The API searches the user's organization for similar script assets, computes a reuse percentage, obtains a provider cost comparison, and searches for avatar/background recommendations.
7. The API generates a script (Gemini if configured; inspect `rag/generation.py` for fallback/error behavior), saves a `ready_for_review` record and its first script version, and returns analysis and recommendations.
8. The UI shows a text script preview, reuse percentage, estimated cost, provider comparison, and any recommendations. This is not a rendered video.
9. Dashboard and library pages fetch saved API records. Video detail fetches the script and metadata for the signed-in organization.

## 5. Frontend reference

### Routes

| Path | Page | Purpose |
|---|---|---|
| `/login` | `pages/Login.jsx` | Login/registration UI |
| `/` | `pages/Dashboard.jsx` | Org dashboard and recent videos |
| `/create` | `pages/CreateVideo.jsx` | Nine-step brief wizard and plan result |
| `/library` | `pages/VideoLibrary.jsx` | Organization video list |
| `/library/:videoId` | `pages/VideoDetail.jsx` | One video's metadata/script |
| `/assets` | `pages/AssetLibrary.jsx` | Browse available asset types |
| `/admin` | `pages/AdminPanel.jsx` | Admin cross-organization view/actions |

`App.jsx` wraps all routes except login in a `ProtectedRoute`; the guard checks local storage only. API authorization is separately enforced by FastAPI dependencies. `Layout.jsx` provides the shared navigation shell.

### API client

`lib/api.js` contains browser `fetch` helpers. It reads the bearer token from local storage and uses a fixed local API origin. Helpers cover authentication, plan creation, dashboard, library/detail, asset browsing, and admin reads/asset deletion. Errors generally become a short `Error` based on HTTP status; there is no shared refresh/retry client.

## 6. Backend modules

### Application bootstrap — `apps/api/app/main.py`

Creates the FastAPI app, allows credentialed CORS from `http://localhost:5173`, initializes the asset, video, and user tables at import/startup, mounts the dashboard/assets/videos/auth/admin routers, and exposes `GET /` health text. CORS is local-development-only as written.

### Authentication — `auth.py`, `routers/auth.py`

- Passwords are hashed and verified using Passlib bcrypt.
- JWTs use HS256; expiry is 60 minutes.
- `get_current_user` requires `Authorization: Bearer <token>` and returns email, organization ID, and role.
- `require_admin` permits only a token whose role is exactly `admin`.
- Registration accepts `role` in its request model, defaulting to `user`; the route writes that value as supplied. This means self-registration can request `admin` in the current implementation and must be treated as a security gap.
- `JWT_SECRET_KEY` falls back to a known development secret when unset. Set a strong secret outside local development.

### Routers and endpoints

All routes are mounted without an `/api` prefix. Except registration/login and `/`, the endpoints below require a bearer token.

| Method | Path | Auth | Behavior |
|---|---|---|---|
| `GET` | `/` | No | Basic API-running response |
| `POST` | `/auth/register` | No | Create user and return access token |
| `POST` | `/auth/login` | No | Verify credentials and return access token |
| `GET` | `/dashboard/stats` | User | Statistics scoped to token organization |
| `GET` | `/dashboard/recent-videos` | User | Up to five org videos |
| `POST` | `/assets/search` | User | Semantic search scoped to org, optional sector/type/top-k |
| `GET` | `/assets/browse/{asset_type}` | User | Browse org assets, filtered by type |
| `POST` | `/videos/plan` | User | Search, score reuse, choose mock provider, generate script, save plan |
| `GET` | `/videos/library` | User | List videos belonging to org |
| `GET` | `/videos/{video_id}` | User | Fetch one video only if it belongs to org; otherwise 404 |
| `GET` | `/admin/organizations` | Admin | Cross-org video stats |
| `GET` | `/admin/videos` | Admin | Cross-org video listing |
| `GET` | `/admin/assets` | Admin | Cross-org assets (response omits asset type) |
| `DELETE` | `/admin/assets/{asset_id}` | Admin | Delete asset by ID |
| `GET` | `/admin/users` | Admin | List email/org/role (not password hashes) |

Although video storage defines helpers for versions, the current `videos` router does **not** expose version-history or change-request endpoints. The UI does not render video version history.

### Data model and stores — `app/rag/*_store.py`

One SQLite file currently holds:

- `users`: email primary key, password hash, organization ID, role.
- `assets`: ID, organization ID, text, sector, JSON embedding, type (default `script`). The same table stores script, avatar, and background records as text descriptions.
- `videos`: ID, organization ID, title, sector, country, status, date, reuse percentage, cost, script.
- `video_versions`: ID, video ID, version number, script, change description, changed-by string, timestamp.

`asset_store.py` provides insert/replace and organization/type filtered listing. `video_store.py` provides organization-scoped list/detail, save, dashboard aggregation, and version helper functions. `admin_store.py` intentionally performs cross-organization reads and asset deletion for admin routes.

Database initialization uses `CREATE TABLE IF NOT EXISTS`. The users initializer contains a small role-column migration; there is no general migration framework. Store functions open direct SQLite connections and use the relative DB filename `assets.db`.

### Retrieval and generation

- `embeddings.py`: wraps Google text embedding generation; requires an API key for successful remote calls. Inspect this module for failure handling before changing fallbacks.
- `retrieval.py`: embeds the query, restricts candidate rows to the requested organization and asset type, optionally hard-filters sector, then ranks with cosine similarity. This is an in-process linear scan, not a vector database.
- `reuse_score.py`: converts retrieved similarity results to a reuse percentage using a threshold-based rule. The current product's reuse percentage is an estimate from retrieved assets, not proof that video components were physically reused.
- `generation.py`: creates a script from the brief and retrieved context through Gemini, with rate-limit/error handling in the module.
- `cost_engine.py`: separate cost helper. Check call sites before assuming it determines the plan cost; the current `/videos/plan` route calculates `base_cost * (1 - reuse_percentage / 100)` inline.

### Provider selection

`providers/base.py` describes the common provider contract. `heygen_mock.py` and `synthesia_mock.py` are mock adapters with estimated costs; they do not call paid external video APIs. `decision_engine.py` compares available provider estimates and recommends the cheapest. `packages/shared-types/src/index.js` documents planned shared JS types and the six method names (`listAvatars`, `listVoices`, `estimateCost`, `createVideo`, `checkStatus`, `downloadVideo`); this is documentation/convention, not a runtime-enforced cross-language interface. Creatify is named in concepts but has no adapter implementation here.

## 7. Current planning/cost semantics

`POST /videos/plan` currently performs the following sequence: retrieve up to three same-org script assets; compute reuse score; choose a provider for the brief; retrieve one avatar and one background recommendation; calculate estimated final cost and saving; generate script; persist the video and initial version; return IDs and analyses.

The stored `cost` is the estimated final cost, not a confirmed provider charge. The saving is an estimate from the reuse percentage; no reused footage is assembled and no provider generation is launched. Dashboard fields named `*_this_month` are currently aggregated across all stored videos rather than filtered by calendar month. `rag_savings_this_month` is hard-coded to zero. Video country is saved as `UK` regardless of the wizard's country selection because country is not sent to the API.

## 8. Configuration and local development

### API

Requirements are pinned in `apps/api/requirements.txt`. `apps/api/.env.example` currently contains `GOOGLE_API_KEY=your-key-here`; auth also reads `JWT_SECRET_KEY`, which should be added to a real local `.env` with a long random value.

```powershell
cd apps/api
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
# Create .env with GOOGLE_API_KEY and JWT_SECRET_KEY
uvicorn app.main:app --reload --port 8000
```

Interactive API docs: `http://localhost:8000/docs`.

### Web

```powershell
cd apps/web
npm install
npm run dev
```

Vite serves the app at `http://localhost:5173`. The API origin currently must be reachable at `http://localhost:8000`.

### Sample data and utilities

`apps/api/seed_avatars.py` seeds sample avatar/background records. `test_retrieval.py` is described by the README as seeding example scripts; other `test_*.py` files are standalone experiment/manual scripts for retrieval, embeddings, generation, scoring, provider choice, planning, and error behavior. There is no pytest dependency or documented root test runner. `list_models.py` inspects available Gemini models. Inspect each script before running because some may make API calls or mutate the local DB.

### Docker compose

`docker-compose.yml` starts PostgreSQL 16 on port 5432 with a named volume. No current API module connects to this service; the app uses SQLite. Do not assume Docker Compose is required for local operation or that app data is stored in Postgres.

## 9. Security, tenancy, and operational constraints

- User-owned asset/video reads are generally filtered by the organization ID from the JWT, rather than a client-supplied org ID.
- Admin routes intentionally expose cross-org data and rely on the JWT role claim.
- Registration's client-controlled `role` field currently allows privilege self-assignment; remove or tightly control it before real multi-user use.
- JWT signing has a development-secret fallback; production configuration must fail closed if missing.
- Local storage token handling has no refresh/logout expiry UX beyond the API rejecting expired tokens.
- CORS only allows the local Vite origin.
- SQLite has no production migration strategy, backup plan, or configured concurrency tuning.
- There is no own-API rate limiting, audit trail, notification system, CI/CD, or deployment configuration documented as implemented.
- `assets.db` is present in the repository tree. Check `.gitignore` and repository tracking before sharing or deploying; local user data/secrets should not be committed.

## 10. Implemented versus planned

### Present in code

- React application with login/register, dashboard, create-plan wizard, library/detail, asset browse, admin pages.
- FastAPI endpoints for authentication, dashboard, asset search/browse, plan creation, video reads, and admin operations.
- SQLite tables and organization-scoped data access for normal video/asset flows.
- Embedding-based asset retrieval, reuse estimate, Gemini script generation, mock provider cost comparison.
- Video metadata/script persistence and version-storage helper functions.

### Not implemented or incomplete

- Actual video rendering, provider job submission/status polling, and downloadable video output.
- Real HeyGen/Synthesia/Creatify integration.
- Passing all wizard choices through to the API and saving the chosen country/audience/tone/format/duration/culture.
- Applying avatar/background selection to a generation job; current behavior is recommendation only.
- Version/change-request HTTP endpoints and corresponding UI.
- Actual clip/component reuse, so savings are modeled rather than realized.
- Accurate monthly-only spend/savings reporting.
- Production database migrations, provider configuration, API rate limiting, audit logs, CI/CD, deployment setup, and a maintained automated test suite.

## 11. Guidance for AI agents changing this repository

1. Read this file and the relevant source files before making assumptions. `README.md` and `docs/ARCHITECTURE.md` include intended designs and historical descriptions that may be ahead of or different from current code.
2. Keep tenant scoping based on the authenticated user's organization for ordinary routes. Treat cross-tenant access as an explicit admin-only capability.
3. Never describe the mock provider or estimated savings as actual rendered video or confirmed spend.
4. Remember that frontend wizard state is not equivalent to API input; currently only `query` and `sector` cross the network.
5. Preserve API response shapes used by `apps/web/src/lib/api.js` and the page components, or update both sides together.
6. SQLite schema changes need an explicit migration/backward-compatibility plan; `CREATE TABLE IF NOT EXISTS` alone does not update existing columns.
7. Keep credentials out of source control. Gemini calls require a configured API key; local auth should use a non-default secret.
8. The npm root `dev` and `test` scripts are placeholders; run the app-specific commands above. Do not infer a test suite exists merely from filenames beginning with `test_`.

## 12. Related documentation

- [`README.md`](README.md): original overview and quick-start notes.
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md): design rationale, tenancy intent, and proposed testing/deployment principles.
- [`apps/api/app/main.py`](apps/api/app/main.py): API assembly and initialization.
- [`apps/api/app/routers/`](apps/api/app/routers/): endpoint implementations.
- [`apps/api/app/rag/`](apps/api/app/rag/): data, retrieval, generation, and cost logic.
- [`apps/web/src/`](apps/web/src/): frontend routes, pages, and API client.
