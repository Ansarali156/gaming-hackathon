"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Building2, Users, Trophy, Globe, Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

const stats = [
  { icon: Users, value: "500+", label: "Elite Developers", gradient: "from-[#8b5cf6] to-[#10b981]" },
  { icon: Building2, value: "50+", label: "Top Tech Colleges", gradient: "from-[#10b981] to-[#059669]" },
  { icon: Globe, value: "100K+", label: "Digital Outreach", gradient: "from-[#8b5cf6] to-[#a78bfa]" },
  { icon: Trophy, value: "₹2L+", label: "Prize Pool Pool", gradient: "from-[#10b981] to-[#8b5cf6]" },
];

const benefits = [
  {
    title: "Direct Recruiting Channel",
    desc: "Gain exclusive, immediate access to a highly filtered pool of top-tier developer talent specializing in AI, game engines, and full-stack development. Accelerate your engineering pipeline.",
    highlight: "Talent Access"
  },
  {
    title: "High-Impact Brand Visibility",
    desc: "Feature your brand at the absolute forefront across physical banners, digital channels, live broadcasts, promotional press releases, and our prominent main stage during the grand finale.",
    highlight: "Global Reach"
  },
  {
    title: "API & SDK Product Adoption",
    desc: "Integrate your web services, APIs, hardware platforms, or LLM models as core hackathon challenge tracks. Drive deep developer engagement and get real-world product feedback.",
    highlight: "Developer Growth"
  }
];

