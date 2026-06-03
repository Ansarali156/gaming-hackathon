"use client";

import { motion } from "motion/react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ShieldCheck, Scale, FileText, AlertCircle } from "lucide-react";

export default function TermsOfServicePage() {
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
              <Scale size={13} />
              <span>Legal Guidelines</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-4xl md:text-5xl font-extrabold text-[#1E293B] mb-6 tracking-tight"
            >
              Terms of Service
            </motion.h1>
            <p className="text-text-muted text-sm">Last updated: May 22, 2026</p>
          </div>

          {/* Legal Document Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-10 md:p-16 bg-surface border border-white/5 space-y-10 text-[#1E293B]"
          >
            <div className="flex gap-4 p-5 bg-primary/5 rounded-2xl border border-primary/10 text-primary">
              <ShieldCheck size={24} className="shrink-0" />
              <p className="text-xs md:text-sm font-semibold leading-relaxed">
                By accessing, registering, or participating in the AI Gaming Hackathon, you fully agree to adhere to these Terms of Service. Please read them thoroughly.
              </p>
            </div>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-extrabold flex items-center gap-2.5">
                <FileText size={20} className="text-primary" />
                <span>1. Acceptance of Terms</span>
              </h2>
              <p className="text-text-muted text-sm leading-relaxed">
                These Terms of Service (the &quot;Terms&quot;) constitute a legally binding agreement between you and IncuXai Brand Relations Committee governing your access to the platform and participation in any hackathon events. Your continued use of the platform represents automatic compliance with all guidelines.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-extrabold flex items-center gap-2.5">
                <FileText size={20} className="text-primary" />
                <span>2. Registration & Eligibility</span>
              </h2>
              <p className="text-text-muted text-sm leading-relaxed font-normal">
                To participate in our hackathons, you must register as a valid individual or team representative. You agree to provide accurate, current, and complete credentials. Any misrepresentation of college enrolment or IT professional status may result in immediate disqualification and deletion of your team account without recourse.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-extrabold flex items-center gap-2.5">
                <FileText size={20} className="text-primary" />
                <span>3. Code of Conduct & IP Rights</span>
              </h2>
              <p className="text-text-muted text-sm leading-relaxed">
                All submissions, software code, UI interfaces, and visual assets built during the hackathon must represent original works or utilize legitimate open-source libraries. Plagiarism, pre-built template cheating, or harassment of other participants will trigger a permanent ban. Participants retain the copyright to their projects but grant IncuXai an irrevocable, worldwide license to display and demonstrate their projects for public branding.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-extrabold flex items-center gap-2.5">
                <FileText size={20} className="text-primary" />
                <span>4. Payment of Fees</span>
              </h2>
              <p className="text-text-muted text-sm leading-relaxed">
                Fees for registering a team must be settled completely using the Razorpay gateway before the official submission starts. Failure to complete payment removes the team from the official evaluation queue. Payments represent actual platform operational maintenance and cannot be split or paid in custom increments.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-extrabold flex items-center gap-2.5">
                <AlertCircle size={20} className="text-primary" />
                <span>5. Platform Maintenance & Disclaimers</span>
              </h2>
              <p className="text-text-muted text-sm leading-relaxed">
                The IncuXai platform is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. We hold no liability for sudden internet latency, Razorpay server outages, server data loss, or visual discrepancies. We reserve the absolute right to amend details, prizes, timelines, and evaluation guidelines at any time to preserve the competition&apos;s integrity.
              </p>
            </section>

          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
