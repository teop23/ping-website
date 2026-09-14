# PING card storage

Self-hosted storage for PING share cards, run on the owner's own machine and
reached by Cloudflare Pages Functions through a Cloudflare Tunnel.

## Why this exists

`POST /api/share` renders a card once and stores it so a bot's scrape is a
read, not a render. That used to mean two Workers KV writes per newly shared
character. KV's free tier caps writes at 1,000/day; this moves the writes off
KV entirely onto storage the owner already has, keeping KV as a working
fallback (see `functions/_lib.ts`, `selectCardStore`).

## What's here

- `server.js` - the storage API. Zero runtime dependencies: just Node's
  `http`, `fs`, `crypto`. Persists card PNGs + metadata and the gallery index
  under `DATA_DIR` (`/data` in the container, backed by the `ping-cards-data`
  Docker volume).
- `server.test.js` - `node --test` covering auth, id validation, size caps,
  and the PUT/GET/HEAD round trip.
- `Dockerfile`, `docker-compose.yml` - the service plus `cloudflared` as a
  second container in the same compose file.
- `.env.example` - copy to `.env` (gitignored) and fill in.

## Endpoints

All routes but `/healthz` require `Authorization: Bearer <AUTH_TOKEN>`,
compared in constant time.

| Method | Path          | Purpose                                    |
| ------ | ------------- | ------------------------------------------- |
| GET    | `/healthz`    | Docker healthcheck, no auth                 |
| PUT    | `/cards/:id`  | Store a card. Body: raw PNG bytes, `Content-Type: image/png`. Optional `X-Ping-Traits` header (URL-encoded canonical trait string). |
| GET    | `/cards/:id`  | Fetch a card. 404 if absent.                |
| HEAD   | `/cards/:id`  | Existence check, no body.                   |
| GET    | `/gallery`    | The gallery document (JSON array), `[]` if none yet. |
| PUT    | `/gallery`    | Replace the gallery document. Body: JSON array. |

`:id` must match `^[0-9a-z]{1,32}$` (the shape `shareId()` produces) - nothing
resembling a path segment reaches `fs.*`. Cards are capped at 2 MB
(`MAX_CARD_BYTES`); real cards run 55-135 KB.

## Owner setup

These steps happen on your own machine and in your own Cloudflare dashboard.
Nothing here was done for you - the agent that built this does not have
Cloudflare account access.

1. **Install Docker Desktop** if you don't have it: https://www.docker.com/products/docker-desktop/

2. **Create the tunnel token** in the Cloudflare Zero Trust dashboard:
   - Go to **Networks > Tunnels > Create a tunnel**.
   - Choose **Cloudflare Connector (cloudflared)**, name it (e.g. `ping-cards`).
   - Pick the **Docker** install method. Cloudflare shows a command like
     `docker run cloudflare/cloudflared:latest tunnel run --token eyJ...` -
     copy just the token (the `eyJ...` part) for `.env` below. Don't run that
     command directly; `docker-compose.yml` here already runs cloudflared
     with that token from the environment.
   - Under **Public Hostname**, add one, e.g. `cards.yourdomain.com`, with
     **Service** set to `HTTP` and URL `storage:8787` (the compose service
     name and port - not `localhost`, since cloudflared reaches it over the
     Docker network).

3. **Create `.env`** in this folder from `.env.example`:
   ```
   AUTH_TOKEN=<a long random string, e.g. from `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`>
   TUNNEL_TOKEN=<the token from step 2>
   ```

4. **Start it**:
   ```
   docker compose up -d
   docker compose logs -f
   ```
   Confirm `storage` reports listening and `cloudflared` reports the tunnel
   is connected.

5. **Set the Pages secrets** (in the Cloudflare Pages dashboard for this
   project, or via `wrangler pages secret put`, run from the app root, not
   here):
   ```
   wrangler pages secret put CARD_STORE_URL
   # value: https://cards.yourdomain.com  (the public hostname from step 2)
   wrangler pages secret put CARD_STORE_TOKEN
   # value: the same AUTH_TOKEN from step 3
   ```
   Set both for the `production` environment; add them for `preview` too if
   you want preview deploys to use the same box rather than falling back to
   KV. Until these are set, `selectCardStore` keeps using KV - nothing
   breaks in the meantime.

6. **Smoke test** (replace host and token):
   ```
   curl -i https://cards.yourdomain.com/healthz

   curl -i -X PUT https://cards.yourdomain.com/cards/testtesttest \
     -H "Authorization: Bearer $AUTH_TOKEN" \
     -H "Content-Type: image/png" \
     --data-binary @some-local-image.png

   curl -i https://cards.yourdomain.com/cards/testtesttest \
     -H "Authorization: Bearer $AUTH_TOKEN" \
     -o /tmp/roundtrip.png
   ```
   Expect `200` on all three and a byte-identical PNG back.

7. **Back up the volume** occasionally - it's the only copy of every shared
   card and the gallery index:
   ```
   docker run --rm -v ping-cards-data:/data -v %cd%:/backup alpine \
     tar czf /backup/ping-cards-backup-%date%.tar.gz -C /data .
   ```
   (PowerShell: replace `%cd%`/`%date%` with `${PWD}`/a literal date string.)

8. **Restart on boot**: `restart: unless-stopped` in `docker-compose.yml`
   already brings both containers back up whenever Docker Desktop starts, as
   long as Docker Desktop itself is set to launch at login (Docker Desktop
   settings > General > "Start Docker Desktop when you sign in").

## Local development (no Docker)

```
cd storage
AUTH_TOKEN=dev-token node server.js
```

Runs on `:8787` against `./data`. Useful for testing `functions/_lib.ts`'s
HTTP store against a real server before touching the tunnel.

## Tests

```
cd storage
npm test
```

Uses Node's built-in test runner (`node --test`) against a temp data
directory - no dependencies to install.
