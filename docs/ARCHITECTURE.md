# Architecture Deep Dive

## 1. Provider Adapter Pattern

**Problem:** HeyGen, Synthesia, and Creatify each have completely different API
shapes. If we call each one directly from business logic, adding a 4th provider
later means touching code everywhere.

**Solution:** One common interface. Every provider gets an "adapter" that
translates our interface into that provider's real API.

```ts
// packages/shared-types/src/provider.ts
interface VideoProvider {
  listAvatars(): Promise<Avatar[]>;
  listVoices(): Promise<Voice[]>;
  estimateCost(job: VideoJob): Promise<CostEstimate>;
  createVideo(job: VideoJob): Promise<GenerationHandle>;
  checkStatus(handle: GenerationHandle): Promise<GenerationStatus>;
  downloadVideo(handle: GenerationHandle): Promise<Buffer>;
}
```

`HeyGenAdapter`, `SynthesiaAdapter`, `CreatifyAdapter` all implement this. The
rest of the app never knows which provider it's talking to — it just calls
`provider.createVideo(job)`.

**Consequence if skipped:** every new provider = rewriting core logic across
the app. Directly violates the brief's "modular architecture" requirement.

## 2. Multi-tenant isolation

Every table that stores organization data (`videos`, `avatars`, `voices`,
`backgrounds`, `scripts`, `assets`) carries an `organization_id` column. Every
query is scoped by the authenticated user's `organization_id` — enforced at
the data-access layer, not left to individual endpoints to remember.

Two categories of data:

| Data | Scope |
|---|---|
| Provider's public catalog (e.g. HeyGen's globally available avatars) | Shared, read-only across all orgs |
| Anything generated/stored by an organization | Strictly isolated to that org |

Normal users never query the RAG directly — only Super Admin can (per the
brief's Section 18). Normal users only benefit indirectly through
recommendations the system surfaces to them.

## 3. RAG / Reusable Asset Library

Not a "chatbot RAG." A structured, searchable asset database. Every completed
video is broken into components at save time: avatar, voice, background,
intro, outro, B-roll, script, music — each stored and tagged separately so
future requests can reuse *parts* of a video, not just whole videos.

Reuse score example (from the brief):

```
Existing UK adult-care avatar: available
Existing approved care-home background: available
Existing intro/outro: available
Existing safeguarding B-roll: 70% reusable
Existing script: 55% relevant
→ Reusable from Library: 76%
→ New AI Generation Required: 24%
```

This score must be calculated **before** any paid API call is made.

## 4. Cost & Savings Engine

Every generation must record:
- Estimated cost before generation
- Actual cost after generation
- Estimated cost if nothing had been reused
- The delta = savings

Actual confirmed spend and estimated avoided spend are always kept as
**separate fields** — savings are never reported as if they were real cash
transactions.

## 5. Testing strategy (mandatory from Day 1)

- Unit tests — individual functions/services
- Integration tests — DB, auth, provider adapters, RAG
- E2E tests — full user journeys (login → create video → approve → library)
- Permission tests — org isolation, RBAC boundaries
- **External provider APIs are always mocked in CI** — tests must never spend
  real provider credits

## 6. Deployment pipeline

```
Developer branch → Pull Request → Automated Tests → Code Review → Staging → Production (manual promotion)
```

Separate environments (dev/staging/production) with separate credentials from
the start — never shared.
