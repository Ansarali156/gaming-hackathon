"use client";

import Link from "next/link";
import { Instagram, Linkedin, MessageCircle, Mail } from "lucide-react";

const footerLinks: Record<string, { label: string; href: string }[]> = {
  Event: [
    { label: "About", href: "/#about" },
    { label: "Tracks", href: "/#tracks" },
    { label: "Timeline", href: "/#timeline" },
    { label: "Prizes", href: "/#prizes" },
    { label: "FAQ", href: "/#faq" },
  ],

  Legal: [
    { label: "Terms of Service", href: "/terms-of-service" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Refund Policy", href: "/refund-policy" },
  ],
};

const socialLinks = [
  { icon: <Instagram size={20} />, href: "https://instagram.com/incuxai" },
  { icon: <Linkedin size={20} />, href: "https://www.linkedin.com/company/incuxai/" },
  { icon: <MessageCircle size={20} />, href: "https://wa.me/917995061289" },
  { icon: <Mail size={20} />, href: "mailto:incuxaigaming@gmail.com" },
];

export function Footer() {
  return (
    <footer className="bg-surface border-t border-white/5">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <Link href="/" className="font-display text-2xl font-bold gradient-text">
              AI Gaming Hackathon
            </Link>
            <p className="text-text-muted">
              India&apos;s Ultimate AI Gaming Hackathon. Build. Battle. Innovate & Conquer.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((link, i) => (
                <SocialLink key={i} href={link.href} icon={link.icon} />
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-display text-lg font-bold text-primary mb-4">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.href ? (
                      <Link href={link.href} className="text-text-muted hover:text-primary transition-colors">
                        {link.label}
                      </Link>
                    ) : (
                      <span className="text-text-muted/50 cursor-default">
                        {link.label}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 text-center text-text-muted">
          <p className="mb-2">
            Website: <a href="https://incuxai.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">incuxai.com</a> | 
            Phone: <a href="tel:+917995061289" className="hover:text-primary transition-colors">+91 7995061289</a> | 
            Email: <a href="mailto:incuxaigaming@gmail.com" className="hover:text-primary transition-colors">incuxaigaming@gmail.com</a>
          </p>
          <p>© 2026 IncuXai AI Gaming Hackathon. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  if (!href) {
    return (
      <span className="w-10 h-10 rounded-lg glass-panel flex items-center justify-center text-text-muted/50 cursor-default">
        {icon}
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 rounded-lg glass-panel flex items-center justify-center hover:text-primary hover:border-primary/50 transition-all"
    >
      {icon}
    </a>
  );
}
