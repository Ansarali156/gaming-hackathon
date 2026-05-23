"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "motion/react";
import Link from "next/link";
import Script from "next/script";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CreditCard, CheckCircle2, ShieldCheck, ArrowRight, Loader2, AlertCircle } from "lucide-react";

function PayContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paying, setPaying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [details, setDetails] = useState<{
    teamName: string;
    teamId: string;
    amount: number;
    category: string;
    userName: string;
    userEmail: string;
    userMobile: string;
  } | null>(null);

  useEffect(() => {
    if (!email) {
      setError("No email address provided. Please access this page from the login screen.");
      setLoading(false);
      return;
    }

    fetch(`/api/payments/pending?email=${encodeURIComponent(email)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Could not find any pending registration payment for this email.");
        return res.json();
      })
      .then((data) => {
        setDetails(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load payment details.");
        setLoading(false);
      });
  }, [email]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCheckout = async () => {
    if (!details) return;
    setPaying(true);
    setError("");

    try {
      // 0. Ensure Razorpay SDK is fully loaded
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error("Razorpay SDK failed to load. Please check your internet connection.");
      }

      // 1. Create order on Sun Backend via our Core API
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create-order",
          teamId: details.teamId
        })
      });

      const orderData = await res.json();

      if (!res.ok || orderData.error) {
        throw new Error(orderData.error || "Failed to initialize checkout.");
      }

      // 2. Open Razorpay Modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_SDJLxYQuOsRKMU",
        amount: orderData.amount,
        currency: orderData.currency,
        name: "IncuXAI Hackathon",
        description: "Registration Payment Check",
        order_id: orderData.orderId,
        handler: async (rpResponse: any) => {
          try {
            // 3. Verify Payment Signature
            const verifyRes = await fetch("/api/payments", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                action: "verify",
                paymentId: rpResponse.razorpay_payment_id,
                orderId: rpResponse.razorpay_order_id,
                signature: rpResponse.razorpay_signature,
                teamId: details.teamId,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              setSuccess(true);
            } else {
              throw new Error("Payment signature verification failed.");
            }
          } catch (err: any) {
            setError(err.message || "Verification failed. Please try again.");
          } finally {
            setPaying(false);
          }
        },
        prefill: {
          name: details.userName,
          email: details.userEmail,
          contact: details.userMobile,
        },
        theme: { color: "#a855f7" },
        modal: {
          ondismiss: () => {
            setError("Checkout was dismissed. Please click proceed to complete payment.");
            setPaying(false);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during payment.");
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="animate-spin text-primary mb-4" size={48} />
        <p className="text-text-muted">Loading secure checkout details...</p>
      </div>
    );
  }

  if (error && !details) {
    return (
      <div className="glass-card p-8 md:p-12 text-center max-w-xl mx-auto border border-red-500/10">
        <AlertCircle className="mx-auto text-red-400 mb-4" size={48} />
        <h2 className="text-xl font-bold text-text mb-2">Checkout Error</h2>
        <p className="text-text-muted mb-6 text-sm">{error}</p>
        <Link href="/login" className="btn-primary inline-flex items-center gap-2">
          Back to Login <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-12 text-center max-w-xl mx-auto border border-green-500/20"
      >
        <div className="w-16 h-16 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="text-green-400 animate-bounce" size={32} />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-text mb-2">Payment Successful!</h2>
        <p className="text-text-muted mb-8 text-sm">
          Your payment has been successfully recorded. Your account has been activated and is ready to access!
        </p>
        <Link href="/login" className="btn-primary btn-glow w-full inline-flex items-center justify-center gap-2">
          Proceed to Login <ArrowRight size={16} />
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-8 md:p-12 max-w-xl mx-auto border border-white/5 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 bg-primary/10 px-3 py-1 rounded-bl-lg text-xs font-semibold text-primary">
        PENDING REGISTRATION
      </div>

      <h1 className="font-display text-2xl font-bold text-text mb-1">Complete Payment</h1>
      <p className="text-text-muted text-xs mb-6">Finish registration to activate your dashboard access</p>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs mb-6">
          {error}
        </div>
      )}

      <div className="space-y-4 mb-8">
        <div className="p-4 bg-surface rounded-lg border border-white/5 space-y-2.5">
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">Team Name</span>
            <span className="text-text font-semibold">{details?.teamName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">Team ID</span>
            <span className="text-text font-mono text-xs">{details?.teamId}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">Category</span>
            <span className="text-text uppercase font-semibold text-xs tracking-wider">{details?.category}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">Leader Email</span>
            <span className="text-text text-xs">{details?.userEmail}</span>
          </div>
        </div>

        <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 flex justify-between items-center">
          <div>
            <div className="text-xs text-text-muted">TOTAL AMOUNT</div>
            <div className="text-lg font-bold text-primary font-mono">₹{details?.amount}</div>
          </div>
          <ShieldCheck className="text-primary opacity-80" size={24} />
        </div>
      </div>

      <button
        onClick={handleCheckout}
        disabled={paying}
        className="btn-primary btn-glow w-full flex items-center justify-center gap-2 py-3.5"
      >
        {paying ? (
          <>
            <Loader2 className="animate-spin" size={18} />
            Processing Checkout...
          </>
        ) : (
          <>
            <CreditCard size={18} />
            Proceed to Payment 💳
          </>
        )}
      </button>

      <div className="mt-6 flex justify-center items-center gap-2 text-xs text-text-dim text-center">
        <ShieldCheck size={14} className="text-neon-green" />
        Secured by Razorpay • UPI, Cards, Net Banking & Wallets accepted
      </div>
    </motion.div>
  );
}

export default function PayPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <main className="pt-28 pb-16">
        <div className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop">
          <Suspense fallback={
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="animate-spin text-primary mb-4" size={48} />
              <p className="text-text-muted">Loading secure checkout...</p>
            </div>
          }>
            <PayContent />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  );
}
