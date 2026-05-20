"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PRICING } from "@/lib/constants";
import { Users, Mail, Phone, Linkedin, Building2, Code, Send, CheckCircle } from "lucide-react";

type Category = "STUDENT" | "IT_PROFESSIONAL" | "STARTUP";

interface TeamMember {
  name: string;
  email: string;
  skills: string;
  role: string;
}

export default function RegisterPage() {
  const [razorpayInstance, setRazorpayInstance] = useState<any>(null);

  // Load Razorpay script dynamically
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const [step, setStep] = useState(1);
  const [category, setCategory] = useState<Category | null>(null);
  const [teamName, setTeamName] = useState("");
  const [leaderName, setLeaderName] = useState("");
  const [leaderEmail, setLeaderEmail] = useState("");
  const [leaderMobile, setLeaderMobile] = useState("");
  const [leaderLinkedin, setLeaderLinkedin] = useState("");
  const [leaderCollege, setLeaderCollege] = useState("");
  const [members, setMembers] = useState<TeamMember[]>([{ name: "", email: "", skills: "", role: "" }]);
  const [projectTheme, setProjectTheme] = useState("");
  const [techStack, setTechStack] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const pricing = category ? PRICING[category] : null;
  const totalAmount = pricing ? pricing.price * (members.length + 1) : 0;

  const addMember = () => {
    if (pricing && members.length < pricing.maxTeam - 1) {
      setMembers([...members, { name: "", email: "", skills: "", role: "" }]);
    }
  };

  const removeMember = (index: number) => {
    if (members.length > 1) {
      setMembers(members.filter((_, i) => i !== index));
    }
  };

  const handlePay = async () => {
    setSubmitting(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const response = await fetch(`${apiUrl}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          teamName,
          leader: { name: leaderName, email: leaderEmail, mobile: leaderMobile, linkedin: leaderLinkedin, college: leaderCollege },
          members,
          projectTheme,
          techStack,
          totalAmount,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        alert("Registration failed. Please try again.");
        setSubmitting(false);
        return;
      }

      const orderData = {
        orderId: data.razorpayOrder.id,
        amount: data.razorpayOrder.amount / 100,
        teamId: data.teamId,
      };

      // Open Razorpay immediately after order is created
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder",
        amount: orderData.amount * 100,
        currency: "INR",
        name: "IncuXAI Hackathon",
        description: "Registration Fee",
        order_id: orderData.orderId,
        handler: async function (rpResponse: any) {
          try {
            const verifyRes = await fetch(`${apiUrl}/api/payments/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                paymentId: rpResponse.razorpay_payment_id,
                orderId: rpResponse.razorpay_order_id,
                signature: rpResponse.razorpay_signature,
                teamId: orderData.teamId,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              setSuccess(true);
            } else {
              alert("Payment verification failed. Please contact support.");
            }
          } catch (err) {
            console.error("Payment verification failed:", err);
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: leaderName,
          email: leaderEmail,
          contact: leaderMobile,
        },
        theme: { color: "#a855f7" },
        modal: {
          ondismiss: () => {
            setSubmitting(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed. Please try again.");
      setSubmitting(false);
    }
  };


  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Header />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-12 text-center max-w-lg mx-auto"
        >
          <CheckCircle className="text-primary mx-auto mb-6" size={64} />
          <h2 className="font-display text-3xl font-bold text-text mb-4">Registration Successful!</h2>
          <p className="text-text-muted mb-6">
            Your team has been registered. Check your email for confirmation and next steps.
          </p>
          <a href="/dashboard/participant" className="btn-primary">
            Go to Dashboard
          </a>
        </motion.div>
        <Footer />
      </div>
    );
  }

  // Step labels: 1=Category, 2=Team Details, 3=Payment, 4=Complete
  const stepLabels: Record<number, string> = {
    1: "Category",
    2: "Team Details",
    3: "Payment",
    4: "Complete",
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-28 pb-16">
        <div className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold gradient-text mb-4">Register Now</h1>
            <p className="text-text-muted">Join India's Ultimate AI Gaming Hackathon</p>
          </motion.div>

          {/* Step Indicator — 4 steps */}
          <div className="flex justify-center gap-4 mb-12">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`flex items-center gap-2 ${s <= step ? "text-primary" : "text-text-dim"}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    s < step
                      ? "bg-primary text-background"
                      : s === step
                      ? "bg-primary text-background ring-4 ring-primary/20"
                      : "bg-surface-light text-text-dim"
                  }`}
                >
                  {s < step ? <CheckCircle size={16} /> : s}
                </div>
                <span className="hidden md:inline text-sm font-medium">{stepLabels[s]}</span>
              </div>
            ))}
          </div>

          <div className="glass-card p-8">
            {/* STEP 1 — Category */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="font-display text-2xl font-bold text-text mb-6">Select Category</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(Object.entries(PRICING) as [Category, typeof PRICING.STUDENT][]).map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() => setCategory(key)}
                      className={`glass-card p-6 text-left transition-all ${
                        category === key ? "border-primary/50 bg-primary/5" : ""
                      }`}
                    >
                      <h3 className="font-display text-lg font-bold text-text mb-2">
                        {key === "STUDENT" ? "Students" : key === "IT_PROFESSIONAL" ? "IT Professionals" : "Startups"}
                      </h3>
                      <p className="text-3xl font-bold text-primary mb-2">₹{value.price}</p>
                      <p className="text-text-muted text-sm">per person</p>
                      <p className="text-text-muted text-sm mt-2">Team: {value.minTeam}-{value.maxTeam} members</p>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => category && setStep(2)}
                  disabled={!category}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            )}

            {/* STEP 2 — Team Details */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="font-display text-2xl font-bold text-text mb-6">Team Details</h2>

                <div>
                  <label className="label-text">Team Name</label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="input-field"
                    placeholder="Enter team name"
                  />
                </div>

                <div className="border-t border-white/5 pt-6">
                  <h3 className="font-bold text-text mb-4">Leader Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="label-text">Full Name</label>
                      <input type="text" value={leaderName} onChange={(e) => setLeaderName(e.target.value)} className="input-field" />
                    </div>
                    <div>
                      <label className="label-text">Email</label>
                      <input type="email" value={leaderEmail} onChange={(e) => setLeaderEmail(e.target.value)} className="input-field" />
                    </div>
                    <div>
                      <label className="label-text">Mobile</label>
                      <input type="tel" value={leaderMobile} onChange={(e) => setLeaderMobile(e.target.value)} className="input-field" />
                    </div>
                    <div>
                      <label className="label-text">LinkedIn</label>
                      <input type="url" value={leaderLinkedin} onChange={(e) => setLeaderLinkedin(e.target.value)} className="input-field" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="label-text">College/Company</label>
                      <input type="text" value={leaderCollege} onChange={(e) => setLeaderCollege(e.target.value)} className="input-field" />
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-text">Team Members</h3>
                    {pricing && members.length < pricing.maxTeam - 1 && (
                      <button onClick={addMember} className="text-primary text-sm hover:underline">
                        + Add Member
                      </button>
                    )}
                  </div>
                  {members.map((member, i) => (
                    <div key={i} className="mb-4 p-4 bg-surface-light rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" placeholder="Name" value={member.name} onChange={(e) => {
                          const newMembers = [...members]; newMembers[i].name = e.target.value; setMembers(newMembers);
                        }} className="input-field" />
                        <input type="email" placeholder="Email" value={member.email} onChange={(e) => {
                          const newMembers = [...members]; newMembers[i].email = e.target.value; setMembers(newMembers);
                        }} className="input-field" />
                        <input type="text" placeholder="Skills" value={member.skills} onChange={(e) => {
                          const newMembers = [...members]; newMembers[i].skills = e.target.value; setMembers(newMembers);
                        }} className="input-field" />
                        <input type="text" placeholder="Role" value={member.role} onChange={(e) => {
                          const newMembers = [...members]; newMembers[i].role = e.target.value; setMembers(newMembers);
                        }} className="input-field" />
                      </div>
                      {members.length > 1 && (
                        <button onClick={() => removeMember(i)} className="text-red-400 text-sm mt-2 hover:underline">
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/5 pt-6">
                  <h3 className="font-bold text-text mb-4">Project Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="label-text">Selected Theme</label>
                      <select value={projectTheme} onChange={(e) => setProjectTheme(e.target.value)} className="input-field">
                        <option value="">Select a theme</option>
                        <option value="AI NPC Systems">AI NPC Systems</option>
                        <option value="Procedural Content Generation">Procedural Content Generation</option>
                        <option value="AI for Game Testing">AI for Game Testing & Balancing</option>
                        <option value="AR/VR Gaming">AR/VR Gaming Experience</option>
                        <option value="Esports Analytics">Esports Analytics & AI</option>
                        <option value="Serious Games">Serious Games for Social Impact</option>
                        <option value="Metaverse/Web3">Metaverse and Web3 Gaming</option>
                      </select>
                    </div>
                    <div>
                      <label className="label-text">Tech Stack</label>
                      <input type="text" value={techStack} onChange={(e) => setTechStack(e.target.value)} className="input-field" placeholder="e.g., Unity, Python, TensorFlow" />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button onClick={() => setStep(1)} className="btn-secondary flex-1">Back</button>
                  <button
                    onClick={() => teamName && leaderName && leaderEmail && setStep(3)}
                    disabled={!teamName || !leaderName || !leaderEmail}
                    className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3 — Payment Summary */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="font-display text-2xl font-bold text-text mb-6">Payment Summary</h2>

                <div className="glass-panel p-6 space-y-4">
                  <div className="flex justify-between text-text-muted">
                    <span>Team</span>
                    <span className="text-text font-bold">{teamName}</span>
                  </div>
                  <div className="flex justify-between text-text-muted">
                    <span>Category</span>
                    <span className="text-text">{category === "STUDENT" ? "Students" : category === "IT_PROFESSIONAL" ? "IT Professionals" : "Startups"}</span>
                  </div>
                  <div className="flex justify-between text-text-muted">
                    <span>Team Size</span>
                    <span className="text-text">{members.length + 1} members</span>
                  </div>
                  <div className="flex justify-between text-text-muted">
                    <span>Price per person</span>
                    <span className="text-text">₹{pricing?.price}</span>
                  </div>
                  <div className="border-t border-white/5 pt-4 flex justify-between font-bold">
                    <span className="text-text">Total Amount</span>
                    <span className="text-primary text-2xl">₹{totalAmount}</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button onClick={() => setStep(2)} className="btn-secondary flex-1">Back</button>
                  <button
                    onClick={() => setSuccess(true)}
                    className="btn-primary flex-1"
                  >
                    Pay ₹{totalAmount}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
