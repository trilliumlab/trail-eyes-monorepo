<!-- Title + Logo -->
<br />
<div align="center">

  # Trail Eyes Monorepo

  <img src="assets/icon.png" alt="Logo" width="80" height="80">

  The backend and admin panel for Trail Eyes, a hazard-tracking app for Forest Park, Portland.

  Development sponsored by Portland State University and NSF award CIF-2046175.


  [![Last Commit][last-commit-shield]][last-commit-url]
  [![Biome][biome-shield]][biome-url]
  [![Bun][bun-shield]][bun-url]
</div>

## About

This monorepo contains the server and webapp side of Trail Eyes. Hikers submit geolocated trail-hazard
reports (fallen trees, erosion, damaged signs, etc.) with photos from the
[mobile app][app-repo-url]; volunteers triage them in a web admin panel with an interactive map.

It contains two apps — a **backend** API server and an **admin panel** — plus a set of shared
packages. It is implemented as a [Bun][bun-url] + [Turborepo][turbo-url] workspace written
in React + TypeScript.

### Structure

**Apps**

| Package          | Description                                                                             |
| ---------------- | --------------------------------------------------------------------------------------- |
| `@repo/backend`  | [Hono][hono-url] + [oRPC][orpc-url] API server (REST + RPC + auth).         |
| `@repo/panel`    | Admin panel — [TanStack Start][tanstack-url] (SSR) + [MapLibre][maplibre-url] map.       |
| `@repo/scripts`  | One-off CLI scripts (route import, sprite building, test emails).                       |

**Packages**

| Package                          | Description                                                                    |
| -------------------------------- | ------------------------------------------------------------------------------ |
| `@repo/contract`                 | oRPC + Zod API contract — the single source of truth shared by server & client. |
| `@repo/database`                 | [Drizzle ORM][drizzle-url] over Postgres/[PostGIS][postgis-url], plus better-auth. |
| `@repo/env`                      | Typed and validated environment-variable access.                                  |
| `@repo/email`                    | Transactional email templates ([React Email][react-email-url] + nodemailer).   |
| `@repo/ui`                       | Shared React component library (shadcn/ui).                             |
| `@repo/util` / `@repo/zod-utils` | Shared helpers and Zod utilities.                                             |
| `@repo/typescript-config`        | Shared `tsconfig` presets.                                                      |

## How to Build

### Required

- [Bun][bun-dep-url] >= `1.1.22` — the runtime and package manager for this repo.
- [PostgreSQL][postgres-dep-url] with the [PostGIS][postgis-url] extension — trail routes and
  reports are stored as geospatial data.

> [!NOTE]
> An SMTP server is needed for transactional email (e.g. auth), and a
> [PostHog][posthog-url] project is used for analytics. Both are optional for basic local work but
> their environment variables must still be present.

### Installation

1. Clone this project:
   ```bash
   git clone https://github.com/trilliumlab/trail-eyes-monorepo.git
   cd trail-eyes-monorepo
   ```

2. Most work happens on the `dev` branch. To switch to it:
   ```bash
   git checkout dev
   ```

3. Install dependencies:
   ```bash
   bun install
   ```

4. Create a `.env` file in the repo root. Copy the example and fill in your values:
   ```bash
   cp .env.example .env
   ```

> [!IMPORTANT]
> Environment variables are **not** loaded automatically. Any command that touches the database,
> auth, email, or public config must be run with `--env-file=.env` (see below), or startup will fail
> when the required variables can't be found.

### Environment Variables

All environment variables live in the root `.env` file and are **shared across the workspace**.
Variables prefixed with `VITE_` are **public** (exposed to the browser); everything else is
**server-only**. See [`.env.example`](.env.example) for the full list.

