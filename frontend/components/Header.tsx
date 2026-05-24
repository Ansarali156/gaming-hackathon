'use client';

import { motion } from 'motion/react';

export default function Header() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 border-b border-white/10 bg-surface/30 backdrop-blur-xl">
      <div className="flex justify-between items-center h-20 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="font-headline-lg text-primary font-bold tracking-tighter"
        >
          HACK.2026
        </motion.div>
        
        <div className="hidden md:flex items-center gap-8">
          <NavLink href="#" active>Tracks</NavLink>
          <NavLink href="#">Schedule</NavLink>
          <NavLink href="#">Sponsors</NavLink>
          <NavLink href="#">FAQ</NavLink>
        </div>

        <motion.button 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-primary-container text-on-primary font-label-mono px-6 py-2.5 rounded-full font-bold cta-glow"
        >
          Register Now
        </motion.button>
      </div>
    </nav>
  );
}

function NavLink({ href, children, active }: { href: string; children: React.ReactNode; active?: boolean }) {
  return (
    <a 
      href={href} 
      className={`font-label-mono ${active ? 'text-primary border-b border-primary pb-1' : 'text-on-surface-variant hover:text-on-surface'} transition-colors`}
    >
      {children}
    </a>
  );
}
