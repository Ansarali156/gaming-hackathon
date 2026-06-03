'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface Particle {
  id: number;
  initialX: string;
  initialScale: number;
  animateX: string;
  duration: number;
  delay: number;
}

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    initialX: `${Math.random() * 100 - 50}%`,
    initialScale: Math.random() * 0.5 + 0.5,
    animateX: `${(Math.random() * 100 - 50) + (Math.random() * 20 - 10)}%`,
    duration: Math.random() * 5 + 5,
    delay: Math.random() * 5,
  }));
}

export default function PortalEffect() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setParticles(generateParticles(20));
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden h-screen">
      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[400px] h-full pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-primary/10 blur-[100px] rounded-full"
        />
      </div>

      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[400px] md:w-[800px] h-full opacity-10">
        <div className="w-full h-full portal-glow" />
      </div>

      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ 
            opacity: 0, 
            x: p.initialX, 
            y: "100%",
            scale: p.initialScale
          }}
          animate={{ 
            opacity: [0, 1, 0],
            y: "10%",
            x: p.animateX
          }}
          transition={{ 
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear"
          }}
          className="absolute left-1/2 w-1 h-1 bg-primary rounded-full blur-[1px] z-10"
        />
      ))}

      <div className="absolute inset-0 dot-grid opacity-20" style={{ maskImage: 'radial-gradient(circle at 50% 60%, black, transparent 80%)' }} />

      <div className="absolute bottom-[5%] left-1/2 -translate-x-1/2 w-[150%] h-[30%]">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 2.5 }}
          className="w-full h-full bg-primary blur-[180px] rounded-full" 
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
    </div>
  );
}
