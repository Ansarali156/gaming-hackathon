"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Building2 } from "lucide-react";

export function SponsorsSection() {
  const [groupedSponsors, setGroupedSponsors] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSponsors() {
      try {
        const res = await fetch("/api/sponsors");
        const data = await res.json();
        
        if (data.success && data.sponsors.length > 0) {
          // Group by tier
          const groups: Record<string, any[]> = {};
          data.sponsors.forEach((sponsor: any) => {
            const tier = sponsor.tier || "Other Partners";
            if (!groups[tier]) groups[tier] = [];
            groups[tier].push(sponsor);
          });
          setGroupedSponsors(groups);
        } else {
          // Default mock data if no sponsors in DB yet
          setGroupedSponsors({
            "Title Sponsor": [{ name: "Coming Soon" }],
            "Community Partners": [{ name: "GDSC" }, { name: "IEEE" }],
          });
        }
      } catch (error) {
        console.error("Failed to fetch sponsors:", error);
        setGroupedSponsors({
          "Title Sponsor": [{ name: "Coming Soon" }],
        });
      } finally {
        setLoading(false);
      }
    }
    fetchSponsors();
  }, []);

  return (
    <section id="sponsors" className="py-24 relative">
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

        {loading ? (
          <div className="flex justify-center text-primary">Loading sponsors...</div>
        ) : (
          <div className="space-y-12">
            {Object.entries(groupedSponsors).map(([tier, sponsorsArray], i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <h3 className="font-display text-lg font-bold text-primary mb-6">{tier}</h3>
                <div className="flex flex-wrap gap-6 justify-center">
                  {sponsorsArray.map((sponsor, j) => (
                    <div
                      key={j}
                      className="glass-card px-8 py-6 min-w-[150px] flex items-center justify-center hover:bg-white/10 transition-colors"
                    >
                      {sponsor.website ? (
                        <a href={sponsor.website} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-3 text-text-muted hover:text-white font-medium">
                          {sponsor.logo && <img src={sponsor.logo} alt={sponsor.name} className="h-12 w-auto object-contain mb-2" />}
                          {sponsor.name}
                        </a>
                      ) : (
                        <div className="flex flex-col items-center gap-3">
                          {sponsor.logo && <img src={sponsor.logo} alt={sponsor.name} className="h-12 w-auto object-contain mb-2" />}
                          <span className="text-text-muted font-medium">{sponsor.name}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <a
            href="/sponsors"
            className="btn-secondary inline-flex items-center gap-2"
          >
            <Building2 size={18} />
            Become a Sponsor
          </a>
        </motion.div>
      </div>
    </section>
  );
}
