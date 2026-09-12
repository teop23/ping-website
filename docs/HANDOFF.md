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

## Mouth follow-up, 2026-09-11: code generation dropped, image model in

**Owner's decision on the five:** "re design to be better or cut". A sixth
round of code-drawn mockups (bent beak with corner creases, tilted smirk,
recolored gold beak) was rejected outright. **Stop drawing traits in code.**
New art now comes from an image model and the owner's approval.

**Plan (not yet executed):** cut `smile`, `smirk`, `open-laugh`,
`gap-tooth` and `gold-tooth`, and replace them with prop-style mouth traits.
Nothing is cut or changed on the site yet. The five rejected ones are still
live. Cut them only once replacements are approved, and handle the count
through `check-copy-count` (238 now).

**The prompt:** `docs/trait-generation-prompt.md`. It covers every category,
with 61 concepts that have been checked against the library for duplicates.
Model: GPT Image 2 first, Nano Banana Pro (Gemini) as the fallback. The
attachments are in `docs/trait-refs/`:
- `ping-on-white.png` is the image to edit.
- `originals-sheet.png` has 16 of the owner's originals, 2 per category, at
  512.

**Gemini test (Flash, free tier; the 3.1 Pro picker wouldn't select):**
- The owner approved `fish-in-beak` take 1 as a look. It's saved as
  `.trait-work/gemini/fish-in-beak-take1.jpg`, a 1024 JPG straight from the
  "Download full size image" button. Gemini also saves JPG, not PNG.
- Gemini returns the **whole redrawn image**, never a layer. Framing holds:
  the penguin's bbox matches the base to a pixel or two, and the mean diff
  outside the mouth is 0.68/255.
- Getting pixels out of the Gemini tab: fetch/XHR to localhost is blocked by
  CSP, and a `window.open` bridge was refused by the auto-mode classifier.
  Canvas `toDataURL` works but is too big to route through context. Use the
  download button.

**Next step: extract the trait layer.** Nothing is written for this yet.
1. Diff `fish-in-beak-take1.jpg` against `docs/trait-refs/ping-on-white.png`.
   Allow for JPG noise, so threshold around 25-40 and clean up the mask with
   a morphological open.
2. Restrict the diff to a mouth-region mask. Build alpha from the diff
   strength and take the colour from Gemini's pixels.
3. Map native 1024 to trait space with `trait = native * 1.5682 - 229.4`
   onto a 1147 transparent canvas, and save it as
   `public/traits/trait-fish-in-beak_mouth.png`.
4. **Watch for:** if Gemini redrew the beak, the diff picks up a ghost beak
   inside the mask. Check the extracted layer on its own before compositing.
5. Run the gates:
   - `check-eye-clearance`
   - `node scripts/sim-builder.mjs out.png <trait>` at 599. It's new,
     persisted from scratch work and checked against a real capture.
   - The 512 contact sheet next to cigar/joint/lollipop/whistle.
   - The real builder capture (8790, PORT=9912).
   - `generate-index`
   - One wrangler render.
6. Show the owner, then repeat for the other mouth concepts, then the other
   categories. Commit only on a yes.

In `.trait-work/gemini/` you'll also find the reference images that were
attached in Gemini: `ref-cigar`, `ref-ciggy` and `ref-beard` on white, and
the sheet at 1600.

## Mouth batch 1, 2026-09-11 (after fish-in-beak)

**Shipped:** `fish-in-beak` (commit 1b1b0e7), with
`scripts/extract-trait-from-edit.mjs <category> <edit.jpg|png> [--name] [--box] [--debug dir]`.
The copy count is now 239.

**Waiting on the owner's yes (in `public/traits/`, uncommitted):**
- `rose` - the stem runs behind the beak. It fits the canvas and is 38.6px from the eyes. The strongest of the batch.
- `toothpick` - from Gemini's first, unframed image (1200x896, beige background,
  `.trait-work/gemini/toothpick-take0-unframed.jpg`). It was registered onto the base (scale 0.935, offset -49,101, fitted
  on the diff outside the mouth), saved as `toothpick-take0.png`, then extracted. It's clean, but its outline
  is thinner than the originals'.
- Before committing: run the builder capture and a wrangler render on both. Adding them takes
  the copy count to 241 while the five rejected mouths are still live.

**Wheat-stalk: the owner likes the look. Redo it.** `.trait-work/gemini/wheat-stalk-take1.jpg`
reaches native x=906, but the trait canvas ends at about 878, so the head gets clipped. Ask Gemini
for the same wheat-stalk with the whole stalk ending before about 80% of the image width.
The rejected extraction is in `.trait-work/extract/`.

**Still to generate:** party-blower, gold-beak-ring, pacifier, bubble-pipe.

**Gemini driving notes:**
- Claude-in-Chrome needs its own tab group. Open gemini.google.com/app in it.
- File upload: the input only exists after you click "Upload files", which opens a native picker.
  Hook `HTMLInputElement.prototype.click` so that for `type=file` it just keeps the input,
  click the menu item, then `file_upload` to that input. It's the second `input[type=file]`,
  and its accept list is empty.
- Paste long prompts through the clipboard (`Set-Clipboard`, then ctrl+v). Send with the "Send message" ref.
- A batch prompt ("separate images, one per concept, not a sheet") works. Gemini
  also sent one stray extra image, and that stray was the good toothpick.
- Every download from one reply has the same filename
  (`Gemini_Generated_Image_<id>.jpg`), so move each file out of Downloads before the next click.
- Check framing: Gemini sometimes returns a different size or background. Register it
  onto the base as above, and don't reject it for that alone.

**Extractor notes:**
- The mouth box is now [380,340,878,625]. Check the component list: a blob that touches the box edge
  means the prop was clipped, or it runs off the canvas.

## Mouth batch 2, 2026-09-11 (later session)

**Owner verdict (2026-09-11):**
- YES: toothpick, rose, wheat-stalk, party-blower, bubble-pipe. These PNGs are in `public/traits/`,
  still uncommitted.
- NO: gold-beak-ring. Its PNG was moved to `.trait-work/rejected/`. Don't reroll it.
- MAYBE: pacifier, if it's made smaller. The current PNG is still in `public/traits/` and must not ship
  as is.

**Next session, in order:**
1. Pacifier: ask for a smaller one in the fish chat (`/app/a79ee6352abc0cf5`), same short prompt as
   before plus "about half the size, a small pacifier on the beak tip that leaves most of the lower
   face visible". Register, extract with `--box 380,260,878,625`, send a builder-size sheet
   (`.trait-work/review.mjs`) for a yes. If it isn't clearly better, drop it and move its PNG to
   `.trait-work/rejected/`.
2. Take a real builder capture (`scripts/capture-builder-receiver.mjs`) and a wrangler render of the
   accepted mouths. Nothing from this batch has had either yet, only sim-builder.
3. In one commit: add the accepted mouths (5, or 6 with pacifier), cut the five rejected expressions
   (smile, smirk, open-laugh, gap-tooth, gold-tooth: PNGs plus their entries in
   `generate-mouths-from-beak.mjs`), regenerate the index, and update the six copy sites.
   Count: 239 + 5 - 5 = 239, or 240 with pacifier. Confirm with `check-copy-count.mjs`.
   Commit `scripts/register-edit.mjs` and the `--behind-beak` change with it.

The notes below were written before the verdict.

