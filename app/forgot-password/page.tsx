"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Mail, ArrowLeft, Loader2, CheckCircle2, ShieldCheck, HelpCircle, AlertCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Email address is required.");
      return;
    }

    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(true);
        setMessage(data.message);
      } else {
        setError(data.error || "An error occurred. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please check your internet connection.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#03000a] text-[#f3f4f6] relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
      
      <Header />
      
      <main className="pt-28 pb-16 flex-grow flex items-center justify-center relative z-10 px-margin-mobile md:px-margin-desktop">
        <div className="w-full max-w-md">
          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-8 md:p-10 text-center border border-primary/20 relative"
            >
              <div className="absolute top-0 right-0 bg-primary/10 px-3 py-1 rounded-bl-lg text-xs font-semibold text-primary flex items-center gap-1">
                <ShieldCheck size={12} /> SECURED
              </div>

              <div className="w-16 h-16 bg-primary/10 border border-primary/25 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="text-primary" size={32} />
              </div>

              <h2 className="font-display text-2xl font-bold text-text mb-3">Email Dispatched!</h2>
              <p className="text-text-muted text-sm leading-relaxed mb-8">
                {message || "If that email belongs to an account, we have sent secure password reset instructions. Please check your inbox and spam folder."}
              </p>

              <div className="space-y-4">
                <Link
                  href="/login"
                  className="btn-primary w-full inline-flex items-center justify-center gap-2 py-3 text-sm font-semibold"
                >
                  Return to Login <ArrowLeft size={16} className="rotate-180" />
                </Link>
                <button
                  onClick={() => setSuccess(false)}
                  className="text-xs text-text-dim hover:text-text hover:underline transition-all"
                >
                  Resend Email Request
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-8 md:p-10 border border-white/5 relative"
            >
              <div className="absolute top-0 right-0 bg-surface px-3 py-1 rounded-bl-lg text-xs font-semibold text-text-dim flex items-center gap-1.5 border-l border-b border-white/5">
                <HelpCircle size={12} /> SUPPORT
              </div>

              <h1 className="font-display text-2xl font-bold text-text mb-2">Forgot Password?</h1>
              <p className="text-text-muted text-xs mb-8">
                No worries! Enter your registered team leader's email below and we'll send you secure reset instructions.
              </p>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/25 rounded-lg text-red-400 text-xs mb-6 font-semibold flex items-center gap-2">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-dim uppercase tracking-wider">
                    Leader Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                    <input
                      type="email"
                      placeholder="e.g. leader@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-surface border border-white/10 rounded-lg pl-11 pr-4 py-3 text-sm text-text focus:outline-none focus:border-primary/50 transition-all font-mono"
                      required
                      disabled={submitting}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full btn-primary btn-glow flex items-center justify-center gap-2 py-3.5 text-sm font-semibold tracking-wide"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Sending Instructions...
                    </>
                  ) : (
                    <>
                      Send Reset Instructions
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-center">
                <Link
                  href="/login"
                  className="text-xs text-text-dim hover:text-text hover:underline flex items-center gap-1.5 transition-colors"
                >
                  <ArrowLeft size={14} /> Back to Login
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
