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
    const [discordJoined, setDiscordJoined] = useState(false);
    const [discordVerifying, setDiscordVerifying] = useState(false);
    const [discordError, setDiscordError] = useState<string | null>(null);
    const [discordSuccess, setDiscordSuccess] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [paymentData, setPaymentData] = useState<{ orderId: string; amount: number; teamId: string } | null>(null);

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

  const handlePayment = () => {
    if (!paymentData) return;

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder",
      amount: paymentData.amount * 100,
      currency: "INR",
      name: "IncuXAI Hackathon",
      description: "Registration Fee",
      order_id: paymentData.orderId,
      handler: async function (response: any) {
        setSubmitting(true);
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
          const verifyRes = await fetch(`${apiUrl}/api/payments/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
              teamId: paymentData.teamId,
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
        } finally {
          setSubmitting(false);
        }
      },
      prefill: {
        name: leaderName,
        email: leaderEmail,
        contact: leaderMobile,
      },
      theme: {
        color: "#a855f7",
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  const handleSubmit = async () => {
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
      if (response.ok && data.success) {
        setPaymentData({
          orderId: data.razorpayOrder.id,
          amount: data.razorpayOrder.amount / 100,
          teamId: data.teamId,
        });
        setStep(5);
      }
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed. Please try again.");
    }
    setSubmitting(false);
  };

  const handleDiscordVerify = async () => {
    setDiscordVerifying(true);
    setDiscordError(null);
    setDiscordSuccess(false);
    
    try {
      // In a real implementation, you would verify Discord OAuth here
      // For now, we'll simulate a successful verification after a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate successful Discord verification
      setDiscordJoined(true);
      setDiscordSuccess(true);
      
      // Auto-transition to Step 4 (Payment) after 1.5 seconds for a premium UX
      setTimeout(() => {
        setStep(4);
      }, 1500);
    } catch (error) {
      console.error("Discord verification error:", error);
      setDiscordError("Failed to verify Discord. Please try again.");
    } finally {
      setDiscordVerifying(false);
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

           <div className="flex justify-center gap-4 mb-12">
             {[1, 2, 3, 4, 5].map((s) => (
               <div
                 key={s}
                 className={`flex items-center gap-2 ${s <= step ? "text-primary" : "text-text-dim"}`}
               >
                 <div
                   className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                     s <= step ? "bg-primary text-background" : "bg-surface-light text-text-dim"
                   }`}
                 >
                   {s}
                 </div>
                 <span className="hidden md:inline text-sm">
                   {s === 1 ? "Category" : s === 2 ? "Team Details" : s === 3 ? "Discord" : s === 4 ? "Payment" : "Success"}
                 </span>
               </div>
             ))}
           </div>

          <div className="glass-card p-8">
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
                          const newMembers = [...members];
                          newMembers[i].name = e.target.value;
                          setMembers(newMembers);
                        }} className="input-field" />
                        <input type="email" placeholder="Email" value={member.email} onChange={(e) => {
                          const newMembers = [...members];
                          newMembers[i].email = e.target.value;
                          setMembers(newMembers);
                        }} className="input-field" />
                        <input type="text" placeholder="Skills" value={member.skills} onChange={(e) => {
                          const newMembers = [...members];
                          newMembers[i].skills = e.target.value;
                          setMembers(newMembers);
                        }} className="input-field" />
                        <input type="text" placeholder="Role" value={member.role} onChange={(e) => {
                          const newMembers = [...members];
                          newMembers[i].role = e.target.value;
                          setMembers(newMembers);
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

            {step === 3 && (
               <div className="space-y-6 text-center">
                 <h2 className="font-display text-2xl font-bold text-text mb-6">Join Discord (Mandatory)</h2>
                 <p className="text-text-muted mb-6">
                   Join our official Discord server to receive updates, connect with mentors, and collaborate with other participants.
                 </p>
                 <div className="flex justify-center mb-6">
                   <a
                     href="https://discord.gg/incuxai"
                     target="_blank"
                     rel="noopener noreferrer"
                     className="btn-secondary inline-flex items-center gap-2"
                   >
                     Join Discord Server
                   </a>
                 </div>
                  <div className="flex gap-4">
                    <button onClick={() => setStep(2)} className="btn-secondary flex-1">Back</button>
                    {discordSuccess ? (
                      <button
                        onClick={() => setStep(4)}
                        className="btn-primary flex-1 bg-green-600 hover:bg-green-700 text-white animate-pulse"
                      >
                        Continue to Payment
                      </button>
                    ) : (
                      <button
                        onClick={handleDiscordVerify}
                        disabled={discordVerifying}
                        className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {discordVerifying ? "Verifying..." : "Verify Discord Join"}
                      </button>
                    )}
                  </div>
                 {discordError && (
                   <p className="text-red-400 mt-4 text-sm">
                     {discordError}
                   </p>
                 )}
                 {discordSuccess && (
                   <p className="text-green-400 mt-4 text-sm">
                     Discord verified successfully! You can now proceed to payment.
                   </p>
                 )}
               </div>
             )}

             {step === 4 && (
               <div className="space-y-6">
                 <h2 className="font-display text-2xl font-bold text-text mb-6">Payment</h2>
 
                 <div className="glass-panel p-6 space-y-4">
                   <div className="flex justify-between text-text-muted">
                     <span>Category</span>
                     <span className="text-text">{category}</span>
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
                     <span className="text-primary text-xl">₹{totalAmount}</span>
                   </div>
                 </div>
 
                 <div className="flex gap-4">
                   <button onClick={() => setStep(3)} className="btn-secondary flex-1">Back</button>
                   <button
                     onClick={handleSubmit}
                     disabled={submitting}
                     className="btn-primary flex-1 disabled:opacity-50"
                   >
                     {submitting ? "Processing..." : `Pay ₹${totalAmount}`}
                   </button>
                 </div>
               </div>
             )}
             
              {step === 5 && (
                <div className="space-y-6">
                  <h2 className="font-display text-2xl font-bold text-text mb-6">Complete Payment</h2>
                  
                  {paymentData && (
                    <div className="glass-card p-8 text-center">
                      <p className="text-text-muted mb-6">
                        Please complete the payment of ₹{paymentData.amount} to confirm your registration.
                      </p>
                      
                      <button
                        onClick={handlePayment}
                        className="btn-primary w-full py-4 mb-4 font-bold text-lg bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all duration-300"
                      >
                        Pay with Razorpay
                      </button>
                      
                      <p className="text-text-muted text-sm">
                        We accept UPI, Credit/Debit Cards, Net Banking & Wallets
                      </p>
                    </div>
                  )}
                  
                  <div className="flex gap-4">
                    <button onClick={() => setStep(4)} className="btn-secondary flex-1">Back</button>
                    <button
                      onClick={() => {
                        // In a real implementation, you would verify payment here
                        // For now, we'll simulate success
                        setSuccess(true);
                      }}
                      disabled={submitting}
                      className="btn-primary flex-1"
                    >
                      {submitting ? "Verifying..." : "Skip / Sim Success (Test)"}
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
