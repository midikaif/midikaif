/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowRight } from "lucide-react";
import CaseStudyOverlay from './CaseStudyOverlay';

gsap.registerPlugin(ScrollTrigger);

interface ProjectData {
  id: string;
  name: string;
  headline: string;
  role: string;
  date: string;
  tags: string[];
  impacts: string[];
  imageColor: string;
  videoUrl?: string;
}

const PROJECTS: ProjectData[] = [
  {
    id: "01",
    name: "CogniChat",
    headline: "AI-powered real-time communication platform.",
    role: "Full Stack Developer",
    date: "2025",
    tags: ["REAL-TIME", "AI/RAG", "VECTOR DB"],
    impacts: [
      "Solved WebSocket race conditions with useRef management.",
      "Reduced latency from 3s to 1.5s using Promise.all.",
      "Achieved >98% cache hit rate with Pinecone integration."
    ],
    imageColor: "from-stone-900 via-stone-800 to-black",
    videoUrl: "/cognichat.mp4"
  },
  {
    id: "02",
    name: "VakeelIt",
    headline: "AI Legal Assistant for automated document analysis.",
    role: "Full Stack Developer",
    date: "2024",
    tags: ["FASTAPI", "OCR", "REACT NATIVE"],
    impacts: [
      "Engineered multi-modal backend with Gemini 2.5 Flash.",
      "Built robust OCR ingestion pipeline for PDF/Image parsing.",
      "Implemented exponential backoff for API resilience."
    ],
    imageColor: "from-blue-950 via-slate-900 to-black",
    videoUrl: "/vakeelit.mp4"
  }
];

