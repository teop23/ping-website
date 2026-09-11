# PING / buildaping.com — handoff

Updated 2026-09-11 (see "Builder audit, 2026-09-11" at the bottom for the
latest state). Originally written 2026-09-10, end of a session that took the trait library from 176 to
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
  named terrorist, explicit content), then grown from 164 to 239 traits (238 after the builder audit removed one
more hate-symbol asset)
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

4. **Detail inside the beak is invisible at render size.** The rebuilt
   mouths from (3) kept the real beak but drew every expression *inside* its
   silhouette: a 14px tooth bar, a 6px smile stroke. The beak is ~53x14px at
   the 512 render, so smile and smirk vanished entirely and the open mouths
   became a 5px smudge - live, not in the preview script's 1147px output.
   Fixed 2026-09-10 (second session) by treating the real beak as the upper
   mandible and adding the expression *below* it at a readable size: a dark
   interior plus an orange lower mandible for the open-beak family, a tongue
   or bubble emerging from under it (`scripts/generate-mouths-from-beak.mjs`).
   Everything added sits below the beak's bottom edge, so eye clearance is
   guaranteed by construction, and measured anyway with
   `scripts/check-eye-clearance.mjs`.

Also fixed in that pass, same batch: `bandana-mask` was drawn across the
eyes (a blindfold in brown) rather than over the beak; the 9 new ground
accessories were ~60% the size of the existing stove/washing machine and
were grown 1.45x about their ground point (`scripts/rescale-trait.mjs`);
guitar, kite and balloon-animal were scaled up about the flipper contact
point. Everything else in the 76-trait batch was checked composited over
the base at 512px on contact sheets and left alone.

**The takeaway for whoever picks this up:** when a new trait touches or sits
near an existing feature of the base character, prefer extracting that real
feature's pixels over hand-drawing an approximation; make the defining shape
big enough to survive the 512 render (a contact sheet of the real composite
at 512px, not the 1147px master, is the honest test); and always verify
against an actual `wrangler pages dev` render - this project's own preview
tooling and validation caught none of the four bugs above; a person looking
at the live site did.

## What's actually still broken

- **Site copy quotes the trait count in four places** (hero, roadmap, meta
  tags, OG banner) that can't read the manifest. `scripts/check-copy-count.mjs`
  (runs in `prebuild`) now fails the build if any of them disagrees with the real count, so the
  number can't silently sit at 176 again - but it still has to be edited by
  hand when the library grows.
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
- `scripts/check-eye-clearance.mjs` — pixel-distance check against the eyes;
  run it on any mouth/face trait that is meant to leave the eyes alone
- `scripts/rescale-trait.mjs` — grow/shrink a finished trait about its
  ground point or centroid without re-authoring it
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

## Session 2026-09-10/11: batch fixes shipped, full builder audit in progress

**Shipped and live** (commit `83b8569`, pushed, verified on buildaping.com):
the 76-trait batch was checked on contact sheets at 512px next to originals
and 21 traits were rebuilt - all 8 mouth expressions (below the real beak,
see item 4 above), bandana-mask, guitar/kite/balloon-animal, 9 ground
accessories (grown 1.45x, cart basket filled). Copy now says 239 everywhere
and `scripts/check-copy-count.mjs` fails the build on drift. New scripts:
`check-eye-clearance.mjs`, `rescale-trait.mjs`, `contact-sheet.mjs`.

The owner then rejected gap-tooth as rendered by the BUILDER and asked for
every trait to be checked in the real site. That audit is done; see the
next section.

Environment notes: `.claude/launch.json` has `ping-dev` (vite, 5173) and
`ping-pages` (wrangler on 8790 - a stale workerd from an older session
still holds 8788). Capturing from a hidden browser tab crawls; keep it
fronted.

## Builder audit, 2026-09-11: done

All 239 traits were captured from the real builder canvas (599px, 1600px
window) into `.trait-audit/`. They were tiled 20 per labelled sheet, and all
12 sheets were reviewed. Each capture was also pixel-diffed against the
bare base to catch traits that draw nothing. Every fix was re-captured from
the builder, re-checked, contact-sheeted at 512 next to originals of the
same category, and rendered once through `wrangler pages dev`.

Fixed:

- **gap-tooth** (the rejected one): a 5-tooth row with one dark slot is
  ~8px tall at 599px and the slot vanished into the dark interior. It is now
  two big front teeth under the closed real beak, with a gap.
