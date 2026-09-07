import { motion, useReducedMotion } from 'framer-motion';
import React from 'react';
import { ROADMAP_STEPS, type RoadmapStatus } from '../utils/constants';

export type RoadmapStep = {
  id: string;
  title: string;
  description: string;
  status: RoadmapStatus;
};

/**
 * Status is carried by a written label as well as a colour, so it survives
 * colour-blindness and greyscale.
 *
 * The three empty "future phase" placeholders that used to pad this list are
 * gone. Blank greyed cards do not read as anticipation, they read as having
 * nothing to say.
 */
const STATUS_META: Record<RoadmapStatus, { label: string; dot: string; text: string }> = {
  completed: { label: 'Shipped', dot: 'bg-positive', text: 'text-positive' },
  'in-progress': { label: 'In progress', dot: 'bg-brand', text: 'text-accent-ink' },
  upcoming: { label: 'Planned', dot: 'bg-ink-faint', text: 'text-ink-faint' },
};

const Roadmap: React.FC = () => {
  const reduceMotion = useReducedMotion();

  return (
    <section id="roadmap" className="container scroll-mt-24 border-t border-hairline py-16 sm:py-20">
      <div className="mb-8 flex items-baseline justify-between gap-4">
        <h2 className="font-display text-h2 font-bold text-ink">Roadmap</h2>
        <p className="hidden text-meta text-ink-muted sm:block">What is done, and what is next.</p>
      </div>

      <ol className="divide-y divide-hairline border-y border-hairline">
        {ROADMAP_STEPS.map((step, index) => {
          const meta = STATUS_META[step.status];

          return (
            <motion.li
              key={step.id}
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: index * 0.06, duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
              className="grid grid-cols-1 gap-x-8 gap-y-2 py-6 sm:grid-cols-[10rem_1fr]"
            >
              <div className="flex items-center gap-2">
                <span aria-hidden="true" className={`size-1.5 shrink-0 rounded-pill ${meta.dot}`} />
                <span className={`text-micro font-semibold uppercase tracking-wider ${meta.text}`}>
                  {meta.label}
                </span>
              </div>

              <div>
                <h3 className="font-display text-h3 font-bold text-ink">{step.title}</h3>
                <p className="type-prose mt-2 text-body text-ink-muted">{step.description}</p>
              </div>
            </motion.li>
          );
        })}
      </ol>
    </section>
  );
};

export default Roadmap;