All uncommitted, in `public/traits/`, waiting on the owner's yes along with rose and toothpick
(review sheets were sent at builder size; `.trait-work/review.mjs out.png <names...>` rebuilds one):
- `wheat-stalk` (take 2) - Gemini shrank the penguin and pointed the beak. Registered, then extracted
  with `--behind-beak`, so the stalk comes out from behind the real beak's corner. 32.7px from the eyes.
- `party-blower` - pixel-exact framing, `--box 380,260,878,625` so the curl and motion lines aren't clipped.
- `gold-beak-ring` - exact framing, but **Gemini reshaped the beak to a point**, and that ghost beak is
  in the layer. Probably needs a new take.
- `pacifier` - clean, but large: it covers most of the lower face.
- `bubble-pipe` - clean, `--box 380,150,878,625` for the bubbles. The pipe reads as a tobacco pipe.

The committed library is 239 (fish-in-beak included). See the verdict above for the final count.

New tools:
- `scripts/register-edit.mjs <edit> <out.png> [--box]` fits scale+offset of an edit onto
  `ping-on-white.png` (from the silhouette bbox and from identity, keeping the better), grid-refined on
  the diff outside the box. Under ~1/255 is a good fit; 4+ means Gemini redrew the penguin: reject.
- `extract-trait-from-edit.mjs --behind-beak` takes the base beak (orange fill + outline) out of the
  region. Use it for props that pass behind the beak when Gemini redrew the beak.

**Gemini, what works:** continue the "Adding a Fish Trait to Penguin Mascot" chat
(`/app/a79ee6352abc0cf5`) with a short prompt that says "Start again from image 1 (the plain penguin),
not from any image you made", names one trait, restates the framing rules. 4 of 4 came back at exact
framing (diff 0.12-0.17/255). The batch chat drifts (sheets, restyled penguin) and a fresh chat with the
long prompt redrew the penguin. The Send button appears a moment after the paste; click it by
`button[aria-label="Send message"]` in JS.

## All categories via Gemini, 2026-09-11 (third session)

Everything below is **uncommitted** in `public/traits/`. Nothing gets committed without the owner's yes
on builder-size sheets. Raws and registered edits are in `.trait-work/gemini/<name>-take<n>[-raw].png`.
Review sheets are in `.trait-work/extract/`.

**Status per category** (sheets marked "sent" went to the owner; no verdicts yet):
- mouth: pacifier take 2 (smaller) sent. The 5 accepted mouths are still waiting on the commit from
  "Mouth batch 2".
- head (sent, `head-review.png`): ushanka, headphones, traffic-cone, eggshell, beret, santa-hat,
  bunny-ears, mohawk.
- face (sent, `face-review.png`): dollar-eyes, ski-goggles, aviators, vr-headset, snorkel-mask (take 2),
  eye-bags, band-aid (take 2).
  - dollar-eyes, goggles, aviators and snorkel all overlap the beak top, as pit-vipers does.
  - band-aid landed on the chin twice; the cheek gap is too small for Gemini.
- body (sent, `body-review.png`): puffer-jacket, gold-chain, overalls, varsity-jacket, lab-coat,
  knit-sweater, tracksuit, cape. All first takes, fit 0.06-0.19. Lab-coat hem grazes the feet top.
- right_hand (sent, `right-review.png`): pickaxe, smartphone (take 2), microphone, fish, megaphone
  (take 2), magnifying-glass (take 2, fit-right 0.93x), rubber-duck, baguette (fit-right 0.92x).
  Gemini often extends the flipper a little to grip.
- left_hand (**not sent yet**): snowball, piggy-bank (take 2), briefcase, lantern (take 2), teddy-bear,
  calculator, banana. Water-balloon hasn't been generated yet.
  - Calculator: Gemini put it on the right twice, even when told "left half". So take 2 was extracted
    as right_hand, flopped onto the left flipper (mirror axis native x~500, trait shift 38px), then
    scaled 0.88x about its bottom-right.
  - Banana: the current PNG is take 1, and its tip crosses onto the belly, so it's a reject. Take 2
    (hanging outside the body) is generated in the chat but was never captured.
  - `piggy-bank-take1-raw.png` is a wrong-side junk take. Ignore it.
- accessory, aura: not started.

**Region boxes that worked** (`take.sh` passes them to both register and extract):
- head: `--box 180,0,840,600 --fit-top 165`, plus `--fill-enclosed` for white fills.
- face: `--box 280,250,750,560`. Snorkel used `250,146,800,560`.
- body: `--box 230,400,790,790`. Cape used `170,380,860,800`. Add `--fill-enclosed` for white fills
  (lab-coat).
- right_hand: `--box 590,146,1023,820 --fit-right 862`.
- left_hand: `--box 0,146,440,1023 --fit-left 162`. y1 must be 1023, or items hanging below the feet
  get cut (lantern).
- Review: `LEFT=<x> TOP=<y> node .trait-work/review2.mjs out.png name_cat...` sets the 2x crop.
  - body: TOP=210.
  - right: LEFT=239 TOP=150-170.
  - left: LEFT=0 TOP=200-230.

**New flags in `extract-trait-from-edit.mjs`:**
- `--fill-enclosed`: fills white-on-white areas inside the trait.
- `--fit-top Y`: scales about the bottom centre.
- `--fit-right X` / `--fit-left X`: scale about the bottom corner nearest the body.
- `--max-hole N`.

`register-edit.mjs` and all these extractor changes are still uncommitted.

**Gemini automation (Claude-in-Chrome):**
- Chats: face `/app/1fdef9131e2fd080` (drifted at about 21 edits), hands `/app/588081c59ab05e8b`
  (18 edits so far). **Start a fresh chat per category** (accessory, aura). To set one up:
  1. Hook `HTMLInputElement.prototype.click` for type=file *after* the page has loaded.
  2. Click "Upload & tools", then "Upload files".
  3. Aria-label the hooked input and `file_upload` `docs/trait-refs/ping-on-white.png` and
     `originals-sheet.png` into it.
  4. Send the intro line plus the first trait.
