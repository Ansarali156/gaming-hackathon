"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CheckCircle2, AlertCircle, Loader2, ArrowRight, ShieldCheck } from "lucide-react";

import { ShieldAlert, Sparkles, RefreshCw, Laptop, Check, AlertTriangle } from "lucide-react";

function CallbackContent() {
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [teamDetails, setTeamDetails] = useState<{ teamName: string; teamId: string } | null>(null);
  const [emailStatus, setEmailStatus] = useState<string>("sent");
  
  // Database state check
  const [teamActive, setTeamActive] = useState<boolean>(false);
  const [isLocal, setIsLocal] = useState<boolean>(false);
  const [syncEmail, setSyncEmail] = useState<string>("");
  const [syncing, setSyncing] = useState<boolean>(false);
  const [syncError, setSyncError] = useState<string>("");
  const [syncSuccess, setSyncSuccess] = useState<boolean>(false);

  useEffect(() => {
    // 1. Detect environment
    if (typeof window !== "undefined") {
      const host = window.location.hostname;
      setIsLocal(host === "localhost" || host === "127.0.0.1" || host.startsWith("192.168."));
    }

    const teamName = searchParams.get("teamName") || "";
    const teamId = searchParams.get("teamId") || "";
    const emailStatus = searchParams.get("emailStatus") || "sent";

    if (teamName || teamId) {
      setTeamDetails({ teamName, teamId });
      setEmailStatus(emailStatus);
      
      // 2. Query actual registration state in Postgres
      fetch(`/api/payments/status?teamId=${encodeURIComponent(teamId)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.teamExists) {
            setTeamActive(true);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch payment status:", err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  // Client-side self-healing trigger for local development
  const handleLocalSync = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!syncEmail.trim()) {
      setSyncError("Registered email address is required.");
      return;
    }

    setSyncing(true);
    setSyncError("");
    setSyncSuccess(false);

    try {
      const res = await fetch("/api/payments/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: syncEmail.trim(),
          payment_id: `pay_dev_local_${Math.floor(Math.random() * 1000000)}`,
          order_id: `order_dev_local_${Math.floor(Math.random() * 1000000)}`,
          status: "SUCCESS"
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSyncSuccess(true);
        setTeamActive(true);
        setTeamDetails({
          teamName: data.teamName || teamDetails?.teamName || "Sync Team",
          teamId: data.teamId || teamDetails?.teamId || "INCXXXXXX"
        });
        setEmailStatus(data.emailStatus || "sent");
      } else {
        setSyncError(data.error || "Failed to locate registration draft. Please verify the email address.");
      }
    } catch (err) {
      setSyncError("Network error synchronizing local registration.");
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="animate-spin text-primary mb-4" size={48} />
        <p className="text-text-muted">Securing payment transaction with payment gateway...</p>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-8 md:p-12 text-center max-w-xl mx-auto border border-red-500/10"
      >
        <AlertCircle className="mx-auto text-red-400 mb-4" size={48} />
        <h2 className="text-xl font-bold text-text mb-2">Verification Failed</h2>
        <p className="text-text-muted mb-6 text-sm">{error}</p>
        <div className="flex flex-col gap-3">
          <Link href="/login" className="btn-primary inline-flex items-center justify-center gap-2">
            Back to Login <ArrowRight size={16} />
          </Link>
          <a href="mailto:incuxaigaming@gmail.com" className="text-xs text-primary hover:underline">
            Contact Support
          </a>
        </div>
      </motion.div>
    );
  }

  // Render the Local Developer Sync UI if team is not yet created in localhost sandbox
  if (!teamActive && isLocal) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-10 max-w-xl mx-auto border border-yellow-500/20 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 bg-yellow-500/10 px-3 py-1 rounded-bl-lg text-xs font-semibold text-yellow-500 flex items-center gap-1.5">
          <Laptop size={12} /> DEV SANDBOX MODE
        </div>

        <div className="w-16 h-16 bg-yellow-500/10 border border-yellow-500/25 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="text-yellow-500" size={32} />
        </div>

        <h2 className="font-display text-2xl font-bold text-center text-text mb-2">⚠️ Local Callback Unreachable</h2>
        
        <p className="text-text-muted text-xs text-center leading-relaxed mb-6">
          You are running the application on <strong>localhost</strong>. Because the external SUN payment portal is on a public server, it cannot trigger the server-to-server webhook callback back to your local machine.
        </p>

        <div className="p-4 bg-surface rounded-lg border border-white/5 mb-6 text-xs leading-relaxed text-text-muted">
          <span className="font-bold text-text block mb-1">💡 What does this mean?</span>
          Your payment was successfully simulated on SUN, but Next.js hasn't created your login account locally yet because the callback couldn't reach your laptop.
        </div>

        <form onSubmit={handleLocalSync} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-dim">Registered Leader Email</label>
            <input
              type="email"
              placeholder="e.g. leader@example.com"
              value={syncEmail}
              onChange={(e) => setSyncEmail(e.target.value)}
              className="w-full bg-surface-light border border-white/10 rounded-lg px-4 py-2.5 text-sm text-text focus:outline-none focus:border-yellow-500/50 transition-all font-mono"
              required
            />
          </div>

          {syncError && (
            <div className="p-3 bg-red-500/10 border border-red-500/25 rounded-lg text-red-400 text-xs flex items-center gap-2">
              <AlertTriangle size={14} className="shrink-0" />
              <span>{syncError}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={syncing}
            className="w-full btn-secondary inline-flex items-center justify-center gap-2 py-3 bg-yellow-500/10 hover:bg-yellow-500/20 border-yellow-500/30 text-yellow-500 text-sm font-semibold tracking-wide"
          >
            {syncing ? (
              <>
                <RefreshCw className="animate-spin" size={16} />
                Synchronizing Local Database...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Sync & Activate Account Locally ✨
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/login" className="text-xs text-text-dim hover:text-text hover:underline transition-all">
            Cancel & Go Back
          </Link>
        </div>
      </motion.div>
    );
  }

  // Render warning message if in production and payment sync is taking time
  if (!teamActive && !isLocal) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-12 text-center max-w-xl mx-auto border border-blue-500/20"
      >
        <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <RefreshCw className="text-blue-400 animate-spin" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-text mb-2">⏳ Activating Your Account...</h2>
        <p className="text-text-muted mb-8 text-sm leading-relaxed">
          Your payment was successfully received! We are currently waiting for the payment gateway webhook to synchronize and activate your login credentials. This typically takes less than a minute.
        </p>
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => window.location.reload()}
            className="btn-primary inline-flex items-center justify-center gap-2"
          >
            Check Activation Status <RefreshCw size={16} />
          </button>
          <Link href="/login" className="text-xs text-text-dim hover:text-text hover:underline">
            Proceed to Login anyway
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-12 text-center max-w-xl mx-auto border border-primary/20 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 bg-primary/10 px-3 py-1 rounded-bl-lg text-xs font-semibold text-primary">
        TRANSACTION SECURED
      </div>

      <div className="w-20 h-20 bg-primary/10 border border-primary/30 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="text-primary" size={44} />
      </div>

      <h2 className="font-display text-3xl font-bold text-text mb-2">🎉 Payment Successful!</h2>
      <p className="text-text-muted mb-6 text-sm">
        Your registration payment has been securely verified and processed. A confirmation email has been dispatched to your registered email address!
      </p>

      {syncSuccess && (
        <div className="p-3 bg-neon-green/10 border border-neon-green/30 rounded-lg text-neon-green text-xs font-semibold mb-6 flex items-center justify-center gap-2 animate-pulse">
          <Check size={16} /> LOCAL DATABASE SYNCED SUCCESSFULLY!
        </div>
      )}

      <div className="p-4 bg-surface rounded-lg border border-white/5 space-y-2.5 text-left mb-8">
        <div className="flex justify-between text-sm">
          <span className="text-text-muted">Registered Team</span>
          <span className="text-text font-semibold">{teamDetails?.teamName}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-muted">Assigned Team ID</span>
          <span className="text-primary font-mono font-bold text-sm">{teamDetails?.teamId}</span>
        </div>
        <div className="flex justify-between text-sm border-t border-white/5 pt-2">
          <span className="text-text-muted">Account Status</span>
          <span className="text-neon-green font-bold text-xs uppercase tracking-wider">APPROVED & ACTIVE</span>
        </div>
        <div className="flex justify-between text-sm border-t border-white/5 pt-2">
          <span className="text-text-muted">Confirmation Email</span>
          <span className="text-neon-blue font-bold text-xs uppercase tracking-wider">
            {emailStatus === "sent" ? "SENT ✓" : "QUEUED FOR RETRY 📥"}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Link href="/login" className="btn-primary btn-glow w-full inline-flex items-center justify-center gap-2 py-3.5">
          Proceed to Login <ArrowRight size={16} />
        </Link>
        <Link href="/" className="text-xs text-text-dim hover:text-text hover:underline transition-all">
          Back to Homepage
        </Link>
      </div>

      <div className="mt-8 flex justify-center items-center gap-2 text-xs text-text-dim text-center">
        <ShieldCheck size={14} className="text-neon-green" />
        Payment callback processed successfully
      </div>
    </motion.div>
  );
}

export default function PayCallbackPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-28 pb-16">
        <div className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop">
          <Suspense fallback={
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="animate-spin text-primary mb-4" size={48} />
              <p className="text-text-muted">Loading payment callback...</p>
            </div>
          }>
            <CallbackContent />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  );
}
