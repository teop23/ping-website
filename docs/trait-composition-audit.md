# Trait composition audit - 2026-09-14

Full re-pass over all 233 non-aura traits and realistic combinations, following
up on e3dfc96 (16 traits with enclosed white keying holes fixed). Method:
rendered every trait at real render geometry (base at 1.4x centered, trait at
1x, matching `functions/_lib.ts` `BASE_SCALE`/`CharacterPreview.tsx`
`composeCharacter`) over both flat magenta and a busy aura (`neon-city_aura`),
in sheets of 25, and inspected every sheet. Tools used, all under
`.trait-work/layer/` (copied from the main checkout, plus new ones written
this session - `sheet.mjs`, `probe2.mjs`, `classify.mjs`, `scan2.mjs`):

- `classify.mjs` - finds every enclosed alpha hole in every non-aura trait
  (same flood-fill as `fillholes.mjs`) and flags only the ones whose centroid
  falls *outside* the base's silhouette at real geometry - those are the ones
  that let the aura bleed through underneath. Narrowed 233 traits down to 28
  candidates instead of visually checking everything blind.
- `probe2.mjs` - crops a small window around a specific (x,y) in a trait's
  native resolution, composited on magenta at real geometry, for close-up
  judgment calls.
- `sheet.mjs` - the main 5x25 review sheets.

## Fixed (3)

All three are mechanical patches with `fillholes.mjs` (fills an enclosed
low-alpha region with white, painted under the art) - no art was redrawn.
Verified with a before/after crop that only the defect changed (buttons and
other legitimate negative space on the same trait were re-checked and are
pixel-identical in intent).

- **drumstick_right_hand** - jagged off-white fragment at the bone's knuckle
  joint, left over from background removal. `node fillholes.mjs
  drumstick_right_hand --write`.
- **boxing-glove_right_hand** - a corner notch cut out of the wrist cuff,
  same cause. `node fillholes.mjs boxing-glove_right_hand --write`.
- **varsity-jacket_body** - ragged magenta/aura fringe running the length of
  both sleeve cuffs (visible as a jagged pink edge over any aura, not just an
  enclosed hole - needed `--close 4` to bridge the fringe into a closeable
  region). `node fillholes.mjs varsity-jacket_body --close 4 --write`.

`drumstick_right_hand` and `boxing-glove_right_hand` are already marked FIX
(full regen) in `docs/trait-verdicts.md` for unrelated style reasons; this
patch is a correctness fix in the meantime, not a substitute for that.

## Checked and NOT a defect (worth recording so it isn't re-flagged)

The `classify.mjs` pass surfaced 28 traits with holes outside the base
silhouette; only the 3 above were real defects. Everything else was
legitimate negative space by design, confirmed by close-up crop:

- **tennis-racket_right_hand** - all 20 "holes" are the string mesh.
- **donut_left_hand**, **hello-kitty-keychain_right_hand** (ring loop),
  **trophy_right_hand** (handle loops), **boombox_accessory** (carry-handle
  loop) - literal holes in the object (donut center, keyring, cup handles,
  carry handle) that are supposed to show through.
- **flower-crown_head** - gaps between petals/leaves, part of the garland.
- **ciggy_right_hand** - hollow center of the smoke-curl icon.
- **hello-kitty-mask_face** - gaps between the bow lobes, the ear outline's
  hollow interior, and the whisker-line gaps; all intentional line art.
- **googly-eyes_face** - gap between eyelid arc and pupil.
- **white-monster_right_hand**, **redbull_right_hand**, **fish_right_hand**,
  **m16_right_hand**, **girl-eyes_face** - all flagged holes are 6-40px
  (sub-visual) texture/highlight specks, not visible at render size.
- **lantern_left_hand**, **mini-fridge_accessory** - the "holes" outside the
  object are the drawn light-glow rays, not keying artifacts.
- **soul-reaper-sword_left_hand** - looked disconnected from the flipper at
  small scale, but a close-up crop at the grip point shows the same small
  gap every dangling-strap weapon has (compared directly against
  `thor-hammer_left_hand`); not a position bug.

## Trait canvas sizes vary - checked, not a defect

Native PNG canvas size varies a lot across the library (1147x1147 is most
common, but sizes from 320x320 to 1208x1208 appear - `crown_head` is
862x862, the `gun-hand_*` traits are 1208x1208, `poobis_left_hand` is
320x320, etc). Since every renderer does a uniform square resize to the
target size, a different native pixel count alone doesn't cause
scale/position drift as long as the content was authored at a consistent
scale relative to the character - and it is. Rendered a 20-trait sheet
mixing several odd-sized canvases (`crown_head`, `gun-hand_left_hand`,
`propeller-hat_head`, `poobis_left_hand`, etc.) against standard-size traits
and all align correctly. No action needed, but worth recording since it's
the kind of thing that looks like a smoking gun until you actually render it.

## Needs an owner decision, not fixed

- **chill-guy_accessory** - the only accessory in the library with a fully
  opaque white sticker-style outline traced around the whole figure (2504
  solid-white edge pixels; every comparable meme accessory - `pet-apu`,
  `sad-pepe_head`, `hello-kitty-pet` - has a clean line-art edge with no
  border). This may be an intentional reproduction of the "chill guy" meme's
  usual sticker presentation, or it may be an unremoved background matte.
  Not touched pending a call, since removing it could be undoing a
  deliberate style choice.

## Ordering / combination checks

Tested the pairings the brief called out as likely trouble spots:
mouth-over-full-face-helmet (doom-helmet, master-chief-helmet, mF-dOOM-mask,
ski-mask, helm-of-domination, each combined with cigar/beard/joint/mustache),
head-hat-over-face-mask (doom-helmet+cap, master-chief-helmet+top-hat,
snorkel-mask+santa-hat, helm-of-domination+crown), and
body-jacket-over-hand-item (puffer-jacket+beer, varsity-jacket+dumbbell,
tuxedo-shirt+wallet), plus accessory-pet next to a hand item
(pet-apu+teddy-bear, hello-kitty-pet+rubber-duck).

**All of these render correctly with the existing paint order** (`aura, body,
face, mouth, head, right_hand, left_hand, accessory`). The full-face helmets
and masks were authored with a mouth-shaped cutout, so mouth items show
through in the right spot instead of floating over solid faceplate. Hats
nest visually fine on top of helmets. Jacket/hand overlaps that looked like
clipping at thumbnail size turned out to be clean overlaps once rendered at
full resolution and cropped - no ordering-rule change is being proposed.

## Counts

- Traits reviewed: 233 non-aura (matches the brief's count) + spot combo
  checks.
- Fixed (mechanical art patch): 3 - drumstick_right_hand,
  boxing-glove_right_hand, varsity-jacket_body.
- Needs an owner call (not fixed): 1 - chill-guy_accessory (white sticker
  border, possibly intentional).
- Order-rule proposals: 0 - every combination tested renders correctly with
  the current `TRAIT_RENDER_ORDER`.
