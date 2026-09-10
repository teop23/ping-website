# PING / buildaping.com — handoff

Written 2026-09-10, end of a session that took the trait library from 176 to
239 and touched the palette, favicon, token image, domain, and deploy
pipeline. Everything below is the actual current state, verified, not a
summary of intentions.

## What this project is

A character generator + open image API for the `$PING` memecoin, relaunching
on **Pons** (a launchpad) on **Robinhood Chain**. Originally on Solana at
`pingonsol.com` (dead). Vite 5 + React 18 + TS + Tailwind, Cloudflare Pages
with Pages Functions for server-rendered share images.

- Repo: `github.com/teop23/ping-website`, branch **`relaunch/robinhood-chain`**
  (this is the live branch now — `main` is the old Solana site, untouched)
- Live at **buildaping.com** (apex + www, cert active) via Cloudflare Pages
  project `buildaping`, GitHub-connected to `relaunch/robinhood-chain` —
  **pushing to that branch auto-deploys to production**
- Domain registered 2026-09-07. Robinhood Chain: Arbitrum L2, chain ID
  `4663`. Pons: 1B fixed supply to a bonding curve, zero creator allocation,
  graduates to Uniswap v4 with locked LP, **metadata immutable at creation**

## What's actually done

- **Palette**: light cream (`#F3F1EA`), Robinhood lime (`#CCFF00`) exact,
  merged from three competing variants. Token ramp lives in `src/index.css`;
  `src/index.contrast.test.ts` asserts every pairing meets WCAG AA — both
  this project's own tokens *and* the shadcn/radix alias layer (`--primary`,
  `--ring`, etc.), which is a separate set of tokens that resolve
  independently and was not covered until this session.
- **Favicon and token image**: both full-bleed lime, generated from the real
  character art by `scripts/make-favicon.mjs` / `scripts/make-token-image.mjs`
  so they can't drift from the source. Token image is ready for the Pons
  submission.
- **Trait library**: cleaned of 12 hate-symbol/explicit assets (see commit
  `032ab7b` for the exact list — Nazi-era imagery, slurs, a real photo of a
  named terrorist, explicit content), then grown from 164 to **239 traits**
  across all 8 categories by hand-authored SVG, not an image model. See
  `docs/trait-style-guide.md`, `docs/trait-generation-plan.md`.
