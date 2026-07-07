# Trail Eyes — Deployment & Ops Runbook

How the Trail Eyes backend + panel are hosted, deployed, and maintained. This covers the
**operations** layer; for local development and env-var reference see the [README](README.md).

> **Status: skeleton.** Lines marked **`TODO(Elliot)`** are things only the original developer
> knows — fill these in during the Friday handoff call. Everything else is derived from the code.

---

## The big picture

- **Host:** an **Oracle Cloud** Ubuntu VM.
- **Orchestration:** [**Coolify**](https://coolify.io) (a self-hosted deploy platform) runs on that
  VM and manages the app + database containers. Web UI: `https://coolify.traileyes.net`.
- **What's deployed:**
  - `api.nightly.traileyes.net` — the backend (`@repo/backend`)
  - `panel.nightly.traileyes.net` — the admin panel (`@repo/panel`)
  - `legacy.traileyes.net` — the old Deno server (currently offline; can be restarted)
- **Auto-deploy:** pushing to the monorepo **`dev`** branch triggers a redeploy of the nightly
  services via Coolify. `TODO(Elliot)`: confirm this is a Coolify GitHub webhook / auto-deploy
  setting, and exactly which services are wired to it.

## Access (get these during handoff)

- [ ] Coolify admin login — `TODO(Elliot)`: create an account for Dr. Lipor.
- [ ] SSH to the VM — key-based only. Add your public key via Coolify's in-browser root shell.
      `TODO(Elliot)`: confirm the VM host/IP and SSH user.
- [ ] Oracle Cloud console access (Dr. Lipor already has tenancy access).
- [ ] Domain registrar for `traileyes.net` — `TODO(Elliot)`: which registrar, so DNS can be managed.

## Environments

| Env | Backend URL | Notes |
|-----|-------------|-------|
| nightly | `api.nightly.traileyes.net` | Auto-deploys from `dev`. Current working environment. |
| production | `TODO(Elliot)` | Is there a separate prod, or is nightly it for now? |
| legacy | `legacy.traileyes.net` | Old Deno server; offline; restart only if needed. |

Env vars per environment live in `.env`-style files (the README notes `.env.nightly` for the
nightly environment). In Coolify these are set as the service's **Environment Variables**.
`TODO(Elliot)`: confirm where the canonical env values live (Coolify UI vs a file on the VM).

## Deploying a change

1. Merge to `dev` → Coolify auto-deploys nightly. `TODO(Elliot)`: confirm + note typical deploy time.
2. Manual redeploy: in Coolify, open the service → **Redeploy**. `TODO(Elliot)`: confirm exact steps.

### Rolling back
`TODO(Elliot)`: how to roll back a bad deploy — redeploy a previous commit/image in Coolify?
Note the exact procedure and how to pick the previous good version.

## Database (Postgres + PostGIS)

- Managed by `TODO(Elliot)`: is Postgres a Coolify-managed database, a container, or external?
- **Credentials:** `TODO(Elliot)` (also captured in the handoff access list).
- **Migrations:** applied with `bun --env-file=.env run db:migrate` (see README). `TODO(Elliot)`:
  are migrations run automatically on deploy, or manually? If manual, when/how against nightly?
- **Seeding trail routes:** `bun --env-file=.env run db:import-routes` (loads `data/routes`).
- **Backups:** `TODO(Elliot)` — is anything backing up the database? If not, this is a gap to fix
  before real testers (see below).

## Uploaded images (persistent storage)

- The backend writes uploaded report photos to `${STORAGE_DIRECTORY}/images` on disk
  (`apps/backend/src/routes/reports.ts`). Old/orphaned images are cleaned on an interval.
- **This must be a persistent Coolify volume** — if it's ephemeral container storage, photos are
  lost on every redeploy.
- `TODO(Elliot)`: confirm the volume mount and where `STORAGE_DIRECTORY` points on the VM, and
  whether images are backed up.

## Disk space (known gotcha)

Elliot flagged that the VM can run out of disk and need manual intervention.
- `TODO(Elliot)`: what fills up — Postgres, images, Docker build cache/images, logs?
- `TODO(Elliot)`: how to check (`df -h`) and safely reclaim space (e.g. `docker system prune`),
  and whether any alerting exists.

## Logs & monitoring

- Container logs are viewable per-service in the Coolify UI. `TODO(Elliot)`: any external
  monitoring/uptime/error alerting (PostHog is wired for product analytics, not ops)?

## Disaster recovery (if the VM is lost)

Rough sequence to stand the stack back up (fill in from the above once confirmed):
1. Provision a VM, install Coolify, restore access.
2. Recreate the Postgres database (+ PostGIS); restore from backup or start fresh.
3. Deploy `@repo/backend` and `@repo/panel` from the `dev` branch via Coolify.
4. Set environment variables; attach the persistent images volume.
5. Run `db:migrate`, then `db:import-routes` to seed trail data.
6. Point DNS (`api.nightly` / `panel.nightly`) at the new host.

---

### Pre-tester checklist (ops)
- [ ] Database backups exist and are tested
- [ ] Images volume is persistent and backed up
- [ ] Disk-space monitoring / cleanup in place
- [ ] Dr. Lipor has independent Coolify + VM access
- [ ] A decision on nightly-vs-prod for real testers
