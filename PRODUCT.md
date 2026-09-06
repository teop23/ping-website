# Product

## Register

brand

## Users

Arriving, in priority order:

1. **Robinhood Chain / Pons traders.** Scanning launchpad listings, comparing dozens of tokens in a sitting, low patience, high skepticism. They have seen a thousand launch sites this month and most were empty. They are looking for reasons to dismiss, not reasons to stay.
2. **Crypto X / meme audience.** Came from a shared image or a Space. Here for the character and the community, not the fundamentals.
3. **Traders new to memecoins.** Robinhood's mainstream base touching an on-chain launchpad for the first time. Need more explanation than a degen does, and are the most easily spooked by anything that looks like a scam.

Explicitly NOT an audience: existing $PING holders on Solana. The Robinhood Chain launch is a clean slate, not a migration, so the site carries no migration or bridging messaging.

## Product Purpose

$PING is a memecoin launching on Pons, on Robinhood Chain. The site is the project's credibility surface.

Robinhood Chain and Pons are both new. Thousands of tokens deploy there weekly and nearly all of them have no site, or a template. In that context a real site is the signal: it says someone is actually building, and it is the cheapest available proof that the project is semi serious.

Three jobs, none of which can be sacrificed for the others:

- Sell the token (contract, chart, where to buy)
- Run the PFP builder (the thing people actually use and share)
- Point at the community (X, Telegram, daily Spaces)

Success is a Pons trader landing from a listing, spending thirty seconds, and concluding this one is not a rug.

## Brand Personality

**Deadpan, precise, confident.**

The interface never jokes. The character does. A penguin holding a bazooka is funny in inverse proportion to how seriously the surface around it behaves, so the surface behaves like an exchange product: exact numbers, real spacing, no winking, no exclamation marks. Restraint is the delivery mechanism for the comedy, and simultaneously the credibility signal.

Voice: short declaratives. States facts, does not hype. Never says "revolutionary", "the future of", "join the movement", or "LFG". If a sentence would embarrass a real fintech product page, it is cut.

## Anti-references

All four confirmed by the user, all four to be actively avoided:

- **A Pons clone.** Same acid lime on neutral black, same graduated-token card grid, same Inter + Instrument Serif pairing, same 24px rounded panels. The target audience arrives directly from that site and will read a copy instantly. Differentiation must come from typography, layout language, density and motion, because the palette is deliberately shared.
- **An official Robinhood property.** Using RH's exact brand colors is intentional and fine. Using their marks, their product layouts, or any wording implying endorsement is not. Pons itself is not an official Robinhood product and neither is this. No RH logos, no "official", no affiliation claims.
- **Generic pump.fun memecoin site.** Rainbow gradients, floating 3D coins, "HOW TO BUY" in four steps with wallet icons, marquee tickers, comic energy. The current site is partway here.
- **Corporate Web3 SaaS.** Purple-to-blue gradients, glassmorphism, abstract 3D blobs, "The Future of X" hero copy. Reads serious, says nothing, fools nobody.

## Design Principles

1. **Credibility is the product.** Every decision is judged against a skeptical trader giving the page thirty seconds. Polish is not vanity here; it is the entire argument.
2. **Deadpan delivery.** The interface plays it straight so the character can be absurd. Any element that tries to be funny on its own weakens both.
3. **Show the machine.** The trait system, the image API, the generator, the community-made traits. Working software is the proof that claims cannot provide. Surface it rather than describing it.
4. **Respect the scan.** These users compare dozens of tokens. Contract address, chart, and what this thing is must land without scrolling and without hunting.
5. **Earn the accent.** One accent color, used rarely. When lime appears it means something: a live state, the primary action, a real number. Spraying it everywhere spends the only emphasis the palette has.

## Accessibility & Inclusion

- **WCAG 2.1 AA.** Body text ≥4.5:1, large text ≥3:1, verified rather than assumed. On a near-black surface with a single high-chroma accent, contrast discipline is also what separates this from a cheap dark theme.
- **Full keyboard navigation**, including the trait builder. Visible focus states throughout, never `outline: none` without a replacement.
- `prefers-reduced-motion: reduce` honored on every animation, with a crossfade or instant alternative rather than a dropped feature.
- Lime `#CCFF00` on near-black is a strong contrast pair, but it must never be the *only* channel carrying meaning. Live/success/error states need a shape, icon, or label alongside the color for color-blind users.
- The builder is image-heavy by nature. Every trait, control, and generated result needs a text label or alt text; the canvas needs an accessible description of the current selection.
