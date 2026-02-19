---
name: tailor-code-review
description: Agnostic code review for the current git branch. Analyses changed files for bugs, security vulnerabilities, and critical issues. Reads AGENTS.md or CLAUDE.md for repo-specific context. Works without GitHub — uses local git only.
version: 1.0.0
---

# Tailor Code Review

Performs an automated, multi-agent code review of your current git branch changes against the base branch (main/master/develop).

Works entirely with local git — no GitHub CLI or PR required.

## What it checks

- Potential bugs and logic errors
- Security vulnerabilities (injection, auth, secrets, unsafe operations)
- Critical fixes (data loss, crashes, breaking API changes)
- Compliance with repo-specific guidelines from AGENTS.md / CLAUDE.md

## Output

Writes a Markdown report to `reviews/<branch>_<timestamp>.md` at the repo root. Creates the `reviews/` directory if it doesn't exist.

Each issue is scored 0–100 for confidence. Only issues scoring ≥ 75 are included.
