"use client";

import { motion } from "motion/react";
import { Quote } from "lucide-react";

const messages = [
  {
    initials: "SI",
    name: "SRI P. JAGADEESH, I.P.S.",
    title: "SUPERINTENDENT OF POLICE,\nANANTAPUR",
    quoteTitle: "Empowering law enforcement with next-gen AI",
    quoteText: "We invite the brightest minds across the nation to collaborate with the Anantapur Police Department. This hackathon is an opportunity to build solutions that can directly strengthen public safety, improve response systems, and create meaningful impact through AI."
  },
  {
    initials: "JD",
    name: "JOHN DOE",
    title: "CHIEF GUEST",
    quoteTitle: "Innovating for a safer tomorrow",
    quoteText: "Join us in this groundbreaking initiative to leverage technology for social good. Your ideas have the power to transform how we approach law enforcement and community safety. Let's build the future together."
  }
];

export function WelcomeSection() {
  const logos = [
    "https://incuxai.com/assets/img/logo/incuxai.jpg",
    "https://incuxai.com/hackathon/assets/images/rtih.jpeg",
  ];
  
  // Duplicate logos to ensure seamless scrolling
  const marqueeLogos = [...logos, ...logos, ...logos, ...logos, ...logos, ...logos];

  return (
    <section id="welcome" className="pb-24 bg-background relative overflow-hidden">
      <style>{`
        @keyframes scroll-ltr {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-scroll-ltr {
          animation: scroll-ltr 20s linear infinite;
        }
      `}</style>
      
      {/* Scrolling Logos Marquee */}
      <div className="w-full mt-20 mb-20 py-8 bg-surface-light/50 border-y border-white/5 flex overflow-hidden">
        <div className="flex w-max animate-scroll-ltr items-center hover:[animation-play-state:paused]">
          {/* First Group */}
          <div className="flex w-max items-center gap-16 px-8">
            {marqueeLogos.map((logo, i) => (
              <img 
                key={`group1-${i}`} 
                src={logo} 
                alt="Partner Logo" 
                className="h-20 md:h-24 object-contain rounded-lg shadow-lg opacity-80 hover:opacity-100 transition-opacity shrink-0" 
              />
            ))}
          </div>
          {/* Second Group */}
          <div className="flex w-max items-center gap-16 px-8">
            {marqueeLogos.map((logo, i) => (
              <img 
                key={`group2-${i}`} 
                src={logo} 
                alt="Partner Logo" 
                className="h-20 md:h-24 object-contain rounded-lg shadow-lg opacity-80 hover:opacity-100 transition-opacity shrink-0" 
              />
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-[2px] bg-primary"></div>
            <h2 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-wide text-text">
              WELCOME <span className="text-primary">MESSAGE</span>
            </h2>
          </div>
        </motion.div>

        <div className="flex flex-col gap-8">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-surface-light rounded-xl overflow-hidden flex flex-col md:flex-row relative border border-white/5"
            >
              {/* Background Quote Watermark */}
              <Quote className="absolute right-8 top-1/2 -translate-y-1/2 w-64 h-64 text-white/[0.02] z-0 pointer-events-none -rotate-12" />

              {/* Sidebar Area */}
              <div className="bg-surface md:w-[320px] p-8 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-white/5 z-10 shrink-0">
                <div className="w-36 h-36 rounded-full bg-[#178C8F] flex items-center justify-center border-[6px] border-background shadow-lg mb-6">
                  <span className="text-5xl md:text-6xl font-light text-white tracking-widest">{msg.initials}</span>
                </div>
                <h3 className="text-white font-bold tracking-wider mb-2 uppercase text-sm">
                  {msg.name}
                </h3>
                <p className="text-[#00f5d4] text-[10px] md:text-xs font-bold tracking-widest uppercase whitespace-pre-line leading-relaxed">
                  {msg.title}
                </p>
              </div>

              {/* Content Area */}
              <div className="p-8 md:p-12 lg:p-16 flex-1 flex flex-col justify-center z-10">
                <Quote className="w-10 h-10 text-white/10 mb-6" />
                <h4 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6 leading-tight max-w-3xl">
                  {msg.quoteTitle}
                </h4>
                <p className="text-text-muted text-base md:text-lg leading-relaxed max-w-4xl">
                  {msg.quoteText}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
