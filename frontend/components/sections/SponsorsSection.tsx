"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { Building2 } from "lucide-react";
import { SponsorInquiryModal } from "@/components/ui/SponsorInquiryModal";

const SPONSORS = [
  {
    name: "Ratan Tata Innovation Hub (RTIH)",
    logo: "/rtih_logo.png",
    website: "https://rtih.co.in"
  },
  {
    name: "IncuXai",
    logo: "/incuxai_new.png",
    website: "https://incuxai.com"
  }
];

export function SponsorsSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section id="sponsors" className="py-24 relative bg-background border-t border-b border-border">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-title">Sponsors & Partners</h2>
          <p className="section-subtitle">Collaborating with industry pioneers to power the next generation of AI Gaming Innovation.</p>
        </motion.div>

        <div className="flex flex-wrap gap-8 justify-center items-center">
          {SPONSORS.map((sponsor, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card w-full max-w-[340px] px-8 py-8 flex flex-col items-center justify-center border border-border shadow-md bg-surface rounded-xl"
            >
              {sponsor.website ? (
                <a
                  href={sponsor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-4 text-center group w-full"
                >
                  <div className="h-24 w-full flex items-center justify-center mb-2 p-2">
                    <Image
                      src={sponsor.logo}
                      alt={sponsor.name}
                      width={180}
                      height={96}
                      className="max-h-full max-w-full object-contain transition-all duration-300"
                    />
                  </div>
                  <span className="text-text font-semibold group-hover:text-primary transition-colors text-base">
                    {sponsor.name}
                  </span>
                </a>
              ) : (
                <div className="flex flex-col items-center gap-4 text-center w-full">
                  <div className="h-24 w-full flex items-center justify-center mb-2 p-2">
                    <Image
                      src={sponsor.logo}
                      alt={sponsor.name}
                      width={180}
                      height={96}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <span className="text-text font-semibold text-base">{sponsor.name}</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-secondary inline-flex items-center gap-2"
          >
            <Building2 size={18} />
            Become a Sponsor
          </button>
        </motion.div>
      </div>

      <SponsorInquiryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </section>
  );
}
