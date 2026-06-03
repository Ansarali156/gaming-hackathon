"use client";

import { motion } from "motion/react";
import { Quote } from "lucide-react";

const messages = [
  {
    name: "DR. R. HAFEEZ BASHA",
    title: "CEO, RTIH ANANTHAPUR SPOKE",
    quoteTitle: "Nurturing innovation and startup scaling in AP",
    quoteText: "Welcome to the Anantapur Innovation Festival. At the Ratan Tata Innovation Hub, our mission is to empower student innovators and startups with direct pathways to incubation, mentorship, and investment. This hackathon is your canvas to build real-world AI gaming solutions that make a lasting impact.",
    image: "/hafeez.jpg",
    initials: "HB"
  },
  {
    name: "ASIF MA",
    title: "Founder, College Circle & YouTuber (@asifma121)",
    quoteTitle: "Bridging the gap between students and career opportunities",
    quoteText: "AI is the ultimate game-changer for the next generation of creators and developers. This hackathon is not just a competition, but an absolute launchpad for students to build real-world products, connect with industry leaders, and scale their ideas. Unleash your creativity, think out of the box, and construct the future of interactive technology!",
    image: "/asif.png",
    initials: "AM"
  }
];

export function WelcomeSection() {
  return (
    <section id="welcome" className="py-24 bg-background relative overflow-hidden">

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
                <div className="w-36 h-36 rounded-full overflow-hidden flex items-center justify-center border-[6px] border-background shadow-lg mb-6 bg-surface">
                  {msg.image ? (
                    <img src={msg.image} alt={msg.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-[#178C8F] flex items-center justify-center">
                      <span className="text-5xl md:text-6xl font-light text-white tracking-widest">{msg.initials}</span>
                    </div>
                  )}
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
