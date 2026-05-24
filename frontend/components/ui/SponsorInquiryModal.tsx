import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { XCircle, Send, Loader2 } from "lucide-react";

export function SponsorInquiryModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/sponsors/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit inquiry");
      }
      
      setStatus("success");
      setFormData({ name: "", email: "", phone: "", company: "", message: "" });
      
      // Auto close after 3s
      setTimeout(() => {
        setStatus("idle");
        onClose();
      }, 3000);
      
    } catch (err: any) {
      console.error("Inquiry error:", err);
      setStatus("error");
      setErrorMessage(err.message || "An unexpected error occurred.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg glass-card p-6 md:p-8 relative overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-text-muted hover:text-text transition-colors"
            >
              <XCircle size={24} />
            </button>

            <div className="mb-6">
              <h2 className="font-display text-2xl font-bold text-text mb-2">Become a Sponsor</h2>
              <p className="text-text-muted text-sm">
                Partner with India's brightest tech minds. Fill out the form below and our team will get in touch with you shortly.
              </p>
            </div>

            {status === "success" ? (
              <div className="text-center py-12 space-y-4 animate-in fade-in zoom-in duration-300">
                <div className="w-16 h-16 bg-neon-green/20 rounded-full flex items-center justify-center mx-auto text-neon-green">
                  <Send size={32} />
                </div>
                <h3 className="font-display font-bold text-xl text-text">Inquiry Sent!</h3>
                <p className="text-text-muted text-sm">Thank you for your interest. We'll be in touch soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label htmlFor="name" className="text-xs font-medium text-text-muted uppercase tracking-wider">Full Name <span className="text-primary">*</span></label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                    placeholder="John Doe"
                    disabled={status === "loading"}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="email" className="text-xs font-medium text-text-muted uppercase tracking-wider">Email <span className="text-primary">*</span></label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input-field"
                      placeholder="john@example.com"
                      disabled={status === "loading"}
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="phone" className="text-xs font-medium text-text-muted uppercase tracking-wider">Phone <span className="text-primary">*</span></label>
                    <input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="input-field"
                      placeholder="+91 9876543210"
                      disabled={status === "loading"}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="company" className="text-xs font-medium text-text-muted uppercase tracking-wider">Company / Organization</label>
                  <input
                    id="company"
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="input-field"
                    placeholder="Tech Corp Ltd."
                    disabled={status === "loading"}
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="message" className="text-xs font-medium text-text-muted uppercase tracking-wider">Additional Message</label>
                  <textarea
                    id="message"
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="input-field resize-none"
                    placeholder="Tell us how you'd like to collaborate..."
                    disabled={status === "loading"}
                  />
                </div>

                {status === "error" && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="btn-primary w-full py-3 flex items-center justify-center gap-2 mt-4"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Sending...
                    </>
                  ) : (
                    <>
                      Submit Inquiry
                      <Send size={18} />
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