function ProjectCard({ project, index, total, onExplore }: { project: ProjectData; index: number; total: number; onExplore: (id: string) => void }) {
  const isLast = index === total - 1;
  return (
    <div 
      id={project.name.toLowerCase()}
      className="relative w-full md:w-screen min-h-screen md:h-[100dvh] flex flex-col justify-center shrink-0 border-b md:border-b-0 md:border-r border-white/5"
    >
      
      {/* Background Watermark Text - Isolated from content flow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
        <h3 className="text-[25vw] md:text-[15vw] font-black text-white/5 whitespace-nowrap leading-none select-none uppercase tracking-tighter">
          {project.name}
        </h3>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 py-20 md:py-12 md:px-16 lg:px-24 flex flex-col md:flex-row items-center gap-8 md:gap-12 lg:gap-16">
        
        {/* Left Column: Content */}
        <div className="w-full md:w-1/2 space-y-5 md:space-y-6 lg:space-y-10">
          <div className="flex flex-col gap-3 md:gap-4">
            <span className="font-mono text-dark-text-muted text-[10px] md:text-xs tracking-widest">{project.id} / 02</span>
            <div className="flex flex-wrap gap-2">
              {project.tags.map(tag => (
                <span key={tag} className="text-[8px] md:text-[9px] font-bold tracking-[0.2em] bg-white/5 border border-white/10 px-3 py-1 rounded-sm text-dark-text-muted uppercase">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-3 md:space-y-4">
            <h2 className="text-4xl md:text-6xl lg:text-8xl font-bold tracking-tighter leading-[0.9] text-white">
              {project.name}
            </h2>
            <p className="text-lg md:text-xl lg:text-2xl text-dark-text-muted font-light leading-snug max-w-xl">
              {project.headline}
            </p>
          </div>
          
          <div className="space-y-3 md:space-y-4 max-w-lg">
             {project.impacts.map((impact, i) => (
               <div key={i} className="flex gap-3 md:gap-4 items-start group">
                 <div className="mt-2 w-1.5 h-1.5 rounded-full bg-[#c4f022] shrink-0" />
                 <p className="text-sm md:text-base lg:text-lg text-dark-text-muted group-hover:text-dark-text transition-colors duration-300">
                    {impact}
                 </p>
               </div>
             ))}
          </div>

          <motion.button 
            onClick={() => onExplore(project.name)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-8 py-4 md:px-10 md:py-5 bg-[#c4f022] text-black rounded-full text-[10px] md:text-xs font-black tracking-widest uppercase hover:shadow-[0_0_30px_rgba(196,240,34,0.3)] transition-all"
          >
            Explore Case Study
          </motion.button>
        </div>

        {/* Right Column: Visual (Reduced size and constrained) */}
        <div className="w-full md:w-1/2 flex justify-center mt-8 md:mt-0">
          <div className="relative w-full max-w-md lg:max-w-xl aspect-square lg:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl group max-h-[50vh] md:max-h-[60vh]">
            <div className={`absolute inset-0 bg-gradient-to-br ${project.imageColor} opacity-40 transition-opacity duration-700 group-hover:opacity-60`} />
            <div className="absolute inset-0 p-4 lg:p-10 flex items-center justify-center">
              <div className="w-full h-full border border-white/10 rounded-2xl bg-black/40 backdrop-blur-3xl flex flex-col relative shadow-2xl transition-transform duration-700 group-hover:scale-[1.02] overflow-hidden">
                 {/* Browser UI Mockup Header */}
                 <div className="h-10 border-b border-white/10 flex items-center px-5 gap-2 bg-white/5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/30" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/30" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/30" />
                </div>
                {/* Mockup Body Content */}
                <div className="flex-1 overflow-hidden">
                  {project.videoUrl ? (
                    <video 
                      src={project.videoUrl} 
                      autoPlay 
                      loop 
                      muted 
                      playsInline 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="p-6 lg:p-10 space-y-6 h-full">
                      <div className="h-4 w-1/3 bg-white/10 rounded-md" />
                      <div className="space-y-3">
                        <div className="h-2 w-full bg-white/5 rounded" />
                        <div className="h-2 w-4/5 bg-white/5 rounded" />
                        <div className="h-2 w-2/3 bg-white/5 rounded" />
                      </div>
                      <div className="aspect-video w-full bg-[#c4f022]/5 rounded-xl border border-[#c4f022]/10 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full border border-[#c4f022]/20 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#c4f022] animate-pulse" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Swipe/Scroll Indicator Arrow */}
      {!isLast && (
        <div className="absolute bottom-6 right-6 md:bottom-12 md:right-12 z-20 pointer-events-none hidden sm:block">
          <div className="flex items-center gap-4">
            <motion.span 
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="text-[10px] font-black uppercase tracking-[0.4em] text-white"
            >
              Next Project
            </motion.span>
            <motion.div 
              animate={{ 
                x: [0, 8, 0],
                backgroundColor: ["rgba(255,255,255,0.1)", "rgba(255,255,255,0.15)", "rgba(255,255,255,0.1)"] 
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="backdrop-blur-md border border-white/10 rounded-full p-3"
            >
              <ArrowRight className="w-5 h-5 text-white/60" />
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProjectShowcase() {
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [activeStudy, setActiveStudy] = useState<string | null>(null);

  useGSAP(() => {
    if (!trackRef.current || !pinRef.current) return;

    const mm = gsap.matchMedia();
    const track = trackRef.current;
    
    mm.add("(min-width: 768px)", () => {
      gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: pinRef.current,
          pin: true,
          start: "top top",
          end: () => `+=${track.scrollWidth - window.innerWidth}`,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progressBarRef.current) {
              gsap.set(progressBarRef.current, { width: `${self.progress * 100}%` });
            }
          },
        },
      });
    });

    return () => mm.revert();
  }, { scope: pinRef });

  return (
    <section id="works" ref={pinRef} className="relative min-h-screen md:h-[100dvh] bg-dark-bg text-dark-text z-30 md:overflow-hidden">
      <div ref={trackRef} className="flex flex-col md:flex-row h-full w-full md:w-max">
        {PROJECTS.map((project, index) => (
          <ProjectCard 
            key={project.id} 
            project={project} 
            index={index} 
            total={PROJECTS.length} 
            onExplore={(id) => setActiveStudy(id)}
          />
        ))}
      </div>
      
      {/* Horizontal Progress Bar */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-white/10 hidden md:block">
         <div 
           ref={progressBarRef}
           className="absolute top-1/2 left-0 h-1 bg-brand-accent -translate-y-1/2 rounded-full w-0"
         />
      </div>

      <CaseStudyOverlay 
        isOpen={!!activeStudy}
        onClose={() => setActiveStudy(null)}
        projectId={activeStudy || ""}
      />
    </section>
  );
}

