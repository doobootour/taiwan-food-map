# Exact Google Maps link gate (public eats)

Chris requirement (2026-11-08): **future public listings must use a verified exact Google Maps business/branch URL**. Name-search URLs, coordinate-only URLs, missing links, and malformed non-Maps URLs must **not** become public.

## What the code checks (structural)

Shared helper: `scripts/lib/google-maps-url.js` (`mapsPublicationBlockReason` / `canPublishWithMapsLink`).

A link is structurally “exact enough to publish” only when `hasPlaceIdentity` is true:

- `https://maps.app.goo.gl/...` or `https://goo.gl/maps/...` shortlinks
- `/maps/place/...`
- `query_place_id=...`, `ftid=...`, or `cid=...`
- embedded place feature id `!1s0x...:0x...`

Blocked reasons (held pending, not discarded):

| reason | meaning |
| --- | --- |
| `missing_link` | empty / null link |
| `malformed_or_disallowed_url` | not HTTPS Google Maps allowlist |
| `coordinate_only` | `query=lat,lng` (or equivalent) with no place id |
| `generic_name_search` | name query without place identity |
| `unsupported_maps_url` | other Maps URL without place identity |

Pending rows use `hidden=true` and `hidden_reason=pending_exact_maps_link:<reason>`.

## What the code does **not** check (semantic)

**Structural URL shape ≠ real business/branch identity.** A valid shortlink or `/place/` URL can still point at the wrong shop or the wrong branch. Automated collection and human review must compare the resolved place name, address, and branch against the source context before clearing `hidden`. Do not treat a passing gate as proof of the correct venue.

## Enforcement layers

1. **Frontend registration** (`js/map.js`): new inserts without place identity are saved as hidden pending with reason; original pasted URL is preserved (never rewritten to a Korean name-search).
2. **Database trigger** `eats_enforce_exact_maps_for_public`: any INSERT/UPDATE that would leave `hidden=false` without place identity is coerced to hidden + pending reason. Also clears stale `pending_exact_maps_link:*` reasons when a row becomes public with an exact link.
3. **Bulk import / HOWTO** (`/workspace/taiwan/site-sync/HOWTO.md`): Monday sync must not insert public rows without an exact Maps URL; hold/SKIP with reason instead.
4. **Static generators**: anon SELECT already hides `hidden=true` rows, so pending venues are not baked into public detail pages.

## Gaps / not universal

- A raw SQL session as a superuser can disable the trigger.
- Edge function `admin-update-spot` is not in this repo; the DB trigger still gates public visibility after that write.
- Semantic place/branch verification remains a process/routine responsibility (parent Monday routine), not this structural gate.
