"use client";

import { motion } from "motion/react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ShieldAlert, Eye, Lock, Database, UserCheck } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col justify-between">
      {/* Decorative Glows */}
      <div className="glow-spot top-[15%] -left-[10%] opacity-70" />
      <div className="glow-spot-secondary top-[40%] -right-[5%] opacity-50" />

      <Header />

      <main className="pt-32 pb-24 z-10 flex-grow">
        <div className="max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop">
          
          {/* Header Banner */}
          <div className="text-center max-w-2xl mx-auto mb-16 relative">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-6"
            >
              <Eye size={13} />
              <span>Data Protection</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-4xl md:text-5xl font-extrabold text-[#1E293B] mb-6 tracking-tight"
            >
              Privacy Policy
            </motion.h1>
            <p className="text-text-muted text-sm">Last updated: May 22, 2026</p>
          </div>

          {/* Privacy Document Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-10 md:p-16 bg-surface border border-white/5 space-y-10 text-[#1E293B]"
          >
            <div className="flex gap-4 p-5 bg-primary/5 rounded-2xl border border-primary/10 text-primary">
              <ShieldAlert size={24} className="shrink-0" />
              <p className="text-xs md:text-sm font-semibold leading-relaxed">
                Your privacy is paramount. This Privacy Policy details what information we collect, how it is secured, and our strict non-sharing data principles.
              </p>
            </div>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-extrabold flex items-center gap-2.5">
                <Database size={20} className="text-primary" />
                <span>1. Information We Collect</span>
              </h2>
              <p className="text-text-muted text-sm leading-relaxed">
                We collect personal registration details necessary to verify team credentials and process GST-compliant transaction receipts:
              </p>
              <ul className="list-disc list-inside text-text-muted text-sm space-y-1.5 pl-4">
                <li>Participant and leader names, business/personal emails, and phone numbers.</li>
                <li>College or company names to verify correct category selection.</li>
                <li>Payment logs processed through Razorpay (we do not store raw credit card numbers or banking passwords).</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-extrabold flex items-center gap-2.5">
                <Lock size={20} className="text-primary" />
                <span>2. Use of Collected Data</span>
              </h2>
              <p className="text-text-muted text-sm leading-relaxed">
                Your information is used strictly to configure your hackathon dashboard, pair Discord support accounts, generate printable team participation certificates, and dispatch important announcements. Under no circumstances do we utilize or sell participant contact details for third-party commercial spamming.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-extrabold flex items-center gap-2.5">
                <Eye size={20} className="text-primary" />
                <span>3. Cookies & Session Storage</span>
              </h2>
              <p className="text-text-muted text-sm leading-relaxed">
                We store secure, essential session cookies (NextAuth credentials) to let participants sign into their team dashboards. No tracking analytics pixel or behavioral profiling scripts are active on this site.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-extrabold flex items-center gap-2.5">
                <UserCheck size={20} className="text-primary" />
                <span>4. Data Integrity & Retention</span>
              </h2>
              <p className="text-text-muted text-sm leading-relaxed">
                Your team registration data is retained until the platform concludes the 2026 innovation festival evaluation. Participants can request immediate account deletion or modification by emailing support at <span className="font-semibold text-primary">Incuxaigamming@gmail.com</span>.
              </p>
            </section>

          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
