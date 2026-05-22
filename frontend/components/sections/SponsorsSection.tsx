"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Building2 } from "lucide-react";
import { SponsorInquiryModal } from "@/components/ui/SponsorInquiryModal";

export function SponsorsSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section id="sponsors" className="py-24 relative overflow-hidden">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-title">Sponsors & Partners</h2>
          <p className="section-subtitle">Join our ecosystem of innovation. Partner with India's brightest minds.</p>
        </motion.div>

        {/* Scrolling or Static Grid of the two sponsors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-8 justify-center items-center mb-16"
        >
          <a
            href="https://incuxai.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card px-8 py-6 min-w-[200px] flex flex-col items-center justify-center hover:bg-white/10 transition-colors"
          >
            <img
              src="https://incuxai.com/assets/img/logo/incuxai.jpg"
              alt="IncuXai"
              className="h-16 w-auto object-contain mb-3 rounded"
            />
            <span className="text-text-muted hover:text-white font-medium">IncuXai</span>
          </a>

          <a
            href="https://incuxai.com/hackathon/index.php"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card px-8 py-6 min-w-[200px] flex flex-col items-center justify-center hover:bg-white/10 transition-colors"
          >
            <img
              src="https://incuxai.com/hackathon/assets/images/rtih.jpeg"
              alt="IncuXai Hackathon"
              className="h-16 w-auto object-contain mb-3 rounded"
            />
            <span className="text-text-muted hover:text-white font-medium">Hackathon Portal</span>
          </a>
        </motion.div>

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
