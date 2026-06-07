"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#tracks", label: "Tracks" },
  { href: "/#sponsors", label: "Sponsors" },
  { href: "/#faq", label: "FAQ" },
  { href: "/sponsors", label: "Become Sponsor" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const dashboardUrl = (session as any)?.user?.role === "ADMIN" ? "/dashboard/admin" : "/dashboard/participant";

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-surface/90 border-b border-primary/10 shadow-[0_4px_20px_rgba(92,107,252,0.05)] backdrop-blur-md" 
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop">
        <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? "h-16" : "h-20"}`}>
          <Link prefetch={false} href="/" className="flex items-center gap-3 group">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 overflow-hidden rounded-xl shadow-[0_4px_10px_rgba(92,107,252,0.05)] border border-primary/10 bg-white flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <img 
                  src="/apgovt_logo_v2.jpg" 
                  alt="AP Government Logo" 
                  className="h-full w-full object-contain p-0.5"
                />
              </div>
              <div className="h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 overflow-hidden rounded-xl shadow-[0_4px_10px_rgba(92,107,252,0.05)] border border-primary/10 bg-white flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <img 
                  src="/rtih_logo.png" 
                  alt="RTIH Logo" 
                  className="h-full w-full object-contain p-0.5 scale-[1.15]"
                />
              </div>
            </div>
            <span className="font-display text-sm sm:text-base md:text-lg lg:text-xl font-bold gradient-text hidden sm:inline-block leading-none tracking-tight">
              AI Gaming Hackathon
            </span>
            <span className="font-display text-sm sm:text-base font-bold gradient-text sm:hidden leading-none tracking-tight">
              AI Gaming
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-2 xl:gap-4">
            {navLinks.map((link) => (
              <Link prefetch={false} key={link.href}
                href={link.href}
                target={link.href.endsWith(".pdf") ? "_blank" : undefined}
                rel={link.href.endsWith(".pdf") ? "noopener noreferrer" : undefined}
                className="px-3.5 py-2 rounded-xl text-text-muted hover:text-primary hover:bg-primary/5 transition-all duration-300 font-semibold text-sm xl:text-base"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3 xl:gap-4">
            {status === "loading" ? (
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : session ? (
              <>
                <Link prefetch={false} href={dashboardUrl}
                  className="px-4 py-2 border border-primary/15 bg-white text-primary font-bold rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] active:translate-y-0 active:scale-[0.98] shadow-[0_4px_12px_rgba(92,107,252,0.03),inset_2px_2px_4px_rgba(255,255,255,0.9),inset_-2px_-2px_4px_rgba(92,107,252,0.04)] flex items-center gap-2 text-sm xl:text-base"
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="px-4 py-2 bg-red-500/10 text-red-500 font-bold rounded-xl transition-all duration-300 hover:bg-red-500/15 hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 text-sm xl:text-base shadow-[0_4px_12px_rgba(239,68,68,0.02)]"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link prefetch={false} href="/login"
                  className="px-4 py-2 border border-primary/15 bg-white text-primary font-bold rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] active:translate-y-0 active:scale-[0.98] shadow-[0_4px_12px_rgba(92,107,252,0.03),inset_2px_2px_4px_rgba(255,255,255,0.9),inset_-2px_-2px_4px_rgba(92,107,252,0.04)] text-sm xl:text-base"
                >
                  Login
                </Link>
                <Link prefetch={false} href="/register"
                  className="px-4 py-2 bg-primary text-white font-bold rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-[0_8px_20px_rgba(92,107,252,0.25)] active:translate-y-0 active:scale-[0.98] shadow-[0_6px_15px_rgba(92,107,252,0.18),inset_2px_2px_4px_rgba(255,255,255,0.4),inset_-3px_-3px_6px_rgba(0,0,0,0.15)] text-sm xl:text-base whitespace-nowrap"
                >
                  Register Now
                </Link>
              </>
            )}

            <div className="w-px h-6 bg-primary/10" />

            <div className="flex items-center gap-2 shrink-0">
              <img 
                src="/cclogo.png" 
                alt="College Circle Logo" 
                className="h-8 w-8 xl:h-9 xl:w-9 object-contain rounded-xl shadow-[0_4px_10px_rgba(92,107,252,0.05)] border border-primary/10 bg-white transition-transform duration-300 hover:scale-105 p-0.5"
              />
              <img 
                src="/incuxai_new.png" 
                alt="IncuXai Logo" 
                className="h-8 xl:h-9 w-auto max-w-[80px] xl:max-w-[100px] object-contain rounded-xl shadow-[0_4px_10px_rgba(92,107,252,0.05)] border border-primary/10 bg-white transition-transform duration-300 hover:scale-105 p-0.5"
              />
            </div>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-text p-2 hover:bg-primary/5 rounded-xl transition-colors border border-transparent hover:border-primary/10"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="lg:hidden bg-surface/95 backdrop-blur-xl border-t border-primary/10 shadow-2xl overflow-hidden"
        >
          <div className="px-6 py-4 space-y-4">
            {navLinks.map((link) => (
              <Link prefetch={false} key={link.href}
                href={link.href}
                target={link.href.endsWith(".pdf") ? "_blank" : undefined}
                rel={link.href.endsWith(".pdf") ? "noopener noreferrer" : undefined}
                onClick={() => setMobileOpen(false)}
                className="block text-text-muted hover:text-primary transition-colors text-base py-1.5 font-semibold"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-3 pt-4 border-t border-primary/10">
              {status === "loading" ? (
                <div className="flex justify-center py-2">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : session ? (
                <>
                  <Link prefetch={false} href={dashboardUrl}
                    onClick={() => setMobileOpen(false)}
                    className="w-full text-center py-2.5 border border-primary/15 bg-white text-primary rounded-xl flex items-center justify-center gap-2 font-bold shadow-[inset_2px_2px_4px_rgba(255,255,255,0.9)]"
                  >
                    <LayoutDashboard size={16} />
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="w-full text-center py-2.5 bg-red-500/10 text-red-500 rounded-xl font-bold flex items-center justify-center gap-2"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex gap-4">
                  <Link prefetch={false} href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center py-2.5 border border-primary/15 bg-white text-primary rounded-xl font-bold shadow-[inset_2px_2px_4px_rgba(255,255,255,0.9)]"
                  >
                    Login
                  </Link>
                  <Link prefetch={false} href="/register"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center py-2.5 bg-primary text-white rounded-xl font-bold shadow-[0_4px_12px_rgba(92,107,252,0.18)]"
                  >
                    Register
                  </Link>
                </div>
              )}

              <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-primary/10">
                <img 
                  src="/cclogo.png" 
                  alt="College Circle Logo" 
                  className="h-9 w-9 object-contain rounded-xl shadow-[0_4px_10px_rgba(92,107,252,0.05)] border border-primary/10 bg-white p-0.5"
                />
                <img 
                  src="/incuxai_new.png" 
                  alt="IncuXai Logo" 
                  className="h-9 w-auto max-w-[100px] object-contain rounded-xl shadow-[0_4px_10px_rgba(92,107,252,0.05)] border border-primary/10 bg-white p-0.5"
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
