# Sharing PING characters: is there a cleaner path than the OG workaround?

Research task, 2026-09-12. Scope: buildaping.com / `relaunch/robinhood-chain`.

## Recommendation (read this, skip the rest if short on time)

1. **Ship now, near-zero effort:** on the "Tweet" button, reuse the client-side
   canvas render that `handleCopy` already builds (`src/components/CharacterPreview.tsx:258-335`)
   to copy the PNG to the clipboard via `navigator.clipboard.write`, *then* open
   the X intent with text only (drop the fake `image` param — it has never done
   anything, see below). The user lands in the compose box with the image one
   Ctrl+V away. This is not "direct attach," it's "attach in one paste," but it
   is real, it works today in this codebase, and it costs an afternoon.
2. **Do next, if the free-tier failures keep happening:** stop rendering the
   share card per request. Persist the already-composited PNG to R2 at
   creation time behind a short id, keep KV for the id-to-trait-selection
   record, and serve `/api/og/p/<id>` as a static image fetch instead of a
   satori render. This is the "small database" direction, scoped narrowly (a
   cache in front of the renderer, not a general app database), and it
   directly removes the root cause of both documented production failures
   (the CPU-budget empty body and the edge-cached zero-length PNG) because
   there is no longer a render to time out on the request path.
3. **Skip: posting on the user's behalf via the X API.** As of 2026 there is
   no free tier — it's pay-per-post ($0.015-$0.20/post) with OAuth consent
   friction on top, for a worse UX than a composer the user already trusts.
4. **Treat `navigator.share({ files })` as a mobile-only enhancement, not the
   primary path.** Wire it in behind `canShare()` feature detection for
   visitors on the builder itself; it cannot replace the OG card because it
   requires a live user gesture in the browser tab that rendered the image —
   it has nothing to offer someone who only has a link.
5. **The OG card stays.** It's the only mechanism that works for a link
   shared or re-shared by anyone who isn't the original builder session, and
   it's what makes a pasted/retweeted link unfurl at all. Hardening it (item 2,
   plus confirming the Cache Rule below actually exists) is the honest
   long-term fix, not replacing it.

## Comparison table

| Option | Attaches image directly? | Effort | Ongoing cost | Platform risk | Fixes today's failures? |
|---|---|---|---|---|---|
| **Current: OG tag + per-request satori render** | No — link unfurl only | — (shipped) | Free (Workers Free) | Low, but the render can time out | No — this *is* the failure |
| **Clipboard-then-paste into X intent** (recommendation 1) | Requires one manual paste, but the pasted image is a real media attachment | Small (reuses existing code) | Free | `navigator.clipboard.write` needs a user gesture and HTTPS; no iOS Safari image-to-clipboard guarantee (unverified, see below) | Doesn't touch the render path; a separate improvement |
| **Pre-render to R2 + KV/D1 short id** (recommendation 2) | No (still an OG unfurl) but the unfurl becomes reliable | Medium (new endpoint, id scheme, migration for old links) | Cheap — R2 free tier covers low tens of thousands of images/month | Low | Yes — removes the render from the request path entirely |
| **X API v2 media upload, post on user's behalf** | Yes, a real attachment, no unfurl needed | Large (OAuth app review, token storage, consent UI) | $0.015-$0.20 per post, no free tier (docs.x.com, 2026) | High — money per share, OAuth consent, X can change pricing/policy again | No — orthogonal to the render problem |
| **`navigator.share({ files })`** | Yes, when the OS/app honors a file share target | Small-medium (feature detection, fallback) | Free | Medium — Firefox desktop lacks `navigator.share` entirely; iOS/Android app behavior differs (see unverified section) | No — mobile-only enhancement, no benefit to link recipients |
| **Farcaster / crypto-native surfaces** | N/A for X specifically | N/A | N/A | Low relevance — the token's audience is on X | Not applicable to the stated goal |

## What the codebase actually does today

**Share URL construction** — `generateApiUrl()` in
`src/components/CharacterPreview.tsx:344-357` builds
`${origin}/api/og?<category>=<trait-id>...` from the in-memory trait
selection. This is the query-param encoding the owner is asking about
replacing.

