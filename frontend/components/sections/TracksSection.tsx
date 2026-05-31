"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ArrowRight, Code2, LineChart, Lightbulb } from "lucide-react";
import { TRACK_CATEGORIES } from "@/lib/constants";

export function TracksSection() {
  const icons = [Code2, LineChart, Lightbulb];

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
            Three main tracks. Multiple paths to victory. Select a track to view details.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TRACK_CATEGORIES.map((category, idx) => {
            const Icon = icons[idx];
            return (
              <motion.div
                key={category.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link
                  href={`/tracks/${category.slug}`}
                  className="block h-full glass-card p-8 card-hover group flex flex-col items-center text-center border border-white/5 hover:border-primary/50 transition-colors"
                >
                  <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                    <Icon className="text-primary" size={40} />
                  </div>
                  
                  <h3 className="font-display text-2xl font-bold text-text mb-4">
                    {category.category}
                  </h3>
                  
                  <p className="text-text-muted text-base leading-relaxed mb-8 flex-grow">
                    {category.description}
                  </p>

                  <div className="flex items-center text-primary font-bold text-sm group-hover:translate-x-2 transition-transform">
                    Explore Track <ArrowRight className="ml-2" size={16} />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
