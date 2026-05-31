"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { MessageCircle, Instagram, Users, Trophy, Download } from "lucide-react";
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
  const [registeredCount, setRegisteredCount] = useState<number | null>(null);

  useEffect(() => {
    // Fetch real team count from the database and add base count of 118
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => setRegisteredCount((data.totalTeams ?? 0) + 118))
      .catch(() => setRegisteredCount(118));
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
            <span className="text-text-muted">
              {registeredCount === null ? (
                <span className="inline-block w-4 h-3 bg-white/10 rounded animate-pulse" />
              ) : (
                <><span className="text-primary font-bold">{registeredCount}+</span> Participants Registered</>
              )}
            </span>
          </motion.div>

          <p className="text-primary font-bold tracking-widest text-sm md:text-base">CODE. DESIGN. PLAY. WIN.</p>

          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
            India's Ultimate{" "}
            <span className="gradient-text">AI Gaming</span>
            <br />
            Hackathon
          </h1>

          <p className="text-text-muted text-lg md:text-xl max-w-3xl mx-auto">
            National Level Hackathon | 4th & 5th July 2026 | Cash Prizes Worth ₹10 Lakhs | Internships, Incubation & Investments
          </p>

          <CountdownTimer targetDate={EVENT_DATES.registrationClose} label="Registration Closing In" />

          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/register" className="btn-primary btn-glow">
              Register Now
            </Link>
            <a
              href="/user-guide.pdf"
              download="TRACK-1,2,3_AI_HACKATHON_INCUX_AI.pdf"
              className="btn-secondary flex items-center gap-2"
            >
              <Download size={18} />
              Download Guide
            </a>
            <a href="https://wa.me/917995061289" className="btn-secondary">
              <MessageCircle className="inline mr-2" size={18} />
              WhatsApp Support
            </a>
            <Link href="/sponsors" className="btn-secondary">
              Become Sponsor
            </Link>
            <a href="https://www.instagram.com/incuxai" className="btn-secondary">
              <Instagram className="inline mr-2" size={18} />
              Instagram
            </a>
          </div>

          <div className="flex flex-wrap gap-8 justify-center pt-8">
            <Stat icon={<Trophy className="text-primary" />} value="₹10,00,000" label="Cash Prizes" />
            <Stat icon={<Users className="text-neon-blue" />} value="B.Tech & M.Tech" label="Students Eligible" />
            <Stat icon={<Users className="text-neon-purple" />} value="Startups" label="Welcome" />
            <Stat icon={<Users className="text-neon-green" />} value="Professionals" label="Can Participate" />
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