| Variable                                        | Description                                          |
| ----------------------------------------------- | ---------------------------------------------------- |
| `VITE_APP_NAME`                                 | Display name of the app.                             |
| `VITE_BACKEND_URL` / `VITE_PANEL_URL`           | Base URLs for the backend (`:8000`) and panel (`:3000`). |
| `VITE_POSTHOG_HOST` / `VITE_POSTHOG_KEY`        | PostHog analytics config.                            |
| `VITE_LOG_LEVEL` / `VITE_LOG_FORMAT`            | Logging verbosity and format (`json` \| `pretty`).  |
| `BETTER_AUTH_SECRET`                            | Secret seed for better-auth.                         |
| `STORAGE_DIRECTORY`                             | Directory where uploaded report images are stored.  |
| `DB_HOST` / `DB_PORT` / `DB_NAME` / `DB_USER` / `DB_PASSWORD` / `DB_SSL` | Postgres connection.        |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` / `SMTP_SENDER` / `SMTP_SENDER_NAME` | Email server config. |

> [!NOTE]
> When adding a new variable, add it to the schema in [`packages/env`](packages/env/src/index.ts)
> **and** to the `globalEnv` list in [`turbo.json`](turbo.json), or Turborepo won't pass it through.

### Database Setup

Ensure your Postgres database exists and has PostGIS enabled, then apply migrations:

```bash
bun --env-file=.env run db:migrate       # apply migrations
bun --env-file=.env run db:import-routes  # (optional) seed trail routes from data/routes
```

### Running

Start every app in watch mode with Turborepo:

```bash
bun --env-file=.env run dev
```

This launches the backend on [http://localhost:8000](http://localhost:8000) (with API docs at
`/`) and the admin panel on [http://localhost:3000](http://localhost:3000).

To run a single app, use a Turborepo filter:

```bash
bun --env-file=.env run dev --filter=@repo/panel
```

### Building

Build all apps and packages:

```bash
bun --env-file=.env run build
```

Run the production builds:

```bash
bun --env-file=.env run start
```

## Commands

> [!IMPORTANT]
> Prefix any command that reads env (`dev`, `build`, `start`, all `db:*`, `build-sprites`) with
> `--env-file=.env`. Multiple `.env` files can be used for different environments (such as `.env.nightly` for the nightly
> environment).

| Command                    | Description                                                    |
| -------------------------- | ------------------------------------------------------------- |
| `bun install`              | Install dependencies.                                         |
| `bun run dev`              | Run all apps in watch mode.                                   |
| `bun run build`            | Build all apps and packages.                                  |
| `bun run start`            | Run the production builds.                                    |
| `bun run check`            | Lint **and** format check with [Biome][biome-url] (CI gate).  |
| `bun run check:fix`        | Auto-fix lint and formatting issues.                          |
| `bun run db:generate`      | Generate Drizzle migrations from the schema.                  |
| `bun run db:migrate`       | Apply pending migrations.                                     |
| `bun run db:studio`        | Open Drizzle Studio.                                          |
| `bun run db:import-routes` | Seed trail routes from `data/routes` into the database.       |
| `bun run build-sprites`    | Build map sprite sheets from `data/sprites`.                  |

> [!NOTE]
> To run a single app's tests, use Bun directly from that app's directory, e.g.
> `cd apps/backend && bun test test/routes/geojson/plugin.test.ts`.

## Project Structure

```ini
trail-eyes-monorepo
├── apps
│   ├── backend  # Hono + oRPC API server (REST, RPC, better-auth)
│   ├── panel    # TanStack Start admin panel with a MapLibre map
│   └── scripts  # CLI scripts (route import, sprite building, test email)
├── packages
│   ├── contract        # oRPC + Zod API contract (shared by server & client)
│   ├── database        # Drizzle ORM + PostGIS schema, models, queries, auth
│   ├── email           # React Email templates + nodemailer
│   ├── env             # Typed environment-variable access
│   ├── ui              # Shared React component library (Radix + Tailwind)
│   ├── util            # Shared utilities
│   ├── zod-utils       # Shared Zod helpers
│   └── typescript-config # Shared tsconfig presets
├── data
│   ├── routes   # Trail route GeoJSON + start markers
│   ├── sprites  # Map icon sprite sources (and generated output)
│   └── styles   # MapLibre style definitions
└── turbo.json   # Turborepo pipeline configuration
```

### Integration

The API is **contract-first**. [`@repo/contract`](packages/contract) defines every endpoint's
shape with Zod. The backend implements those handlers against the contract, and the panel's
client is fully typed from the same contract — so a change to an endpoint surfaces as a type error
on both sides. The backend exposes this router three ways: an OpenAPI REST surface (used by the
mobile app), an RPC surface under `/rpc` (used by the panel), and better-auth under `/auth`.

## Contributing

Contributions are welcomed! If you have any suggestions, feel free to open a pull request.

1. Fork the project.
2. Create a new branch `git checkout -b feature/new-feature-name`
3. Commit your changes `git commit -m 'Added new feature'`
4. Push your changes `git push`
5. Open a [pull request][pr-url].

Not up for a pull request? Feel free to open an [issue][issues-url].

Run `bun run check` before opening a PR.

## License

Trail Eyes is provided under the MIT license.

<!-- Repository Links -->
[app-repo-url]: https://github.com/trilliumlab/forest-park-reports-app
[pr-url]: https://github.com/trilliumlab/trail-eyes-monorepo/pulls
[issues-url]: https://github.com/trilliumlab/trail-eyes-monorepo/issues

<!-- Status Links -->
[last-commit-url]: https://github.com/trilliumlab/trail-eyes-monorepo/commits/dev/
[last-commit-shield]: https://img.shields.io/github/last-commit/trilliumlab/trail-eyes-monorepo/dev?style=for-the-badge
[biome-shield]: https://img.shields.io/badge/Biome-60A5FA?style=for-the-badge&logo=biome&logoColor=white
[bun-shield]: https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white

<!-- Dependency & Tooling Links -->
[bun-url]: https://bun.sh/
[bun-dep-url]: https://bun.sh/
[turbo-url]: https://turborepo.com/
[postgres-dep-url]: https://www.postgresql.org/
[postgis-url]: https://postgis.net/
[biome-url]: https://biomejs.dev/
[hono-url]: https://hono.dev/
[orpc-url]: https://orpc.unnoq.com/
[tanstack-url]: https://tanstack.com/start
[maplibre-url]: https://maplibre.org/
[drizzle-url]: https://orm.drizzle.team/
[react-email-url]: https://react.email/
[posthog-url]: https://posthog.com/