- Page helpers (they're lost on every navigation): `cnt`, `markNewest`, `settle`, `poll`, `send`,
  `rules`, and a category wrapper.
  - The source is in this session's transcript and in the face/hand chats' first messages.
  - The wrapper tells Gemini: start again from image 1, keep the framing identical, the flipper stays
    down.
- Per trait:
  1. `send(...)`, then `await poll(__n0)`.
  2. Screenshot, then `await settle()`. The hidden tab stalls animations until a frame is forced.
  3. Get the "Copy newest image" ref. Use `read_page filter=interactive`, not `find`: `find` calls a
    model and hit a rate limit.
  4. Click it, then run `powershell -STA -File .trait-work/clip.ps1` with the PowerShell tool.
  5. `sh .trait-work/take.sh <cat> <name> <n> <opts>`.
- Gotchas:
  - Scaled screenshots (0.3) seem to shrink the tab's viewport step by step (1568 to 193 to 82px). At
    that size Copy fails silently. Use scale 0.5 or more; if `innerWidth` collapses, open a fresh tab.
  - Closing the last tab in Claude's group deletes the group. Open the new tab first, then close the
    old one.
  - Two orphan Gemini tabs from this session may still be open outside the group.
  - Always check the fit line from take.sh. 1-3/255 means Gemini restyled the penguin (the lantern
    take 1 turned grey). Also check the side: "viewer's LEFT" gets ignored, so say "the left half of
    the picture, where the teddy was".
- **Blocker at handoff: the Windows clipboard is wedged.** Every OpenClipboard fails and no owning
  window is reported, probably Chrome stuck mid-copy from a frozen renderer. Restart Chrome or copy
  something by hand to clear it.
  - A local receiver doesn't work: `.trait-work/recv.mjs` on port 9913 was started, but Gemini's page
    can't fetch localhost ("Failed to fetch"). Kill it if it's still running.
  - Other fallback: allow multiple downloads for gemini.google.com in Chrome site settings, then use
    "Download full size image" (take.sh also picks up `Gemini_Generated_Image_*.jpg`).

**Next session, in order:**
1. Clear the clipboard, then capture banana take 2 and redo `take.sh left_hand banana 2`. Generate
   water-balloon. Send the left_hand sheet.
2. Accessory in a fresh chat. Items stand on the ground line beside the penguin at 1/3 to 1/2 of its
   height, and must not touch it. Check the box on first use; `REGIONS.accessory` is
   `146,525,878,878`.
3. Aura in a fresh chat, drawn behind the penguin. Review with the `--aura` preview.
4. Collect verdicts, then: builder capture plus wrangler render, generate-index, cut the 5 rejected
   mouths, update the copy sites (`check-copy-count.mjs`), and commit the tools with the traits.
   Rejects go to `.trait-work/rejected/`.

## Shipped, 2026-09-11 (fourth session)

**Pushed to `relaunch/robinhood-chain`:**
- `4c36803`: the 53 traits from the vetted sheets (`.trait-work/extract/vetted-{1,2,3}.png`). That's
  6 mouth (incl. pacifier take 2), 8 head, 7 face, 8 body, 8 right_hand, 8 left_hand and 8 accessory.
  - The five rejected mouths (smile, smirk, open-laugh, gap-tooth, gold-tooth) are cut, PNGs and
    generator entries.
  - The tools went in with it: `register-edit.mjs` and all the extractor flags.
- Second commit: six auras the owner approved ("very good job on the aura set"). Five are
  full-canvas: northern-lights, money-rain, green-candles, confetti, bubbles. hearts is a huge halo.
- Library: 239 -> 287 -> 293. The copy is updated, tests 101/101, the build is clean.
- No real builder capture or wrangler render was taken. The sheets use sim-builder geometry.

**Waiting on the owner (parked in `.trait-work/pending/`, not in `public/traits/`, so generate-index skips
them):** six extra full-canvas auras, sheet `.trait-work/extract/aura-extra.png`: to-the-moon, synthwave,
blizzard, gold-hoard, fireworks, deep-sea. All fit ~1.7/255. The to-the-moon rocket is clipped at the
top-right corner in the builder crop. To ship the approved ones:
1. Move them back to `public/traits/`.
2. Run `node scripts/generate-index.mjs`.
3. Bump the count in the 4 copy files (`check-copy-count.mjs` lists them), run `npx vitest run`, and
   commit.

**Owner direction:** auras should be "cool", and can be full images. Full-canvas backgrounds are the
most reliable Gemini output so far: the framing stayed exact on 11 of 12.

**New tool flags:**
- `register-edit.mjs --penguin` fits on the penguin's own pixels only (the base silhouette, eroded
  4px), with a coarse scale/offset grid search.
  - Use it whenever the background isn't white.
  - The fit line is then the mean diff inside the penguin. ~1.7 is normal; 12 meant Gemini moved and
    greyed the penguin, so reject.
- `extract-trait-from-edit.mjs --full` makes the whole edit an opaque layer. The penguin silhouette
  (+3px) is filled from the surrounding background, so no ghost outline is possible.
  - Command: `sh .trait-work/take.sh aura <name> <n> --box 0,0,1023,1023 --full --penguin`
  - For a halo aura drop `--full`, and keep `--penguin`.
  - The eye-clearance FAIL on full auras is expected: the aura sits behind the penguin.
- `extract-trait-from-edit.mjs --ground Y` moves accessories straight up or down so their bottom sits
  on native Y=750, the feet line.
- `.trait-work/sheet.mjs out.png "Title" name_cat[:note] ...` builds a contact sheet at builder
  geometry, drawing auras behind the penguin.
  - Set `DIR=.trait-work/pending` to read from elsewhere.
  - A note turns the label brown.