- **The image-API empty-body bug is fixed** (see "What's actually still
  broken" below for the honest nuance) by compositing from 512px render art
  instead of 1024–1147px masters.

## The three things a person caught that nothing automated did

These are worth reading before touching trait art again, because they're not
one-off mistakes — they're a pattern (see `docs/trait-style-guide.md` and the
generator scripts' own comments for the full detail):

1. **A trait can render correctly in isolation and still be wrong once
   composited.** An aura's cover shape painted a solid wedge over the
   character's face because closing an open arc with a straight chord fills
   the middle instead of leaving it hollow — invisible in every preview,
   obvious on the live site. Fixed with real geometry *and* a redundant
   safe-zone mask (`scripts/generate-aura-traits-svg.mjs`).
2. **Hand-approximating a shape you could extract exactly is a mistake.**
   Five shirt traits were drawn as a guessed tee silhouette instead of using
   the real `blank-tee_body.png` — visibly the wrong shape and proportions.
   Fixed by decoding the real garment, keeping its outline exact, and only
   replacing the interior fill/pattern (`scripts/generate-shirts-from-mask.mjs`).
3. **Don't erase a defining feature to add an expression.** Seven mouth
   traits covered the character's actual mouth — the orange beak — with a
   cream rectangle and drew an invented human mouth-line on bare face. Fixed
   the same way as the shirts: extract the real beak from `public/ping.png`
   via a flood-fill (a plain rectangular crop pulls in unrelated hood-outline
   pixels; color filtering alone can't tell a hood fragment from the beak's
   own outline, since both are black) and decorate that instead of replacing
   it (`scripts/generate-mouths-from-beak.mjs`).

**The takeaway for whoever picks this up:** when a new trait touches or sits
near an existing feature of the base character, prefer extracting that real
feature's pixels over hand-drawing an approximation, and always verify
against an actual `wrangler pages dev` render — this project's own preview
tooling and validation caught none of the three bugs above; a person looking
at the live site did.

## What's actually still broken

- **The image API's empty-body failure is reduced, not eliminated, and its
  root cause is unconfirmed.** Best-supported explanation: Cloudflare
  Workers **Free** gives 10ms CPU per invocation, and satori/resvg's own WASM
  init can exceed that regardless of how light the actual composite is —
  which would mean **no amount of trait-side optimization fixes it**. Do not
  trust a single test run either way; failures were shown to interleave
  inside one rapid burst (successes and failures back to back), so isolate
  variance from real signal by running >=10 cache-busted requests before
  concluding anything. See `docs/../src/index.css` history and commit
  history around `86d1175`/`b13bec9`/`63d6e2d` for the three *wrong*
  diagnoses that preceded the current one (a cache header, a poisoned edge
  cache, render workload) — each looked confirmed from too few samples.
  Real options: pay for Workers ($5/mo, 30s CPU, would settle this
  definitively); move rendering client-side (the builder already composites
  with fabric.js) and store the result rather than re-rendering per request;
  or accept the failure rate for the documented public API.
- **4 trait assets are undersized** with no source art to fix them:
  `Apu-Apustaja-tee` (500px), `grenade` and `m16` (450px), `poobis` (320px).
  Build warns, doesn't fail.
- **~21 traits reference third-party trademarks** (Sanrio/Hello Kitty, Touhou
  "fumo" plushes, Halo, Naruto, Dragon Ball, Marvel, PlayStation/Xbox logos,
  a deceased musician's likeness) — untouched, flagged as a legal-exposure
  decision that's the project owner's call, not a style question.
- **`bazooka-aura`** is a literal photo of an RPG launcher filed under
  `aura` — looks like a mis-categorization, not investigated further.
- **`aura` is not one visual style.** Only the flame/glow-halo treatment
  (`fire-aura`, `sunrise-aura`, and 6 added this session) has a generator.
  `american-aura`/`persian-aura`/`LGBTQ-aura` (LGBTQ-aura was since removed
  by request)/`link-aura` are a completely different full-frame flag/logo
  backdrop treatment, and `fart-aura` is a third, an ornate swirl halo.
  Extending either of those requires picking specific flags/logos — a
  content decision that was deliberately not made unilaterally.
- **Root `tsconfig.json`** has a stray top-level `moduleResolution` and a
  trailing comma; bare `npx tsc --noEmit` fails. CI/this session both dodge
  it by targeting `tsconfig.app.json` and `functions/tsconfig.json`
  explicitly. Never actually fixed.

## Launch blockers (not started)

`src/utils/constants.ts`: `TOKEN_LIVE = false`, `CONTRACT_ADDRESS = ""`,
`CHART_LINK = ""`, `COUNTDOWN_TARGET`. Every surface reads `TOKEN_LIVE` and
degrades to a pre-launch state on its own — flipping it plus filling in the
real values is what launch day actually is, code-wise.

## Where things live

- `docs/trait-style-guide.md` — the real, evidence-based style rules (three
  treatments, not one, per category)
- `docs/trait-generation-plan.md` / `trait-generation-prompt.md` — the
  original plan and a ready-to-paste prompt for an image-generation agent,
  if that route is preferred over hand-authored SVG for future batches
- `scripts/generate-*-traits-svg.mjs` — one generator per category, each with
  registration measurements and known-gotcha comments in its header
- `scripts/generate-shirts-from-mask.mjs`, `generate-mouths-from-beak.mjs` —
  the two "extract the real feature, don't approximate it" generators
- `scripts/lib/png.mjs` — pure-JS PNG decode/resize/encode (linear-light,
  premultiplied-alpha resize; Adam7/interlace support), used everywhere
  instead of adding `sharp` as a real dependency for the site itself
  (`sharp` is used only in the one-off generator scripts, as a transitive
  dependency already present)
- `scripts/preview-trait.mjs` — composites a candidate trait over the real
  base character using the renderer's exact math; `--aura` flag for the one
  category that paints *behind* the base instead of after it
- `src/index.contrast.test.ts` — the full contrast test suite; extend this
  rather than eyeballing a color change
- Vault notes (if migrating knowledge elsewhere, these have the full forensic
  detail this doc only summarizes): `PING Website`,
  `Trait Registration Against a Base Character`,
  `A Trait That Looks Right Alone Can Still Paint Over the Face`,
  `Contrast Invariants as Tests`, `Debugging Empty 200 Responses`

## Verification standard this session settled on

Every trait batch was checked three ways before being trusted: the build's
own hard validation (`scripts/generate-index.mjs`), a visual composite over
the real base at actual render size (not a thumbnail — several defects were
invisible small and obvious large), and at least one real
`wrangler pages dev` render through the live Function. For anything with a
tight physical constraint against an existing feature (mouth near the eyes,
in particular), an automated pixel-distance check beats a visual pass —
eyes sit only ~13px in radius and the beak's own top edge is only ~9px below
their bottom edge; that gap is too easy to eyeball as "fine" when it isn't.
