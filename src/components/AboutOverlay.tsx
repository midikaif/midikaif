/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence, useSpring, useMotionValue } from "motion/react";
import { useEffect, useState, useRef, MouseEvent } from "react";
import { X } from "lucide-react";

interface AboutOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutOverlay({ isOpen, onClose }: AboutOverlayProps) {
  const [isHoveringEdge, setIsHoveringEdge] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Soft spring for the magnetic button
  const springConfig = { damping: 25, stiffness: 150 };
  const buttonX = useSpring(mouseX, springConfig);
  const buttonY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleEsc = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleMouseMove = (e: MouseEvent) => {
    // We want the button to follow the cursor within the interaction zone
    // and emerge from the edge of the panel.
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end outline-none overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
          />

          {/* Magnetic Interaction Area (Active strip to the left of panel) */}
          <AnimatePresence>
            {isHoveringEdge && (
              <motion.div 
                className="absolute top-0 bottom-0 left-0 right-[55%] md:right-[65%] lg:right-[55%] z-[110] hidden md:block"
                onMouseMove={handleMouseMove}
              >
                <motion.div
                  style={{
                    left: buttonX,
                    top: buttonY,
                    translateX: "-50%",
                    translateY: "-50%",
                    position: "fixed",
                  }}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  onClick={onClose}
                  className="w-28 h-28 bg-dark-bg text-dark-text rounded-full flex flex-col items-center justify-center cursor-pointer shadow-2xl border border-white/10 group"
                >
                  <X className="w-5 h-5 mb-1 group-hover:rotate-90 transition-transform duration-500" />
                  <span className="text-[10px] uppercase tracking-[0.2em] font-black">Close</span>
                </motion.div>
              </motion.div>
            )}
            {!isHoveringEdge && (
              <div 
                className="absolute top-0 bottom-0 left-0 right-[55%] md:right-[65%] lg:right-[55%] z-[110] hidden md:block"
                onMouseEnter={() => setIsHoveringEdge(true)}
              />
            )}
          </AnimatePresence>

          {/* About Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 35, stiffness: 200, mass: 1 }}
            onMouseLeave={() => setIsHoveringEdge(false)}
            className="relative w-full md:w-[65%] lg:w-[55%] h-full bg-[#fdfdfd] text-[#111111] shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-y-auto z-[105]"
          >
            <div className="max-w-3xl mx-auto px-6 sm:px-12 md:px-20 py-16 md:py-24 min-h-full flex flex-col">
              
              {/* Top Area */}
              <div className="flex justify-between items-start mb-20 md:mb-32">
                <div className="space-y-4">
                  <h2 className="text-[10px] uppercase tracking-[0.5em] font-black text-brand-accent">About Me</h2>
                  <p className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-black text-stone-400">Md Kaif Khan — Software Engineer</p>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="md:hidden flex items-center gap-3 px-6 py-3 border border-black/10 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm bg-white"
                >
                  <X className="w-3 h-3" />
                  Close
                </motion.button>
              </div>

              {/* Main Content */}
              <div className="space-y-8 md:space-y-12">
                <motion.h1 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight leading-none text-[#111]"
                >
                  About Me.
                </motion.h1>

                <div className="space-y-8 md:space-y-10 text-lg md:text-xl text-stone-600 font-light leading-relaxed max-w-2xl">
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl md:text-3xl font-medium text-black leading-tight"
                  >
                    Architecting systems that balance deep intelligence with absolute reliability.
                  </motion.h2>
                  
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    I am a full-stack developer obsessed with the intersection of scalable systems and AI-powered product engineering. My journey is defined by a commitment to backend maturity—ensuring that real-time communication platforms and multi-modal AI agents don&apos;t just work, but excel under production stress.
                  </motion.p>
                  
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    From solving non-deterministic WebSocket race conditions to engineering RAG architectures with extreme semantic efficiency, I focus on the engineering details that matter. My expertise across Node.js, FastAPI, and React allows me to bridge the gap between complex infrastructure and premium user experiences.
                  </motion.p>
                </div>
              </div>

              {/* Approach Section */}
              <div className="mt-40">
                <motion.h3 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="text-[10px] uppercase tracking-[0.5em] font-black text-stone-300 mb-16"
                >
                  Problem Solving Approach
                </motion.h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-20">
                  {[
                    {
                      title: "Real-time Architecture",
                      desc: "Taming WebSockets and distributed state to build fluid, low-latency communication layers."
                    },
                    {
                      title: "AI Workflow Engineering",
                      desc: "Designing production-grade LLM pipelines with strict JSON schemas and multi-modal parsing."
                    },
                    {
                      title: "System Reliability",
                      desc: "Architecting for the edge case. Implementing resilient retry patterns and fault-tolerant APIs."
                    },
                    {
                      title: "Performance Tuning",
                      desc: "Achieving sub-second latencies through aggressive caching, vector indexing, and parallel processing."
                    },
                    {
                      title: "Technical Maturity",
                      desc: "Building systems that are maintainable, observable, and ready for global scale from day zero."
                    },
                    {
                      title: "Complex Debugging",
                      desc: "Finding the needle in the haystack. Systematic resolution of async bottlenecks and race conditions."
                    }
                  ].map((item, i) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="group space-y-4"
                    >
                      <div className="h-[1px] w-full bg-stone-100 group-hover:bg-brand-accent transition-colors duration-500" />
                      <h4 className="text-sm font-bold uppercase tracking-[0.2em]">{item.title}</h4>
                      <p className="text-base text-stone-500 font-light leading-relaxed group-hover:text-black transition-colors duration-300">
                        {item.desc}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Certifications Section */}
              <div className="mt-40">
                <motion.h3 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="text-[10px] uppercase tracking-[0.5em] font-black text-stone-300 mb-16"
                >
                  Certifications & Recognition
                </motion.h3>

                <div className="space-y-12">
                  {[
                    {
                      institution: "Harvard University",
                      title: "CS50P: Introduction to Programming with Python",
                      year: "2025",
                      href: "https://cs50.harvard.edu/certificates/01978369-7a2b-4f33-bfc6-6743d602e251"
                    },
                    {
                      institution: "Sheriyans Coding School",
                      title: "Full-Stack Development Mastery",
                      year: "2025",
                      href: "#" // Placeholder
                    },
                    {
                      institution: "Sheriyans Hackathon",
                      title: "Hackathon Recognition — Architectural Excellence",
                      year: "2025",
                      href: "#" // Placeholder
                    }
                  ].map((cert, i) => (
                    <motion.div
                      key={cert.title}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="group flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-stone-100 pb-8"
                    >
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-widest font-black text-brand-accent">{cert.institution}</p>
                        <h4 className="text-xl md:text-2xl font-medium text-black group-hover:translate-x-2 transition-transform duration-500">{cert.title}</h4>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className="text-sm font-mono text-stone-400">{cert.year}</span>
                        {cert.href !== "#" && (
                          <a 
                            href={cert.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-stone-100 hover:bg-brand-accent hover:text-white transition-all rounded-full"
                          >
                            Verify
                          </a>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Footer / Connect */}
              <div className="mt-auto pt-40 pb-12">
                <div className="flex flex-col gap-10 pt-12 border-t border-stone-100">
                  <div className="space-y-4 max-w-full overflow-hidden">
                    <p className="text-[10px] uppercase tracking-[0.3em] font-black text-stone-300">Drop a line</p>
                    <a 
                      href="mailto:mdkaif0153@gmail.com" 
                      className="text-2xl md:text-3xl font-light tracking-tight hover:text-brand-accent transition-colors underline decoration-stone-200 underline-offset-8 break-all block"
                    >
                      mdkaif0153@gmail.com
                    </a>
                  </div>
                  <div className="flex flex-wrap gap-x-8 gap-y-4">
                    {[
                      { name: "LinkedIn", url: "https://linkedin.com/in/md-kaif-khan" },
                      { name: "GitHub", url: "https://github.com/midikaif" }
                    ].map(link => (
                      <a 
                        key={link.name} 
                        href={link.url} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold uppercase tracking-[0.2em] hover:text-brand-accent transition-colors"
                      >
                        {link.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
