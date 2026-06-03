'use client';

import Image from "next/image";
import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { Box, Code2, Shield, Zap, Layout, Globe } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: "Generative Realities",
    description: "Create immersive environments that respond to LLM-driven prompts in real-time. Bridge the gap between text and 3D space.",
    icon: Box,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAF_dqkM0IffIyru4CqN6fd_aKcFOLH4tjeRnaqOCsVGe3mnCCarUEnDiiPrt-JYuvuoFKFk9mtUUSkrsn4WSESkTtVt3-J17uiExP9yQr7_l1fDKNonqy1QgJDmOxKnRCFkKtFZUGD9bB6vivpGoizFLZZG1QoF2m90krHeqDUSba-36njJFcEROCEu3whUl-Oq22b9251zf4imUeD2hEieH_eNsaj8S65LhDdlxFATC3SWX5pZAyX5Gh3XlIbFUxt1n6cPFFz9w",
  },
  {
    id: 2,
    title: "AI Agents",
    description: "Deploy autonomous entities that live within the browser environment. Systems that learn and react to players dynamically.",
    icon: Code2,
    mentors: ["JD", "AL", "+12"]
  },
  {
    id: 3,
    title: "Tactical Gear",
    description: "Design high-fidelity tactical equipment and procedural assets inspired by competitive shooters and tech-wear.",
    icon: Shield,
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 4,
    title: "Vapor Shaders",
    description: "Build aesthetic, retro-futuristic environments using advanced WebGL shaders and global reactive lighting.",
    icon: Zap,
    image: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 5,
    title: "Cinematic UI",
    description: "Push the boundaries of web interfaces with depth-sensing layouts and cinematic animation frameworks.",
    icon: Layout,
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 6,
    title: "Autonomous Worlds",
    description: "Architect persistent, decentralized worlds where logic is governed by autonomous agents and smart systems.",
    icon: Globe,
    image: "https://images.unsplash.com/photo-1635339001026-6812837f6534?auto=format&fit=crop&q=80&w=600",
  }
];

export default function TracksGrid() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const x = useTransform(smoothProgress, [0, 1], ["0%", "-85%"]);

  return (
    <section ref={targetRef} className="relative h-[600vh] z-20">
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        <div className="px-margin-mobile md:px-margin-desktop mb-8 md:mb-12">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             className="space-y-2"
           >
             <h2 className="font-headline-lg text-primary">Challenge Tracks</h2>
             <p className="text-on-surface-variant max-w-sm font-body-md">Discover the six specialized categories for innovation.</p>
           </motion.div>
        </div>
        
        <motion.div style={{ x }} className="flex gap-6 md:gap-8 px-margin-mobile md:px-margin-desktop pr-[50vw]">
          {TRACKS.map((track) => (
            <TrackCard key={track.id} track={track} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function TrackCard({ track }: { track: typeof TRACKS[0] }) {
  const Icon = track.icon;
  
  return (
    <div className="flex-shrink-0 w-[320px] md:w-[420px] glass-panel p-6 md:p-8 rounded-xl border border-white/10 flex flex-col justify-between min-h-[400px] md:min-h-[480px] relative overflow-hidden group">
      <div className="relative z-10 h-full flex flex-col">
        <div className="bg-primary/10 w-fit p-3 rounded-lg mb-6 group-hover:bg-primary/20 transition-colors">
          <Icon className="text-primary" size={28} />
        </div>
        <h3 className="text-2xl md:text-3xl font-display font-bold mb-4">{track.title}</h3>
        <p className="font-body-md text-on-surface-variant leading-relaxed">
          {track.description}
        </p>

        {track.mentors && (
          <div className="mt-auto pt-6 border-t border-white/5">
            <div className="flex -space-x-3">
              {track.mentors.map((m, i) => (
                <Avatar 
                  key={i} 
                  initials={m} 
                  className={i === 0 ? "bg-primary/20" : i === 1 ? "bg-primary/10" : "bg-primary text-background"} 
                />
              ))}
            </div>
            <p className="text-[12px] mt-2 font-label-mono text-primary font-bold">Registered Mentors</p>
          </div>
        )}
      </div>
      
      {track.image && (
        <div className="absolute inset-0 pointer-events-none opacity-10 group-hover:opacity-30 transition-opacity duration-700">
          <Image 
            src={track.image} 
            alt={track.title} 
            fill
            sizes="(max-width: 768px) 320px, 420px"
            className="object-cover scale-110 group-hover:scale-100 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent" />
        </div>
      )}
    </div>
  );
}

function Avatar({ initials, className }: { initials: string, className?: string }) {
  return (
    <div className={`w-10 h-10 rounded-full border-2 border-background flex items-center justify-center text-[10px] font-bold ${className}`}>
      {initials}
    </div>
  );
}
