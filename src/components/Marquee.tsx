/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";

const MARQUEE_ITEMS = [
  "Open for freelance work",
  "Full-stack developer",
  "React / Next.js / Node.js",
  "Building scalable apps",
  "Based in India",
];

export default function Marquee() {
  const content = (
    <div className="flex items-center gap-8 px-4 whitespace-nowrap py-3">
      {MARQUEE_ITEMS.map((item, i) => (
        <div key={i} className="flex items-center gap-8">
          <span className="text-[11px] uppercase tracking-widest font-bold">
            {item}
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-brand-text" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="sticky bottom-0 left-0 w-full bg-brand-accent overflow-hidden z-20 border-y border-black/10">
      <div className="flex relative">
        <motion.div
          className="flex"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {content}
          {content}
        </motion.div>
      </div>
    </div>
  );
}