- **gold-tooth, open-laugh**: fewer, taller teeth (36px, from 24px).
- **smirk**: the lower mandible pinched to a crossing sliver on the short
  side. It now has its own tapered path.
- **every beak-based mouth**: a light dotted seam showed under the beak on
  open mouths. The flood-filled beak kept its outline's anti-aliased grey
  fringe. That fringe is now black at matching coverage, which looks
  identical over cream and dark over the interior.
- **umbrella**: the canopy was a bat-wing shape. It is now a domed,
  scalloped canopy with a J handle.
- **fishing-rod**: it pointed across the chest with the fish on the belly.
  It now points up and away, and the fish hangs in open space.
- **wizard-hat**: the tip ran off the canvas top. The cone is shorter.
- **rocket**: it floated ~140px above the ground line. It is now lowered to
  stand where the other accessories stand.
- **fan-of-the-painter-tee** removed: a swastika on red, named for Hitler.
  The 2026-09-09 hate-symbol pass missed it behind the euphemism. The count
  is now 238, and the six copy sites are updated.

Not a defect: `skull-tattoo` captured as the bare base. The old capture
snippet waited a fixed 500ms and the builder loads trait images
asynchronously. The art is fine. The snippet in
`scripts/capture-builder-receiver.mjs` now waits until the canvas differs
from the bare base. A stray `receiver.mjs` from an older session was
holding port 9911 and writing elsewhere, so the receiver now takes `PORT`.

Looked at and left alone, as original art rather than a defect: angry
brows extending past the head, wand's white glow, sayian hair over one
eye, and the hello-kitty keychain's small size. Two left-side traits,
such as umbrella plus rocket, overlap when both are picked. That is
inherent to both slots living on the left.

## Mouth expressions, 2026-09-11: 3 of 8 accepted, 5 still rejected

**Accepted by the owner, keep as they are:** `tongue-out`, `gum-bubble`,
`mustache-only` (the state in commit `b93ad3b`, thinned beak outline).

**Rejected, "uncanny valley":** `smile`, `smirk`, `open-laugh`,
`gap-tooth`, `gold-tooth`. They are live on the site right now in that
rejected state.

All eight come from `scripts/generate-mouths-from-beak.mjs`. Versions the
owner has turned down so far (the generator header has the detail):

1. A cream rectangle over the beak with a human mouth line drawn on bare face.
2. The expression drawn inside the beak's silhouette. Too small to see.
3. A drawn orange lower mandible and tooth row under the real beak. In the
   builder it read as a strip of tiny boxes.
4. The same idea resized. It read as a second beak or a bucket bolted on,
   and the perfect-vector lines clashed with the hand-drawn base.
5. The current version (`c4fb9bc` + `b93ad3b`): the real beak split along
   its orange midline and opened, with teeth and tongue inside the gap,
   drawn parts wobbled, and the outline thinned. It's technically clean in
   the builder, and still uncanny.

My read (a hypothesis, not confirmed with the owner): the three that work
all keep the beak basically closed and add a **prop or object** (tongue
hanging out, a bubble, a mustache). That is the same convention as the
original cigar/joint/lollipop/whistle, which were always fine. The five
that fail all show **inside the mouth**: teeth, gums, an interior.
Human-style mouth anatomy on a bird beak is what reads as uncanny, so
tuning sizes, outlines or line wobble won't fix them.

Options for the five, which is the owner's call:

- **Cut them.** Count 238 -> 233, update the six copy sites
  (`scripts/check-copy-count.mjs` lists them), and delete the PNGs and their
  jobs in the generator.
- **Replace them with prop-style expressions** that never open the beak,
  for example: a toothpick, a flower stem, a pacifier, a straw, a
  harmonica, a party blower, a leaf, a fish tail sticking out. Held in the
  beak's corner like the cigar.
- **Keep the names, re-express them without an interior.** gold-tooth
  becomes a gold cap on the beak tip; smirk becomes a tilted closed beak or
  a single side cheek mark. It's risky, because it's closest to what already
  failed.

Process rule for whoever picks this up: the owner has rejected mouth work
five times. **Show mockups at builder size (599px canvas, face crop plus
full frame) and get a yes before regenerating, committing or pushing.**
The pipeline, receiver on PORT=9912, capture snippet and gates all work.
See "Verification standard" above and the generator header.
