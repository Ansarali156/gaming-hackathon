import Link from "next/link";
import { Instagram, Linkedin, MessageCircle, Mail, Phone } from "lucide-react";

const footerLinks = {
  Event: ["About", "Tracks", "Timeline", "Prizes", "FAQ"],
  Community: ["Discord", "Campus Ambassadors", "Mentors", "Judges"],
  Legal: ["Terms of Service", "Privacy Policy", "Refund Policy"],
};

export function Footer() {
  return (
    <footer className="bg-surface border-t border-white/5">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <Link href="/" className="font-display text-2xl font-bold gradient-text">
              IncuXai<span className="text-primary">.AI</span>
            </Link>
            <p className="text-text-muted">
              India's Ultimate AI Gaming Hackathon. Build. Battle. Innovate & Conquer.
            </p>
            <div className="flex gap-4">
              <SocialLink href="#" icon={<Instagram size={20} />} />
              <SocialLink href="#" icon={<Linkedin size={20} />} />
              <SocialLink href="#" icon={<MessageCircle size={20} />} />
              <SocialLink href="#" icon={<Mail size={20} />} />
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-display text-lg font-bold text-primary mb-4">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-text-muted hover:text-primary transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 text-center text-text-muted">
          <p>© 2026 IncuXai AI Gaming Hackathon. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      className="w-10 h-10 rounded-lg glass-panel flex items-center justify-center hover:text-primary hover:border-primary/50 transition-all"
    >
      {icon}
    </a>
  );
}