**The Tweet button** — `handleShareOnX()`,
`src/components/CharacterPreview.tsx:359-387`:
```
367: const twitterUrl = new URL('https://twitter.com/intent/tweet');
368: twitterUrl.searchParams.set('text', tweetText);
369: twitterUrl.searchParams.set('hashtags', hashtags);
370: twitterUrl.searchParams.set('url', apiUrl);
373: if (apiUrl.includes('?')) {
374:   twitterUrl.searchParams.set('image', apiUrl);
375: }
```
Line 375 is dead code: the tweet intent has never had a working `image`
parameter (see below) — every source, from 2012 dev-community threads to the
current docs, confirms the only intent parameters are `text`, `url`, `via`,
`hashtags`, `in_reply_to`. Setting `image` is a silent no-op. Also,
`hashtags = "PING,Solana,Crypto"` (line 365) is stale Solana-era copy — this
is already flagged in `docs/HANDOFF.md` ("Sixth session" section, "The X
share button still tags `PING,Solana,Crypto`") but not yet fixed.

**A working client-side render + clipboard path already exists**, just not
wired to the Tweet button. `handleCopy()`,
`src/components/CharacterPreview.tsx:258-342`, composites the character
(base image + traits, respecting `splitAtBase` for auras) onto a 1024x1024
canvas including any text overlays, converts it to a PNG blob, and calls:
```
325: await navigator.clipboard.write([
326:   new ClipboardItem({ 'image/png': blob })
327: ]);
```
This is the exact mechanism recommendation 1 proposes reusing — it is not a
new capability, it's the existing "Copy" button's logic pointed at a
"Tweet" click handler that also opens the intent URL afterward.

**The OG endpoints:**
- `functions/api/og/index.ts` — checks `BOT_USER_AGENT` (Twitterbot,
  Slackbot, Discordbot, facebookexternalhit, TelegramBot, WhatsApp,
  LinkedInBot, Pinterest, redditbot — `functions/_lib.ts:198-199`); bots get
  an HTML page with OG/Twitter meta tags pointing `og:image` at
  `/api/image/custom.png?...&type=banner`; humans get a 302 redirect back to
  the builder with the same trait params so the link opens the same
  character (`functions/api/og/index.ts:19-23`).
- `functions/api/og/banner.png.tsx` — the *site's own* generic share card
  (fixed 1200x630, satori/ImageResponse, one featured trait set), not
  per-character.
- `functions/api/og/ogx/[handle].ts` — same bot/human split for the
  shirt-by-X-handle feature.
- `functions/api/image/custom.png.tsx` — the actual per-request compositor.
  Validates every category/trait against `traits-index.json` (lines 44-59),
  then builds an `ImageResponse` (`@cloudflare/pages-plugin-vercel-og`,
  i.e. satori + resvg under the hood) from absolute `<img>` URLs pointing at
  `/traits-512/...` and `/ping-768.png`.

**The two documented production failures, in the code's own words:**
- CPU budget: `functions/_lib.ts:201-213` — art is loaded from
  `/traits-512` (not `public/traits`, which holds up to 1147px masters)
  "specifically because decode cost in a Worker scales with source pixels,
  not output size" and compositing at full master size "exhausted the
  isolate's CPU budget partway through the response — after the 200 had
  been flushed, so it surfaced as a valid 200 with an empty body." And
  `functions/_lib.ts:216-232`: card geometry is 800x420, not the
  conventional 1200x630, because "measured on the live deployment, a
  TWO-trait 1200x630 card failed 4/10 while an EIGHT-trait 512x512 one
  failed 3/10" — output raster size, not layer count, is what blows the
  budget.
- Edge-cache poisoning: `functions/_lib.ts:56-63` — `noStore()` exists
  because "Cloudflare treats a `.png` path as cacheable by extension
  whatever the origin says," which produced "a zero-length entry stored at
  the edge and then served ... back as 200/0 bytes ... on every
  revalidation," and the comment states plainly that the `Cache-Control:
  no-store` header alone is *not* sufficient — "Keeping the URL out of the
  shared cache needs a zone Cache Rule bypassing `/api/*`... this header is
  the correct origin-side half of that, not a substitute for it." I found no
  file in this repo (checked `wrangler.toml`, no `_headers`/`_redirects` with
  cache-rule content) that shows that zone Cache Rule was actually created —
  it appears to be a Cloudflare dashboard-side change with no
  infrastructure-as-code record here. **This should be verified in the
  Cloudflare dashboard directly**, since if it was never added, the
  zero-length-PNG failure mode is still live regardless of any other fix.
- `docs/HANDOFF.md` (top-level "What's actually still broken" section)
  states the root cause is still unconfirmed and gives three honest options:
  pay for Workers ($5/mo, 30s CPU), move rendering client-side and store the
  result, or accept the failure rate. Recommendation 2 in this report is the
  middle option, made concrete.

No KV, D1, R2, or Durable Objects binding exists in this project today —
`wrangler.toml` only sets `pages_build_output_dir` and per-environment
names. Any of the database directions below is new infrastructure, not a
config flip.

## X / Twitter web intent: media attachment

**Confirmed, from `docs.x.com` (fetched 2026-09-12) and corroborated by
X's own developer-community threads going back to 2012-2024** ("Attach a
photo to a web intent," "Can tweet intent links include media?," "Include
image in Twitter intent post" — all on `devcommunity.x.com`): the tweet
intent (`twitter.com/intent/tweet`, and its `x.com/intent/post` alias) has
**never** accepted an image/media parameter. Its actual parameters are
`text`, `url`, `via`, `hashtags`, and `in_reply_to`. There is no
undocumented way around this — it's a standing, repeatedly-requested,
repeatedly-declined feature request. The only "image" trick that ever
worked was linking to an *already-uploaded* `pic.twitter.com` URL, which
doesn't apply here (there is nothing pre-uploaded to link to). This fully
confirms the owner's premise that the current setup relies entirely on link
unfurl, and confirms line 375 in `CharacterPreview.tsx` is inert.

## What real media attachment requires (X API v2)

Per `docs.x.com/x-api/getting-started/pricing` (fetched 2026-09-12):
- Pricing moved to **pay-per-usage with no free tier** as of February 2026.
  Standard post creation: **$0.015/request**; a post containing a URL:
  **$0.200/request**; media metadata: **$0.005/request**. (Media upload
  itself is now a v2 endpoint, `POST /2/media/upload`, called before the
  post that references the returned media id — I could not find a distinct
  published per-upload price beyond the metadata line item above; treat the
  effective cost per share as roughly the post-creation price.)
- This requires the app to be registered, to hold user OAuth 1.0a/2.0 access
  tokens (an actual "Sign in with X" + write-scope consent flow — a new
  auth surface for a site that currently has none), and to eat a real
  per-share dollar cost with no free allowance.
- **Conclusion: not viable for a consumer meme-coin site letting anonymous
  visitors post arbitrary content on someone's account.** Beyond cost, an
  app posting *as the user* without them seeing the final tweet in the
  native composer is also a worse, less trustworthy UX than opening the
  composer pre-filled — skip this even if the cost were zero.

## Web Share API Level 2 (`navigator.share({ files })`)

- MDN (fetched 2026-09-12): file sharing via `navigator.share` has "limited
  availability," is not yet Baseline, and the documented pattern is to
  gate every call behind `navigator.canShare({ files })`. Supported file
  types include images, audio, video, and several document formats.
  Promise-resolution timing differs by OS (Windows resolves when the share
  popup opens; Android resolves once data reaches the target).
- What happens when the target is the X app: **unverified in detail**. I
  found second-hand reports (not X's own docs) that Android generally
  passes the file through as a real attachment, while iOS Safari has had
  cases where a shared image was received as text by the target app rather
  than an image, depending on app and OS version. I could not find an X-
  or Apple-authored statement confirming current, version-specific behavior
  for the X app specifically — **flag as unverified, do not promise "it
  always attaches" to the owner.**
- Desktop: no native OS share sheet on desktop browsers in the way mobile
  has one; Chrome desktop technically implements `navigator.share` in some
  configurations but it is not the primary use case and Firefox desktop
  does not implement `navigator.share` at all (per MDN's compatibility
  notes, which I did not get to render in full — the exact current Firefox
  status should be re-checked against MDN's compat table directly before
  relying on it).
- **Net:** worth adding as a `canShare()`-gated mobile enhancement
  alongside the clipboard flow (share the same PNG blob `handleCopy`
  already builds), but not a replacement for the OG card, since it only
  helps the person actively looking at the builder in their own browser —
  it has no answer for "someone else opens a link."

## Clipboard route (`navigator.clipboard.write` + paste)

Already implemented and, per the existing "Copy" button in this codebase,
already working: `ClipboardItem({'image/png': blob})` writes a real PNG to
the OS clipboard from a user-gesture click. Pairing this with opening the
X intent (recommendation 1) is the cheapest way to get an actual attached
image into a tweet without any server or API changes: the browser puts a
real image on the clipboard, the intent opens a compose box, the user
pastes. The friction is exactly one keystroke (Ctrl/Cmd+V), and X's
composer already accepts pasted images as first-class attachments — this
is very well established (it is how people normally screenshot-and-paste
into tweets) even though I did not find a docs.x.com page that states it
as a numbered feature; it is the standard OS-level paste-into-a-file-input
behavior every Chromium/WebKit browser supports, not an X-specific API.
Caveat: needs a secure context and a user gesture (both already satisfied
by the existing "Copy" button working), and clipboard image writes on
Safari/iOS have historically been less reliable than Chrome/Edge —
**unverified for the current Safari version**, worth a quick manual check
before shipping copy that promises it works everywhere.

## How X currently handles `summary_large_image` unfurls

- The dedicated Card Validator at `cards.twitter.com/validator` was
  deprecated in 2022 and no longer exists as a standalone tool (multiple
  2025/2026 sources agree on this; I could not reach an X-authored page
  saying so directly, but it is consistent and uncontested across sources).
  Re-scraping now happens implicitly on crawl, or via whatever the current
  X post-composer preview does when a link is pasted.
  card data for roughly a week, so a cache-buster query param on the image
  URL (which this project already effectively gets for free, since every
  distinct trait combination is a distinct URL) is the standard mitigation
  for a stale card — **this project doesn't have a staleness problem for
  distinct characters**, since the URL already encodes the full trait set.
  It would matter if the *same* URL's image content ever needed to change,
  which doesn't apply here.
- Minimum card size is 300x157; below that X falls back to a small
  thumbnail card instead of a large one. The project's 800x420
  (`functions/_lib.ts:229-231`) is safely above this floor, consistent with
  the comment on that line.
- I could not verify, from a primary source, an exact current "large image"
  quality floor (a 1200x628 recommendation is repeated across several
  third-party SEO-tool blogs, none of them X's own docs) — treat 1200x628
  as a soft best-practice figure, not a hard requirement, and note the
  project already deliberately trades some image sharpness for renderer
  reliability (`functions/_lib.ts:216-228`) — that tradeoff is documented
  and reasonable given the free-tier CPU ceiling.

## Farcaster / crypto-native surfaces

Farcaster Frames/Mini Apps do treat an image as a first-class share
primitive (a Frame's image is the primary content, with buttons/intents
layered on top), which is structurally closer to what the owner wants than
X's link-unfurl model. However, this project's stated audience and
distribution channel is X (`buildaping.com`'s copy, the `TwitterIcon`
share button, `SOCIAL_LINKS.TWITTER` in `src/utils/constants.ts`), and
there's no existing Farcaster surface in this codebase. Building a Frame
would be a parallel distribution channel, not a fix to the X share flow —
worth a future look if the community turns out to have a meaningful
Farcaster presence, but out of scope for "make the X share better."

## The database direction, designed concretely for this stack

**What "a created PING lives here" actually needs to store, and where:**

| Data | Best fit | Why |
|---|---|---|
| The 8-slot trait selection (a handful of short strings) | KV *or* a D1 row | Tiny, needs a fast point lookup by short id, doesn't need relational queries |
| The rendered PNG (the actual share image) | **R2** | R2 is built for blob storage with free egress; KV's 25 MiB value cap technically fits a PNG but KV is priced/rate-limited for small hot config values, not media, and R2's own metadata can hold the id |
| The short id -> R2 key / trait-set mapping | KV (fast read, write-light) or D1 (if you want to query/list/expire) | See below |

**Cloudflare KV vs D1 vs R2 vs Durable Objects, with the actual free-tier
numbers** (fetched 2026-09-12 from `developers.cloudflare.com`):

- **R2**: 10 GB-month storage, 1M Class A ops (writes/uploads) and 10M
  Class B ops (reads) per month, free, **and egress is always free** —
  this last point matters a lot here, since every card view/scrape is a
  read that costs nothing regardless of volume.
- **KV**: 100,000 reads/day, **1,000 writes/day to distinct keys** (writes
  to the *same* key are further limited to 1/second), 1 GB storage per
  namespace, 25 MiB max value size. The 1,000-writes/day ceiling is a real
  constraint: if the site ever created more than ~1,000 new shared
  characters a day, KV alone as the write path would need to queue or
  batch, or you'd want D1 instead.
- **D1**: as of the **2026-09-01 changelog** (Cloudflare's own changelog
  post, "D1 enforces free tier daily query limits"), free tier is hard-
  capped — as of that date, queries beyond the daily limit *fail* rather
  than silently degrading. Limits: 5,000,000 rows read/day, 100,000 rows
  written/day, 5 GB total storage, 10 databases/account, 500 MB/database.
  100,000 row-writes/day is a much higher ceiling than KV's 1,000 and would
  comfortably cover a viral spike; storage is generous for tiny trait-
  selection rows.
- **Durable Objects**: overkill for this — DOs give strongly consistent
  single-object state and coordination, which nothing here needs (no two
  clients are racing to edit the same character). Skip.

**Recommendation for this specific stack: D1 for the id/trait-selection
record, R2 for the PNG.** D1's write ceiling is far more comfortable than
KV's for a public "anyone can create one" endpoint, and its point-lookup-
by-id query is trivial; R2 is simply the correct place for a binary blob
regardless of which metadata store you pick.

**Does persisting the PNG at creation time remove the per-request render
cost?** Yes, unambiguously, if the render happens once (at share-creation
time, when the user clicks "Tweet" or "Share," already inside a request
that has a live user session and presumably more slack than a bot's cold
scrape) and the `/api/og/p/<id>` bot-facing route becomes a straight R2
`GET` instead of an `ImageResponse` build. Both documented failures are
specifically about the *render* happening inside the request that serves
the scraper: the CPU-budget failure is satori/resvg's own WASM init and
composite work exceeding the free tier's 10ms-per-invocation-adjacent
budget (`docs/HANDOFF.md`, "still broken" section), and the edge-cache
failure is about a `.png` response path being cached wrong — an R2-backed
static fetch sidesteps the first entirely and can be given an explicit,
correct `Cache-Control` since it's now a deterministic, unchanging object
rather than a script whose success is probabilistic.

**Short-id scheme and collision handling:** a base62 or base58 random id of
6-8 characters (e.g. `nanoid(8)`) gives billions of values with negligible
collision probability at any realistic scale for this project; check-and-
retry on insert (D1 `INSERT ... ON CONFLICT DO NOTHING` / unique constraint,
retry with a new id on conflict) is sufficient — no need for a
coordination service.

**What `/p/<id>` serves:** a Pages Function at that route does the same
bot/human split the current `/api/og` does (`BOT_USER_AGENT` regex,
`functions/_lib.ts:198-199`) — a bot gets the OG HTML page with `og:image`
pointing at the R2 object's public URL (or an `/api/image/p/<id>.png` proxy
route if you don't want to expose the R2 bucket URL directly), a human gets
redirected to the builder with the trait params restored from the stored
record (so the existing "open the same character" behavior is preserved).

**Abuse surface:** anyone can `POST` a trait combination and get storage
allocated. The trait set is already a closed, validated enum —
`functions/api/image/custom.png.tsx:44-59` rejects any category or trait
not present in `traits-index.json` with a 400 — so the abuse surface is
narrower than free-form input: an attacker can't inject arbitrary images or
text, only spam *storage* by requesting many valid-but-unwanted
combinations. Mitigations, in order of effort: (1) since only 8 categories
with a fixed small set of trait names exist, the total number of *distinct*
characters is finite (the current 298-trait library across 8 slots is
large but finite) — dedupe on the canonical sorted trait-string before
writing, so repeat requests for the same combination are a read, not a
write, which also means the R2/D1 writes actually scale with distinct
characters ever created, not with share-button clicks; (2) rate-limit
creation per IP (Cloudflare's own rate-limiting rules, or a simple
KV-counter check, given KV reads are generous even if writes aren't); (3)
optionally expire unread records after N days with R2 lifecycle rules if
storage ever becomes a real cost concern (unlikely at these free-tier
ceilings for a project this size).

**Migration:** the existing `?category=trait&...` query-param URLs
(`/api/og?head=...`) must keep working indefinitely — they're already out
in the world in old tweets and cached cards. The clean way: keep
`functions/api/og/index.ts` exactly as it is for query-param URLs, and add
the new `/p/<id>` route alongside it as an *additional*, preferred path
that the site itself starts generating going forward. No redirect or
rewrite of old links is needed or desirable — both routes can coexist
permanently, since the query-param route has no server state to migrate
(it's already fully self-describing).

## Implementation sketch for the recommended path

**Step 1 (ship first, no infra):**
- `src/components/CharacterPreview.tsx`: extract the canvas-compositing
  block already inside `handleCopy` (lines ~264-320) into a shared helper
  that returns a `Blob`, call it from both `handleCopy` and a new/modified
  `handleShareOnX`. In `handleShareOnX`, write the blob to the clipboard
  the same way (`navigator.clipboard.write([new ClipboardItem({'image/png':
  blob})])`), remove the dead `image` param (line 374-375), fix the stale
  `hashtags` (line 365) to something Robinhood-Chain-appropriate, and only
  *then* `window.open` the intent URL. Update the button label/tooltip to
  say the image was copied and needs pasting (`ActionButton` around line
  475-483).

**Step 2 (when ready to invest in infra):**
- `wrangler.toml`: add a D1 database binding and an R2 bucket binding.
- New Pages Function `functions/api/og/p/[id].ts`, modeled on
  `functions/api/og/index.ts`, doing a D1 lookup by id, then either serving
  the OG HTML (bot) with `og:image` pointing at an R2-backed image route, or
  redirecting to the builder with the stored trait params (human).
- New Pages Function `functions/api/image/p/[id].png.ts` (or serve directly
  from R2's public bucket URL if acceptable) to stream the stored PNG with
  a long, correct `Cache-Control` — this one is safe to let Cloudflare
  cache, unlike today's `/api/image/custom.png`, because the object never
  changes once written.
- A creation endpoint, e.g. `functions/api/share.ts`, that: validates the
  trait selection the same way `custom.png.tsx` already does
  (`functions/api/image/custom.png.tsx:44-59` — factor that validation out
  into `_lib.ts` and reuse it rather than duplicating it), canonicalizes and
  dedupes on the sorted trait string, generates a short id on first write,
  renders the PNG once (reusing the existing `ImageResponse` compositor
  code), writes it to R2, writes the id/trait-set/R2-key row to D1, and
  returns the `/p/<id>` URL to the client to use in place of the current
  `/api/og?...` URL from `generateApiUrl()`
  (`src/components/CharacterPreview.tsx:344-357`).

## What I could not verify

- Whether the zone Cache Rule bypassing `/api/*` (mentioned as necessary in
  `functions/_lib.ts:56-63`) was ever actually created in the Cloudflare
  dashboard — there is no infrastructure-as-code record of it in this repo,
  and I have no dashboard access. **This should be checked directly before
  trusting that the zero-length-PNG failure mode is closed.**
- The precise, current, version-specific behavior of `navigator.share`
  with an image file when the target is the X/Twitter app on iOS vs.
  Android — I found consistent secondary reports of iOS inconsistency but
  no X- or Apple-authored statement pinning down current behavior.
- The exact current Firefox desktop support status for `navigator.share`
  (text-only vs. none) — MDN's compatibility table should be checked
  directly rather than relied on from a partial fetch.
- Whether `POST /2/media/upload` on the X API v2 has a distinct published
  price beyond the `$0.005` media-metadata line item — the pricing page
  content I could retrieve did not clearly separate "upload" from
  "metadata," and I did not find a fuller breakdown from a second X-
  authored page in the time available.
- The exact current image-quality floor X recommends for
  `summary_large_image` beyond the documented 300x157 minimum-to-avoid-
  thumbnail-fallback — the commonly repeated 1200x628 "best practice"
  figure comes only from third-party SEO/marketing sites, not from an
  X-authored page I could reach.
- Clipboard image-write (`ClipboardItem`) reliability on the current Safari/
  iOS version specifically — the existing "Copy" button implies desktop
  Chrome/Edge work; mobile Safari was not independently confirmed here.
