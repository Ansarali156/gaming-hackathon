"use client";

import { motion } from "motion/react";
import { TIMELINE } from "@/lib/constants";
import { Calendar, ArrowRight } from "lucide-react";

export function TimelineSection() {
  return (
    <section id="timeline" className="py-24 bg-surface/50 relative">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-title">Event Timeline</h2>
          <p className="section-subtitle">Final Round: 27th & 28th June 2026 — Offline Event</p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-primary/20" />

          {TIMELINE.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative flex items-center mb-8 ${
                i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              <div className={`flex-1 ${i % 2 === 0 ? "md:text-right md:pr-12" : "md:text-left md:pl-12"} pl-12 md:pl-0`}>
                <div className="glass-card p-6 inline-block">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="text-primary" size={18} />
                    <span className="text-primary font-bold">{item.date}</span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-text">{item.phase}</h3>
                  {item.status === "active" && (
                    <span className="inline-flex items-center gap-1 mt-2 text-xs text-primary">
                      <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                      Active
                    </span>
                  )}
                </div>
              </div>

              <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-primary rounded-full -translate-x-1/2 border-4 border-background z-10" />

              <div className="flex-1 hidden md:block" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
