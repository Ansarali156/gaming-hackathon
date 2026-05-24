"use client";

import { motion } from "motion/react";
import { PRIZE_POOL } from "@/lib/constants";
import { Trophy, Gift, Award, Star, Medal } from "lucide-react";

const prizeIcons = [Trophy, Medal, Award, Star, Gift];

export function PrizeSection() {
  return (
    <section id="prizes" className="py-24 relative">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-title">Prize Pool — ₹10 Lakhs</h2>
          <p className="section-subtitle">Cash prizes, internships, incubation & investment opportunities await you.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {PRIZE_POOL.map((prize, i) => {
            const Icon = prizeIcons[i];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`glass-card p-6 text-center card-hover ${i === 0 ? "md:col-span-1 lg:col-span-1 border-primary/30" : ""}`}
              >
                <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${prize.color} flex items-center justify-center mb-4`}>
                  <Icon className="text-white" size={28} />
                </div>
                <h3 className="font-display text-lg font-bold text-text mb-2">{prize.place}</h3>
                <p className="text-2xl font-bold gradient-text">{prize.prize}</p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="inline-flex flex-wrap gap-6 justify-center text-text-muted">
            <span className="flex items-center gap-2"><Gift size={18} className="text-primary" /> Sponsor Goodies</span>
            <span className="flex items-center gap-2"><Award size={18} className="text-primary" /> Internship Offers</span>
            <span className="flex items-center gap-2"><Star size={18} className="text-primary" /> Startup Incubation</span>
            <span className="flex items-center gap-2"><Medal size={18} className="text-primary" /> Certificates</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
