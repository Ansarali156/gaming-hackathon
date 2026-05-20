"use client";

import { motion } from "motion/react";
import { Trophy, Globe, Briefcase, Users, Lightbulb, Rocket, DollarSign } from "lucide-react";

const benefits = [
  { icon: Trophy, title: "Win Prizes", desc: "Compete for ₹2,00,000+ in cash prizes and exciting rewards." },
  { icon: Globe, title: "Get Recognized Nationally", desc: "Showcase your talent to industry leaders across India." },
  { icon: Briefcase, title: "Internship & Placements", desc: "Top performers get direct interview opportunities." },
  { icon: Users, title: "Learn & Network", desc: "Connect with startups, mentors, and fellow developers." },
  { icon: Lightbulb, title: "Showcase Innovation", desc: "Present your ideas to investors and industry experts." },
  { icon: Rocket, title: "Build Portfolio", desc: "Create impressive projects that stand out." },
  { icon: DollarSign, title: "Meet Investors", desc: "Pitch your startup ideas to potential investors." },
];

export function WhyParticipateSection() {
  return (
    <section className="py-24 bg-surface/50 relative">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-title">Why Participate?</h2>
          <p className="section-subtitle">More than just a hackathon. It's your launchpad to the future.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-6 card-hover group"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <benefit.icon className="text-primary" size={24} />
              </div>
              <h3 className="font-display text-lg font-bold text-text mb-2">{benefit.title}</h3>
              <p className="text-text-muted text-sm">{benefit.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
