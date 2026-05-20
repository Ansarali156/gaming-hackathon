"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { MessageCircle, Instagram, Users, Trophy } from "lucide-react";
import { EVENT_DATES } from "@/lib/constants";

function CountdownTimer({ targetDate, label }: { targetDate: Date; label: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="text-center">
      <div className="flex gap-2 md:gap-4 justify-center mb-2">
        {Object.entries(timeLeft).map(([unit, value]) => (
          <div key={unit} className="glass-panel px-3 py-2 md:px-6 md:py-4 min-w-[60px] md:min-w-[80px]">
            <div className="font-display text-2xl md:text-4xl font-bold text-primary">{value}</div>
            <div className="text-xs text-text-muted uppercase">{unit}</div>
          </div>
        ))}
      </div>
      <p className="text-text-muted text-sm">{label}</p>
    </div>
  );
}

export function HeroSection() {
  const [registeredCount, setRegisteredCount] = useState(24);

  useEffect(() => {
    const interval = setInterval(() => {
      setRegisteredCount((prev) => prev + Math.floor(Math.random() * 2));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-background pointer-events-none" />

      <div className="relative z-10 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 glass-panel rounded-full text-sm"
          >
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-text-muted">{registeredCount} Teams Registered Today</span>
          </motion.div>

          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
            India's Ultimate{" "}
            <span className="gradient-text">AI Gaming</span>
            <br />
            Hackathon
          </h1>

          <p className="text-text-muted text-lg md:text-xl max-w-3xl mx-auto">
            Build intelligent games, AI systems & immersive experiences with developers, gamers, startups & innovators.
          </p>

          <CountdownTimer targetDate={EVENT_DATES.registrationClose} label="Registration Closing In" />

          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/register" className="btn-primary btn-glow">
              Register Now
            </Link>
            <a href="#" className="btn-secondary">
              <MessageCircle className="inline mr-2" size={18} />
              Join Discord
            </a>
            <Link href="/sponsors" className="btn-secondary">
              Become Sponsor
            </Link>
            <a href="#" className="btn-secondary">
              <Instagram className="inline mr-2" size={18} />
              Instagram
            </a>
          </div>

          <div className="flex flex-wrap gap-8 justify-center pt-8">
            <Stat icon={<Trophy className="text-primary" />} value="₹2,00,000+" label="Prize Pool" />
            <Stat icon={<Users className="text-neon-blue" />} value="50+" label="Colleges" />
            <Stat icon={<Users className="text-neon-purple" />} value="20+" label="Startups" />
            <Stat icon={<Users className="text-neon-green" />} value="15+" label="Sponsors" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="flex justify-center mb-2">{icon}</div>
      <div className="font-display text-2xl font-bold text-text">{value}</div>
      <div className="text-text-muted text-sm">{label}</div>
    </div>
  );
}
