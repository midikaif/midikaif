/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

const PROJECTS = [
  { name: "CogniChat", href: "#cognichat" },
  { name: "VakeelIt", href: "#vakeelit" },
];

export default function ProjectList() {
  return (
    <div className="w-full max-w-md ml-auto">
      <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-black/40 mb-8">
        Selected Projects
      </p>
      <div className="flex flex-col">
        {PROJECTS.map((project, index) => (
          <motion.a
            key={project.name}
            href={project.href}
            className="group relative flex items-center justify-between py-6 border-b border-brand-divider overflow-hidden"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index, duration: 0.5 }}
          >
            <motion.span 
              className="text-2xl md:text-3xl font-medium tracking-tight transition-all duration-300 group-hover:translate-x-4 opacity-70 group-hover:opacity-100"
            >
              {project.name}
            </motion.span>
            
            <div className="flex items-center pr-2">
              <motion.div
                className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
              >
                <ArrowRight className="w-6 h-6 stroke-[1.5px]" />
              </motion.div>
            </div>

            {/* Subtle background reveal on hover */}
            <motion.div 
              className="absolute inset-0 bg-black/5 -z-10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"
            />
          </motion.a>
        ))}
      </div>
    </div>
  );
}
