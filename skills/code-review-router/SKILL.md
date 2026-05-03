---
name: code-review-router
description: Route generic code-review requests to a repo-specific review skill when available; otherwise fall back to tailor-code-review.
version: 1.0.0
---

# Code Review Router

Use this skill as the default entrypoint for code review requests.

## Goal

- Prefer project/repo-specific code-review skills when they exist.
- Fall back to `tailor-code-review` when no specific alternative is available.

## Routing Rules

1. Build candidate list from the currently available skills in the session.
2. Keep only skills that are clearly for code review (for example names/descriptions containing `review`, `code-review`, `branch review`, `mr review`, `pr review`).
3. Exclude these from candidates:
   - `code-review-router` (this skill)
   - `tailor-code-review` (fallback only)
4. If one or more candidates remain, choose the most repo-specific option using this priority:
   - Explicit repo-local/project-local review skill
   - More specific scope (for example backend/frontend/security review) over generic wording
   - If still tied, choose the first exact name match containing `code-review`
5. If a candidate is selected, load and execute that skill.
6. If no candidate is selected, load and execute `tailor-code-review`.

## Guardrails

- Never call `code-review-router` recursively.
- Do not run two review skills for the same request unless the user explicitly asks for multiple passes.
- Preserve the user's original request context when delegating.

## User-facing behavior

- Before delegating, state in one short line what will be used:
  - `Using repo-specific review skill: <name>`
  - or `No repo-specific review skill found, using tailor-code-review`
