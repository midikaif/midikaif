/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import ProjectList from "./ProjectList";
import Marquee from "./Marquee";

export default function Hero() {
  return (
    <>
      <section className="relative min-h-screen md:min-h-[unset] md:py-32 lg:py-0 lg:min-h-screen flex items-center px-6 md:px-12 pt-32 pb-24 overflow-hidden">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
          
          {/* Left Side: Intro */}
          <motion.div
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
             className="flex flex-col gap-8 md:gap-12"
          >
            <div className="space-y-2">
              <motion.h1 
                className="text-[14vw] md:text-[8vw] lg:text-[7.5vw] font-bold leading-[0.9] tracking-[-0.04em] whitespace-nowrap"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              >
                Md <br />
                Kaif Khan.
              </motion.h1>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 1 }}
              className="max-w-md space-y-6"
            >
              <p className="text-xl md:text-2xl font-normal leading-tight text-brand-text/80">
                Building scalable backend systems and AI-powered products.
              </p>
              
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
                <span className="text-sm font-medium tracking-tight text-brand-text/60">
                  Available for work
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side: Projects */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <ProjectList />
          </motion.div>
        </div>

        {/* Background Decorative Element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 opacity-[0.03] pointer-events-none">
          <h2 className="text-[40vw] font-bold select-none leading-none">
            PORTFOLIO
          </h2>
        </div>
      </section>
      <Marquee />
    </>
  );
}
