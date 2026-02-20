# tailor-skills

Claude Code skills shared across TailorHub projects.

## Install a skill

```sh
npx @tailorhub/skills@latest add https://github.com/TailorHub-Mad/ai-skills/tailor-code-review
```

Then restart Claude Code.

## Update all skills

```sh
npx @tailorhub/skills@latest update
```

Re-downloads every installed skill from its source. Run this whenever new skill versions are shipped.

## Update a specific skill

```sh
npx @tailorhub/skills@latest update tailor-code-review
```

## Available skills

| Skill | Description |
|-------|-------------|
| `tailor-code-review` | Agnostic code review for the current git branch. Detects bugs, security vulnerabilities, and critical issues. |
