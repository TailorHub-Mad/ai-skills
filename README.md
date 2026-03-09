# tailor-skills

Shared TailorHub skills installable via `npx` for Claude Code and Codex.

## Installation (CLI)

Run commands with `npx @tailorhub/skills@latest`.

### Targets

The CLI supports these targets:

- `claude` -> installs into `~/.claude/skills`
- `codex` -> installs into `~/.codex/skills`
- `both` -> installs into both locations

If you do **not** pass `--target`, the default is `both`.

The CLI creates the target skills directories automatically if they do not exist.

## Install a skill (`add`)

### Default (installs in Claude Code and Codex)

```sh
npx @tailorhub/skills@latest add https://github.com/TailorHub-Mad/ai-skills/tailor-code-review
```

### Install only in Codex

```sh
npx @tailorhub/skills@latest add https://github.com/TailorHub-Mad/ai-skills/tailor-code-review --target codex
```

### Install a skill with subfolders (agents/references)

```sh
npx @tailorhub/skills@latest add https://github.com/TailorHub-Mad/ai-skills/tailor-mermaid-to-drawio --target both
```

After installing, restart the corresponding app(s) to apply changes.

## Update skills (`update`)

### Update all installed skills (default: Claude Code + Codex)

```sh
npx @tailorhub/skills@latest update
```

### Update all skills for a single target

```sh
npx @tailorhub/skills@latest update --target claude
```

### Update a specific skill on both targets

```sh
npx @tailorhub/skills@latest update tailor-code-review
```

### Update a specific skill only in Codex

```sh
npx @tailorhub/skills@latest update tailor-mermaid-to-drawio --target codex
```

The CLI re-downloads every file in the skill (including nested folders such as `agents/` and `references/`) from its saved source metadata.

## Remove skills (`remove`)

### Remove a specific skill from both targets (default)

```sh
npx @tailorhub/skills@latest remove tailor-code-review
```

### Remove a specific skill only from Codex

```sh
npx @tailorhub/skills@latest remove tailor-code-review --target codex
```

`remove` deletes the skill folder only (for example `~/.codex/skills/<skill>`). It does not delete other skills or the root `skills` directories.

## Partial success behavior

When using `--target both` (or no `--target`), one target may fail while the other succeeds.

- The command is considered successful if at least one target succeeds.
- The CLI prints a per-target result summary so you can see what failed.
- The command fails only if **all** requested targets fail.

## Available skills

| Skill | Description |
|-------|-------------|
| `tailor-code-review` | Agnostic code review for the current git branch. Detects bugs, security vulnerabilities, and critical issues. |
| `tailor-mermaid-to-drawio` | Converts Mermaid architecture diagrams into polished Draw.io XML using Azure/AWS icon libraries and enterprise layout conventions. |
| `grill-me` | Structured interview mode that walks every branch of a technical decision tree until reaching shared understanding. |
