"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Building2, Users, Trophy, Megaphone, Code, Globe, Check } from "lucide-react";

// Tiers removed

const stats = [
  { icon: Users, value: "500+", label: "Expected Participants" },
  { icon: Building2, value: "50+", label: "Colleges" },
  { icon: Globe, value: "100K+", label: "Social Reach" },
  { icon: Trophy, value: "₹2L+", label: "Prize Pool" },
];

export default function SponsorsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-28 pb-16">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold gradient-text mb-4">
              Partner With Us
            </h1>
            <p className="section-subtitle">
              Join India's first large-scale AI Gaming Innovation Festival. Connect with the brightest minds in tech and gaming.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 text-center"
              >
                <stat.icon className="text-primary mx-auto mb-3" size={32} />
                <div className="font-display text-3xl font-bold text-text">{stat.value}</div>
                <div className="text-text-muted text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Packages removed */}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="glass-card p-8 text-center"
          >
            <h3 className="font-display text-2xl font-bold text-text mb-4">Custom Partnership</h3>
            <p className="text-text-muted mb-6 max-w-2xl mx-auto">
              Don't see the perfect fit? Let's create a custom partnership that works for your brand and goals.
            </p>
            <a href="mailto:sponsors@incuxai.com" className="btn-primary inline-flex items-center gap-2">
              <Building2 size={18} />
              Contact Us
            </a>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
