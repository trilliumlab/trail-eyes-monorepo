# Hazard Lifecycle & Tiered-Permission API — Design Proposal

**Status: proposal for Elliot + John to sign off before implementation.** It reconciles the
3-tier permission model with the current `reports` schema and existing endpoint conventions.
Some parts (notably a report-events table) partially reintroduce what the legacy server had and
what the recent hazard/reports table-merge removed — those are called out as **Open Decisions**.

Supersedes the single `PATCH .../status` setter on branch `claude/report-status-endpoint`: that
was a placeholder; the real workflow needs semantic actions, below.

---

## 1. Actors (tiers)

| Tier | Who | Identity |
|------|-----|----------|
| 1 | Any user | Anonymous, `creatorDeviceId` (no login) |
| 2 | Registered volunteer | Authenticated user, role `volunteer` |
| 3 | Admin | Authenticated user, role `admin` |

**Auth gap:** there is currently no role concept — `users` has no `role` column, better-auth has
no admin plugin, and the `authed` procedure in `orpc.ts` is commented out. Tiers require adding a
role (better-auth's admin/access-control plugin, or a `role` enum column `user|volunteer|admin`)
and enabling an authenticated + admin-gated oRPC procedure. Tier-1 actions stay on `pub`.

## 2. Hazard lifecycle (state machine)

```
        report (T1+)                confirm (T3)                 approve-clear (T3)
  · ─────────────────▶ [unconfirmed] ──────────▶ [confirmed] ───────────────────▶ [closed]
                            │  status=open          │ status=confirmed              status=closed
              reject (T3)   │                       │
                            ▼                        ├── present (T1+): log event, bump lastPresentAt (stays confirmed)
                        [closed]                     ├── clear   (T1+): log CLEAR REQUEST (stays confirmed, flagged pending) ──needs T3──▶ approve-clear
                       (rejected)                    ├── set in-progress (T3): status=inProgress
                                                     └── remove (T3): status=closed
```

Key point (answers the app question): **reporting "cleared" does NOT remove the hazard.** It
records a *pending clear request*; the hazard stays on the map (ideally shown as "clear reported —
pending review") until a **tier-3 admin approves**. Only tier-3 removal actually closes it.

Statuses reuse the existing enum (`open` = unconfirmed, `confirmed`, `inProgress`, `closed`).
"Pending clear" is **not** a status — it's the existence of an unapproved clear event on a
`confirmed` report (see §4).

## 3. Permission matrix

| Action | Allowed tier | State effect | Needs approval |
|--------|--------------|--------------|----------------|
| Report new hazard | 1+ | create, `open` | — |
| Report "still present" | 1+ | log `present` event, bump `lastPresentAt` (stays `confirmed`) | — |
| Report "cleared" | 1+ | log `clear` request (stays `confirmed`, pending) | **yes → T3** |
| Confirm | 3 | `open → confirmed` | — |
| Reject unconfirmed | 3 | `open → closed` (rejected) | — |
| Approve clear | 3 | `confirmed → closed` (removed) | — |
| Dismiss clear | 3 | clears the pending flag (stays `confirmed`) | — |
| Set in-progress | 3 | `confirmed → inProgress` | — |
| Remove hazard | 3 | `→ closed` | — |
| Triage ordering | 3 (view) | unconfirmed queue lists **tier-2 reports before tier-1** | — |

## 4. Data-model changes

1. **`users.role`** — `user | volunteer | admin` (or better-auth admin plugin).
2. **`report_events` table** (audit log — the mechanism for present/clear/approvals):
   `id`, `reportId` (fk), `eventLocalId` (uuid, for idempotent client submits),
   `type` (`present | clear | confirm | reject | approve_clear | dismiss_clear | status_change`),
   `createdByDeviceId`, `createdByUserId?`, `createdByTier` (snapshot), `note?`, `imageUuid?`,
   `createdAt`. The report's `status` remains the authoritative admin-approved state; events drive
   transitions, the pending-clear flag, and the triage/audit view.
3. (Optional, for cheap queries) cached fields on `reports`: `lastPresentAt`, `clearPendingAt`,
   `confirmedByUserId` — otherwise derive from events.

## 5. Proposed API (semantic actions)

Design choice: **one endpoint per matrix row**, not a generic status setter — so each is
authorized and audited cleanly. All under the existing `/reports/report/{localId}/…` convention;
each returns the updated report. Client-supplied `eventLocalId` (uuid) makes submits idempotent
for the app's offline queue.

**Public (tier 1+, `pub`; capture user if a session exists):**
| Method | Path | Body |
|--------|------|------|
| POST | `/reports/report/{localId}/present` | `{ eventLocalId, deviceId }` |
| POST | `/reports/report/{localId}/clear`   | `{ eventLocalId, deviceId, note?, imageUuid? }` |

**Admin (tier 3, authenticated + `admin`):**
| Method | Path | Body |
|--------|------|------|
| POST | `/reports/report/{localId}/confirm` | `{}` |
| POST | `/reports/report/{localId}/reject` | `{ reason? }` |
| POST | `/reports/report/{localId}/approve-clear` | `{}` |
| POST | `/reports/report/{localId}/dismiss-clear` | `{}` |
| POST | `/reports/report/{localId}/in-progress` | `{}` |
| DELETE | `/reports/report/{localId}` | — |

**Triage query (tier 3):** `GET /reports?status=open&order=reporterTier` → unconfirmed queue,
tier-2 reports first, each annotated with reporter tier and any pending-clear flag. (Could instead
extend `geojson.getReports`.)

## 6. App (client) behavior — what changes for Diya

- **"Report Cleared"** → `POST …/clear`. Hazard **stays** on the map, shown as pending review —
  it does **not** disappear (a change from the legacy app, which removed it optimistically). It
  goes away only after an admin approves and the map's geojson refreshes (note: geojson is
  memoized ~5 min refresh / 15 min expiry, so removal isn't instant).
- **"Still here / Present"** → `POST …/present`.
- The old `POST /hazard/update` (legacy `active` flag) is replaced by these two semantic actions.

## 7. Open decisions (need Elliot / John)

1. **`report_events` table vs. columns-on-`reports`.** Recommend the events table (audit trail +
   supports tier-ordered triage), but it partially reintroduces the legacy `hazard_updates` table
   the recent merge removed — Elliot's call.
2. **Rejected state:** distinct `rejected` status vs. `closed` + reason.
3. **Tier-2 accounts:** how are volunteers registered, and do they authenticate **in the app**
   (which is currently anonymous) or only in the panel? This determines whether the app needs login.
4. **Spam control** on the anonymous present/clear actions (rate-limit by device?).
5. **Reconcile** with Elliot's forthcoming direct-implementation instructions and the removal of
   the generated client (these will be hand-written calls).
