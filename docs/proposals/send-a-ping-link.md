# Proposal: a shareable link for "Send a PING"

Today Send a PING (`SendPingModal.tsx` + `pingCard.ts`) draws a notification
card client-side (canvas: character + optional message banner) and only lets
the user download or copy the PNG. Nothing is stored, no link exists. Character
sharing (`/api/share` -> `/p/<id>`) already has the storage/OG/showcase
machinery this needs. The question is whether PING gets its own path or folds
into `/p/`.

## Shared building blocks (all options)

- **Id/store**: reuse the `CardStore` interface in `functions/_lib.ts`
  (`kvCardStore` today, R2/tunnel-box later — storage-agnostic by design).
  Extend `canonicalTraits` output with the message so the id is content
  addressed on **traits + message**: `shareId(canonical + '&msg=' + message)`.
  Same character with a different message is a different card; same
  character + same message is idempotent (one stored object, two people
  converge on one link) exactly like today.
- **Reproducing `pingCard.ts` server-side**: the client draws with 2D canvas
  (Archivo web font, `favicon-180.png` icon, `roundRect`, manual text
  fitting). `custom.png.tsx` already proves satori/`ImageResponse` can do the
  same class of layout — it loads the same Archivo TTFs and draws a caption
  banner today. A satori JSX version of `cardLayout`/`drawPingCard` (icon as
  an `<img>`, banner as a flex box, same fraction-of-size math) is a
  **rewrite, not a port**, and won't be byte-identical, but it's the same
  visual language and is buildable. Output size matters for CPU budget: the
  comments in `_lib.ts` already document that an 800x420 banner was chosen
  over 1200x630 because output pixel count is what blows the isolate's CPU
  budget, not layer count. A 1024x1024 PING card is *more* pixels than either
  existing size — render at 512x512 (matches `CARD.square`) or the 800x420
  banner shape, not `CARD_SIZE`.
- **Client-uploads-the-PNG instead, rejected**: the client could POST the
  canvas's own rendered bytes instead of asking the server to re-render. This
  breaks the trust model every other image endpoint relies on: today every
  pixel that reaches storage came from our own trait art, our own font, and a
  fixed set of params the server validated. Accepting arbitrary client PNG
  bytes means anyone can POST any image at all — not a notification card, not
  even a penguin — and get it hosted at `buildaping.com` and scraped into X's
  preview cache. That is a strictly worse abuse surface than presets-only
  text, and validating "is this a plausible PING card" server-side (dimension
  check, PNG signature, size cap à la `MAX_PHOTO_BYTES`) does not actually
  stop someone from uploading a legitimate-looking-but-offensive composite.
  **Don't do this.** Server-side re-render only.
- **Abuse surface unique to this feature**: character sharing has no
  freeform text. PING's whole point is a message. A custom string rendered
  into an image hosted on our domain and pushed into X's preview cache is the
  risk (slurs, threats, phishing-style "your wallet is compromised" text
  wearing our brand). Recommendation across every option below: **ship
  presets-only first** (the 8 strings in `PING_MESSAGES` plus "no banner").
  If custom text is wanted later, it needs: length cap (already 40 chars),
  a wordlist/profanity filter, and a rate limit on the create endpoint — and
  should probably still exclude it from the *stored, X-scraped* image and
  only allow it in the local download/copy path.

## Option A — separate route, `/ping/<id>`

- **URL shape**: `POST /api/ping` (id = hash(traits+message)) ->
  `/ping/<id>`, mirroring `/api/share` -> `/p/<id>` exactly.
- **X preview**: new satori template, the actual notification card (character
  + banner), 512x512 or 800x420. Message is server-rendered into the image
  (presets-only, so no filter needed yet).
