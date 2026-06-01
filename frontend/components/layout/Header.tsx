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
        scrolled ? "bg-background/80 backdrop-blur-xl border-b border-white/5" : ""
      }`}
    >
      <div className="max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex items-center gap-2">
              <img 
                src="/apgovt_logo.jpg" 
                alt="AP Government Logo" 
                className="h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 object-contain rounded-md shadow border border-white/5 bg-white/5 transition-transform duration-300 group-hover:scale-105"
              />
              <img 
                src="/rtih_logo.png" 
                alt="RTIH Logo" 
                className="h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 object-contain rounded-md shadow border border-white/5 bg-white/5 transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <span className="font-display text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold gradient-text hidden sm:inline-block leading-none tracking-tight">
              AI Gaming Hackathon
            </span>
            <span className="font-display text-sm sm:text-base font-bold gradient-text sm:hidden leading-none tracking-tight">
              AI Gaming
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-5 xl:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                target={link.href.endsWith(".pdf") ? "_blank" : undefined}
                rel={link.href.endsWith(".pdf") ? "noopener noreferrer" : undefined}
                className="text-text-muted hover:text-primary transition-colors font-medium text-sm xl:text-base"
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
                <Link
                  href={dashboardUrl}
                  className="px-4 py-1.5 xl:px-6 xl:py-2 border border-primary/50 text-primary rounded-lg hover:bg-primary/10 transition-all font-medium flex items-center gap-2 text-sm xl:text-base"
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="px-4 py-1.5 xl:px-6 xl:py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-all font-bold flex items-center gap-2 text-sm xl:text-base"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-1.5 xl:px-6 xl:py-2 border border-primary/50 text-primary rounded-lg hover:bg-primary/10 transition-all font-medium text-sm xl:text-base"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-1.5 xl:px-6 xl:py-2 bg-primary text-background rounded-lg hover:neon-glow transition-all font-bold text-sm xl:text-base whitespace-nowrap shadow-lg shadow-primary/10 hover:shadow-primary/20"
                >
                  Register Now
                </Link>
              </>
            )}

            <div className="flex items-center gap-2 ml-1 xl:ml-3 shrink-0">
              <img 
                src="/cclogo.png" 
                alt="College Circle Logo" 
                className="h-8 w-8 xl:h-10 xl:w-10 object-contain rounded-md shadow border border-white/5 bg-white/5 transition-transform duration-300 hover:scale-105"
              />
              <img 
                src="/incuxai_new.png" 
                alt="IncuXai Logo" 
                className="h-8 xl:h-10 w-auto max-w-[90px] xl:max-w-[120px] object-contain rounded-md shadow border border-white/5 bg-white/5 transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-text p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="lg:hidden bg-surface/95 backdrop-blur-xl border-t border-white/5 shadow-2xl"
        >
          <div className="px-6 py-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                target={link.href.endsWith(".pdf") ? "_blank" : undefined}
                rel={link.href.endsWith(".pdf") ? "noopener noreferrer" : undefined}
                onClick={() => setMobileOpen(false)}
                className="block text-text-muted hover:text-primary transition-colors text-base py-1"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-3 pt-4 border-t border-white/5">
              {status === "loading" ? (
                <div className="flex justify-center py-2">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : session ? (
                <>
                  <Link
                    href={dashboardUrl}
                    onClick={() => setMobileOpen(false)}
                    className="w-full text-center py-2.5 border border-primary/50 text-primary rounded-lg flex items-center justify-center gap-2 font-medium"
                  >
                    <LayoutDashboard size={16} />
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="w-full text-center py-2.5 bg-red-500/10 text-red-400 rounded-lg font-bold flex items-center justify-center gap-2"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex gap-4">
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center py-2.5 border border-primary/50 text-primary rounded-lg font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center py-2.5 bg-primary text-background rounded-lg font-bold shadow-lg shadow-primary/10"
                  >
                    Register
                  </Link>
                </div>
              )}

              <div className="flex items-center justify-center gap-4 mt-4 pt-2">
                <img 
                  src="/cclogo.png" 
                  alt="College Circle Logo" 
                  className="h-10 w-10 object-contain rounded-md shadow border border-white/5 bg-white/5"
                />
                <img 
                  src="/incuxai_new.png" 
                  alt="IncuXai Logo" 
                  className="h-10 w-auto max-w-[120px] object-contain rounded-md shadow border border-white/5 bg-white/5"
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
