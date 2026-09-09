# Plan: generating a lot of new PING traits

## Why this is easier than it sounds

Unlike a from-scratch trait system (e.g. building one for a character that
only has a gallery of finished illustrations), PING already has everything
that's hard to retrofit:

- a canonical base pose (`public/ping.png`)
- a proven category schema and paint order (`functions/_lib.ts`,
  `src/data/traitOrder.ts`)
- a build pipeline that hard-validates every new asset before it can ship
  (`scripts/generate-index.mjs`) — bad filename, wrong category, non-square,
  duplicate id, all rejected automatically
- 164 existing traits to draw a style guide *from*, rather than inventing one

So this isn't "design a trait system." It's "keep filling in categories that
already work." The only genuinely new step is choosing how the art gets made.

## Priority order (by category gap)

| Category | Current count | Priority | Why |
|---|---|---|---|
| `mouth` | 4 | **Highest** | All 4 are substance-related except `beard`. Anyone who doesn't want a beard or a smoking accessory has effectively one option. |
| `aura` | 12 | Medium | Smallest category after mouth; auras are also the most visually distinct slot, so each new one adds real variety. |
| `face` | 17 | Medium | |
| `left_hand` | 23 | Lower | |
| `accessory` | 20 | Lower | |
| `body` | 27 | Lowest | Already the deepest category. |
| `head` | 26 | Lowest | |
| `right_hand` | 35 | Lowest | Deepest category in the library. |

Concretely: even 15-20 new `mouth` traits (smile, smirk, tongue-out,
mustache-only, lollipop, gum bubble, whistle, gold tooth, missing tooth,
gritted teeth, pout, open laugh...) would do more for how varied a random
character looks than 15-20 more `right_hand` items, which is already the
best-stocked slot.

## Generation approach

Three ways to get the actual art, in order of what I'd try first:

### 1. AI image generation, reference-conditioned (fastest to start)

Most current image models can take reference images plus a written spec and
produce a matching isolated asset. The generation prompt below is built for
this — it embeds the style guide directly rather than assuming the model has
seen this conversation.

Caveat to expect: getting a genuinely flat, evenly-outlined cartoon asset
with a truly transparent background out of an image model on the first try
is inconsistent. Budget for a rejection pass (see QA below), not one-shot
success.

### 2. Commission an artist against the style guide

`docs/trait-style-guide.md` is written so it can be handed to a human artist
directly — it's evidence-based (cites real files) rather than vibes-based.
Slower and costs money, but the most reliable route to art that actually
matches, especially for the painterly aura treatment, which is the hardest
of the three to get an image model to hit consistently.

### 3. Hybrid (what I'd actually recommend)

Use AI generation for `mouth` and `face` — small, simple objects, the
treatment-A flat-cartoon style is the easiest of the three for a model to
hit, and volume matters more than perfection for filling a thin category.
Commission `aura` traits from a human, or from whoever made the originals if
they're reachable — the painterly gradient treatment is the one place a
generic prompt is likely to visibly miss.

## QA gate before anything reaches `public/traits/`

Every candidate file, before it's added:

1. Run it through `scripts/generate-index.mjs` — this already hard-fails on
   filename, category, duplicate id, and non-square art, so most mechanical
   mistakes are caught for free.
2. Composite it over `public/ping.png` by hand and eyeball it against 3-4
   existing traits in the same category, side by side. This is the check
   that catches a wrong outline weight or a stray white background that the
   build script can't see.
3. For anything in `right_hand`/`left_hand`: check it doesn't collide with
   `accessory` items that are commonly worn on the same side (a few existing
   traits are explicitly `-(left)`/`-(right)` suffixed for this reason — see
   `trait-pet-ping-(left)_accessory.png` and its `(right)` twin).

## Using the generation prompt

`docs/trait-generation-prompt.md` is ready to paste into an image-generation
agent or tool. It asks for one category and a batch of named concepts at a
time — running it once per category (starting with `mouth`) rather than
asking for all 164+ new traits in one pass keeps each batch reviewable and
keeps the model's attention on one visual treatment at a time.
