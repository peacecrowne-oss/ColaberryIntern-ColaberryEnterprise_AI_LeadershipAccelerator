# Detroit Scalable Voter Education Platform

> Working demo / pilot accompanying the Colaberry response to **City of Detroit RFP 548227** (Office of Contracting and Procurement, on behalf of Elections). A resident enters a ZIP code, picks civic issues (housing, education, public safety), and gets plain-language, source-cited summaries of their officials, candidates, and relevant legislation, with a "why am I seeing this" provenance trail.

| Field | Value |
|---|---|
| Owner | Omolola |
| RFP close date | **2026-07-13** (proposal) |
| Demo URL (target) | https://detroit-voter-demo.colaberry.dev |
| BC list (proposal) | https://app.basecamp.com/3945211/buckets/47346103/todolists/10067424410 |
| BC list (build) | https://app.basecamp.com/3945211/buckets/47346103/todolists/10068130382 |
| Opportunity Pulse | not linked from Basecamp as of 2026-08-19 |

## What this is

A web app pilot shipped alongside the proposal. The pilot is a working demonstration of the system the City is asking for — evaluators can click a link in the proposal and see real screens with seeded fake data flowing through them.

## Status as of 2026-08-19

This project was **not previously scaffolded** in the Accelerator repo — it existed only as Basecamp tickets and specification documents (Requirements, Architecture & Agent Map, Trust Primer, Build Guide, Traceability Matrix, all in BC Docs & Files) with no committed application code anywhere reachable from this session. This scaffold and STORY-011's implementation are the first real code for this project. Everything else described as "built" in prior session notes (STORY-001–029 decision records) is not present in any accessible repository and should be treated as not done until re-verified against real code.

## Two-week sprint goal

Build a working pilot that supports the demo storyline in [requirements.md](./requirements.md) and deploys to a public URL referenced by the proposal.

## Quickstart

```bash
cp .env.example .env
# fill in the env vars
npm install
npm run dev
```

See [SETUP.md](./SETUP.md) for full local development setup.

## Architecture

Full requirements, the multi-agent map, and the Trust (TBI) framework this build must satisfy live in [requirements.md](./requirements.md) — sourced directly from the Basecamp Requirements, Architecture & Agent Map, and Trust (TBI) Primer documents (fetched 2026-08-19). Read it before adding a new story.

## Fake-data seeds

```bash
npm run seed
```

## Deployment

```bash
npm run deploy
```

Not yet configured — see [deploy/](./deploy/). No live deploy target exists yet; `detroit-voter-demo.colaberry.dev` does not resolve as of 2026-08-19 (verified via DNS + HTTPS request).

## Later: split into its own repo

This project currently lives inside the Colaberry Enterprise AI Accelerator repo. See [MOVE_TO_OWN_REPO.md](./MOVE_TO_OWN_REPO.md) — the target is `ColaberryIntern/detroit-voter-education` (already created, currently empty).
