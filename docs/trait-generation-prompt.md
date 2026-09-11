# PING trait generation prompt (for an image model)

For any trait in any category: new traits, and redraws of existing ones
(e.g. the five rejected mouth expressions). Recommended model: GPT Image 2
(ChatGPT image editing). Fallback: Nano Banana Pro (Gemini), which takes up
to 14 reference images.

Attach, in this order:

1. `docs/trait-refs/ping-on-white.png` - the base character (`ping.png`
   flattened on white, 1024). **This is the image to edit.**
2. `docs/trait-refs/originals-sheet.png` - 16 of the owner's hand-drawn
   traits, 2 per category, composited on the base at render size and
   labelled
3. 2-4 raw trait PNGs from `public/traits/` in the target category, from
   the owner's originals (anything added before 2026-09-09). Don't attach
   generated ones.

Fill in `<CATEGORY>` and paste that category's list from "Concepts" below
into `<CONCEPTS>`. Run one category per conversation, and ideally one
concept per message. The trait layer is cut out of each
edited image afterwards by diffing it against `ping.png` inside a
category-specific region mask, which is why the framing must not move.

## Concepts

Checked against the 238 current traits for duplicates. There are three
themes: penguin/arctic (it's a penguin), degen/memecoin culture without
brands or text, and plain cute. No brands, logos or franchises.

**mouth** (this list replaces the five rejected expressions, which get cut:
smile, smirk, open-laugh, gap-tooth, gold-tooth)
- fish-in-beak - a small fish held sideways, tail flopping. The most
  on-brand trait in the set
- toothpick - chewed, in the beak corner like the cigar, too cool to care
- wheat-stalk - long stalk in the corner, smug farmhand energy (smirk's
  replacement)
- rose - stem in the corner, romantic (smile's replacement)
- party-blower - a paper horn unrolling out of the beak, mid-toot
  (open-laugh's replacement)
- gold-beak-ring - a thick gold hoop through the beak like a nose ring;
  the beak is the nose (gold-tooth's replacement)
- pacifier - over the beak tip, baby-degen
- bubble-pipe - curved pipe in the corner with 2-3 soap bubbles rising
  to the side, away from the eyes

**head**
- ushanka - fur trapper hat with ear flaps down
- headphones - big over-ear, band over the top of the head
- traffic-cone - worn as a hat, slightly tilted
- eggshell - the top half of a cracked egg on the head, a freshly hatched
  chick
- beret - flat, tilted, artist vibe
- santa-hat - with the pom-pom flopping to one side
- bunny-ears - a headband with floppy ears
- mohawk - a spiky colored hair strip, sized to the head's top curve

**face**
- dollar-eyes - "$" shapes replacing the eyes, drawn like star-eyes
- ski-goggles - big mirrored goggles with a strap round the head
- aviators - teardrop sunglasses, thin gold frame thickened for the outline
- vr-headset - a plain boxy headset over the eyes, no logo
- snorkel-mask - a diving mask with the snorkel tube up the side of the head
- eye-bags - tired dark rings under the eyes, three-days-no-sleep trader
- band-aid - a crossed pair of plasters on one cheek

**body**
- puffer-jacket - a quilted jacket following the real body and flipper
  outline
- gold-chain - a chunky chain resting on the chest, with a plain pendant
  (a coin with no symbol, or a fish)
- overalls - denim bib overalls with two buttons and straps
- varsity-jacket - contrast sleeves, no lettering
- lab-coat - white coat, open, with a pocket
- knit-sweater - a chunky winter sweater with a snowflake band
- tracksuit - a zip jacket with two side stripes
- cape - a short cape hanging behind from the shoulders, peeking out at the
  sides

**right_hand**
- pickaxe - mining crypto, pointing up and away
- smartphone - the screen shows a simple green up-candle chart, no text
- microphone - a handheld mic
- fish - a whole fish held by the tail
- megaphone - pointed outward
- magnifying-glass - held up and out
- rubber-duck - small, yellow, cute
- baguette - long, angled up

**left_hand**
- snowball - held, with a couple of snow flecks
- piggy-bank - small, pink, coin slot on top
- briefcase - a plain brown case with a handle
- lantern - an old camping lantern with a warm glow shape
- teddy-bear - held by one arm
- calculator - chunky, big buttons, a blank or simple-number screen
- banana
- water-balloon - blue, tied off, wobbly

**accessory** (stands on the ground line beside the penguin)
- igloo - a small one with a dark entrance
- snowman - three balls, carrot nose, stick arms
- gold-bars - a stacked pyramid of bars
- trading-desk - a small desk with one monitor showing green candles, no
  text
- fish-bucket - a metal bucket with fish tails sticking out
- lawn-flamingo - a pink plastic flamingo on wire legs
- mini-fridge - a small fridge, door slightly open, glowing
- iceberg - a small ice block or floe with a fish frozen inside

**aura** (behind the penguin; the outlined-gradient style of fire-aura)
- northern-lights - green and purple aurora ribbons in a halo; a penguin
  aura that's literally an aurora
- money-rain - a jagged halo filled with falling coins and bills
- green-candles - rising green chart candles forming the halo's spikes
- hearts - a halo of pink and red hearts
- confetti - a burst halo with confetti bits
- bubbles - a soft blue halo of soap bubbles

---

You're drawing new "traits" for PING, a PFP generator built around a cartoon
penguin mascot. Users stack traits (a hat, a shirt, something in each hand, a
background aura...) on a fixed base character. Image 1 is that base. Image 2
is a sheet of traits the original artist drew by hand, two from each category
and labelled. The other images are some of those traits on their own, at
full size.

You're extending an existing, hand-drawn set. The goal is that nobody can
tell your traits from the artist's.

## Category and concepts

Category: **<CATEGORY>**

Concepts, one trait each:
<CONCEPTS - e.g. "pirate hat", "straw hat", "chef hat">

## The style you're matching

Study image 2 before drawing anything.

- A chunky black marker outline, uneven and slightly wobbly, like a thick
  felt pen. It's not a clean vector stroke and not thin ink. Its weight
  matches the penguin's own outline.
- Flat fills, with at most one flat shade. No gradients (auras are the one
  exception, see below), no glossy highlights beyond a single simple white
  shine mark, no texture, no hatching.
- Clean, cheerful colors like the sheet: a red balloon, a gold crown, a
  rainbow propeller cap.
- Very few lines. Objects are simple icons, not illustrations: a mug is a
  mug shape plus a handle, a crown is five points and three gems.
- Cute and slightly dumb, never detailed or realistic.

## Where each category goes (match the placement in image 2)

- **aura**: a jagged flame or glow halo *behind* the whole penguin. Thick
  black outer outline, soft color gradient inside with a little grain (like
  fire-aura and blue-aura). It surrounds the silhouette and must not cover
  the face or body. It gets drawn behind the penguin.
- **body**: clothing or a tattoo on the torso. Garments follow the penguin's
  real body and flipper silhouette (see ping-tee and dress). Never invent a
  generic human shirt shape.
- **face**: over the eye area (glasses, eye patch, star eyes). This is the
  only category allowed to cover the eyes.
- **mouth**: around the beak. **Never reshape, open or redraw the beak.**
  The artist's mouth traits leave it untouched: the cigar sits in its
  corner, the beard hangs below it. No teeth, gums, tongue-in-mouth, open
  beak interiors, human lips or a second lower jaw. Every one of those was
  tried and rejected as uncanny. Sell an expression with additions: a prop,
  cheek marks, something sticking out.
- **head**: sits on top of the head, sized like crown and propeller-hat. It
  must stay fully inside the canvas. Don't cover the eyes.
- **right_hand**: held at the tip of the flipper on the viewer's *right*,
  low at the side (see coffee-mug and basketball). The object is about the
  size of the penguin's head or smaller and points away from the body,
  never across the chest or belly.
- **left_hand**: the same, at the flipper on the viewer's *left* (see
  balloon and handbag).
- **accessory**: a separate object standing on the ground beside the
  penguin, on either side. Its bottom sits on the same ground line as the
  penguin's feet, and it's scaled like the stove and the dog: roughly a
  third to half the penguin's height. It doesn't float or touch the penguin.

## Hard constraints

- **Keep the framing identical to image 1.** Same canvas size, same penguin
  size and position, same pose. Only add the trait, and don't redraw or
  "improve" any part of the penguin. The result gets diffed against image 1,
  so a shift or restyle anywhere else breaks it.
- **One trait per image.** A hat doesn't come with hair, a shirt doesn't come
  with a held object, a mouth trait doesn't add eyebrows.
- **Traits stack.** It must look right next to any other trait from any
  other category: no cast shadow on the penguin, nothing that assumes a
  specific companion trait.
- **Readable small.** In the builder, the whole penguin is about 300px tall.
  If a detail only shows up zoomed in, drop it. Use bold shapes and few of
  them.
- Plain background, the same as image 1's. Don't add a scene, floor, props
  or text.
- Content: family-friendly. No sexual content, no new drug items, no hate
  symbols or euphemisms for them, no real people, no brands, logos, or
  franchise characters (a generic "space helmet" is fine, a specific
  game's helmet is not). If a concept can't avoid that, skip it and say so.

## What went wrong in earlier batches (don't repeat these)

- Redrawing a feature of the base instead of adding to it: covering the beak
  to draw a human mouth, or opening or bending the beak.
- Guessed silhouettes: shirts drawn as a generic tee that didn't match the
  penguin's body.
- Held objects pointing across the chest, or with the business end resting
  on the belly (a fishing rod with the fish on the stomach).
- A hat whose tip ran off the top of the canvas.
- Ground accessories drawn at ~60% of the right size, or floating ~140px
  above the ground line.
- An aura that painted a solid wedge over the face.
- Umbrella drawn as a bat-wing shape instead of a domed, scalloped canopy.
- Perfect-vector, even-width lines that looked pasted onto the hand-drawn
  base.

## Deliver

For each concept, give 2-3 different takes, each as a full edited copy of
image 1 with only that trait added. For each take, write one line on what
makes it work at small size, then say which take you'd pick. If a concept
doesn't work in this style, say so rather than delivering a weak one.
