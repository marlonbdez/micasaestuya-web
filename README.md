# mi casa es tuya

Frontend of **micasaestuya**, a free platform that connects hosts offering
accommodation and meals with travellers who help out a few hours a day in
exchange. Built with [Nuxt 3](https://nuxt.com/).

The project's source of truth (product vision, architecture, decisions and
current status) is the
[`micasaestuya-docs`](https://github.com/marlonbdez/micasaestuya-docs) repo.
Coding conventions for this repo are in `CLAUDE.md` and `docs/`.

## Install

Install dependencies

```bash
npm install
```

Install dependencies at CI

```bash
npm ci
```

## Environment file

Create a copy of `.env.example`, rename it to `.env`, and update the API endpoint:

```bash
cp .env.example .env
```

For local development, set:

```bash
NUXT_PUBLIC_API_BASE=http://localhost:3001/api
```

> **Note:** `NUXT_PUBLIC_API_BASE` must be a `localhost` URL. This is a Client-Side Rendered (CSR) app — all API calls are made from the browser, not from the server, so Docker internal hostnames like `express` won't resolve.

## Development

Start the development server on http://localhost:3000

```bash
npm run dev
```

## Dev Container

> Requires the repos (`micasaestuya-api`, `micasaestuya-web`, `micasaestuya-infra`, and `micasaestuya-docs` for the documentation) cloned as siblings in the same parent directory. See the [infra README](../micasaestuya-infra/README.md) for the required folder layout.

1. Open the `micasaestuya-web/` folder in VS Code.
2. When prompted, click **Reopen in Container** (or run `Dev Containers: Reopen in Container` from the command palette).
3. VS Code will start the full Docker Compose stack (including the backend, MongoDB, and Redis) and attach to the `nuxt` container.
4. `NUXT_PUBLIC_API_BASE` is automatically set to `http://localhost:3001/api` by the Docker Compose configuration — no `.env` file needed when using Dev Containers.

## Tests

Run unit tests watching for changes

```bash
npm run test:unit
```

Run unit tests for continuous integration

```bash
npm run test:unit:headless
```

Run unit tests with coverage

```bash
npm run test:unit:coverage
```

Run e2e tests

```bash
npm run test:e2e
```

Run e2e tests headless, the way CI does it: serve the static build and run Cypress against it (`npm run test:e2e:headless` uses `nuxt start`, which does not work with the static preset — see `docs/tooling.md` § 2)

```bash
npm run generate
npx serve -s .output/public -l 3000 &
npm run test:e2e:run
```

## Production

### Node.js server

> **Note:** `nuxt.config.ts` currently sets `nitro.preset` to `"static"`,
> which does not emit `.output/server` — so this path does not work as
> described below until that preset is changed or overridden. In practice
> this project is deployed as a static site (see "Static hosting"), which is
> also what `Dockerfile.prod` and Netlify actually build. See
> `docs/tooling.md` § 2 for how this was found.

Build the application for production on a Node.js server

```bash
npm run build
```

The result will be an entry point that can be initiated on a node server.

```bash
node .output/server/index.mjs
```

### Static hosting

Build the application for production on any static hosting service with static site generation.

```bash
npm run generate
```

Locally preview production build:

```bash
npm run preview
```

Checkout the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
