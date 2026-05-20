"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/dashboard/participant");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-28 pb-16">
        <div className="max-w-md mx-auto px-margin-mobile md:px-margin-desktop">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8"
          >
            <h1 className="font-display text-3xl font-bold gradient-text mb-2 text-center">Welcome Back</h1>
            <p className="text-text-muted text-center mb-8">Login to access your dashboard</p>

            <button
              onClick={() => signIn("google", { callbackUrl: "/dashboard/participant" })}
              className="w-full py-3 bg-white text-background rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 mb-6"
            >
              <svg width="20" height="20" viewBox="0 0 20 20">
                <path fill="#4285F4" d="M18.9 10.2c0-.6-.1-1.2-.2-1.8H10v3.4h5c-.2 1.1-.9 2.1-1.9 2.8v2.3h3c1.8-1.6 2.8-4.1 2.8-6.7z"/>
                <path fill="#34A853" d="M10 19c2.5 0 4.6-.8 6.1-2.2l-3-2.3c-.8.6-1.9.9-3.1.9-2.4 0-4.4-1.6-5.1-3.8H1.8v2.4C3.3 17.2 6.4 19 10 19z"/>
                <path fill="#FBBC05" d="M4.9 11.6c-.2-.6-.3-1.2-.3-1.6s.1-1 .3-1.6V6H1.8C1.2 7.2 1 8.5 1 10s.2 2.8.8 4l3.1-2.4z"/>
                <path fill="#EA4335" d="M10 3c1.3 0 2.5.5 3.4 1.3l2.6-2.6C14.4.6 12.5 0 10 0 6.4 0 3.3 1.8 1.8 5l3.1 2.4C5.6 4.6 7.6 3 10 3z"/>
              </svg>
              Continue with Google
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-text-muted text-sm">or</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="label-text">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field pl-10"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="label-text">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pl-10 pr-10"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-dim"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <p className="text-center text-text-muted mt-6">
              Don't have an account?{" "}
              <Link href="/register" className="text-primary hover:underline">
                Register now
              </Link>
            </p>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
