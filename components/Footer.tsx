import { Share2, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full py-12 border-t border-black/5 bg-surface/50 relative z-20">
      <div className="flex flex-col md:flex-row justify-between items-center px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto gap-8">
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="font-headline-lg text-primary font-bold tracking-tighter">HACK.2026</div>
          <p className="font-body-md text-on-surface-variant/60 text-sm">© 2026 IncuXai AI Gaming Hackathon. All rights reserved.</p>
          <p className="text-xs text-on-surface-variant/40">Venue: Regional Technology Innovation Hub (RTIH), Anantapur, AP</p>
        </div>
        
        <div className="flex gap-8">
          <FooterLink href="#">Privacy Policy</FooterLink>
          <FooterLink href="#">Code of Conduct</FooterLink>
          <FooterLink href="#">Contact</FooterLink>
        </div>

        <div className="flex gap-4">
          <SocialIcon icon={<Share2 size={20} />} />
          <SocialIcon icon={<Globe size={20} />} />
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="font-body-md text-on-surface-variant hover:text-primary transition-colors">
      {children}
    </a>
  );
}

function SocialIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <div className="w-10 h-10 rounded-lg glass-panel flex items-center justify-center hover:text-primary transition-all cursor-pointer">
      {icon}
    </div>
  );
}
