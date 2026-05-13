/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, X, Sparkles } from "lucide-react";

const impactData = [
  {
    title: "Semantic Caching & Cost Reduction",
    subtitle: "98% Cache Hit Rate",
    tags: ["Node.js", "Pinecone", "RAG"],
    description: "Architected a RAG pipeline with Pinecone and Node.js. Decoupled search indexes from metadata to resolve 'vector dilution', achieving a 98% cache hit rate and reducing Gemini LLM API calls by 50%."
  },
  {
    title: "Real-Time Architecture",
    subtitle: "Race Condition Elimination",
    tags: ["Socket.io", "React Context"],
    description: "Engineered WebSocket layers using Socket.io and React Context. Fixed 'Context Ripple' render thrashing and implemented Singleton patterns to eliminate race conditions and memory leaks."
  },
  {
    title: "Backend Reliability Engineering",
    subtitle: "Fault Tolerant Systems",
    tags: ["Python", "FastAPI", "Native"],
    description: "Handled silent serverless Vercel crashes in a Python/FastAPI and React Native monorepo by writing custom Global Exception Handlers to package and surface Python stack traces directly to the browser."
  },
  {
    title: "Latency Masking",
    subtitle: "50% Latency Reduction",
    tags: ["Concurrency", "Embeddings"],
    description: "Reduced 'First Time to Byte' latency from 3s to 1.5s using Promise.all concurrency and offloading heavy vector embeddings to background processes (Fire-and-Forget)."
  }
];

export default function EngineeringImpact() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const nextCard = () => {
    setActiveIndex((prev) => (prev + 1) % impactData.length);
  };

  return (
    <section id="impact" className="relative min-h-[1000px] flex items-center justify-center bg-[#0a0a0a] py-32 px-6 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-purple-600/10 blur-[180px] rounded-full pointer-events-none" />

      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.button
            key="pill"
            layoutId="container"
            onClick={() => setIsOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative flex items-center gap-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-10 py-5 text-white shadow-2xl transition-colors hover:bg-white/10 overflow-hidden"
          >
            <motion.div 
               layoutId="glow"
               className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-lime-400/20 opacity-0 group-hover:opacity-100 transition-opacity" 
            />
            <Sparkles className="w-5 h-5 text-[#c4f022]" />
            <span className="text-sm font-black uppercase tracking-[0.4em] relative z-10">View Engineering Impact</span>
          </motion.button>
        ) : (
          <motion.div
            key="expanded"
            layoutId="container"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-2xl min-h-[700px] bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 md:p-14 relative flex flex-col shadow-[0_40px_120px_rgba(0,0,0,0.6)]"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-16 relative z-30">
              <div className="space-y-1">
                <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-[#c4f022]">Archive / 01</h2>
                <p className="text-2xl font-bold text-white tracking-tighter">Engineering Case Studies</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-4 rounded-full bg-white/5 border border-white/10 text-white hover:bg-red-500/20 hover:border-red-500/30 transition-all"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* The Stacked Card Area */}
            <div className="flex-1 relative flex items-center justify-center perspective-[1200px] min-h-[450px]">
              {impactData.map((item, index) => {
                const isActive = index === activeIndex;
                const isNext = index === (activeIndex + 1) % impactData.length;
                const isPrevious = index === (activeIndex - 1 + impactData.length) % impactData.length;
                
                // Only render active, next and previous for performance and stack logic
                if (!isActive && !isNext && !isPrevious) return null;

                const position = 
                  index === activeIndex ? 0 : 
                  index === (activeIndex + 1) % impactData.length ? 1 : -1;

                return (
                  <motion.div
                    key={item.title}
                    style={{ zIndex: 10 - Math.abs(position) }}
                    animate={{
                      y: position * 50,
                      x: position * 10,
                      scale: 1 - Math.abs(position) * 0.1,
                      opacity: 1 - Math.abs(position) * 0.5,
                      rotateX: position * -10,
                    }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 250, 
                      damping: 30,
                      mass: 1
                    }}
                    onClick={() => {
                        if (!isActive) setActiveIndex(index);
                    }}
                    className="absolute inset-0 transition-all duration-300"
                  >
                    <div className={`w-full h-full bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-[2.5rem] p-8 md:p-10 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group ${isActive ? 'cursor-default' : 'cursor-pointer hover:border-[#c4f022]/20'}`}>
                      {/* Grid background inside card */}
                      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] bg-[size:24px_24px]" />
                      
                      <div className="relative z-10 space-y-6 md:space-y-8">
                        <div className="flex justify-between items-start">
                          <div className="flex flex-wrap gap-2">
                            {item.tags.map((tag) => (
                              <span 
                                key={tag} 
                                className="text-[9px] font-black tracking-widest text-[#c4f022]/60 border border-[#c4f022]/10 bg-[#c4f022]/5 px-2.5 py-1.5 rounded-full uppercase"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <span className="text-[10px] font-black text-white/10 tracking-[0.2em]">CASE_00{index + 1}</span>
                        </div>
 
                        <div className="space-y-4 md:space-y-6">
                          <h3 className="text-2xl md:text-4xl font-bold text-white tracking-tighter leading-[1.1] max-w-[90%]">
                            {item.title}
                          </h3>
                          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#c4f022]/10 border border-[#c4f022]/20 text-[#c4f022] text-[10px] md:text-[11px] font-black uppercase tracking-wider shadow-[0_0_20px_rgba(196,240,34,0.1)]">
                            <Sparkles className="w-3.5 h-3.5" />
                            {item.subtitle}
                          </div>
                          <p className="text-zinc-400 text-sm md:text-base leading-relaxed font-light">
                            {item.description}
                          </p>
                        </div>
                      </div>
 
                      {isActive && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="relative z-10 flex justify-end pt-4"
                        >
                          <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                nextCard();
                            }}
                            className="group flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-white hover:text-[#c4f022] transition-colors cursor-pointer"
                          >
                            Explore Next
                            <ChevronRight className="w-5 h-5 text-[#c4f022] group-hover:translate-x-1.5 transition-transform" />
                          </button>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>


            {/* Pagination / Progress */}
            <div className="mt-16 flex justify-between items-center relative z-30">
               <div className="flex gap-2.5">
                  {impactData.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setActiveIndex(i)}
                        className={`h-1.5 rounded-full transition-all duration-500 ${
                            i === activeIndex ? "bg-[#c4f022] w-12" : "bg-white/10 w-4 hover:bg-white/20"
                        }`}
                        aria-label={`Go to case ${i + 1}`}
                    />
                  ))}
               </div>
               <span className="text-[10px] font-black text-white/30 tracking-[0.4em] uppercase">
                 {activeIndex + 1} / {impactData.length}
               </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