**Gemini automation, what worked this session (Claude-in-Chrome, tab in Claude's group):**
- The aura chat is `/app/5daaaf9b1a9abe8b`. Both reference images are already uploaded there.
- Page helpers are lost on navigation. Rebuild them from `send`/`poll`/`markNewest` in the earlier
  section; `__poll` must cap at 35s because JS calls time out at 45s. Aura prompts:
  - `__wrapV(item, full)` = "New trait. Start again from image 1 (the plain penguin on white), not from
    any image you made. Add ONE aura trait: " + item + " " + (full ? RULES_FULL : RULES_HALO).
  - RULES_FULL: "The aura is drawn BEHIND the penguin: the penguin stays completely on top and exactly
    unchanged, nothing covers its face, body, flippers or feet. Make it bold and striking, the kind of
    background that makes the penguin look cool. It fills the WHOLE square picture edge to edge and
    replaces the white background completely, the way american-aura in image 2 fills the whole frame.
    Same hand-drawn style as image 2: chunky wobbly black marker outlines on the big shapes, bright
    saturated colours, soft gradients and a little grain allowed. No text, no logos, no ground or floor
    line, no other characters. Keep the framing identical to image 1: same square canvas, same penguin
    size, position and pose. Do not redraw, recolour, re-outline or restyle any part of the penguin, and
    put no glow or shadow on it. Output exactly one edited image with one penguin."
  - RULES_HALO: the same, but "a HUGE halo that fills most of the picture and reaches close to all four
    edges, much bigger than fire-aura, like coral-aura in image 2. Thick chunky black outer outline...
    Outside the halo the background stays plain white."
  - If Gemini moves the penguin, add: "IMPORTANT: the penguin is pasted in exactly as it is in image 1:
    same size, same centred position, same pure black body, no grey tint and no glow on it."
- Per take:
  1. Send, then `await __poll()`.
  2. Wait ~8s, run `__mark()`, and take a screenshot at scale 0.6. If the image is still dim, wait again.
  3. `read_page filter=interactive` to get the "Copy newest image" ref, then click it. The ref goes up
     by ~20 per response.
  4. PowerShell: `Start-Sleep -Milliseconds 1500; powershell -STA -File .trait-work/clip.ps1`.
  5. Bash: `take.sh`.
  - Send the next prompt while take.sh runs.
- Gotcha: once the clipboard held a 1542x249 strip instead of the image (fit 134/255). If a fit is
  wild, check the raw's dimensions, delete the take, and click Copy again.
- Parallel agents are unsafe: the clipboard and `Downloads/Gemini_Generated_Image_*` are shared.
  Before going parallel, take.sh needs per-agent file paths plus a mkdir lock.

**Next session:**
1. Get the owner's verdict on the 6 extra auras. Ship the yeses (steps above); rejects go to
   `.trait-work/rejected/`.
2. Ask the owner what to generate next. Candidates:
   - More full-canvas auras: lava, vaporwave, jungle, city-night, pixel-sky, rainy-window.
   - A second round of hands, heads and accessories. Brainstorm the concepts first and check them
     against the 293 existing traits for duplicates.
   - Rerolls of the weaker ones: snowman, gold-bars and lawn-flamingo accessories are small;
     band-aid sits on the chin; the mini-fridge glow is clipped at the left edge.
3. Optionally, a real builder capture (`scripts/capture-builder-receiver.mjs`) of a few new traits, to
   confirm the sim.

## Fifth session, 2026-09-11: auras shipped, 8 new auras pending, full vetting pass

**Shipped:** `d75f17c` (pushed): the six extra full-canvas auras (to-the-moon, synthwave, blizzard,
gold-hoard, fireworks, deep-sea). Library 293 -> 299, copy check passes, tests 101/101. Nothing since.

**Waiting on the owner (nothing committed):**
1. **8 new full-canvas auras** in `.trait-work/pending/`, sheet `.trait-work/extract/aura-batch5.png`:
   volcano, jungle, neon-city, pixel-sky, red-candles, cherry-blossom, desert, haunted. All registered at
   s=1, d=0. To ship: same three steps as the fourth session (move to `public/traits/`, generate-index,
   bump the 4 copy files, vitest, commit).
2. **Vetting verdicts.** Two independent passes (7 Sonnet agents, then 3 Opus agents) over all 299 traits.
   Findings per category are in `.trait-work/vet/<cat>-findings.md` (pass 1) and `-findings-v2.md` (pass 2).
   Consolidated sheets:
   - `.trait-work/extract/vet-remove.png`: 25 REMOVE, both passes agree.
     - aura (7): bazooka, link, sunrise, yellow, color, storm, shadow (near-dupes of fire/ice, or weak).
     - accessory (5): chill-guy, cirno-fumo, reimu-fumo-(left), reimu-fumo-(right), reisen-fumo.
     - body (4): wif-tattoo, pump-fun-tattoo, reimu-x-soldier-tee, reimu-x-wif-tee.
     - face (2): helm-of-domination, monocle.
     - right_hand (3): gun-hand, side-gun-hand, green-candle-injection.
     - left_hand (4): gun-hand, side-gun-hand, poobis, green-candle-injection.
   - `vet-fix-1.png`, `vet-fix-2.png`: FIX or the owner's call.
     - Fixable gaps (shift onto the flipper): devil-trident, drumstick, both sparklers, money-bag, flower,
       bong, rubber-duck.
     - Style: gloss or shading on santa-hat, headphones, doom-helmet, master-chief-helmet, infinity-gauntlet.
       Thin lines on girl-eyes, nerd-glasses, jBL-speaker, hello-kitty-mask, persianliion. Blur on
       mF-dOOM-mask. Low-res m16, grenade. Stray dot on sayian-1. Cheese-grate-hat text unreadable.
     - All 6 fumo hands are on the sheet, so they get the same verdict as the fumo accessories.
     - ping-gameboy and its pink twin: keep both?
   - To remove the approved ones: move the PNGs to `.trait-work/rejected/`, run generate-index, set the copy
     count to 299 - N (+ any auras shipped), vitest, commit. Check `scripts/` generators for entries by name,
     as was done for the cut mouths.

**Gemini, what changed:**
- The old aura chat `/app/5daaaf9b1a9abe8b` drifted at ~22 edits: it returned widescreen images with a
  redrawn penguin twice. **The new aura chat is `/app/02ba2598ce24ac78`**, with both refs uploaded; 2 edits so far.
- **Uploads no longer work through the file input.** The hooked input gets the files, but Gemini ignores
  its change event. What works:
  1. On `/app`, hook `HTMLInputElement.prototype.click` for type=file.
  2. Click "Upload & tools". Take a screenshot to force a frame, then `read_page` shows the menuitem
     "Upload files". Click it by ref; the hook captures the input.
  3. Move the input to `document.body`, remove its `aria-hidden`, and `read_page` gives it a ref.
     `file_upload` both refs into it.
  4. Build a `DataTransfer` from `input.files` and dispatch `new ClipboardEvent('paste', {clipboardData})`
     on `rich-textarea .ql-editor`. Both images attach.
- Helpers: `.trait-work/helpers.js`. Paste it into `javascript_tool` after every navigation. It also adds
  `__SQ`, a "square 1:1 only" line appended to both aura rule sets.
- `.trait-work/ta.sh <cat> <name> <n> <take opts>` wraps take.sh: it prints the fit line and the raw's
  dimensions, then parks the result in `.trait-work/pending/`.
- Full-aura fit: 7-9/255 with s=1, d=0 was only Gemini tinting the penguin grey. The aura layer's
  silhouette is filled from the background, so the tint never shows. Reject only when the penguin moves or
  scales, or the image isn't square.
- Tab-group gotcha: closing the old tab killed the group even though a new tab had just been created
  (the new tab wasn't in the group). Create tabs with `tabs_context_mcp createIfEmpty` after the close instead.

**Next session:**
1. Get both verdicts above; ship the aura yeses and apply the removals in one commit each.
2. For FIX items the owner keeps: shift or scale them onto the flipper with a small sharp script, make
   before/after sheets.
3. More generation from `.trait-work/concepts.md`: 15 aura ideas plus 12 per other category, top 6 starred,
   dupe-checked against the list. Aura ideas not yet tried: tie-dye, laser-rave, black-hole, matrix-code,
   candyland, meteor-shower, comic-burst, casino-jackpot. Non-aura categories need a fresh chat per
   category, set up with the paste trick.

## Sixth session, 2026-09-12: auras shipped, 11 cut, launch config, flipper fixes

Four commits, **not pushed** (pushing `relaunch/robinhood-chain` auto-deploys to
production, so that stayed the owner's call). Library **299 -> 298**.

**`35ddae5` — 8 full-canvas auras in, 11 traits cut.**
In: volcano, jungle, neon-city, pixel-sky, red-candles, cherry-blossom, desert,
haunted (the batch parked in `.trait-work/pending/` last session).
Cut, on the owner's verdict over `vet-remove.png` and a follow-up sheet:
- The entire small-gradient-halo aura family: `bazooka`, `storm`, `shadow`,
  `toxic`, `ice`, `holy`, `galaxy`. The owner's words were "all auras that look
  similar to storm/shadow should be removed"; a sheet of the 16 old auras
  (`.trait-work/extract/aura-halo-family.png`) settled the boundary at "the
  whole first row". Their `CONCEPTS` entries are gone from
  `generate-aura-traits-svg.mjs`, not just the PNGs.
- `green-candle-injection`, both hand slots.
**The rest of the two vetting passes' 25-item REMOVE list was reviewed and
KEPT** — the fumos, chill-guy, the tattoo/crossover tees, helm-of-domination,
monocle, both gun-hands and poobis all stay. Do not re-propose them.

**`b167340` — `launch.config.mjs`, one file to edit at launch.**
The five launch-day values (`tokenLive`, `contractAddress`, `chartLink`,
`countdownTarget`, `showCountdown`) sit at the top under a commented block
saying what each does; chain/launchpad/social/domain facts below. No values
changed — `tokenLive` is still false.
Plain ESM, not JSON or TS, because the four consumers share no module graph:
Vite-bundled `src/`, esbuild-bundled Pages Functions, plain `node scripts/*.mjs`,
and static `index.html`. The last can't import anything, so a Vite plugin swaps
`__TRAIT_COUNT__` / `__SITE_URL__` at build time.
**The trait count is deliberately NOT in the config.** It is derived from
`public/traits-manifest.json` everywhere, so the four-file hand-typed
duplication is structurally impossible now. `check-copy-count.mjs` was
rewritten to police the new invariant instead: it fails if a literal count
reappears in a file that should derive it, and `--post-build` checks
`dist/index.html` actually got substituted. **You no longer bump a count by
hand when the library changes.**
Also folded in: `functions/_lib.ts` had its own hand-synced copy of
`EMPTY_TRAIT_CHANCE` (with a comment admitting it mirrored constants.ts) —
now imported. And the root `tsconfig.json` stray `moduleResolution` +
trailing comma, listed as "never actually fixed" since 2026-09-10, is fixed;
`npx tsc --build` works.

**`9f1fd2b` — seven held props moved onto the flipper tip.**
sparkler (both), money-bag, flower, bong, drumstick, rubber-duck. Each prop's
own grip point — stick end, stem base, bag neck, handle end — translated onto
the flipper tip for its slot (left tip native `(297,595)`, right `(706,575)`,
mapped through the compositor's fraction formula
`frac = 1.4*(native/1024) - 0.2`). No scaling needed.
`devil-trident` was left exactly as shipped, by the owner's call.
New tool: `scripts/shift-trait.mjs --dx N --dy N --out-dir DIR <trait>` —
translate a finished trait without re-authoring it. `rescale-trait.mjs` could
only scale about an anchor.

### The measurement lesson from this session

The first attempt at the flipper fix measured **nearest opaque pixel to a 45px
radius around the flipper tip**, got 0.0px for seven of the eight, and
concluded they were already correct and the vetting pass was wrong. It wasn't.
A prop can overlap the body silhouette anywhere along its height and score zero
while its grip point floats somewhere else entirely — the sparklers scored 0.0px
while sitting at *head height*. **Measure the grip point, not the silhouette.**
This is the same shape of error as the four bugs at the top of this document:
a number that is technically correct answering a question nobody asked. The
defect was obvious the moment anyone looked at a composited contact sheet.

### Still open

- **`matrix-code` aura** in `.trait-work/pending/`, unreviewed. Salvaged from a
  Gemini run that was stopped early for budget. Sheet:
  `.trait-work/extract/matrix-check.png`.
- **Style fixes not done**: `shopping-cart`, `laser-eyes`, `hello-kitty-mask`,
  `nerd-glasses`. The owner asked for these; the agent doing them was stopped
  for budget before producing anything. Thin lines / unreadable at render size
  is the recorded defect. A raster dilate of the dark pixels is the approach —
  see `.trait-work/measure-strokes.mjs` for the measurements.
- **`.trait-work/next-batch.md`**: 67 dupe-checked concepts across all 8
  categories, each with a Gemini prompt phrase and the region-box flags for
  `take.sh`. Ready to run; no thinking needed before starting.
  Category counts, thinnest first: mouth 16, aura 30, face 34, accessory 38,
  left_hand 41, head 44, body 44, right_hand 53.
- **Never done on any trait since the 53-trait batch**: a real builder capture
  or a `wrangler pages dev` render. Everything since has been verified on
  sim-builder geometry only.
- **The X share button still tags `PING,Solana,Crypto`**
  (`src/components/CharacterPreview.tsx:410`) — left over from the Solana era.
  Flagged to the owner, not changed.
- `.trait-work/` is now gitignored. `check_gap.mjs` at the repo root is a stray
  scratch file from an earlier session; nobody has claimed it.

### Working note on agents

`.trait-work/take.sh` still shares the clipboard and
`Downloads/Gemini_Generated_Image_*` globally, so Gemini capture remains
strictly one agent at a time. Everything else in this session parallelized
fine. The owner's standing direction as of this session: **decompose work into
pieces small enough for a weak model** — one exact command, one verifiable
output, no judgment calls inside the task.

## Sixth session, continued: OG copy, aura batches 6 and 7

**`2a81b06` — the trait count is out of the share copy.** The meta/OG/twitter
descriptions and the OG banner quoted a live count. The number was correct
(derived from the manifest) but a share card is the wrong place for it: every
platform that scrapes the card caches the description and re-serves it for
months, so whatever ships is wrong out in the world regardless of how
correctly it was derived. Copy is now durable and count-free — "Build your own
PING. A trait editor, an open image API, and a token on Robinhood Chain." and
"Eight slots. Endless characters." **The on-page copy still quotes the derived
count** — that's read live, so it's accurate whenever anyone looks.
`check-copy-count.mjs` now guards both directions and takes `--file` so its
three failure modes are covered by fixtures in `scripts/fixtures/`.

**14 auras pending review** in `.trait-work/pending/`, none shipped:
- batch 6 (`.trait-work/extract/aura-batch6.png`): rave-lasers, server-room,
  cherry-soda, candy-land, autumn-leaves, lava-lamp, void.
- batch 7 (`.trait-work/extract/aura-batch7.png`), replacements for the orphan
  flame-halos: tie-dye, black-hole, meteor-shower, comic-burst, casino-jackpot,
  crystal-cave.
All 13 came back first-take at s=1, d=0, fit 1.6-1.8/255. `void` scored 17/255
purely because Gemini drew a bright rim-light against pure black and a hard
black-to-white edge maximizes per-pixel diff — penguin unmoved, image square,
so it passes the real reject bar. **A high fit is not automatically a reject:
check whether the penguin moved or scaled before rerolling.**

### Owner directives from this session

- **Regeneration, not removal, for 16 traits.** All 6 Hello Kitty traits,
  `master-chief-helmet`, `infinity-gauntlet`, `redbull` (both hands), and the 6
  orphan auras. The auras are covered by batch 7 above. The other 10 need
  replacement *concepts* designed before anything is generated — "replace Hello
  Kitty" is a design decision, not a prompt. Open question put to the owner:
  fill the six slots with unrelated ideas, or invent one original mascot and
  reuse it across all six the way Hello Kitty was.
- **The fit audit is done** — `.trait-work/audit/does-not-fit.md`, 43 traits
  across 4 reasons, sheets `fit-1/2/3.png`. Owner has ruled only on the 16
  above; the rest of the list (the other trademark cases, the Solana-era five,
  the two flag auras) is still awaiting a verdict.
- **New working mode:** generate in bulk, self-vet, and leave sheets for the
  owner to review in the morning rather than asking per-trait. Note the honest
  limit — mechanical defects (framing, clipping, eye clearance, empty layers,
  duplicates, grip point) can be vetted automatically; "uncanny" cannot, and
  that is the axis that killed five rounds of mouth work. Expect sheets to be
  filtered, not pre-approved.
- **Decompose work small enough for a weak model**: one exact command, one
  verifiable output, no judgment inside the task. Two haiku agents did the
  stroke measurements and the dilate script this way in seconds.

### Gemini gotchas found this session (new, beyond the fifth-session list)

1. **A JS `.click()` on "Copy newest image" is not a trusted user gesture.**
   The clipboard write silently no-ops and `clip.ps1` picks up the *previous*
   image. Use a real `computer.left_click`, taking a screenshot first to
   convert the button's `getBoundingClientRect()` into the screenshot's
   coordinate frame (the ratio was consistently `1568/innerWidth`).
2. **The tab viewport can collapse to near-zero at any screenshot scale**, not
   just 0.3 as previously documented — it happened at 0.5, and `resize_window`
   did not fix it. The fix is still a fresh tab: create it *and navigate it*
   before closing the old one, then re-check `tabs_context_mcp` afterwards.
3. Enter on a wrongly-focused element opens Gemini's full-screen image editor
   instead of copying. Recover with the back arrow at the top left.
4. `Page.captureScreenshot` and `zoom` time out ("renderer may be frozen") on
   backgrounded tabs; retrying the same call usually works a moment later.
5. `document.visibilityState` can sit at `"hidden"` on the working tab even
   when it is the only selected tab in the group. Clipboard writes still work
   once the button is properly focused.
6. The first Copy click of a session often leaves the clipboard empty — click
   the same button a second time.

The aura chat `/app/02ba2598ce24ac78` is at roughly 17 edits with no drift
symptoms yet, but that is close to the ~20 where previous chats went bad.
**Start a fresh chat before the next batch.**

## Next session: start here

### State at handoff (2026-09-12)

- **Library: 298 traits.** `node scripts/generate-index.mjs` regenerates the
  manifest and the 512 renders; the count is derived from the manifest
  everywhere, so nothing needs bumping by hand.
- **7 commits on `relaunch/robinhood-chain`, NONE PUSHED.** Pushing that branch
  auto-deploys to buildaping.com production, and the owner has not given the
  go-ahead. In order: `35ddae5` (8 auras in, 11 cut), `b167340` (launch config
  + derived count + tsconfig fix), `9f1fd2b` (seven props onto the flipper),
  `3479c6f` (handoff), `302c39e` (matrix-code in, laser-eyes out, two outlines
  thickened), `2a81b06` (trait count out of share copy), `774a2b3` (handoff).
- Gates all green as of the last commit: **107/107 tests**, clean build,
  `tsc --noEmit` clean on both projects, `check-copy-count` clean pre- and
  post-build.

### WARNING: `.trait-work/` is gitignored

Everything parked there is **local to this machine and not in any commit** —
the 13 pending auras, the audit, the review sheets, the Gemini raws, the
staged `.trait-work/fixflipper/` and `stylefix/` PNGs. A fresh clone has none
of it. Do not assume a file referenced in this document exists until you have
listed the directory. If the owner ever wants the pending work preserved
off-machine, that needs deciding — right now it is one `rm -rf` from gone.

### Blocked on the owner — nothing here should be guessed

1. **13 pending auras** in `.trait-work/pending/`, sheets already sent:
   batch 6 (`aura-batch6.png`) rave-lasers, server-room, cherry-soda,
   candy-land, autumn-leaves, lava-lamp, void; batch 7 (`aura-batch7.png`)
   tie-dye, black-hole, meteor-shower, comic-burst, casino-jackpot,
   crystal-cave. To ship the yeses: move to `public/traits/`, run
   `generate-index`, `npx vitest run`, commit. Rejects go to
   `.trait-work/rejected/`.
2. **The fit audit**, `.trait-work/audit/does-not-fit.md` — 43 traits flagged,
   the owner has ruled on 16 (regenerate, not remove). The remaining ~27 are
   unjudged: the other trademark cases, the Solana-era five (`solana-coin`
   both hands, `solana-tattoo`, `wif` x2 — the clearest cut in the library),
   and the two flag auras. Sheets are `fit-1/2/3.png`.
3. **10 trademark replacements need concepts designed before generating.**
   All 6 Hello Kitty traits, `master-chief-helmet`, `infinity-gauntlet`,
   `redbull` x2. The open question, already put to the owner and unanswered:
   fill the six Hello Kitty slots with unrelated ideas (a fox mask, three
   different print tees, a different keychain and pet), or invent one original
   mascot and reuse it across all six the way Hello Kitty was. **Do not pick
   unilaterally** — this is the same class of decision the earlier sessions
   correctly refused to make alone about flags and logos.
4. **Overnight run scope.** The owner asked for bulk generation, self-vetting,
   and sheets waiting in the morning, but has not said how many traits or
   which categories. `.trait-work/next-batch.md` has 59 concepts left across
   7 categories (mouth 8, face 9, accessory 8, left_hand 9, body 11, head 11,
   right_hand 7), all dupe-checked with prompt phrases and region boxes.
   **Honest limit to restate when this comes up:** mechanical defects can be
   vetted automatically (framing fit, clipping, eye clearance, empty layers,
   duplicates, grip point) but "uncanny" cannot, and that is precisely the
   axis that killed five consecutive rounds of mouth work. Sheets will be
   filtered, not pre-approved.

### Before generating anything

Start a **fresh Gemini chat**. `/app/02ba2598ce24ac78` is at roughly 17 edits
with no drift symptoms yet, but past chats went bad around 20, and drift is
expensive to detect late. Use the paste-upload procedure in the fifth-session
section — the file input no longer works. Read the two gotcha lists (fifth
session and the one above) before driving the browser; the untrusted-`.click()`
one in particular fails silently and produces a wrong trait with no error.

## Seventh session, 2026-09-12: Solana cut, mouth batch, a rebuilt Gemini path

**`02f01f2` — the five Solana-era traits are out.** `solana-coin` (both
hands), `solana-tattoo`, `wif_accessory`, `wif-tattoo-v2`. Owner ruled cut.
Deliberately kept: `wif-tattoo_body` and `pump-fun-tattoo_body` (earlier keep
ruling) and `reimu-x-wif-tee_body` (flagged under a different reason, still
unjudged). The three generator scripts mention solana-coin/solana-tattoo only
in comments, as the source of their registration measurements — provenance,
not generated output, so nothing regenerates them. Library 298 -> 293.

**Owner rulings this session:** ship the 13 pending auras minus whatever he
names as rejects (sheet `auras-pending-13.png` sent, verdict outstanding); cut
the Solana five (done); **keep the Hello Kitty traits** — "this is not a
commercial site", which also resolves 6 of the 10 trademark replacements, with
master-chief-helmet / infinity-gauntlet / redbull x2 not explicitly ruled on;
run **all 59** concepts from `.trait-work/next-batch.md`.

**Mouth batch done: 8 of 8, all first takes**, fits 0.12-0.35/255, parked in
`.trait-work/pending/`, sheet `.trait-work/extract/mouth-batch8.png` sent.
corn-cob, straw-drink, candy-cane, carrot, ice-pop, paperclip-bite,
birthday-candle, harmonica. Every one clears the 512 bar with room to spare
(smallest, straw-drink, is 126x70 at 512 against a 53x14 beak). Chat is
`/app/72d6849382a5d5ad`.

### The Gemini automation path changed. Read this before driving the browser.

The fifth-session procedure no longer matches what the page does. What
actually works now, found the hard way:

1. **A trusted click only lands if a screenshot is taken immediately before
   it, in the same batch.** This is the single most important fact here.
   Without the preceding screenshot the click is delivered, reports success,
   and reaches no element at all — `document.addEventListener('click')` sees
   nothing. Every failed click in the first hour of this session was this.
2. **Send with the Enter key, never by clicking the send button.** Focus the
   editor, collapse the selection to the end, and press Return with a real
   `computer.key`. The window's `innerWidth` flips between 2560 and 2844
   between calls, which silently invalidates any coordinate measured in a
   previous call — the send button was the most frequent victim. Enter needs
   no coordinates and has not failed once.
3. **The paste-upload trick is obsolete.** Plain `file_upload` into Gemini's
   own live file input attaches the files directly. The critical detail the
   old procedure got wrong: **do not move the input in the DOM.** Appending it
   to `document.body` detaches it from its Angular component and it stops
   working — that is why the old notes needed the `ClipboardEvent` paste at
   all. Restyle it in place (`position:fixed;z-index:99999;opacity:1`) so it
   gets an accessibility ref, then upload into it. Setup:
   - navigate to `/app`, screenshot, measure "Upload & tools" with
     `getBoundingClientRect()` scaled by `k = 1568/innerWidth`, screenshot,
     click. `input[type=file]` appears (two of them).
   - `fileinput0`, the one inside `IMAGES-FILES-UPLOADER`, is the composer's.
     Label it, `find` its ref, `file_upload` both refs into it. They attach.
   - Verify the count before sending: `img[src^="blob:"]` must be exactly 2.
     Retried paste attempts queue up silently — one run left 5 attachments,
     which breaks "image 1"/"image 2" addressing.
4. **Never close a tab.** `tabs_close_mcp` destroyed the whole MCP tab group
   twice, orphaning the working tab, even with two tabs in the group. Leave
   stale tabs open; the cost is clutter, the cost of closing is the group.
5. **Keyboard focus cannot be used for Copy.** Focusing the copy button and
   pressing Enter fails: Gemini pulls focus back to the prompt editor within
   the same tick, so Enter goes to the composer. Copy still needs the
   screenshot-then-click coordinate path.
6. **Re-measure the copy button after every generation**, with a screenshot
   forcing a frame first. Element rects read as `0x0` on this tab until a
   screenshot forces layout, and the image size varies (708px and 807px both
   seen), which moves the toolbar. A stale coordinate copies the *previous*
   image — `take.sh`'s repeat guard catches it, which it did once here.
7. "Download full size image" is not a usable fallback. The download stalls
   as a `.tmp` in Downloads awaiting a Chrome permission that never surfaces.
8. `Page.captureScreenshot` still times out intermittently; retrying a few
   seconds later works, as previously documented.

### Working loop, per trait (5 calls)

1. JS: insert the prompt into `.ql-editor`, wait, refocus, collapse selection
   to end.
2. batch: screenshot, `key Return`, wait 10, JS poll for the copy button.
3. batch: screenshot, JS `__copy()` — marks the newest image and returns the
   button's coordinates.
4. batch: screenshot, click those coordinates, wait.
5. `powershell -STA -File .trait-work/clip.ps1`, then
   `sh .trait-work/ta.sh <cat> <name> <n> --box ...`.

Check `ta.sh`'s fit line every time. Non-aura: ~0.1-2/255 is a good register,
4+ means Gemini redrew the penguin.

## Sharing: stored cards at /p/<id> (2026-09-12)

The owner's requirement: **the only two buttons pressed are Tweet on
buildaping.com and Post on X.** No paste step, no extra tap.

That rules out the clipboard route (it costs a Ctrl+V) and the X API (pay per
post, OAuth consent, and it bypasses the composer entirely). It leaves the OG
unfurl - which already delivers two clicks - so the work was making the card
appear without a wait and without the failures. Research and citations:
`docs/research/sharing-ping-characters.md`.

**What was wrong.** `handleShareOnX` set an `image` param on the tweet intent.
The intent has never had one; it was a silent no-op, so nothing was ever being
attached. Hashtags still said `PING,Solana,Crypto`. Both fixed.

**What now happens.** Tweet click POSTs the trait selection to `/api/share`,
which renders the card **once, in that request**, verifies the body is not the
known empty-200 failure, stores the PNG in KV under a content-addressed id, and
returns `/p/<id>`. The composer opens on that URL. When X's scraper arrives,
`/p/<id>` serves OG tags whose image is `/api/image/p/<id>.png` - a stored
object with `immutable` caching, no render on the request path.

- Ids are `sha256(canonical trait string)` truncated to 12 base36 chars, so
  sharing is idempotent: the same character always yields the same id, a
  re-share is a read, and two users who build the same character share one
  stored card. Storage grows with distinct characters, not with clicks - which
  is also what keeps KV's 1,000-writes/day free ceiling comfortable.
- **KV, not R2, only because R2 is not enabled on the account** (dashboard
  opt-in, needs a payment method even on the free tier). `CARD_STORE`/
  `kvCardStore` in `functions/_lib.ts` is the seam; swapping to R2 is one
  adapter. Namespace `PING_CARDS` = `70f930398a80470dae64b5bedc0cce69`, bound
  in `wrangler.toml` for both environments.
- Every failure falls back to the legacy `?head=...` URL, which still works.
  Old share links in old tweets keep working forever - `/api/og` is untouched
  and both routes coexist permanently, by design, since the query-param route
  has no server state to migrate.
- A human opening `/p/<id>` is redirected to the builder with that character
  restored; an unknown id goes to the builder rather than a 404.

**Verified locally under `wrangler pages dev`:** create, idempotent re-create
(`cached:true`), bot OG tags, stored PNG (`103877` bytes, correct
`Cache-Control`), human redirect restoring traits, invalid trait rejected 400,
unknown id redirected. And end-to-end in the browser: clicking Tweet produced
`.../intent/tweet?...&url=.../p/1tunzm1aek2s`, whose card resolves to
"PING with Crown".

**Still open on this:** whether the zone Cache Rule bypassing `/api/*` was ever
actually created in the Cloudflare dashboard (`functions/_lib.ts` documents it
as required; there is no IaC record of it). The new route does not depend on
it - it wants to be cached - but `/api/image/custom.png` still does.

## OWNER VERDICT PASS, 2026-09-12 - the work list

The owner vetted the full library from the contact sheets. The verdicts are in
**`docs/trait-verdicts.md`** (generated by `.trait-work/verdicts.mjs`, every
name resolved to a real file - none unmatched). That file is the work list;
this section is the context around it.

**Totals: 92 live traits to FIX, 1 live REMOVE (applied), 9 pending to FIX,
5 pending REMOVE (applied).** Everything else is GOOD - the standing rule
below still holds, so do not touch anything not on the list.

**Already applied this session:** `cat-ears-v2_head` deleted (library 293 ->
292, index regenerated), and the five pending rejects deleted
(`paperclip-bite`, `straw-drink` mouths; `static-tv-eyes`,
`peace-sign-stickers`, `newspaper-eye-holes` faces). `.trait-work/pending/` is
now 26 files.

**What FIX means here: regenerate the art.** The concept is approved; the
execution is not. Nothing on that list is up for re-judging.

Three things the owner said that shape the work:

1. **The Hello Kitty family is a FIX, not a removal.** He ruled a second time
   that this is not a commercial site. Six assets: the mask, three shirts, the
   keychain, the pet. Do not raise the trademark question about them again.
2. **The face group is one shared defect.** angry, aviators, blindfold,
   hello-kitty-mask, master-chief-helmet, minion-eyes, monocle, nerd-glasses,
   round-glasses, tears-of-joy - **the eyewear does not show the eyes behind
   it.** That is a single art rule to fix once and apply across all ten, not
   ten independent jobs.
3. **`sparkler` in both hands is called out as off-style** - "regenerate in our
   artstyle", said of the right-hand one and repeated for the left. Treat the
   pair together.

Note this is 101 regenerations against a library of 292, and generation was
stopped by an earlier directive; this list is what restarts it. The Gemini
capture path is strictly serial (shared clipboard), documented further down.
Work it category by category, cheapest first, and re-run
`node .trait-work/vet-sheets.mjs` after each batch so the owner reviews against
fresh ids.

## STANDING RULE (2026-09-12): every trait is GOOD unless named

The owner's directive: **all traits have status GOOD and are left alone.** He
names individual ids when he wants something changed — `HE07 FIX`,
`AU24 REMOVE`. Silence means keep.

Consequences, so no future session re-opens any of this:

- Do **not** propose trait removals unprompted, and do not re-surface
  `.trait-work/audit/does-not-fit.md`. That audit is reference material, not a
  queue. The 32 still-unruled items on it (24 trademark cases, the two flag
  auras, the six flat-vector orphan auras) stay live unless he names them.
- The 31 traits in `.trait-work/pending/` are approved by default too. The
  only exception already known to be bad is `vending-machine_accessory`
  take 1, which is clipped at the canvas edge.
- The "owner rulings still outstanding" list further down this file is
  **closed**, not pending. Nothing there blocks anything.
- Ids come from `node .trait-work/vet-sheets.mjs`, which writes numbered
  contact sheets and `vet-index.md` to `.trait-work/vet-sheets/`. Category
  codes: AU BO FA MO HE RH LH AC, `P`-prefixed for pending. Re-run it after any
  cut, since ids are positional within a category.

Generation is also stopped as of this directive — the 42 approved concepts in
`.trait-work/next-batch.md` stay parked, no new Gemini chats.

## FIXED (eighth session): auras composited ON TOP of the base

Fixed, verified in all three renderer families, and covered by a regression
test. The diagnosis below is kept because it explains *why* the shape of the
fix is what it is. What changed:

- `UNDER_BASE_CATEGORIES` + `paintsUnderBase` + `splitAtBase` in
  `src/data/traitOrder.ts`, mirrored in `functions/_lib.ts`. The stack is now
  under-base categories (today: `aura`), then the base art, then the rest in
  `TRAIT_RENDER_ORDER`.
- All seven real call sites rewritten: `HeroCharacter.tsx`, the three canvases
  in `CharacterPreview.tsx`, `custom.png.tsx`, `random.png.tsx`,
  `banner.png.tsx`. `shirt.png.tsx` was read and left alone — it composites one
  fixed `blank-tee` body trait and can never carry an aura.
- `src/data/baseLayering.test.ts` is the guard. Unit tests on `splitAtBase`
  are the cheap half; the half that actually matters scans each renderer's
  **source** and asserts the under-base layers are painted before the base and
  the base before the rest. A correct order array never forced the base into
  the middle, which is exactly how this shipped, so the test asserts the
  renderers, not the array.
- Verified visually: hero cycle, builder preview canvas (blue-aura), and
  `/api/image/custom.png?aura=blue-aura&head=crown&right_hand=bitcoin` under
  `wrangler pages dev`. Aura behind the penguin in all three.
- 117 tests pass, typecheck clean, build clean.

`.trait-work/sheet.mjs`'s aura special-case is now *correct* rather than a
divergence — the renderers finally do what the sheet always did.

**Cause.** `TRAIT_RENDER_ORDER` (`src/data/traitOrder.ts:15`) lists `aura`
first, which correctly makes it the bottom-most *trait*. But every renderer
paints **the base image first, then the ordered traits**. So `aura`, being
merely the first trait, still lands on top of the penguin. The order array is
not wrong; nothing tells the renderers that the base belongs *between* `aura`
and every other category.

**Every affected site — all the identical shape (base `<img>`/`drawImage`,
then the ordered traits):**

| file | line | what |
|---|---|---|
| `src/components/HeroCharacter.tsx` | 57 | base, then `layersFor(combo).map` |
| `src/components/CharacterPreview.tsx` | 95 | live preview canvas |
| `src/components/CharacterPreview.tsx` | 215 | download canvas |
| `src/components/CharacterPreview.tsx` | 312 | copy canvas |
| `functions/api/image/custom.png.tsx` | 80 | image API |
| `functions/api/image/random.png.tsx` | 72 | image API |
| `functions/api/og/banner.png.tsx` | 114 | OG banner |
| `functions/api/image/shirt.png.tsx` | 43 | three `<img>`; read before editing, not yet confirmed |

**Why nothing caught it.** The 107-test suite passes because no test asserts
that an aura composites *under* the base — the tests check the order array,
which is correct. And every review sheet looked right all along because
`.trait-work/sheet.mjs` special-cases auras behind the base on its own
(`n.endsWith('_aura') ? [trait, base] : [base, trait]`). That divergence
between the sheet script and the real renderers is exactly why this survived
seven sessions of sheet review.

**Fix as shipped.** One helper next to `TRAIT_RENDER_ORDER` that splits the
ordered traits into `under` / `over` at the base, mirrored into
`functions/_lib.ts` per the three-authorities pattern already documented in
that file's comment. Then a test asserting an aura sorts under the base and a
non-aura over it — that test is the actual regression guard; without it this
comes back. Eight call sites, all mechanical.

The fix is committed but **not pushed** — pushing auto-deploys, and there is
still no go-ahead.

## Seventh session: generation state at handoff

**Commits (11 unpushed total on `relaunch/robinhood-chain`).** New this
session: `02f01f2` (Solana five cut), `8efac95` (Gemini path documented).
Pushing auto-deploys to production; still no go-ahead.

**Generated and parked in `.trait-work/pending/` — REMEMBER THIS IS
GITIGNORED AND UNBACKED-UP:**
- 13 auras from earlier sessions, still awaiting the owner's rejects. Sheet
  `.trait-work/extract/auras-pending-13.png` was sent this session; the owner
  said he would **name the rejects**. That answer never arrived — ask again.
- **mouth 8/8**, all first takes, fits 0.12-0.35: corn-cob, straw-drink,
  candy-cane, carrot, ice-pop, paperclip-bite, birthday-candle, harmonica.
  Sheet `.trait-work/extract/mouth-batch8.png` sent.
- **face 9/9**, all first takes, fits 0.12-0.32: x-ray-glasses, googly-eyes,
  glowing-scanner-eye, newspaper-eye-holes, peace-sign-stickers,
  groucho-glasses, tape-x-eyes, static-tv-eyes, coin-slot-eyes. Sheet
  `.trait-work/extract/face-batch8.png` sent.
- **accessory 0/8** — `vending-machine` take 1 is parked but is a REJECT:
  clipped at the right canvas edge (bbox reaches x=1146 of 1147) and its fit
  was 8.37/255, inflated because the object sits outside the extract box, not
  because the penguin was redrawn. Take 2 was generated in the chat but never
  captured. Delete the parked take 1 or move it to `rejected/`.

**Remaining from `.trait-work/next-batch.md`: 42 concepts** — accessory 8,
left_hand 9, body 11, head 11, right_hand 7. The owner approved **all 59**;
mouth and face are done.

**Live Gemini chats, one per category, all with both refs attached:**
- mouth `/app/72d6849382a5d5ad` (8 edits)
- face `/app/9fe529d0340d63cc` (9 edits)
- accessory `/app/75976b7b77f36cf4` (2 edits)

Start a fresh chat per remaining category. Watch the ~20-edit drift ceiling.

**Accessory rule text was tightened after the vending-machine reject** — the
working version now demands "about one third of the penguin's height - small,
not tall" and "the WHOLE object must sit fully inside the picture with a clear
white margin on every side: it must never touch or run off the edge of the
frame". Reuse that wording; the original 1/3-to-1/2 phrasing produced an
object that ran off the canvas.

**One more browser gotcha, beyond the list above:** coordinates must be scaled
per axis — `x * 1568/innerWidth` and `y * 744/innerHeight`. Using the x ratio
for y silently misses whenever the window is not the expected aspect, which is
how the accessory chat's upload button was missed three times. Also: `Enter`
does NOT need a preceding screenshot; only clicks do.

### Owner rulings still outstanding
1. The 13 auras — he chose "I'll name the rejects" and has not named them.
2. master-chief-helmet, infinity-gauntlet, redbull x2 — he ruled to keep Hello
   Kitty ("this is not a commercial site") but did not rule on these four.
   I flagged once that these are enforced trademarks on a site attached to a
   token launch; he kept Hello Kitty knowing that. Do not re-litigate, just
   get the ruling on the remaining four.
3. The rest of the fit audit (~22 traits after the Solana five) — the other
   trademark cases and the two flag auras, still unjudged.
