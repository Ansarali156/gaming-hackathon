"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArrowLeft, Send, CheckCircle2, AlertCircle, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";

export default function SponsorContactPage() {
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
      {/* Decorative Neon Blurs */}
      <div className="glow-spot top-[10%] left-[10%] opacity-70" />
      <div className="glow-spot-secondary bottom-[20%] right-[10%] opacity-50" />

      <Header />
      
      <main className="pt-32 pb-24 z-10 flex-grow flex items-center">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full relative">
          
          {/* Back button link */}
          <div className="max-w-3xl mx-auto mb-6">
            <Link
              href="/sponsors"
              className="inline-flex items-center gap-2 text-text-muted hover:text-primary transition-colors text-sm font-semibold group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span>Back to Sponsorship Overview</span>
            </Link>
          </div>

          {/* Core Form Card */}
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-10 md:p-12 bg-surface-light/30 border border-white/5 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full filter blur-2xl" />
              
              <div className="border-b border-white/5 pb-6 mb-8">
                <h1 className="text-3xl font-display font-extrabold text-white tracking-tight">
                  Contact Sponsorship Team
                </h1>
                <p className="text-text-muted text-sm mt-1.5 leading-relaxed">
                  Have a specific proposal or custom track query? Connect directly with the IncuXai Brand Relations Committee.
                </p>
              </div>

              <AnimatePresence mode="wait">
                {success ? (
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="text-center py-16 space-y-6"
                  >
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary border border-primary/20 animate-bounce">
                      <CheckCircle2 size={42} />
                    </div>
                    <h3 className="text-2xl font-display font-extrabold text-white tracking-tight">Message Transmitted!</h3>
                    <p className="text-text-muted text-sm max-w-sm mx-auto leading-relaxed">
                      Thank you for reaching out. An alignment coordinator has received your query and will follow up with you within 24 hours.
                    </p>
                    <div className="pt-4">
                      <Link
                        href="/sponsors"
                        className="btn-secondary py-3 px-8 text-sm inline-block font-semibold"
                      >
                        Return to Sponsors Hub
                      </Link>
                    </div>
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
                        <label className="label-text">Your Name *</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="input-field"
                          placeholder="e.g. Scott Thompson"
                          required
                          disabled={loading}
                        />
                      </div>
                      <div>
                        <label className="label-text">Company / Organization</label>
                        <input
                          type="text"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          className="input-field"
                          placeholder="e.g. TechCorp Ltd"
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="label-text">Work Email *</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="input-field"
                          placeholder="e.g. scott@company.com"
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
                          placeholder="e.g. +91 9876543210"
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="label-text">Partnership Outline / Message</label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows={5}
                        className="input-field resize-none"
                        placeholder="Detail your goals, track requirements, or custom packages you are interested in..."
                        disabled={loading}
                      ></textarea>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full py-4 flex items-center justify-center gap-2.5 font-bold hover:shadow-lg disabled:opacity-50 transition-all duration-300"
                      >
                        {loading ? (
                          <span>Sending Inquiry...</span>
                        ) : (
                          <>
                            <span>Send Secure Inquiry</span>
                            <Send size={16} />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </AnimatePresence>

            </motion.div>
          </div>

          {/* Quick Channels Grid below form */}
          <div className="max-w-3xl mx-auto mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <a 
              href="mailto:incuxgaming@gmail.com" 
              className="flex flex-col items-center p-5 bg-surface-light/35 border border-white/5 rounded-2xl hover:border-primary/20 hover:bg-surface-light/50 transition-all duration-300 group"
            >
              <Mail className="text-primary mb-3" size={24} />
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Email Us</span>
              <span className="text-xs font-semibold text-white group-hover:text-primary transition-colors mt-1.5">
                incuxgaming@gmail.com
              </span>
            </a>
            <a 
              href="tel:+917995061289"
              className="flex flex-col items-center p-5 bg-surface-light/35 border border-white/5 rounded-2xl hover:border-primary/20 hover:bg-surface-light/50 transition-all duration-300 group"
            >
              <Phone className="text-primary mb-3" size={24} />
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Call Us</span>
              <span className="text-xs font-semibold text-white group-hover:text-primary transition-colors mt-1.5">
                +91 7995061289
              </span>
            </a>
            <div className="flex flex-col items-center p-5 bg-surface-light/35 border border-white/5 rounded-2xl">
              <MapPin className="text-primary mb-3" size={24} />
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Location</span>
              <span className="text-xs font-semibold text-white mt-1.5">
                Anantapur, AP, India
              </span>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
