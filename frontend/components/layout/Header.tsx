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
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex items-center gap-2">
              <img 
                src="https://scontent.fvga7-1.fna.fbcdn.net/v/t39.30808-6/462228572_3821598438114122_1927581696670989735_n.png?stp=dst-jpg_tt6&_nc_cat=109&ccb=1-7&_nc_sid=a5f93a&_nc_ohc=MIEnFTa5i7IQ7kNvwFcuPFo&_nc_oc=Adrgho52WJebKn9y9OUJ5Xz2BjmylnkD8buymT1zcMziJO9pe9uT5HCidZJBayH8RIQ&_nc_zt=23&_nc_ht=scontent.fvga7-1.fna&_nc_gid=FUZaUO2qWlrYpGMhw1yXnQ&_nc_ss=7b289&oh=00_Af7o82fI2gaU2GiWnYoQqlS9DlPvBLAdCOoYYFZOZj57hA&oe=6A1C6219" 
                alt="Partner Logo" 
                className="h-10 w-10 md:h-12 md:w-12 object-contain rounded-md shadow border border-white/5 bg-white/5 transition-transform duration-300 group-hover:scale-105"
              />
              <img 
                src="/rtih_logo.png" 
                alt="RTIH Logo" 
                className="h-10 w-10 md:h-12 md:w-12 object-contain rounded-md shadow border border-white/5 bg-white/5 transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <span className="font-display text-lg md:text-2xl font-bold gradient-text hidden sm:inline-block leading-none">
              AI Gaming Hackathon
            </span>
            <span className="font-display text-lg font-bold gradient-text sm:hidden leading-none">
              AI Gaming
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-text-muted hover:text-primary transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {status === "loading" ? (
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : session ? (
              <>
                <Link
                  href={dashboardUrl}
                  className="px-6 py-2 border border-primary/50 text-primary rounded-lg hover:bg-primary/10 transition-all font-medium flex items-center gap-2"
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="px-6 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-all font-bold flex items-center gap-2"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-6 py-2 border border-primary/50 text-primary rounded-lg hover:bg-primary/10 transition-all font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-2 bg-primary text-background rounded-lg hover:neon-glow transition-all font-bold"
                >
                  Register Now
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-text"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="md:hidden bg-surface border-t border-white/5"
        >
          <div className="px-6 py-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block text-text-muted hover:text-primary transition-colors"
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
                    className="w-full text-center py-2 border border-primary/50 text-primary rounded-lg flex items-center justify-center gap-2"
                  >
                    <LayoutDashboard size={16} />
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="w-full text-center py-2 bg-red-500/10 text-red-400 rounded-lg font-bold flex items-center justify-center gap-2"
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
                    className="flex-1 text-center py-2 border border-primary/50 text-primary rounded-lg"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center py-2 bg-primary text-background rounded-lg font-bold"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
