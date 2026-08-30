# Contributing to Agent Sena (एजेंट सेना)

Thanks for helping improve Agent Sena. Keep changes focused, modular, and testable.

## Run locally

See [README.md](README.md) for full details. Quick start from the repo root:

```bash
cp .env.example .env
# Set BETTER_AUTH_SECRET and ENCRYPTION_KEY to long random strings.
pnpm install
pnpm db:generate
pnpm db:migrate
pnpm dev
```

## Checks before you open a PR

| Command | When to run |
| --- | --- |
| `pnpm test` | Default. Units, properties, and in-process contracts. |
| `pnpm test:integration` | Postgres integration tests, authorization, and Graphile worker jobs. |
| `pnpm test:e2e` | Playwright browser automated acceptance tests. |
| `pnpm check` | TypeScript (`tsc`) across the monorepo packages. |
| `pnpm lint` | Biome lint and format validation. |

## Secrets and configuration

- **Never** commit `.env` files or secrets.
- **Never** paste API keys, tokens, or passwords in issues or PRs.
- Use placeholders in examples (`your-openrouter-key`, etc.).

## Adding New Agents to the Sena Catalog

To contribute a new agent to the Agent Sena Store:
1. Open `apps/web/src/lib/agent-catalog.ts`.
2. Define the new `AgentCatalogTemplate` with a clear role, category, customized system prompt instructions, and sample prompts.
3. Verify that the agent compiles and displays in the Agent Sena Catalog.

Agent Sena is licensed under the [Apache License 2.0](./LICENSE).
