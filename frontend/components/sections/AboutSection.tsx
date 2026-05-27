"use client";

import { motion } from "motion/react";
import { Sparkles, Brain, Rocket } from "lucide-react";

const features = [
  { icon: Sparkles, title: "AI-Powered Innovation", desc: "Leverage cutting-edge AI tools and APIs to build intelligent gaming experiences." },
  { icon: Brain, title: "Expert Mentorship", desc: "Get guidance from industry leaders, AI researchers, and gaming veterans." },
  { icon: Rocket, title: "Startup Launchpad", desc: "Transform your hackathon project into a real startup with incubation support." },
];

export function AboutSection() {
  return (
    <section id="about" className="py-24 bg-surface/50 relative">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-title">About the Hackathon</h2>
          <p className="section-subtitle">
            Gaming Hackathon Final Round — 4th & 5th July 2026 (Offline). All B.Tech, M.Tech students, Startups & Working Professionals can participate. Build your game, solve real challenges, and win cash prizes worth ₹10 Lakhs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="text-primary" size={32} />
              </div>
              <h3 className="font-display text-xl font-bold text-text mb-2">{feature.title}</h3>
              <p className="text-text-muted">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
