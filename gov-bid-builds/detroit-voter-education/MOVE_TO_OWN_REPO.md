# Migrating Detroit Scalable Voter Education Platform to its own git repo

This project currently lives inside the Colaberry Enterprise AI Accelerator repo at `gov-bid-builds/detroit-voter-education/`. The target repo, `ColaberryIntern/detroit-voter-education`, already exists on GitHub and is currently empty.

## Steps

1. Target repo already created: `ColaberryIntern/detroit-voter-education` (https://github.com/ColaberryIntern/detroit-voter-education).

2. From inside the Accelerator repo, run the subtree split:

```bash
cd /path/to/colaberry-enterprise-ai-accelerator
git subtree split --prefix=gov-bid-builds/detroit-voter-education -b detroit-voter-education-split
```

3. Push the split branch to the new repo:

```bash
git remote add detroit-voter-education-remote git@github.com:ColaberryIntern/detroit-voter-education.git
git push detroit-voter-education-remote detroit-voter-education-split:main
```

4. (Optional) Remove the project from the parent repo:

```bash
git rm -rf gov-bid-builds/detroit-voter-education
git commit -m "Split detroit-voter-education into own repo"
```

5. In the new repo, update README links to point at the new location.

## What stays with the Accelerator

- The BC todo lists in Gov Contracts BC project (proposal + build)
- The original requirements.md and architect spec (Basecamp Docs & Files remains the canonical source)

## What goes to the new repo

- All source code under `gov-bid-builds/detroit-voter-education/`
- CI / CD configs (none yet)
- The demo deploy at https://detroit-voter-demo.colaberry.dev (target — not live as of 2026-08-19)

## When to split

Split once the project is **post-sprint stable** — i.e., the proposal has been submitted and the build is in production/iteration mode. During the sprint, the project lives in the Accelerator repo so deploys go through the existing pipeline. As of 2026-08-19, this project is pre-sprint (STORY-011 is the first real code) — do not split yet.
