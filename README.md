# AI Video Creation SaaS Platform

A multi-tenant SaaS platform that orchestrates AI video generation across multiple
third-party providers (HeyGen, Synthesia, Creatify) while maximizing reuse of
previously generated assets to reduce cost.

> **Core principle:** `SEARCH → REUSE → ADAPT → GENERATE`
> Before calling any paid AI provider, the system searches its internal asset
> library (RAG) to see what can be reused. Only the missing pieces are generated.

---

## 1. What this platform actually does

This is **not** an AI video generator. It is an **orchestration and reuse engine**
that sits on top of external AI video providers.

```
User Request
   → Understand the brief
   → Search internal asset library (RAG)
   → Determine what can be reused
   → Determine what must be generated
   → Pick the best provider for the missing pieces
   → Estimate cost
   → Generate only what's needed
   → Assemble final video
   → Store all reusable components back into the RAG
```

The more videos created, the more valuable the internal library becomes, and the
less the platform depends on paying external providers to regenerate content
that already exists.

## 2. Why multi-tenant matters

Every organization (tenant) that signs up gets a **completely isolated** asset
library. Two organizations sending the identical prompt will never see each
other's avatars, backgrounds, scripts, or generated videos — even though both
may be using the same underlying providers. Only the **provider's public
catalog** (e.g. HeyGen's globally available avatars) is shared; everything an
organization generates or stores is private to that organization.

## 3. Repo structure

```
ai-video-saas/
├── apps/
│   ├── web/           # Next.js — prototype UI (Phase 1: mocked data, no real API calls)
│   └── api/            # Node.js backend (plain JavaScript)
│       └── src/providers/  # Provider Adapter Pattern (see docs/ARCHITECTURE.md)
├── packages/
│   └── shared-types/    # Shared JS shapes (documented via JSDoc) used by both web and api
├── docs/
│   └── ARCHITECTURE.md  # Deep-dive on RAG design, provider adapters, cost engine
├── .github/workflows/   # CI — tests run automatically on every push (mandatory from Day 1)
└── docker-compose.yml   # Local Postgres + services for development
```

## 4. Development phases (see docs/ARCHITECTURE.md for detail)

| Phase | Goal |
|---|---|
| 0 | Requirements understanding, repo/CI setup |
| 1 | Clickable prototype — mocked data, no real provider calls |
| 2 | Core backend — DB schema, multi-tenant isolation, provider adapters |
| 3 | RAG intelligence layer — semantic search, reuse scoring |
| 4 | Real provider integration (HeyGen/Synthesia/Creatify) + webhooks |
| 5 | Security — auth, RBAC, IP restriction, audit trail |
| 6 | AWS deployment — dev → staging → production pipeline |

We are currently in **Phase 0 → Phase 1**.

## 5. Local setup

```bash
git clone <this-repo>
cd ai-video-saas
npm install
docker-compose up -d     # starts local Postgres
npm run dev               # starts web + api together
```

## 6. Contributing / branching rules

```
feature-branch → Pull Request → Automated Tests → Code Review → staging → production
```
No one pushes directly to `main`/production. See `.github/workflows/ci.yml`.

## 7. License

TBD.
