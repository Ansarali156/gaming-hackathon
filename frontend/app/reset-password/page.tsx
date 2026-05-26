"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "motion/react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Lock, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle, ShieldAlert, ArrowRight } from "lucide-react";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Missing reset token. Please request a new password reset link.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("Invalid reset token.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(true);
        setMessage(data.message);
      } else {
        setError(data.error || "Failed to reset password.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-8 md:p-10 text-center border border-neon-green/20 max-w-md mx-auto relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 bg-neon-green/10 px-3 py-1 rounded-bl-lg text-xs font-semibold text-neon-green">
          SUCCESSFULLY RESET
        </div>

        <div className="w-16 h-16 bg-neon-green/10 border border-neon-green/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="text-neon-green" size={32} />
        </div>

        <h2 className="font-display text-2xl font-bold text-text mb-3">Password Updated!</h2>
        <p className="text-text-muted text-sm leading-relaxed mb-8">
          {message || "Your password has been securely reset. You can now log into your participant dashboard."}
        </p>

        <Link
          href="/login"
          className="btn-primary btn-glow w-full inline-flex items-center justify-center gap-2 py-3.5 text-sm font-semibold"
        >
          Proceed to Login <ArrowRight size={16} />
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-8 md:p-10 border border-white/5 max-w-md mx-auto relative"
    >
      <div className="absolute top-0 right-0 bg-primary/10 px-3 py-1 rounded-bl-lg text-xs font-semibold text-primary flex items-center gap-1">
        <Lock size={12} /> PASSWORD RESET
      </div>

      <h1 className="font-display text-2xl font-bold text-text mb-2">Choose New Password</h1>
      <p className="text-text-muted text-xs mb-8">
        Create a secure new password for your team leader account.
      </p>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/25 rounded-lg text-red-400 text-xs mb-6 font-semibold flex items-center gap-2">
          {token ? <AlertCircle size={14} className="shrink-0" /> : <ShieldAlert size={14} className="shrink-0" />}
          <span>{error}</span>
        </div>
      )}

      {token && (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-dim uppercase tracking-wider">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface border border-white/10 rounded-lg pl-11 pr-11 py-3 text-sm text-text focus:outline-none focus:border-primary/50 transition-all font-mono"
                required
                disabled={submitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-dim uppercase tracking-wider">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                Saving Password...
              </>
            ) : (
              <>
                Reset Password
              </>
            )}
          </button>
        </form>
      )}

      {!token && (
        <div className="text-center mt-6">
          <Link
            href="/forgot-password"
            className="btn-primary w-full py-3 inline-flex items-center justify-center gap-2"
          >
            Request New Link
          </Link>
        </div>
      )}
    </motion.div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#03000a] text-[#f3f4f6] relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
      
      <Header />
      
      <main className="pt-28 pb-16 flex-grow flex items-center justify-center relative z-10 px-margin-mobile md:px-margin-desktop">
        <div className="w-full max-w-md">
          <Suspense fallback={
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="animate-spin text-primary mb-4" size={48} />
              <p className="text-text-muted">Loading reset credentials...</p>
            </div>
          }>
            <ResetPasswordContent />
          </Suspense>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
