import { motion, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import React, { useEffect } from 'react';
import Builder from '../components/Builder';
import ContractAddress from '../components/ContractAddress';
import HeroCharacter from '../components/HeroCharacter';
import Countdown from '../components/Countdown';
import Roadmap from '../components/Roadmap';
import {
  CHAIN_NAME,
  LAUNCHPAD_NAME,
  SHOW_COUNTDOWN,
  TOKEN_SUPPLY,
} from '../utils/constants';

/**
 * Hard-coded because the manifest only exists after prebuild. Checked
 * against the real library by scripts/generate-index.mjs, which fails the
 * build if this drifts from public/traits - it sat at 176 for a while after
 * the library reached 239.
 */
const TRAIT_COUNT = 293;
const TRAIT_SLOTS = 8;

/**
 * The facts a Pons trader is scanning for, above the fold, in one row.
 * Real numbers, tabular, no adjectives. This is the credibility argument.
 */
const FACTS: { label: string; value: string }[] = [
  { label: 'Chain', value: CHAIN_NAME },
  { label: 'Launchpad', value: LAUNCHPAD_NAME },
  { label: 'Supply', value: TOKEN_SUPPLY.toLocaleString('en-US') },
  { label: 'Traits', value: `${TRAIT_COUNT} across ${TRAIT_SLOTS} slots` },
];

const Home: React.FC = () => {
  const reduceMotion = useReducedMotion();

  // Direct navigation to a hash fragment, e.g. /#roadmap
  useEffect(() => {
    const { hash } = window.location;
    if (!hash) return;

    const element = document.getElementById(hash.slice(1));
    if (!element) return;

    const timer = setTimeout(() => {
      element.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    }, 250);

    return () => clearTimeout(timer);
  }, [reduceMotion]);

  // Honour reduced motion on the hero's own scroll handoff too, not just on
  // hash navigation.
  const handleScrollToBuilder = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById('builder');
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  };

  // One orchestrated entrance, staggered down the fold. Not a fade on every
  // section: content is visible by default and this only animates it in.
  const rise = (delay: number) => ({
    initial: reduceMotion ? false : ({ opacity: 0, y: 16 } as const),
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.5, ease: [0.25, 1, 0.5, 1] as const },
  });

  return (
    <main className="relative">
      {/*
        Lime owns one whole viewport, then hands off to the dark ground where
        the work happens. Drenching the entire page would put every white
        artboard and every black-outlined trait swatch on a clashing
        surface; confining it to the fold keeps the brand loud and the tool
        legible. Near-black on #CCFF00 measures 15.07:1.
      */}
      <section className="flex flex-col text-ink sm:min-h-[calc(100svh-3.5rem)]">
        <div className="container grid flex-1 items-center gap-8 py-12 sm:gap-10 sm:py-12 lg:grid-cols-[minmax(0,1fr)_30rem] lg:gap-16 lg:py-16">
          <div className="flex flex-col gap-8 sm:gap-8 lg:gap-10">
            <div className="w-full max-w-2xl">
              <motion.h1 {...rise(0)} className="type-display font-display text-hero font-extrabold">
                Build a PING.
              </motion.h1>

              <motion.p {...rise(0.08)} className="type-prose mt-6 text-lead text-ink-muted">
                {TRAIT_COUNT} traits. An open image API that renders any combination on
                demand.
              </motion.p>
            </div>

            <motion.dl
              {...rise(0.16)}
              className="grid w-full grid-cols-2 gap-px overflow-hidden rounded-lg border border-hairline bg-hairline sm:grid-cols-4"
            >
              {FACTS.map((fact) => (
                <div key={fact.label} className="bg-raised px-4 py-3.5">
                  <dt className="text-micro font-medium uppercase tracking-wider text-ink-faint">
                    {fact.label}
                  </dt>
                  <dd data-numeric className="mt-1 text-meta font-semibold text-ink">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </motion.dl>

            <ContractAddress />

            {SHOW_COUNTDOWN && <Countdown />}
          </div>

          <motion.div {...rise(0.2)} className="order-first lg:order-none">
            <HeroCharacter />
          </motion.div>
        </div>

        <div className="container hidden pb-8 sm:block">
          <a
            href="#builder"
            onClick={handleScrollToBuilder}
            className="group inline-flex items-center gap-2 text-meta font-semibold text-ink-muted transition-colors duration-fast ease-out-quart hover:text-ink"
          >
            Open the generator
            <ChevronDown
              size={16}
              className="transition-transform duration-normal ease-out-quart motion-safe:group-hover:translate-y-0.5"
            />
          </a>
        </div>
      </section>

      {/* The builder is the proof. Give it the room a product gets, and label
          it so it reads as the working thing rather than a decoration. */}
      <section id="builder" className="container scroll-mt-24 pb-24">
        <div className="mb-5 flex items-baseline justify-between gap-4 border-t border-hairline pt-5">
          <h2 className="font-display text-h3 font-bold text-ink">The generator</h2>
          <p className="hidden text-meta text-ink-muted sm:block">
            Pick traits, shuffle, download. No wallet needed.
          </p>
        </div>

        <motion.div
          {...rise(0.24)}
          className="relative h-[1180px] rounded-lg border border-hairline bg-raised p-3 shadow-panel sm:h-[1100px] sm:p-5 lg:h-[760px]"
        >
          <Builder />
        </motion.div>
      </section>

      <Roadmap />
    </main>
  );
};

export default Home;
