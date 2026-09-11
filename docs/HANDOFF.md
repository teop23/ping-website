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

## Shipped 2026-09-11 (fourth session), aura in progress

**Committed:** the owner said "all are good" on the vetted sheets (`.trait-work/extract/vetted-{1,2,3}.png`,
built by `.trait-work/sheet.mjs`). 53 traits: 6 mouth (incl. pacifier take 2), 8 head, 7 face, 8 body,
8 right_hand, 8 left_hand, 8 accessory. The five rejected mouths (smile, smirk, open-laugh, gap-tooth,
gold-tooth) are cut, PNGs and generator entries. Library 239 - 5 + 53 = 287. No real builder capture or
wrangler render was taken; the sheets use sim-builder geometry.

**Aura, committed (second commit):** the owner wanted auras "cooler, can be full images too" and approved
northern-lights, money-rain, green-candles, confetti, bubbles (full canvas) and hearts (huge halo). Library 293.
Extra auras beyond the list are parked in `.trait-work/pending/` (out of `public/traits/` so
generate-index skips them) until the owner says yes. Chat `/app/5daaaf9b1a9abe8b`; page helpers `__wrapV(item, full)` with `__rulesV`
(full canvas) / `__rulesH` (huge halo).

**New tool flags:**
- `register-edit.mjs --penguin`: fit on the penguin's own pixels only, with a coarse scale/offset grid
  search. Needed when the background is no longer white (full-canvas auras). Fit is the mean diff inside
  the penguin; ~1.7 is normal for these, 12 meant Gemini moved and greyed the penguin (reject).
- `extract-trait-from-edit.mjs --full`: the whole edit becomes an opaque layer, the penguin silhouette
  (+3px) filled from the surrounding background. take.sh: `aura <name> <n> --box 0,0,1023,1023 --full --penguin`.
  For halo auras drop `--full`. The eye-clearance FAIL on full auras is expected.
- `extract-trait-from-edit.mjs --ground Y`: moves accessories so their bottom sits on native Y (750).
