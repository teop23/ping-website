# PING trait style guide

Extracted by opening a cross-section of the existing 164 traits, not written
from memory. The honest finding: **the library is not one consistent style —
it's three**, split cleanly by category. Any generation plan that pretends
otherwise will produce traits that clash with two-thirds of what's already
there.

## Treatment A — flat cartoon (the default, most traits)

Used for: `head`, `face`, `mouth`, `body`, most of `left_hand`/`right_hand`,
most of `accessory`.

- Thick black outline, hand-drawn wobble rather than a perfectly even vector
  stroke. Outline weight is roughly 3-4% of the object's own width — thick
  enough to read at thumbnail size, never a thin line.
- Flat colour fills. At most one shade of internal shadow (see the cowboy
  hat's brim underside); no gradients, no soft airbrushing, no drop shadow.
- Palette is desaturated / muted rather than neon — browns, muted reds,
  denim blues, olive. The one saturated exception is anything explicitly
  branded (Bitcoin orange, a flag's actual colours).
- No linework detail beyond the silhouette and one or two internal seams
  (a hat brim line, a shirt collar). Nothing is textured or hatched.
- Reference files: `trait-cowboy-hat_head.png`, `trait-ping-tee_body.png`,
  `trait-cigar_mouth.png`, `trait-crown_head.png`.

## Treatment B — painterly glow halo (most auras)

Used for: the flame/glow-style `aura` traits — `fire-aura`, `sunrise-aura`,
and the six added 2026-09-10 (`storm-aura`, `toxic-aura`, `ice-aura`,
`holy-aura`, `shadow-aura`, `galaxy-aura`).

**This is not the only style inside the `aura` category — see the note below
before assuming it is.**

- Soft radial gradient (dark/near-transparent near the center, brightening
  toward the outer edge) plus visible film-grain noise texture, no black
  outline at all — the opposite rendering approach from Treatment A.
- An open, jagged crown shape wrapping roughly the top 250 degrees (head and
  shoulders), not a closed 360-degree ring — a full ring puts a spike
  straight down through the character's face, and every reference file stops
  well short of the belly.
- **The center and any area near the character's actual face must be fully
  transparent, not just "dark."** Confirmed by direct pixel measurement:
  `fire-aura` is fully transparent (alpha 0) at the point matching where the
  base's eyes/beak sit. This isn't cosmetic — an opaque area there, even a
  near-black one, sits **in front of** the character rather than behind it
  once actually composited (verified against a real render, not assumed),
  and reads as a solid patch over the face. Trait art that "looks right" in
  isolation and wrong once composited is specifically this failure mode; see
  [[Trait Registration Against a Base Character]] for the fuller story of how
  this shipped once and was only caught by testing the real composite.
- Large file sizes (300KB-1MB) are normal here and are not a mistake to
  "optimize away" — they're what the grain texture costs at ~1147px.
- Reference file: `trait-fire-aura_aura.png`. Generator:
  `scripts/generate-aura-traits-svg.mjs`.

### The other two `aura` sub-styles (not covered by any generator here)

Opening more of the category than just `fire-aura` turned up two more
treatments hiding under the same "aura" label:

- **Flag/logo backdrop.** `american-aura`, `persian-aura`, `LGBTQ-aura`,
  `link-aura` are a full-frame flat-color backdrop (a flag, a brand logo)
  with a white silhouette cutout of the character traced into it, sized
  slightly larger than the base so a thin white border peeks out around the
  edge once the base renders on top. A completely different geometry system
  from the glow halo, and choosing what to represent (whose flag, whose logo)
  is a content decision, not a style-matching one.
- **Ornate swirl/tendril halo.** `fart-aura` is neither of the above — hand
  -drawn interlocking curls, no grain, no jagged spikes.

Also found in the category and worth knowing about, not a style question:
`bazooka-aura` is a literal photo of an RPG launcher. It appears to be
mis-filed under `aura` rather than an intentional third sub-style.

## Treatment C — flat meme/pixel art (a handful of exceptions)

Used for: a minority of `face`/`accessory` traits that are direct references
to a specific internet meme rather than an in-universe object —
`trait-cool-glasses_face.png` (8-bit "deal with it" glasses) is the clearest
example.

- Do not use this treatment for new traits unless the trait *is* a specific,
  recognizable meme image in its own right. It reads as a jarring style break
  next to Treatment A, and Treatment A is safer default for anything that
  isn't already a known meme asset.

## Mouth: the beak is the mouth

The base has no lips - its mouth is the orange beak, ~53x14px at the 512
render. Two consequences, both learned by shipping it wrong:

- Never cover or erase the beak to draw a different mouth, and never bolt a
  drawn lower mandible under it (read as a second beak, rejected twice). An
  open expression is the real beak (flood-filled out of `ping.png`, see
  `scripts/generate-mouths-from-beak.mjs`) split along its orange midline,
  lower half slid down, gap filled with black lip lines and a dark interior.
  Teeth and tongue go inside that gap; a tongue or bubble can come out of
  it; a mustache goes under the beak (the beak is also the nose). Anything
  still drawn gets the displacement wobble so it isn't perfect-vector.
  The beak outline in mouth traits is thinned (proportionally, ~45%) over a
  face-cream footprint that hides the base's own thick outline: the base's
  heavy outline is right for the plain character, too heavy on an
  expression.
- Nothing drawn inside the beak's own silhouette survives the render. A
  tooth row, a smile line or a tongue that fits inside 53x14px is a smudge on
  the live site. Make the added shape at least the beak's own size.
- Size for the builder, not just the API. The builder canvas is 599px with
  the base at 1.4x, so a trait's 1147px master shrinks to ~52%. Teeth under
  ~30px tall in the master, or a detail that relies on dark-on-dark contrast
  (a missing tooth in a dark mouth), don't read there. Check with a capture
  from the real builder (`scripts/capture-builder-receiver.mjs`), not only a
  512 contact sheet.

Held objects (cigar, joint, lollipop, whistle) go in the beak's corner and
were always fine.

## Rules that apply to every treatment

- **Canvas**: square, matching `public/ping.png`'s canvas (1024x1024
  authored; 512x512 is what actually ships — see the build pipeline note
  below). The character silhouette is *not* pre-scaled into the canvas the
  way a favicon is; traits are drawn to register directly against the base
  at native size, generously padded. Look at where the art sits within the
  frame in the reference files rather than guessing a percentage.
- **Background**: fully transparent alpha, not white, not checkerboard.
  `trait-cool-glasses_face.png` and `trait-fire-aura_aura.png` both confirm
  this even where the object itself is small.
- **One trait, one category.** A hat doesn't also draw hair; a shirt doesn't
  also draw an accessory.
- **No baked-in shadow onto the base character.** Every trait must look
  correct next to every other trait it might be layered with, so nothing can
  assume a specific companion piece is present.
- **Filename**: `trait-<kebab-case-name>_<category>.png`. The category must
  be one of `aura, body, face, mouth, head, right_hand, left_hand, accessory`
  exactly — `scripts/generate-index.mjs` hard-fails the build on anything
  else, on a non-square asset, or on a duplicate id.
- **Minimum 512px** on the long edge, square. Below that the build warns
  (doesn't fail) that the trait will look soft. Four existing traits are
  already below this floor with no source art to fix them — don't add a
  fifth.