- **Human landing page**: new `PingShowcase.tsx`. Shows the notification
  card full-width, headline "Someone sent you this PING", CTAs **"Send one
  back"** (opens the builder with these traits pre-loaded *and* the
  SendPing modal open) and **"Remix"** (opens the builder, character only,
  same as today's "Remix this PING"). Bot split via `BOT_USER_AGENT` same as
  `functions/p/[id].ts`.
- **Storage writes per share**: 2 on a first-time (traits, message) pair —
  card + a `pings:index` gallery doc, same shape as `GALLERY_KEY` today.
  Cached reuse is a read, like `/api/share`.
- **Gallery**: separate gallery (`/api/ping-gallery` or a `kind` filter on
  the existing one — see Option C for the merged version). Kept apart here
  because a PING card and a character card are visually different tiles.
- **Files touched**: `functions/api/ping.ts`, `functions/ping/[id].ts`,
  `functions/api/image/ping/[id].png.ts`, `functions/api/ping-card/[id].ts`
  (JSON for the showcase page), a new satori JSX card component (new file or
  inline in the image function), `src/pages/PingShowcase.tsx`, router
  registration, `SendPingModal.tsx` (add "Get link" alongside
  Download/Sticker/Copy), `_lib.ts` (id/canonical helpers, gallery helpers —
  likely generic-ized rather than duplicated).
- **Effort**: **M**. Clean mental model, no risk of confusing the two
  features' analytics or OG semantics, but it's a full parallel stack.

## Option B — same `/p/<id>`, message as a stored variant

- **URL shape**: still `POST /api/share`, still `/p/<id>`. The id already
  hashes `canonicalTraits`; extend the hashed string to include the message
  when present, and store the message in KV metadata alongside `traits`
  (`kvCardStore`'s metadata already carries `traits`; add `message?: string`).
- **X preview**: `functions/p/[id].ts` picks the OG image/title based on
  whether metadata has a message — `renderOgPage` gets a notification-card
  image (same satori work as Option A) instead of the plain character crop
  when `message` is set. Title becomes e.g. "Someone sent you this PING" vs.
  today's `titleFromTraits`.
- **Human landing page**: `Showcase.tsx` grows a branch: message present ->
  notification layout, CTA "Send one back" (opens SendPing pre-filled) next
  to the existing "Remix this PING" / "Make your own". No new page.
- **Storage writes**: same 2 (card + gallery entry) — no new endpoint, no
  new gallery.
- **Gallery**: `SharedGallery.tsx`/`api/gallery.ts` needs a way to tell the
  two apart in the tile (badge, or filter tab) — see `GalleryEntry` needs a
  `message?` field threaded through `addToGallery`/`galleryPage`.
- **Files touched**: `functions/_lib.ts` (metadata shape, id hashing,
  gallery entry shape), `functions/api/share.ts` (accept + pass message),
  `functions/p/[id].ts` (branch OG rendering), `functions/api/card/[id].ts`
  (return message), `functions/api/image/custom.png.tsx` or a new satori
  branch (notification layout), `src/pages/Showcase.tsx` (branch UI),
  `SendPingModal.tsx` / `CharacterPreview.tsx` (wire "Get link" into the
  existing share flow), `SharedGallery.tsx` (badge).
- **Effort**: **S–M**. Fewer new files than A, but `/p/<id>` now means two
  conceptually different things (a character, or a notification someone
  composed), which muddies what the path *is* going forward — worth naming
  explicitly if chosen, e.g. "`/p/` is 'a PING', character-only is the
  degenerate case."

## Option C — one merged page, two modes, done deliberately

Same technical shape as B (one route, one store, message-aware id), but
treated as a real merge rather than a bolt-on: the gallery becomes one feed
with a visible "Character" / "PING" distinction (tabs or a small badge per
tile), and `Showcase.tsx` is redesigned as a single component with two
render modes rather than an if-branch bolted onto the existing layout.

- **URL/OG/storage**: identical to Option B.
- **Difference from B**: `GalleryEntry` and the showcase page are designed
  up front for both shapes (e.g. a `kind: 'character' | 'ping'` discriminant
  instead of inferring from `message` presence), gallery UI gets a filter,
  and CTA copy/layout for both modes gets real design attention instead of
  being squeezed into the existing character layout.
- **Files touched**: same list as B, plus `SharedGallery.tsx` filter UI and
  likely a small redesign pass on `Showcase.tsx` rather than a branch.
- **Effort**: **M**. Same runtime risk profile as B, more front-end design
  time; the payoff is a gallery/showcase that reads as one coherent feature
  instead of two paths through one component.

## Option D — no new render, message stays out of the scraped image

- **URL shape**: still `/p/<id>`, still today's plain character card — no
  satori changes, no new render path. The message rides as a query param on
  the link the person copies/shares: `/p/<id>?msg=Order+filled.` (presets
  only, so this is really an index into `PING_MESSAGES`, not free text).
- **X preview**: unchanged plain character card image. Title/description
  can still say "Someone sent you this PING: Order filled." as plain OG meta
  text (arbitrary text in a meta tag is a much smaller risk than baking it
  into a cached image asset, though it's not zero — X truncates/escapes it).
- **Human landing page**: `Showcase.tsx` reads `?msg=` client-side and
  renders the actual notification-card look (via `pingCard.ts`, canvas,
  already written) on top of the fetched character — visually correct for a
  person, but a link **pasted into X shows the plain character card**, not
  the notification banner. That's a real gap against the stated goal
  ("what X's link preview shows").
- **Storage writes**: zero beyond today's character share — the biggest
  win here.
- **Gallery**: unaffected; a PING'd link doesn't need its own gallery entry
  at all (it's a variant view of an existing character card).
- **Files touched**: `Showcase.tsx` (read `?msg=`, notification render
  branch), `SendPingModal.tsx`/`ShareModal.tsx` (build the `?msg=` link).
  Nothing server-side.
- **Effort**: **S**. Cheapest and lowest-risk by far, but weakest on the
  actual ask — the X preview never shows the banner, only the character.
  Good fallback if storage cost or satori-rewrite time is the binding
  constraint, not a good primary answer to "showcase both features."

## Recommendation

**Option A** (separate `/ping/<id>`, presets-only, server-rendered notification
card). Reasons:

- The owner is already unsure whether to merge, which usually means the two
  things don't actually share a shape yet — a character card and a "someone
  sent you a message" card have different CTAs, different OG titles, and
  will likely diverge further (PING already has stickers; characters don't).
  Forcing them into one id/route now (B/C) means unwinding that coupling
  later if they diverge more, whereas A can always be merged into `/p/`
  afterward if they turn out identical in practice — the reverse is harder.
- It reuses every piece that already exists (`CardStore`, gallery pattern,
  bot/human split, satori-with-Archivo precedent) without touching the
  character path at all, so it can't regress `/p/<id>` while it ships.
- Presets-only sidesteps the one genuinely new abuse surface (custom text
  baked into a domain-hosted, X-cached image) without blocking the feature —
  custom text can follow once there's a filter and a rate limit, as its own
  ticket.

If the owner would rather not stand up a second stack for what may turn out
to be "the same feature," Option C is the second choice over B — merge, but
design the merge, don't let PING become an if-branch in `Showcase.tsx`.

## Open questions for the owner

1. Separate path (A) or merged (B/C)? See the coupling argument above.
2. Presets-only at launch, or is custom text (with a filter + rate limit)
   needed for the first ship?
3. Which storage backend is this landing on — KV (current free-tier ceiling
   already flagged in `HANDOFF.md`: ~500 new shares/day before writes fail),
   or does it wait for the R2/tunnel-box move mentioned in `_lib.ts`? A new
   feature that adds write volume (message variants multiply the id space
   well beyond character-only sharing) makes the existing KV ceiling
   question more urgent, not less.
4. Does "Send one back" on the landing page open the builder with the
   *sender's* traits pre-loaded (a remix), or a blank builder (a reply, not
   a copy)? Affects CTA wording and the router-loaded-state wiring in all
   three build-worthy options.
5. Do PING cards need to show up in the public gallery at all, or is a PING
   inherently one-to-one (sent to a person) rather than a showcase item like
   a character?
