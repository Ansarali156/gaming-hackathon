"use client";

import { motion } from "motion/react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Info, HelpCircle, Mail, AlertTriangle, ShieldCheck } from "lucide-react";

export default function RefundPolicyPage() {
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
              <Info size={13} />
              <span>Financial Regulations</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-4xl md:text-5xl font-extrabold text-[#1E293B] mb-6 tracking-tight"
            >
              Refund Policy
            </motion.h1>
            <p className="text-text-muted text-sm">Last updated: May 22, 2026</p>
          </div>

          {/* Refund Document Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-10 md:p-16 bg-surface border border-white/5 space-y-10 text-[#1E293B]"
          >
            <div className="flex gap-4 p-5 bg-red-500/5 rounded-2xl border border-red-500/10 text-red-500">
              <AlertTriangle size={24} className="shrink-0" />
              <p className="text-xs md:text-sm font-semibold leading-relaxed">
                Important: All hackathon registration fees are final and strictly non-refundable due to pre-allocated resource provisioning. Please verify your calendar availability before committing.
              </p>
            </div>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-extrabold flex items-center gap-2.5">
                <ShieldCheck size={20} className="text-primary" />
                <span>1. Non-Refundable Fee Structure</span>
              </h2>
              <p className="text-text-muted text-sm leading-relaxed">
                Registration fees for IncuXai AI Gaming (₹300/person for students, ₹1000/person for IT professionals, ₹5000 for startup teams) represent essential resource commitments. We deploy immediate infrastructure resources (pre-purchased evaluation cloud credit tokens, grand finale lunch vouchers, server load allocations) instantly upon team payment. Therefore, <span className="font-semibold text-red-500">no voluntary refunds or registration cancellations are permitted</span> once payment is processed.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-extrabold flex items-center gap-2.5">
                <HelpCircle size={20} className="text-primary" />
                <span>2. Handling Transaction Outages</span>
              </h2>
              <p className="text-text-muted text-sm leading-relaxed">
                In rare cases where a database syncing issue or payment gateway breakdown causes a double deduction:
              </p>
              <ul className="list-disc list-inside text-text-muted text-sm space-y-1.5 pl-4">
                <li>If your card is charged but the system displays a transaction failure, Razorpay automatically initiates an auto-reversal within 5–7 working days.</li>
                <li>If a dual deduction occurred and your team was successfully registered once, please email our accounting coordinators immediately with your transaction logs for a direct adjustment check.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-extrabold flex items-center gap-2.5">
                <Mail size={20} className="text-primary" />
                <span>3. Connecting with Billing Support</span>
              </h2>
              <p className="text-text-muted text-sm leading-relaxed">
                For any queries regarding pending transactions, invoice receipt downloads, or dual deduction reviews, please connect directly with our brand billing desk at:
              </p>
              <div className="p-4 bg-surface-light rounded-xl border border-white/10 text-xs md:text-sm font-mono mt-2 inline-block">
                Email: <a href="mailto:Incuxaigamming@gmail.com" className="text-primary font-bold hover:underline">Incuxaigamming@gmail.com</a>
              </div>
            </section>

          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
