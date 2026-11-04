# tailor-skills

Shared TailorHub skills installable via `npx` for Claude Code, Codex, and OpenCode.

## Installation (CLI)

Run commands with `npx @tailorhub/skills@latest`.

### Targets

The CLI supports these targets:

- `claude` -> installs into `~/.claude/skills`
- `codex` -> installs into `~/.codex/skills`
- `opencode` -> installs into `~/.config/opencode/skills`
- `all` -> installs into Claude Code, Codex, and OpenCode

If you do **not** pass `--target`, the default is `all`.

The CLI creates the target skills directories automatically if they do not exist.

## Install a skill (`add`)

### Default (installs in Claude Code, Codex, and OpenCode)

```sh
npx @tailorhub/skills@latest add https://github.com/TailorHub-Mad/ai-skills/tailor-code-review
```

### Install only in Codex

```sh
npx @tailorhub/skills@latest add https://github.com/TailorHub-Mad/ai-skills/tailor-code-review --target codex
```

### Install only in OpenCode

```sh
npx @tailorhub/skills@latest add https://github.com/TailorHub-Mad/ai-skills/tailor-code-review --target opencode
```

### Install a skill with subfolders (agents/references)

```sh
npx @tailorhub/skills@latest add https://github.com/TailorHub-Mad/ai-skills/tailor-mermaid-to-drawio --target all
```

### Auto-install behavior for code review

When you install `tailor-code-review`, the CLI also installs `code-review-router` on the same target automatically (if not already present).

`code-review-router` is idempotent:
- If already installed, it is skipped.
- If installation fails but `tailor-code-review` succeeds, the command reports partial success.

After installing, restart the corresponding app(s) to apply changes.

## Update skills (`update`)

### Update all installed skills (default: Claude Code + Codex + OpenCode)

```sh
npx @tailorhub/skills@latest update
```

### Update all skills for a single target

```sh
npx @tailorhub/skills@latest update --target claude
```

### Update all skills only in OpenCode

```sh
npx @tailorhub/skills@latest update --target opencode
```

### Update a specific skill on all targets

```sh
npx @tailorhub/skills@latest update tailor-code-review
```

### Update a specific skill only in OpenCode

```sh
npx @tailorhub/skills@latest update tailor-code-review --target opencode
```

### Update a specific skill only in Codex

```sh
npx @tailorhub/skills@latest update tailor-mermaid-to-drawio --target codex
```

The CLI re-downloads every file in the skill (including nested folders such as `agents/` and `references/`) from its saved source metadata.

## Remove skills (`remove`)

### Remove a specific skill from all targets (default)

```sh
npx @tailorhub/skills@latest remove tailor-code-review
```

### Remove a specific skill only from Codex

```sh
npx @tailorhub/skills@latest remove tailor-code-review --target codex
```

### Remove a specific skill only from OpenCode

```sh
npx @tailorhub/skills@latest remove tailor-code-review --target opencode
```

`remove` deletes the skill folder only (for example `~/.codex/skills/<skill>`). It does not delete other skills or the root `skills` directories.

## Partial success behavior

When using `--target all` (or no `--target`), one or more targets may fail while others succeed.

- The command is considered successful if at least one target succeeds.
- The CLI prints a per-target result summary so you can see what failed.
- The command fails only if **all** requested targets fail.

## Available skills

| Skill | Description |
|-------|-------------|
| `code-review-router` | Routes code-review requests to a repo-specific review skill when available, with fallback to `tailor-code-review`. |
| `tailor-code-review` | Agnostic code review for the current git branch. Detects bugs, security vulnerabilities, and critical issues. |
| `tailor-mermaid-to-drawio` | Creates and improves editable Draw.io diagrams from prose, Mermaid, or existing files, with accurate cloud/third-party icons, clean routing, and a visual quality pass. |
| `grill-me` | Structured interview mode that walks every branch of a technical decision tree until reaching shared understanding. |

### Draw.io quality standard

`tailor-mermaid-to-drawio` also handles requests such as "hazme un diagrama de
esta arquitectura" or "mejora este Draw.io, sin líneas superpuestas". It bundles
a reusable visual standard, an editable architecture starter, icon-selection
guidance, a read-only XML/geometry checker, and evaluation prompts. Mermaid is
optional; an explicitly requested Mermaid-only output is still respected.

The default is rounded icon-and-label cards, soft responsibility/trust-boundary
containers, restrained colors, readable typography, and unambiguous connectors.
Draw.io MCP can supply icon search and obstacle-avoiding routing when available.
Rendered visual verification is reported separately from structural validation.

To check the bundled starter and checker without extra Python packages:

```sh
python3 skills/tailor-mermaid-to-drawio/scripts/check_drawio.py skills/tailor-mermaid-to-drawio/assets/architecture-starter.drawio
python3 -B -m unittest discover -s skills/tailor-mermaid-to-drawio/scripts -p 'test_*.py'
```
