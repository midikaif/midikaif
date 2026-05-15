
import React from 'react';
import { motion, AnimatePresence } from "motion/react";
import { X, ArrowRight, Zap, Shield, Cpu, Code2, Server, Globe } from "lucide-react";

interface CaseStudyContent {
  title: string;
  subtitle: string;
  role: string;
  duration: string;
  challenge: string;
  approach: string[];
  solution: string;
  result: string;
  techStack: string[];
  metrics: { label: string; value: string }[];
}

const CASE_STUDIES: Record<string, CaseStudyContent> = {
  "CogniChat": {
    title: "High-Performance RAG & AI Orchestration",
    subtitle: "Optimizing end-to-end latency and state synchronization in a real-time AI environment.",
    role: "Lead Full-Stack Developer",
    duration: "4 Months",
    challenge: "The initial RAG (Retrieval Augmented Generation) pipeline suffered from high 'First Byte' latency (up to 3s) and complex Socket.io race conditions during chat mounting.",
    approach: [
      "Re-architected Socket.io handlers with a conditional 'Fast Path' for first messages.",
      "Implemented Promise.all for concurrent MongoDB and Pinecone vector database queries.",
      "Developed a custom Axios interceptor to manage dynamic environment fallbacks natively.",
      "Stabilized component lifecycle with useRef to bridge the async gap in React state updates."
    ],
    solution: "By decoupling the user response from back-end maintenance and using 'Fire-and-Forget' patterns for vector storage, I was able to prioritize the AI's reply stream above all else.",
    result: "Reduced average response latency from 3s to 1.5s (50% reduction). Achieved >98% cache hit rate with semantic caching, reducing Gemini API costs significantly.",
    techStack: ["React", "FastAPI", "MongoDB", "Pinecone", "Socket.io", "Gemini API"],
    metrics: [
      { label: "Latency Reduction", value: "50%" },
      { label: "Cache Hit Rate", value: ">98%" },
      { label: "Cost Saving", value: "50%" }
    ]
  },
  "VakeelIt": {
    title: "Scalable Monorepo & Deployment Engineering",
    subtitle: "Solving production-only cascading failures in a cross-platform serverless environment.",
    role: "Full-Stack Engineer",
    duration: "3 Months",
    challenge: "Encountered critical silent 500 errors and 404 routing loops upon deploying a FastAPI/React monorepo to a serverless platform (Vercel).",
    approach: [
      "Engineered a 'Global Exception Smuggling' pipeline to surface Python stack traces directly in the browser's network tab.",
      "Optimized Vercel's module resolution by dynamically injecting path configurations into sys.path at runtime.",
      "Built a robust catch-all rewrite system in vercel.json to handle SPA client-side routing.",
      "Refactored network layers to handle EXPO_PUBLIC environment variable drops with dynamic relative-path fallbacks."
    ],
    solution: "I implemented a systematic 'peel-back' debugging approach, identifying that root causes were split across Python pathing, missing dependencies in requirements.txt (dnspython), and CORS loopback blocks.",
    result: "Stabilized the entire monorepo architecture, eliminating 100% of production-only crashes. Avoided the need for managed AWS services, significantly lowering infrastructure overhead.",
    techStack: ["React Native", "Expo", "FastAPI", "Vercel", "Vite"],
    metrics: [
      { label: "Uptime", value: "99.9%" },
      { label: "Infra Cost", value: "-40%" },
      { label: "Debug Time", value: "-75%" }
    ]
  }
};

interface CaseStudyOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

export default function CaseStudyOverlay({ isOpen, onClose, projectId }: CaseStudyOverlayProps) {
  const content = CASE_STUDIES[projectId];

  if (!content) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
        >
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/90 backdrop-blur-3xl" 
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            className="relative w-full max-w-6xl max-h-[90vh] bg-[#111111] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-600/10 flex items-center justify-center border border-red-600/20">
                  <Cpu className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-white">{projectId}</h3>
                  <p className="text-xs text-gray-400">Technical Case Study</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/10"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Content Buffer */}
            <div className="flex-1 overflow-y-auto p-8 md:p-12">
              <div className="max-w-4xl mx-auto space-y-16">
                
                {/* Hero Section */}
                <div className="space-y-6">
                  <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white leading-none">
                    {content.title}
                  </h2>
                  <p className="text-xl md:text-2xl text-gray-400 font-light leading-relaxed">
                    {content.subtitle}
                  </p>
                  <div className="flex flex-wrap gap-4 pt-4">
                    {content.techStack.map(tech => (
                      <span key={tech} className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-300">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {content.metrics.map(metric => (
                    <div key={metric.label} className="p-6 rounded-2xl bg-white/2 border border-white/5 space-y-2">
                      <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">{metric.label}</p>
                      <p className="text-4xl font-black text-red-600 tracking-tighter">{metric.value}</p>
                    </div>
                  ))}
                </div>

                {/* Main Body */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                  <div className="space-y-12">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-red-600">
                        <Zap className="w-5 h-5" />
                        <h4 className="text-sm font-black uppercase tracking-widest">The Challenge</h4>
                      </div>
                      <p className="text-gray-300 leading-relaxed text-lg">
                        {content.challenge}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-red-600">
                        <Code2 className="w-5 h-5" />
                        <h4 className="text-sm font-black uppercase tracking-widest">Technical Approach</h4>
                      </div>
                      <ul className="space-y-4">
                        {content.approach.map((step, i) => (
                          <li key={i} className="flex gap-4 group">
                            <span className="shrink-0 w-6 h-6 rounded-md bg-white/5 flex items-center justify-center text-[10px] font-bold text-gray-500 group-hover:bg-red-600 group-hover:text-white transition-colors">
                              0{i + 1}
                            </span>
                            <span className="text-gray-400 text-sm leading-relaxed">{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-12">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-red-600">
                        <Shield className="w-5 h-5" />
                        <h4 className="text-sm font-black uppercase tracking-widest">The Solution</h4>
                      </div>
                      <p className="text-gray-300 leading-relaxed text-lg italic">
                        "{content.solution}"
                      </p>
                    </div>

                    <div className="space-y-4 p-8 rounded-3xl bg-white/2 border border-white/5 border-dashed">
                      <div className="flex items-center gap-3 text-red-600">
                        <Globe className="w-5 h-5" />
                        <h4 className="text-sm font-black uppercase tracking-widest">Business Result</h4>
                      </div>
                      <p className="text-gray-300 leading-relaxed">
                        {content.result}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Closing Tagline */}
                <div className="pt-16 pb-8 text-center space-y-4 border-t border-white/5">
                  <p className="text-gray-500 text-sm italic italic">
                    Production bugs rarely happen in isolation—they cascade. Engineering a robust observability layer was the key to stabilizing this architecture.
                  </p>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-700">Detailed System Audit Complete</p>
                </div>

              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
