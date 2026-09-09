# PING new-trait generation prompt

Run this once per category, starting with `mouth` (the thinnest category —
see `docs/trait-generation-plan.md`). Fill in `<CATEGORY>` and the concept
list before sending. Attach 3-4 reference images from `public/traits/` in
the same category as the target, plus `public/ping.png` for the base pose.

---

You are generating new character-accessory art ("traits") for an existing PFP
generator called PING. Each trait is one isolated PNG that gets composited
over a fixed base character. You are extending an existing, working system —
match it exactly rather than reinterpreting the style.

## Category for this batch

`<CATEGORY>` — one of `aura, body, face, mouth, head, right_hand, left_hand,
accessory`.

## Concepts to produce (one image each)

<LIST 10-20 CONCRETE CONCEPTS HERE, e.g. for mouth:
- smile (closed, friendly, no teeth visible)
- smirk (asymmetric, one side raised)
- tongue-out (playful, no innuendo)
- mustache-only (no beard, thin pencil style)
- lollipop (bright candy stick with a swirl)
- gum-bubble (mid-blow, cartoon pink)
- gold-tooth (grin showing one gold tooth)
- gap-tooth (grin with a visible gap)
- whistle (pursed lips, small motion lines)
- open-laugh (wide, genuine, no teeth detail beyond a dark opening)
>

## Style — non-negotiable

You are matching the attached reference images exactly, not inventing a
related style. Three treatments exist across this system; use the one
specified below, and only that one.

**If this batch is `aura`:** painterly gradient treatment. Soft radial or
directional colour gradient, visible film-grain noise texture, NO black
outline anywhere. The shape must fully surround where a head and shoulders
would sit. Do not draw the character into this layer — it renders alone,
behind the base, in paint order.

**Every other category:** flat cartoon treatment.
- Thick black outline with a slight hand-drawn wobble — not a perfectly even
  vector stroke, not thin linework.
- Flat colour fills only. At most one internal shadow shade. No gradients,
  no airbrushing, no drop shadow, no texture or hatching.
- Muted, desaturated palette (browns, muted reds, denim blue, olive) unless
  the concept is explicitly a bright branded object (e.g. a specific coin
  logo), in which case that one element may be saturated.
- No fine linework beyond the silhouette and one or two structural seams.

## Technical requirements — will be validated, do not skip any

- **Square canvas**, minimum 1024x1024.
- **Fully transparent background** — real alpha channel, not white, not a
  checkerboard pattern baked into the pixels.
- The character/object sits generously padded within the frame, matching
  where objects sit in the attached reference files — do not fill the frame
  edge-to-edge, and do not shrink it to a tiny fraction of the canvas either.
- **One concept per file.** A hat must not also draw hair; a mouth item must
  not also draw a chin or jawline that belongs to the base character.
- **No shadow cast onto the base character**, and no visual dependency on
  any specific other trait being present — this trait must look correct next
  to every other trait it could be layered with.
- Output filename for each: `trait-<kebab-case-concept-name>_<CATEGORY>.png`
  — lowercase, hyphens only, no spaces, no underscore anywhere except the one
  separating the name from the category.

## Content rules

- Family-friendly. No sexual content, no drug paraphernalia beyond what
  already exists in the library (do not add new ones), no hate symbols, no
  real people, no mockery of real tragedies or ethnic/religious groups.
- Do not depict, reference, or riff on any third-party trademarked
  character, logo, or franchise (game/movie/anime characters, console logos,
  brand mascots). Generic archetypes are fine (e.g. "space helmet," not "a
  specific franchise's helmet").
- If a concept unavoidably risks any of the above, skip it and say so rather
  than producing a softened version.

## Before you deliver

Check each file against this list and report the result per file:
- [ ] square, >=1024px
- [ ] real alpha channel, background fully transparent
- [ ] correct treatment (gradient+no-outline for aura, flat+outline for
      everything else)
- [ ] filename matches `trait-<name>_<category>.png` exactly
- [ ] no duplicate concept within this batch
