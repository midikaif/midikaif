import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Download } from 'lucide-react';

interface Capability {
  title: string;
  description: string;
}

const CAPABILITIES: Capability[] = [
  {
    title: "Distributed Systems & Microservices",
    description: "Expertise in decoupling architectures. I deploy dynamic React/Next.js frontends on Vercel and robust Python/FastAPI or Node.js backends on Render, actively solving cross-origin routing, CORS, and latency challenges inherent in microservice environments."
  },
  {
    title: "AI Integration & Semantic Caching",
    description: "Building smart, generative features using the Google Gemini API. I engineer RAG pipelines using Pinecone vector databases and implement semantic caching to resolve 'vector dilution' and drastically reduce LLM API costs."
  },
  {
    title: "Backend Reliability Engineering",
    description: "Focusing on systems that don't fail silently. I build fault-tolerant APIs, write custom global exception handlers to surface hidden serverless errors, and eliminate complex WebSocket race conditions for high availability."
  },
  {
    title: "Cinematic UI Engineering",
    description: "Crafting premium, award-winning frontend interactions using GSAP, Framer Motion, and Tailwind CSS. I bridge the gap between heavy backend logic and flawless, 60fps glassmorphic user experiences."
  }
];

const CapabilityCard = ({ capability }: { capability: Capability }) => {
  return (
    <motion.div 
      className="group relative bg-white border border-black/10 rounded-2xl p-6 md:p-8 flex flex-col justify-between transition-all duration-500 hover:bg-[#0a0a0a] hover:scale-[1.02] cursor-default h-full overflow-hidden"
    >
      {/* Rings Decorative SVG - visible on hover */}
      <svg className="absolute -right-20 -top-20 w-80 h-80 opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="40" stroke="white" strokeWidth="0.5" fill="none" />
        <circle cx="100" cy="100" r="60" stroke="white" strokeWidth="0.5" fill="none" />
        <circle cx="100" cy="100" r="80" stroke="white" strokeWidth="0.5" fill="none" />
        <circle cx="100" cy="100" r="100" stroke="white" strokeWidth="0.5" fill="none" />
      </svg>

      <div className="relative z-10">
        <div className="w-10 h-[1px] bg-black/20 group-hover:bg-white/30 transition-colors duration-500 mb-6" />
        <h3 className="text-xl md:text-2xl font-medium tracking-tight text-[#0a0a0a] group-hover:text-white transition-colors duration-500 mb-4 leading-tight">
          {capability.title}
        </h3>
        <p className="text-sm md:text-base leading-relaxed text-[#0a0a0a]/60 group-hover:text-gray-400 transition-colors duration-500">
          {capability.description}
        </p>
      </div>

      <div className="relative z-10 flex justify-end mt-8">
        <div className="bg-black/5 group-hover:bg-white/10 p-3 rounded-full transition-all duration-500 group-hover:-rotate-45">
          <ArrowRight className="w-5 h-5 text-black/40 group-hover:text-white transition-colors duration-500" />
        </div>
      </div>
    </motion.div>
  );
};

export default function Capabilities() {
  return (
    <section id="capabilities" className="relative w-full min-h-screen md:min-h-0 lg:min-h-screen py-16 md:py-24 lg:py-32 px-6 lg:px-12 bg-[#fdf8f5] text-[#0a0a0a] overflow-hidden flex items-center">
      {/* Massive Watermark */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span className="text-[15vw] font-black uppercase text-black/[0.03] leading-none whitespace-nowrap">
          CAPABILITIES
        </span>
      </div>

      <div className="relative z-10 container mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">
          
          {/* Left Column - Intro */}
          <div className="w-full lg:w-1/3 lg:sticky lg:top-32 h-fit">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="border border-[#0a0a0a]/30 rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-[0.3em] inline-block mb-8 opacity-70">
                Capabilities
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-[0.95] text-[#0a0a0a] mb-8">
                A comprehensive look at my engineering capabilities and how I build scalable systems.
              </h2>
              <p className="text-base md:text-lg text-[#0a0a0a]/60 leading-relaxed mb-10 max-w-md">
                Focusing on microservices, AI integration, and fault-tolerant architecture to deliver high-performance, resilient digital experiences.
              </p>
              
              <motion.a
                href="/MD_KAIF_KHAN_Resume.pdf"
                download="MD_KAIF_KHAN_Resume.pdf"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#0a0a0a] text-white px-8 py-3.5 rounded-full flex items-center gap-3 font-semibold group transition-all text-sm inline-flex"
              >
                View Resume
                <Download className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
              </motion.a>
            </motion.div>
          </div>

          {/* Right Column - Grid */}
          <div className="w-full lg:w-2/3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {CAPABILITIES.map((capability, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <CapabilityCard capability={capability} />
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
