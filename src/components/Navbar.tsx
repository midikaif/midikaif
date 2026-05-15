/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { useState } from "react";

interface NavbarProps {
  onAboutClick: () => void;
}

export default function Navbar({ onAboutClick }: NavbarProps) {
  const [isDark, setIsDark] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    // Detect if we've scrolled enough to be over the dark section
    // The Hero + Marquee usually take about one viewport height
    if (latest > window.innerHeight * 0.7) {
      setIsDark(true);
    } else {
      setIsDark(false);
    }
  });

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-6 py-8 md:px-12 md:py-10 flex justify-end items-center pointer-events-none transition-colors duration-500">
      <div className={`flex gap-6 md:gap-10 pointer-events-auto border p-4 px-8 rounded-full backdrop-blur-2xl shadow-2xl transition-all duration-500 ${
        isDark ? "bg-black/60 border-white/10 text-dark-text" : "bg-white/80 border-black/10 text-brand-text"
      }`}>
        {["Works", "About", "Contact"].map((item) => (
          <motion.a
            key={item}
            href={item === "About" ? undefined : `#${item.toLowerCase()}`}
            onClick={(e) => {
              if (item === "About") {
                e.preventDefault();
                onAboutClick();
              }
            }}
            className="text-xs uppercase tracking-widest font-medium hover:opacity-50 transition-opacity cursor-pointer"
            whileHover={{ y: -1 }}
          >
            {item}
          </motion.a>
        ))}
      </div>
    </nav>
  );
}
