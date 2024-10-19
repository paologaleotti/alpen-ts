# alpen

codename "alpen": prototype for a modern TS backend stack based on [Hono](https://hono.dev/) and [zod](https://zod.dev/)

The main goal is to provide a all-in-one and batteries included solution,
from developer experience to API testing and cloud deployment.

When a user clones the repo he should be able to build, develop and test APIs with zero friciton and with no external dependencies.

Features:

-   Modern typescript stack (zod, ts-pattern, hono)
-   Runtime agnostic (works on node, deno, workers, lambda, bun, vercel)
-   Fast dev iteration using hot reload
-   All in one repo: dev tools, api testing, infra and deploy
-   Low barrier to entry
-   Opt-in openapi to code generation, not a requirement
-   Modular monolith structure + monorepo
-   No implicit behavior, no dependency injection
-   Safe error handling between services and API
-   Single abstraction layer between API and business logic

todo:

-   improve error handling ?
-   infra
-   parse response
-   oapi first? oapi to zod generation?

## Try it

Requirements:

-   **pnpm** (you can use node's build in `corepack` to manage pnpm versions)
-   **Node** >= 20

```bash
pnpm i
pnpm dev:api # start in hot-reload mode
```

To test with a local Postgres database:

-   **goose** (migration tool)
-   **Docker**

```bash
pnpm infra:up
pnpm migrate:up
```
