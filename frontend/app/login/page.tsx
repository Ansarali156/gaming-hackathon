"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      try {
        const sessionRes = await fetch("/api/auth/session");
        const sessionData = await sessionRes.json();
        const role = sessionData?.user?.role;
        
        if (role === "ADMIN") {
          router.push("/dashboard/admin");
        } else {
          // Check if team payment is complete
          const teamRes = await fetch("/api/teams/me");
          if (teamRes.ok) {
            const teamData = await teamRes.json();
            const paymentStatus = teamData.team?.payment?.status || "PENDING";
            if (paymentStatus !== "SUCCESS") {
              router.push(`/pay?email=${encodeURIComponent(email)}`);
              router.refresh();
              return;
            }
          }
          router.push("/dashboard/participant");
        }
      } catch (err) {
        router.push("/dashboard/participant");
      }
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-md p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary" />

        <div className="text-center mb-8">
          <Link href="/" className="inline-block font-display text-2xl font-bold gradient-text mb-2">
            IncuXai
          </Link>
          <h1 className="text-xl font-bold text-text">Welcome Back</h1>
          <p className="text-text-muted text-sm mt-1">Sign in to manage your team and projects.</p>
        </div>

        {error && (
          <div className="p-3 mb-6 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-text">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="label-text mb-0">Password</label>
              <Link href="/forgot-password" className="text-xs text-primary hover:underline font-medium">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full mt-6 flex justify-center"
          >
            {loading ? <div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin" /> : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-text-muted">
          Don't have an account?{" "}
          <Link href="/register" className="text-primary hover:underline font-medium">
            Register here
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
