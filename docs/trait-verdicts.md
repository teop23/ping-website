# Trait verdicts - owner pass, 2026-09-12

Everything not listed here is GOOD and must be left alone (standing rule in
docs/HANDOFF.md). FIX means regenerate the art, not re-judge the concept.

The Hello Kitty family is a FIX, not a removal: the owner ruled again that
this is not a commercial site. Do not re-raise it.

Faces are one shared defect, worth reading before touching any of them: the
eyewear does not show the eyes behind it.

## FIX - live library (89)

- **body** (6): hello-kitty-shirt-(black), hello-kitty-shirt-(pink), hello-kitty-shirt-(white), lab-coat, skull-tattoo, tuxedo-shirt
- **face** (10): angry, aviators, blindfold, hello-kitty-mask, master-chief-helmet, minion-eyes, monocle, nerd-glasses, round-glasses, tears-of-joy
- **head** (9): antlers, bucket-hat, cat-ears, devil-horns, flower-crown, graduation-cap, headphones, pirate-hat, wizard-hat
- **right_hand** (23): balloon-animal, blue-sword, boxing-glove, broom, ciggy, devil-trident, drumstick, dynamite, glock, guitar, hello-kitty-keychain, ice-cream-cone, infinity-gauntlet, monster, pistol, redbull, skull-dagger, sparkler, telescope, tennis-racket, trophy, wand, white-monster
- **left_hand** (21): ZYN, banana, book, donut, dumbbell, fishing-rod, flower, handbag, money-bag, paintbrush, ping-gameboy, ping-gameboy(Pink), pizza-slice, popcorn, redbull, skateboard, snowball, sparkler, thor-hammer, umbrella, wallet
- **accessory** (20): arcade-machine, birdhouse, boombox, campfire, fire-hydrant, hello-kitty-pet, mailbox, nuke, pC-gamer, pS5-(right), pet-apu, pet-cheese, plant-pot, rocket, shopping-cart, snowman, stove, treasure-chest, washing-machine, xbox-gamer

## REMOVE - live library (4)

- **head** (3): cat-ears-v2, beanie, chef-hat
- **mouth** (1): lollipop

## FIX - pending, not shipped (8)

- **mouth** (4): carrot, corn-cob, harmonica, ice-pop
- **face** (3): coin-slot-eyes, x-ray-glasses, tape-x-eyes
- **accessory** (1): vending-machine

## REMOVE - pending, delete the file (9)

- **mouth** (3): birthday-candle, paperclip-bite, straw-drink
- **face** (6): static-tv-eyes, peace-sign-stickers, newspaper-eye-holes, coin-slot-eyes, tape-x-eyes, x-ray-glasses

## Retake - rebuild vetting, 2026-09-13 (10)

Owner vetted the rebuilt art. These rebuilds were rejected and moved to
`.trait-work/retake/`; the live art stays until a new take is accepted.
beanie, chef-hat, lollipop (live) and coin-slot-eyes, tape-x-eyes,
x-ray-glasses (pending) were ruled REMOVE in the same pass, listed above.

- **head** (1): wizard-hat
- **face** (4): aviators, blindfold, monocle, tears-of-joy
- **mouth** (4): carrot, corn-cob, harmonica, ice-pop
- **right_hand** (1): skull-dagger

_Every name resolved to a real file._

## Parked - pulled from prod, 2026-09-13

Owner: "nothing but good traits in prod". The 29 FIX traits whose rebuild
had not shipped were moved out of `public/traits/` to
`.trait-work/parked/` (gitignored, local only). A trait goes back only as
an accepted rebuild; the parked file is the old art, kept for reference.

- **face** (4): aviators, blindfold, monocle, tears-of-joy
- **head** (1): wizard-hat
- **right_hand** (1): skull-dagger
- **left_hand** (6): handbag, skateboard, snowball, sparkler, thor-hammer, umbrella
- **accessory** (17): arcade-machine, boombox, campfire, fire-hydrant, nuke, pC-gamer, pS5-(right), pet-apu, pet-cheese, plant-pot, rocket, shopping-cart, snowman, stove, treasure-chest, washing-machine, xbox-gamer

## Owner rulings, 2026-09-13

- master-chief-helmet, infinity-gauntlet, redbull (both hands): keep as is.
- wif-tattoo, reimu-x-wif-tee: keep. Owner wants the same treatment for
  Robinhood Chain: Robinhood logo, ETH, Pons traits (add to the Robin Hood drop).

## Vetting pass 2, 2026-09-13 (pending + code-drawn live)

- **Shipped (16, GOOD):** auras autumn-leaves, black-hole, candy-land,
  casino-jackpot, cherry-soda, comic-burst, crystal-cave, lava-lamp,
  meteor-shower, rave-lasers, server-room, tie-dye, void; faces
  glowing-scanner-eye, googly-eyes, groucho-glasses.
- **FIX, pending (2):** candy-cane_mouth, vending-machine_accessory (clips the
  frame edge). In `.trait-work/retake/`.
- **FIX, live (11), parked** in `.trait-work/parked/`: halo, viking-helmet,
  3d-glasses, bandana-mask, sleepy-eyes, wink, gum-bubble, tongue-out, whistle,
  anchor-tattoo, matrix-code.
- Code-drawn live traits left unmarked are GOOD: bong, camera, dizzy-eyes,
  flannel-shirt, hawaiian-shirt, heart-tattoo, hoodie, kite, lightning-tattoo,
  mustache-only, rubber-duck, sailor-shirt, star-tattoo.
