"use client";

import { motion } from "motion/react";
import { Brain, Box as Cube, TestTube, Glasses, Trophy, Heart, Globe } from "lucide-react";
import { TRACKS } from "@/lib/constants";

const iconMap: Record<string, React.ElementType> = {
  Brain,
  Cube,
  TestTube,
  Glasses,
  Trophy,
  Heart,
  Globe,
};

export function TracksSection() {
  return (
    <section id="tracks" className="py-24 relative">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-title">Challenge Tracks</h2>
          <p className="section-subtitle">
            Choose your battlefield. Seven specialized tracks for innovation in AI and gaming.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TRACKS.map((track, i) => {
            const Icon = iconMap[track.icon] || Brain;
            return (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 card-hover group"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="text-primary" size={28} />
                </div>
                <h3 className="font-display text-xl font-bold text-text mb-2">{track.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">{track.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
