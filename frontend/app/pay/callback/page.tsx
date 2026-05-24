"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "motion/react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CheckCircle2, AlertCircle, Loader2, ArrowRight, ShieldCheck } from "lucide-react";

function CallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [teamDetails, setTeamDetails] = useState<{ teamName: string; teamId: string } | null>(null);
  const [emailStatus, setEmailStatus] = useState<string>("sent");

  useEffect(() => {
    const data = searchParams.get("data");
    const timestamp = searchParams.get("timestamp");
    const sender = searchParams.get("sender");

    if (!data || !timestamp || !sender) {
      setError("Invalid payment callback parameters. If your payment was successful, please contact support.");
      setLoading(false);
      return;
    }

    // Call the internal payments callback API to decrypt & update database
    fetch("/api/payments/callback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data, timestamp, sender })
    })
      .then(async (res) => {
        const payload = await res.json();
        if (!res.ok) {
          throw new Error(payload.error || "Failed to verify transaction details.");
        }
        return payload;
      })
      .then((payload) => {
        setTeamDetails({ teamName: payload.teamName, teamId: payload.teamId });
        setEmailStatus(payload.emailStatus || "sent");
        setLoading(false);
      })
      .catch((err) => {
        console.error("Verification error:", err);
        setError(err.message || "Cryptographic signature verification failed.");
        setLoading(false);
      });
  }, [searchParams]);

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
        Decrypted & verified securely via AES-256-GCM symmetric signature
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
              <p className="text-text-muted">Loading secure callback verification...</p>
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