export default function SponsorsPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/sponsors/inquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        setFormData({ name: "", email: "", phone: "", company: "", message: "" });
      } else {
        setError(data.error || "Failed to submit inquiry. Please try again.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      setError("An unexpected network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col justify-between">
      {/* Absolute Decorative Ambient Glows */}
      <div className="glow-spot top-[15%] -left-[10%] opacity-80" />
      <div className="glow-spot-secondary top-[40%] -right-[5%] opacity-60" />
      <div className="glow-spot bottom-[10%] left-[20%] opacity-40" />

      <Header />
      
      <main className="pt-32 pb-24 z-10 flex-grow">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          
          {/* Header Banner */}
          <div className="text-center max-w-3xl mx-auto mb-20 relative">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-6"
            >
              <Building2 size={13} />
              <span>Partnership Opportunities 2026</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-display text-4xl md:text-6xl font-extrabold text-[#1E293B] mb-6 leading-tight tracking-tight"
            >
              Elevate Your Brand With <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">IncuXai AI Gaming</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-text-muted text-base md:text-lg leading-relaxed max-w-2xl mx-auto"
            >
              Align your organization with India's premier Large-Scale AI Gaming Innovation Festival. Build future-proof solutions, drive developer adoption, and gain national brand recognition.
            </motion.p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20 relative">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card relative overflow-hidden p-8 flex flex-col justify-between group h-36"
              >
                {/* Visual Top Highlight Bar */}
                <div className={`absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r ${stat.gradient}`} />
                <div className="flex items-center justify-between">
                  <span className="text-text-muted text-xs font-bold uppercase tracking-wider">{stat.label}</span>
                  <div className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center border border-white/5 text-primary group-hover:border-primary/30 transition-colors">
                    <stat.icon size={18} />
                  </div>
                </div>
                <div className="font-display text-4xl font-extrabold text-white mt-4 flex items-baseline gap-1 group-hover:scale-105 origin-left transition-transform duration-300">
                  {stat.value}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Core Content: Vertically stacked to prevent horizontal compression */}
          <div className="space-y-20 relative">
            
            {/* Section 1: Why Sponsor IncuXai? (Full-width grid) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-8"
            >
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-display font-extrabold text-white tracking-tight">
                  Why Sponsor IncuXai?
                </h2>
                <p className="text-text-muted text-sm mt-2 max-w-2xl">
                  Discover the immense strategic value and developer engagement advantages of partnering with our innovation festival.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {benefits.map((benefit, idx) => (
                  <div 
                    key={idx} 
                    className="glass-card p-8 bg-surface-light/40 border border-white/5 rounded-2xl transition-all duration-300 hover:border-primary/20 hover:bg-surface-light/65 group flex flex-col justify-between relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full filter blur-xl group-hover:bg-primary/10 transition-all" />
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-12 h-12 rounded-xl bg-surface border border-white/10 flex items-center justify-center text-primary font-bold text-lg group-hover:bg-primary/10 transition-colors">
                          0{idx + 1}
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 border border-primary/20 px-2.5 py-1 rounded text-primary">{benefit.highlight}</span>
                      </div>
                      <h3 className="font-display font-bold text-white text-xl mb-3 leading-snug">{benefit.title}</h3>
                      <p className="text-text-muted text-sm leading-relaxed">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Section 2: Direct Outreach Channels (Full-width card) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <div className="glass-card p-8 md:p-10 bg-surface-light/40 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full filter blur-2xl" />
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-white/5 pb-6">
                  <div>
                    <h3 className="font-display font-bold text-white text-2xl flex items-center gap-2.5">
                      <Building2 size={22} className="text-primary" />
                      <span>Direct Outreach Channels</span>
                    </h3>
                    <p className="text-text-muted text-sm mt-1">Prefer traditional lines? Connect with our sponsorship coordinators instantly.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <a href="mailto:incuxgaming@gmail.com" className="flex flex-col p-5 bg-[#0a091c] rounded-xl border border-white/5 hover:border-primary/30 transition-all group">
                    <Mail size={22} className="text-primary mb-3" />
                    <span className="text-[10px] font-bold uppercase text-text-muted tracking-wider">Email Us</span>
                    <span className="text-sm font-semibold text-white group-hover:text-primary transition-colors truncate mt-1">incuxgaming@gmail.com</span>
                  </a>
                  <a href="tel:+917995061289" className="flex flex-col p-5 bg-[#0a091c] rounded-xl border border-white/5 hover:border-primary/30 transition-all group">
                    <Phone size={22} className="text-primary mb-3" />
                    <span className="text-[10px] font-bold uppercase text-text-muted tracking-wider">Call Directly</span>
                    <span className="text-sm font-semibold text-white group-hover:text-primary transition-colors truncate mt-1">+91 7995061289</span>
                  </a>
                  <div className="flex flex-col p-5 bg-[#0a091c] rounded-xl border border-white/5">
                    <MapPin size={22} className="text-primary mb-3" />
                    <span className="text-[10px] font-bold uppercase text-text-muted tracking-wider">Headquarters</span>
                    <span className="text-sm font-semibold text-white truncate mt-1">Anantapur, AP, India</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Section 3: Partnership Inquiry Form (Centered & Spacious) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="max-w-4xl mx-auto w-full"
            >
              <div className="glass-card p-8 md:p-12 relative overflow-hidden bg-surface-light/30 border border-white/5">
                <div className="absolute top-0 right-0 w-48 h-48 bg-secondary/5 rounded-full filter blur-3xl pointer-events-none" />
                
                <div className="border-b border-white/5 pb-6 mb-8">
                  <h2 className="text-3xl font-display font-extrabold text-white tracking-tight">Partner Inquiry Form</h2>
                  <p className="text-text-muted text-sm mt-1.5">Submit your requirements below and our brand relations team will contact you within 24 hours.</p>
                </div>

                <AnimatePresence mode="wait">
                  {success ? (
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.95, opacity: 0 }}
                      className="text-center py-16 space-y-5"
                    >
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary border border-primary/20">
                        <CheckCircle2 size={36} />
                      </div>
                      <h3 className="text-2xl font-bold text-white tracking-tight">Proposal Successfully Submitted!</h3>
                      <p className="text-text-muted text-sm max-w-sm mx-auto leading-relaxed">
                        Thank you for your valuable interest. A brand relations manager will get in touch with your organization shortly.
                      </p>
                      <button
                        onClick={() => setSuccess(false)}
                        className="btn-secondary py-3 px-8 text-sm mt-6 inline-flex items-center gap-2 font-semibold"
                      >
                        Submit Another Inquiry
                        <ArrowRight size={14} />
                      </button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      
                      {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm flex items-center gap-2.5">
                          <AlertCircle size={18} className="shrink-0" />
                          <span>{error}</span>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="label-text">Contact Name *</label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="input-field"
                            placeholder="Scott Thompson"
                            required
                            disabled={loading}
                          />
                        </div>
                        <div>
                          <label className="label-text">Company / Brand</label>
                          <input
                            type="text"
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            className="input-field"
                            placeholder="TechCorp Ltd"
                            disabled={loading}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="label-text">Business Email *</label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="input-field"
                            placeholder="scott@company.com"
                            required
                            disabled={loading}
                          />
                        </div>
                        <div>
                          <label className="label-text">Phone Number *</label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="input-field"
                            placeholder="+91 9876543210"
                            required
                            disabled={loading}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="label-text">Collaboration Outline / Message</label>
                        <textarea
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          rows={4}
                          className="input-field resize-none"
                          placeholder="How would you like to collaborate with IncuXai? (e.g. tracks, direct sponsors, recruiting...)"
                          disabled={loading}
                        ></textarea>
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={loading}
                          className="btn-primary w-full flex items-center justify-center gap-2.5 font-bold hover:shadow-lg disabled:opacity-50 transition-all duration-300"
                        >
                          {loading ? (
                            <span>Submitting Inquiry...</span>
                          ) : (
                            <>
                              <span>Submit Partnership Request</span>
                              <Send size={16} />
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
