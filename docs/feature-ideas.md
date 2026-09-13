# Feature ideas — buildaping.com

Ranked, grouped by timing. Assumes `TOKEN_LIVE=false` (`launch.config.mjs`),
292 traits/8 categories (`public/traits-manifest.json`), Workers Free
(10ms CPU), and the render-once-and-store share pipeline
(`functions/api/share.ts`, `functions/p/[id].ts`, `functions/_lib.ts`).

Top 3 picks: **★**.

## Before launch

### ★1. Gallery of shared characters
Pitch: a public wall of everything shared via `/p/<id>`.
Why: the share pipeline already produces durable, content-addressed stored
cards (`kvCardStore` in `functions/_lib.ts`) at zero extra render cost — a
read-only feature over data that already exists, and the single best
pre-launch virality lever (visible proof of an active community pre-token).
Sketch: KV list index (append id+timestamp on `store.put` in
`functions/api/share.ts`); `GET /api/gallery?cursor=` Function; a
`src/pages/Gallery.tsx` grid of `/api/image/p/<id>.png` thumbnails linking to
`/p/<id>`.
Effort: M.
Risks: KV list reads count against free-tier quota — paginate, cache the list
response. Moderation risk if something bad gets shared before vetting catches
it — mitigate with a delay window before entries surface (see #6).

### ★2. "Remix this PING" CTA on shared-card landing
Pitch: `/p/<id>` already redirects a human into the builder with the
character preloaded, but silently — add a banner explaining what happened and
prompting a change.
Why: `traitsFromSearch` (`src/data/shareSelection.ts`) and the `/p/<id>`
redirect (`functions/p/[id].ts`) already reconstruct the full selection on
load; the remix loop is wired, it just dead-ends with no context.
Sketch: in `src/components/Builder.tsx`, flag when `selectedTraits` came from
a share link and show "You're remixing this PING — change something and
share your own" above `CharacterPreview`.
Effort: S.
Risks: none material.

### 3. Trait names printed on the OG banner image itself
Pitch: draw the top 1-3 trait names (`titleFromTraits` output) onto the
banner card, not just the page `<title>`.
Why: `titleFromTraits` (`functions/_lib.ts`) generates "PING with Cowboy Hat
and a Bazooka Aura" but only the OG `<title>` uses it — a saved/screenshotted
image loses that context.
Sketch: pass the title into `functions/api/image/custom.png.tsx`'s satori JSX
as a caption bar, banner variant only (800x420).
Effort: S.
Risks: adds a text layer to satori, the CPU-fragile path — but this fires
inside `/api/share`'s one-time render-on-click, not the public open API, so
the Workers Free CPU risk stays off the bot-scraped hot path.

### 4. Copy-link / native share fallback beyond Twitter
Pitch: add "Copy Link" and `navigator.share` next to the existing Tweet
button.
Why: `CharacterPreview.tsx` only wires a `twitter.com/intent/tweet` URL
(`hashtags` at `src/components/CharacterPreview.tsx:405`); Discord/Telegram,
where crypto communities actually organize pre-launch, get nothing.
Sketch: reuse `createShareUrl()`/`generateApiUrl()`'s result; add
`navigator.share` where available, `navigator.clipboard.writeText` fallback.
Effort: S.
Risks: none; the URL and card already exist.

### 5. Trait spotlight rotation on the homepage
Pitch: rotate 3-4 curated traits into `Home.tsx` hero art instead of one
static preview.
Why: 292 traits churn constantly (per HANDOFF's session history) but nothing
on the marketing pages reflects new drops.
Sketch: a small curated list (`src/data/spotlightTraits.ts`) of existing
trait ids, rendered via the compositor `CharacterPreview.tsx` already uses,
cycled on an interval in `src/pages/Home.tsx`.
Effort: S.
Risks: none; client-side compositing only, no server render.

### 6. Moderation queue for community trait submissions
Pitch: a form + manual review step before any submitted trait concept reaches
the live manifest.
Why: `ROADMAP_STEPS` (`src/utils/constants.ts`) already promises community
submissions in phase 3, and this project's own history shows hand-review
missing a hate-symbol asset twice (once behind a euphemistic name,
`fan-of-the-painter-tee`, per HANDOFF) — an open channel without a gate would
repeat that at higher volume.
Sketch: a form (Cloudflare Function POST to KV) collecting concept + image,
landing in pending storage for sign-off before `scripts/generate-index.mjs`
ever runs on it. No auto-publish path.
Effort: M.
Risks: moderation is the entire point — never skip the manual gate.

## Launch day

### 7. Countdown banner wired to the real Pons slot
Pitch: flip `showCountdown` and set `countdownTarget` in `launch.config.mjs`
ahead of the Pons listing.
Why: the fields already exist and are read everywhere (`SHOW_COUNTDOWN`,
`COUNTDOWN_TARGET` in `src/utils/constants.ts`) but sit at `false`/`0` — pure
config, no new code, and countdown urgency is high-leverage for launch.
Sketch: edit the two values; confirm whatever renders `SHOW_COUNTDOWN` is
actually mounted on the homepage.
Effort: S.
Risks: none — just don't get the timestamp wrong.

### 8. Launch-hour share push feeding the gallery
Pitch: a `TOKEN_LIVE`-gated banner encouraging holders to build and share a
character in the first hours of trading, seeding the gallery (#1) with fresh
content exactly when eyes are on the project.
Why: the stored-card pipeline is already launch-ready and cheap — one render
per distinct character, KV-backed.
Sketch: a banner in `Home.tsx`/`Builder.tsx` ("Share your PING today — first
50 get pinned to the gallery"); "pinned" is a boolean on the KV metadata
already stored per card.
Effort: S.
Risks: frame as cosmetic gallery-pinning only, never tied to token balance or
any financial incentive — avoid reading as an unregistered promotion.

### 9. Launch-config smoke test script
Pitch: a checklist script validating every `TOKEN_LIVE`-gated surface once
contract/chart values are filled in, before announcing launch.
Why: `BUY_LINK`, `EXPLORER_LINK`, `CHART_LINK` (`src/utils/constants.ts`) are
string-templated off `CONTRACT_ADDRESS` — a bad address would silently break
the buy link exactly when people try to buy.
Sketch: `scripts/check-launch-config.mjs`, mirroring the existing
`check-copy-count.mjs` pattern: validate `contractAddress` looks like `0x...`,
`chartLink`/`launchpad.url` are reachable HTTPS, `tokenLive` isn't true with
an empty address.
Effort: S.
Risks: none; validation only.

## After launch

### 10. "Build with our API" integration docs
Pitch: pitch the already-public image API to other Robinhood Chain projects,
matching the explicit roadmap phase 4 line in `constants.ts`.
Why: `src/pages/Docs.tsx` likely documents the API already; embed examples
cost near-zero engineering since the API is stable.
Sketch: an "Integrations" section in `Docs.tsx` with
`<img src="https://buildaping.com/api/image/random.png?...">` examples and
the trait-index schema. No backend change.
Effort: S.
Risks: heavier external embedding could reintroduce the empty-200 failure
(HANDOFF's documented root cause) on the *live* render endpoints
(`custom.png.tsx`, `random.png.tsx`, `shirt.png.tsx`) — none of which are
render-once-and-store like `/p/<id>`. Point embed guidance at the cached
`/p/<id>` path instead of the raw render endpoints.

### 11. Leaderboard: most-remixed character
Pitch: rank shared characters by how often their selection seeded another
share.
Why: builds on the content-addressed share IDs already in KV (`shareId` in
`functions/_lib.ts`) — a natural virality signal once the gallery (#1)
exists, and only counts, never composites.
Sketch: track a `remixOf` field when `/api/share` is called from a URL
already carrying a share id; increment a counter doc in KV keyed by parent
id.
Effort: M.
Risks: needs the gallery (#1) shipped first, otherwise nowhere to surface it.

### 12. Trait vetting status dashboard
Pitch: a generated view over `public/traits-manifest.json` cross-referenced
with `docs/trait-verdicts.md`, replacing the current markdown-only tracking.
Why: vetting state is hand-tracked across scattered files
(`trait-verdicts.md`, `.trait-work/vet/*.md`) across multiple agent passes —
a generated report stops that drift.
Sketch: `scripts/vetting-report.mjs` joining the manifest against
`trait-verdicts.md`'s categorized lists, flagging anything unlisted
(implicitly GOOD per the standing rule) vs. explicitly called out.
Effort: S.
Risks: none; internal tooling only.

### 13. Seasonal/limited-time aura drops
Pitch: time-boxed aura releases (e.g. a two-week holiday aura) to give
recurring reasons to return to the builder.
Why: aura is already the most actively developed category (31 shipped, whole
HANDOFF sessions on Gemini-generated auras) and is pure client-side
compositing — no server risk.
Sketch: an optional `availableUntil` field on manifest entries
(`scripts/generate-index.mjs`), filtered in `src/data/traits.ts` at load;
already-shared `/p/<id>` cards are pre-rendered PNGs (`functions/p/[id].ts`
serves stored bytes) so expiry never breaks old shares.
Effort: M.
Risks: small manifest schema addition; confirmed the stored-card path is
unaffected by expiry.

### 14. Discord/Telegram bot for on-demand cards
Pitch: a slash command calling `/api/share` and posting the result into the
community's own chat.
Why: the image API and share pipeline are already public and stable; a bot is
a thin client on infrastructure that already exists, meeting holders where
they already are (Telegram link already in `launch.config.mjs`).
Sketch: a standalone bot service (outside this repo) calling `POST
/api/share` and posting the returned `url`.
Effort: M (mostly outside this repo).
Risks: rate-limit from the bot side to avoid hammering `/api/share`'s render
path.

### 15. Resolve the trademark-flagged traits
Pitch: finally rule on the ~21 trademark-referencing traits and the Hello
Kitty family regeneration the owner already approved conceptually.
Why: HANDOFF flags Sanrio, Touhou, Halo, Naruto, Dragon Ball, Marvel,
PlayStation/Xbox, and a deceased musician's likeness as unresolved
legal-exposure, "the project owner's call, not a style question" — this is
overdue as the project moves toward real trading volume and more visibility.
Sketch: no new code — a content/legal ruling per item, then run the existing
regeneration pipeline (`docs/trait-generation-prompt.md`,
`scripts/generate-index.mjs`) per `trait-verdicts.md`'s FIX/REMOVE lists.
Effort: L (review volume, not engineering complexity).
Risks: legal/trademark exposure is the whole point of this item — the largest
outstanding launch-readiness gap that isn't a code problem.

---

## Bugs / rough edges noticed while reading

1. `src/utils/constants.ts` derives `TRAIT_COUNT` from the manifest (292:
   face 33, body 42, right_hand 51, left_hand 39, aura 31, head 43,
   accessory 37, mouth 16), but `docs/HANDOFF.md`'s prose count (298/299 in
   its latest sessions) is stale relative to the manifest — not a code bug
   since the manifest is the actual source of truth, but worth a note so
   nobody re-derives the wrong number by hand.
2. `docs/HANDOFF.md` ("Still open", sixth session) flags
   `CharacterPreview.tsx:410` as still tagging `PING,Solana,Crypto`; the
   actual file (`src/components/CharacterPreview.tsx:405`) already reads
   `"PING,RobinhoodChain,Crypto"`. Appears already fixed — HANDOFF's note is
   stale and should be removed.
3. Root `check_gap.mjs` — flagged in HANDOFF as an unclaimed stray scratch
   file from an earlier session — is still present at the repo root (not
   inside gitignored `.trait-work/`). Needs a one-line decision: delete or
   relocate.
4. `functions/api/share.ts`'s two-attempt render retry silently swallows
   failure and returns a generic 502 with no detail beyond `'Card render
   failed'` — no logging to distinguish "isolate CPU exhausted" (the
   documented empty-body failure mode) from any other cause if it recurs
   under launch-day load.
5. `docs/trait-verdicts.md` lists 92 "FIX - live library" traits that are
   known-defective but currently shipping — e.g. 10 face traits where "the
   eyewear does not show the eyes behind it" — a real, currently-visible
   quality gap a first-time builder visitor will notice immediately.
