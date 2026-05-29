"use client";

import { motion } from "motion/react";
import { Trophy, Globe, Briefcase, Users, Lightbulb, Rocket, DollarSign, GraduationCap } from "lucide-react";
import Link from "next/link";

const benefits = [
  { icon: Trophy, title: "Win Prizes", desc: "Compete for ₹10,00,000+ in cash prizes and exciting rewards." },
  { icon: GraduationCap, title: "Free Course Worth ₹5000", desc: "Receive full access to a premium certified AI or Game Dev course after team registration." },
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

        {/* Free Course Highlight Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-primary/15 via-secondary/15 to-primary/5 border border-primary/25 text-center relative overflow-hidden group shadow-lg shadow-primary/5"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-left">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider mb-3">
                Exclusive Participant Reward
              </span>
              <h3 className="font-display text-2xl md:text-3xl font-bold text-text mb-2">
                Free Certified Course Worth <span className="text-primary font-extrabold font-mono">₹5,000</span>
              </h3>
              <p className="text-text-muted text-sm md:text-base max-w-2xl">
                Boost your tech stack! Every registered team member gets full access to a premium, industry-certified AI Engineering or Game Development course absolutely free, immediately upon completing your registration.
              </p>
            </div>
            <Link href="/register" className="btn-primary btn-glow whitespace-nowrap self-start md:self-auto">
              Register & Claim Free Course
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
