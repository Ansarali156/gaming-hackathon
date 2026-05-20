"use client";

import { motion } from "motion/react";
import { Building2 } from "lucide-react";

const sponsors = [
  { tier: "Title Sponsor", name: "Coming Soon", logo: null },
  { tier: "Gold Sponsors", names: ["TechCorp", "GameStudio", "AI Labs"] },
  { tier: "Silver Sponsors", names: ["DevTools Inc", "CloudBase", "DataFlow", "NeuralNet"] },
  { tier: "Community Partners", names: ["GDSC", "IEEE", "ACM", "HackClub"] },
];

export function SponsorsSection() {
  return (
    <section id="sponsors" className="py-24 relative">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-title">Sponsors & Partners</h2>
          <p className="section-subtitle">Join our ecosystem of innovation. Partner with India's brightest minds.</p>
        </motion.div>

        <div className="space-y-12">
          {sponsors.map((group, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h3 className="font-display text-lg font-bold text-primary mb-6">{group.tier}</h3>
              <div className="flex flex-wrap gap-6 justify-center">
                 {(("names" in group) && group.names)
                   ? (group.names as string[]).map((name, j) => (
                       <div
                         key={j}
                         className="glass-card px-8 py-6 min-w-[150px] flex items-center justify-center"
                       >
                         <span className="text-text-muted font-medium">{name}</span>
                       </div>
                     ))
                   : (
                       <div className="glass-card px-12 py-8 flex items-center justify-center">
                         <span className="text-text-muted font-medium">{group.name}</span>
                       </div>
                     )}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <a
            href="/sponsors"
            className="btn-secondary inline-flex items-center gap-2"
          >
            <Building2 size={18} />
            Become a Sponsor
          </a>
        </motion.div>
      </div>
    </section>
  );
}
