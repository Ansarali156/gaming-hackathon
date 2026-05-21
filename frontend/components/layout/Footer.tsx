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
  Community: [
    { label: "Discord", href: "" },
    { label: "Campus Ambassadors", href: "" },
    { label: "Mentors", href: "" },
    { label: "Judges", href: "" },
  ],
  Legal: [
    { label: "Terms of Service", href: "" },
    { label: "Privacy Policy", href: "" },
    { label: "Refund Policy", href: "" },
  ],
};

const socialLinks = [
  { icon: <Instagram size={20} />, href: "https://instagram.com/incuxai" },
  { icon: <Linkedin size={20} />, href: "" },
  { icon: <MessageCircle size={20} />, href: "" },
  { icon: <Mail size={20} />, href: "mailto:info@incuxai.com" },
];

export function Footer() {
  return (
    <footer className="bg-surface border-t border-white/5">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <Link href="/" className="font-display text-2xl font-bold gradient-text">
              IncuXai
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
          <p className="mb-2">Website: incuxai.com | Phone: +91 795061289 | Email: info@incuxai.com</p>
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
