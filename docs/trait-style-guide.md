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

## Treatment B — painterly gradient (auras only)

Used for: every `aura` trait, no exceptions.

- Soft radial/directional gradients, visible film-grain noise texture, no
  black outline at all — the opposite rendering approach from Treatment A.
- Silhouette is a rounded aura shape sized to fully surround the character's
  head and shoulders; the character itself is never drawn into the aura
  layer (it renders as solid black in isolation, which is correct — it sits
  *behind* the base in paint order).
- Large file sizes (300KB-1MB) are normal here and are not a mistake to
  "optimize away" — they're what the grain texture costs at 1120-1147px.
- Reference file: `trait-fire-aura_aura.png`.

## Treatment C — flat meme/pixel art (a handful of exceptions)

Used for: a minority of `face`/`accessory` traits that are direct references
to a specific internet meme rather than an in-universe object —
`trait-cool-glasses_face.png` (8-bit "deal with it" glasses) is the clearest
example.

- Do not use this treatment for new traits unless the trait *is* a specific,
  recognizable meme image in its own right. It reads as a jarring style break
  next to Treatment A, and Treatment A is safer default for anything that
  isn't already a known meme asset.

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
