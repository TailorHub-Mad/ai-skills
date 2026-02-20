# Branch Review

Perform an agnostic, multi-agent code review of the current git branch against its base branch. This works entirely with local git — no GitHub CLI or pull request is needed.

Follow these steps precisely:

## Step 1 — Verify git context

Run `git rev-parse --is-inside-work-tree` to confirm we are inside a git repository. If not, stop and inform the user.

Get the current branch name with `git rev-parse --abbrev-ref HEAD`. Check whether it matches any of the common base branch names: `main`, `master`, or `develop`. If it does, stop immediately and tell the user:

> You are currently on `<branch-name>`, which is a base branch. `tailor-code-review` compares your current branch against the base — running it on the base branch itself produces no meaningful diff. Please switch to a feature branch and try again.

Do not proceed further if the current branch is a base branch.

Determine the base branch by checking (in order):
1. `git show-branch -a 2>/dev/null | grep '\*' | grep -v "$(git rev-parse --abbrev-ref HEAD)" | head -1` to detect common ancestor
2. Try `git rev-parse --verify main`, then `master`, then `develop` to find the first that exists
3. Fall back to `HEAD~10` if none exist

Collect the diff:
```bash
git diff <base>...HEAD
```
If the diff is empty, also check for staged/unstaged changes with `git diff HEAD`. If there are still no changes, inform the user that there is nothing to review.

Get the list of changed files:
```bash
git diff --name-only <base>...HEAD
```

## Step 2 — Collect repo context

Use a Haiku agent to:
- Search for `AGENTS.md` and `CLAUDE.md` files at the repo root and in any directories containing changed files
- Return the file paths and their full contents
- If neither is found, return an empty result (do not error)

## Step 3 — Summarise the change

Use a Haiku agent to read the diff and return:
- A one-paragraph plain-English summary of what changed
- The primary language(s) and frameworks detected

## Step 4 — Parallel review agents

Launch **4 parallel Sonnet agents**, each receiving:
- The full diff
- The list of changed file paths
- The repo context files (AGENTS.md / CLAUDE.md) and their contents
- The change summary from Step 3

Each agent must return a list of issues, each with: a short title, a description, the file path and approximate line number(s), and the reason it was flagged.

### Agent 1 — Bug & logic analysis
Read the diff carefully. Look for:
- Off-by-one errors, null/undefined dereferences, incorrect conditionals
- Race conditions, missing awaits, incorrect async handling
- Wrong variable scoping, shadowing, mutation of shared state
- Incorrect error handling or swallowed exceptions
Avoid nitpicks. Focus on issues that will cause incorrect behaviour at runtime.

### Agent 2 — Security vulnerabilities
Scan the diff for:
- Injection risks (SQL, command, HTML/XSS, path traversal)
- Hardcoded secrets, tokens, passwords, or private keys
- Insecure defaults (weak crypto, missing auth checks, open CORS)
- Unsafe use of `eval`, `exec`, `pickle`, `dangerouslySetInnerHTML`, etc.
- Sensitive data logged or exposed in error messages
Focus only on issues introduced or worsened by this diff.

### Agent 3 — Critical & breaking changes
Look for:
- Data loss risks (destructive DB migrations, overwriting files without backup)
- Breaking API or interface changes (removed fields, changed signatures)
- Dependency or config changes that could cause crashes in production
- Performance regressions that could cause timeouts or memory exhaustion under normal load
Only flag issues that are critical enough to block a deployment.

### Agent 4 — Repo guideline compliance
Using the AGENTS.md / CLAUDE.md contents from Step 2:
- Check whether the diff violates any explicit guidelines (naming conventions, forbidden patterns, required patterns, architecture rules)
- Only flag issues that are directly and specifically mentioned in those files
- If no guideline files were found, skip this agent and return an empty list

## Step 5 — Score each issue

For every issue returned by the agents in Step 4, launch a parallel **Haiku agent** that receives:
- The issue title, description, file path, and line(s)
- The relevant diff section around that file/line
- The repo context files

The agent scores the issue on a scale of 0–100:

| Score | Meaning |
|-------|---------|
| 0     | False positive — does not hold up to scrutiny, or is pre-existing |
| 25    | Possibly real, but unverified or very minor |
| 50    | Likely real, but a nitpick or low-impact in practice |
| 75    | High confidence — verified, important, will be hit in practice |
| 100   | Certain — will definitely occur, high severity |

For guideline issues (Agent 4), the scorer must confirm the guideline file actually states that specific rule explicitly before scoring ≥ 75.

## Step 6 — Filter and write report

Discard any issue with a score below 75.

### Determine the output path

Run the following to build the filename:
```bash
git rev-parse --abbrev-ref HEAD   # branch name
date "+%B %-d %Y at %-I.%M %p"   # e.g. "February 19 2026 at 1.45 PM"
```

Sanitise the branch name for use in a filename by replacing `/` and any non-alphanumeric characters (except `-` and `_`) with `-`. Strip leading/trailing dashes.

The output file path is:
```
<repo-root>/.reviews/<sanitised-branch>_<timestamp>.md
```

For example, a branch named `feat/auth-refactor` reviewed at 1:45 PM on February 19 2026 becomes:
```
.reviews/feat-auth-refactor_February-19-2026-at-1.45-PM.md
```

Create the `.reviews/` directory at the repo root if it does not already exist.

### Write the file

Write a Markdown file to that path. Use the following format precisely:

---

```markdown
# Branch Review — <branch-name>

**Date:** <human timestamp, e.g. February 19 2026 at 1:45 PM>
**Branch:** `<branch-name>`
**Base:** `<base-branch>`
**Changed files:** N

**Summary:** <one-sentence summary of what the branch does>

---

## No issues found

No critical issues found. Checked for bugs, security vulnerabilities, breaking changes, and guideline compliance.
```

---

Or, if issues were found (adapt the count):

---

```markdown
# Branch Review — <branch-name>

**Date:** <human timestamp, e.g. February 19 2026 at 1:45 PM>
**Branch:** `<branch-name>`
**Base:** `<base-branch>`
**Changed files:** N
**Issues found:** N

**Summary:** <one-sentence summary of what the branch does>

---

## Issues

### 1. [CATEGORY] Brief title

Description of the issue and why it matters.

**File:** `path/to/file.ext`, line ~42
**Confidence:** 85/100

```diff
<relevant diff snippet, ≤ 10 lines>
```

---

### 2. [CATEGORY] Brief title

...

---

## Categories

`BUG` — logic or runtime error
`SECURITY` — vulnerability or unsafe pattern
`CRITICAL` — breaking change or data loss risk
`GUIDELINE` — violates AGENTS.md / CLAUDE.md rule
```

---

After writing the file, tell the user:
```
Review saved to .reviews/<filename>.md
```

Categories: `BUG`, `SECURITY`, `CRITICAL`, `GUIDELINE`

## False positive guidance (for Steps 4 and 5)

Do NOT flag:
- Pre-existing issues that are not touched by this diff
- Issues that a linter, type-checker, or compiler would catch automatically
- Stylistic preferences not explicitly mentioned in AGENTS.md / CLAUDE.md
- Changes in behaviour that are clearly intentional given the summary
- Pedantic nitpicks a senior engineer would not raise in a real review
- Issues on lines not modified by this diff
