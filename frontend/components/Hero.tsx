'use client';

import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import PortalEffect from './PortalEffect';

export default function Hero() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
  };

  return (
    <div className="relative">
      <PortalEffect />
      
      <motion.section 
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-20 min-h-[90vh] flex flex-col justify-center px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto pt-20"
      >
        <div className="max-w-4xl space-y-8">
          <div className="space-y-4">
            <motion.h1 variants={item} className="font-display-lg leading-tight">
              Build the Future with <br />
              <span className="text-primary italic">Web3D & AI</span>
            </motion.h1>
            <motion.p variants={item} className="font-body-lg text-on-surface-variant max-w-2xl">
              Join 500+ developers for a 48-hour hackathon. Push the boundaries of the browser with real-time graphics and autonomous agents in a collaborative cinematic environment.
            </motion.p>
          </div>

          <motion.div variants={item} className="flex flex-wrap gap-4 pt-4">
          <motion.button 
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-primary text-white font-bold rounded-lg font-label-mono cta-glow"
          >
            Register Now
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05, y: -2, backgroundColor: "rgba(255,255,255,0.05)" }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 border border-white/20 glass-panel text-on-surface font-bold rounded-lg font-label-mono flex items-center gap-2"
          >
            View Rules
            <ArrowRight size={18} />
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
    </div>
  );
}
