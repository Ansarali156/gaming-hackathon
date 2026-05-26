"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PRICING, TRACKS } from "@/lib/constants";
import {
  Users,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Lock,
} from "lucide-react";

type Category = "STUDENT" | "IT_PROFESSIONAL" | "STARTUP";

interface TeamMember {
  name: string;
  email: string;
  skills: string;
  role: string;
}

interface ValidationErrors {
  [key: string]: string;
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="flex items-center gap-1 text-red-400 text-xs mt-1">
      <AlertCircle size={12} />
      {msg}
    </p>
  );
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function isValidPhone(phone: string) {
  return /^[6-9]\d{9}$/.test(phone.replace(/\s/g, ""));
}

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState<Category | null>(null);
  const [teamName, setTeamName] = useState("");
  const [leaderName, setLeaderName] = useState("");
  const [leaderEmail, setLeaderEmail] = useState("");
  const [leaderPassword, setLeaderPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [leaderMobile, setLeaderMobile] = useState("");
  const [leaderLinkedin, setLeaderLinkedin] = useState("");
  const [leaderCollege, setLeaderCollege] = useState("");
  const [members, setMembers] = useState<TeamMember[]>([
    { name: "", email: "", skills: "", role: "" },
  ]);
  const [projectTheme, setProjectTheme] = useState("");
  const [techStack, setTechStack] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [registeredTeamId, setRegisteredTeamId] = useState<string | null>(null);

  const pricing = category ? PRICING[category] : null;

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

  // ── Step 1 Validation ──────────────────────────────────────────────────
  const validateStep1 = () => {
    if (!category) {
      setErrors({ category: "Please select a category." });
      return false;
    }
    setErrors({});
    return true;
  };

  // ── Step 2 Validation ──────────────────────────────────────────────────
  const validateStep2 = () => {
    const errs: ValidationErrors = {};

    if (!teamName.trim()) errs.teamName = "Team name is required.";
    if (!leaderName.trim()) errs.leaderName = "Leader name is required.";
    if (!leaderEmail.trim()) errs.leaderEmail = "Leader email is required.";
    else if (!isValidEmail(leaderEmail)) errs.leaderEmail = "Enter a valid email address.";
    if (!leaderPassword) errs.leaderPassword = "Password is required.";
    else if (leaderPassword.length < 8) errs.leaderPassword = "Password must be at least 8 characters.";
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(leaderPassword))
      errs.leaderPassword = "Password must include uppercase, lowercase, number, and special character.";
    if (!confirmPassword) errs.confirmPassword = "Please confirm your password.";
    else if (leaderPassword !== confirmPassword) errs.confirmPassword = "Passwords do not match.";
    if (!leaderMobile.trim()) errs.leaderMobile = "Mobile number is required.";
    else if (!isValidPhone(leaderMobile)) errs.leaderMobile = "Enter a valid 10-digit Indian mobile number.";
    if (!leaderCollege.trim()) errs.leaderCollege = "College/Company is required.";

    members.forEach((m, i) => {
      if (!m.name.trim()) errs[`member_${i}_name`] = `Member ${i + 1}: name is required.`;
      if (!m.email.trim()) errs[`member_${i}_email`] = `Member ${i + 1}: email is required.`;
      else if (!isValidEmail(m.email)) errs[`member_${i}_email`] = `Member ${i + 1}: enter a valid email.`;
    });

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── Handle Final Registration ──────────────────────────────────────────
  const handleRegister = async () => {
    setSubmitting(true);
    setSubmitError(null);

    const payload = {
      category,
      teamName,
      leader: {
        name: leaderName,
        email: leaderEmail,
        password: leaderPassword,
        mobile: leaderMobile,
        linkedin: leaderLinkedin,
        college: leaderCollege,
      },
      members,
      projectTheme,
      techStack,
    };

    const registerEndpoint = "/api/register";

    try {
      // 1. Validate fields and uniqueness via validateOnly: true
      const validateResponse = await fetch(registerEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, validateOnly: true }),
      });

      const validateData = await validateResponse.json();

      if (!validateResponse.ok || !validateData.success) {
        setSubmitError(validateData.error || "Validation failed. Please check your inputs.");
        setSubmitting(false);
        return;
      }

      // 2. Submit registration (payments are handled by SUN)
      try {
        const registerRes = await fetch(registerEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, returnSunRedirect: true }),
        });

        const registerData = await registerRes.json();

        if (registerRes.ok && registerData.success) {
          setRegisteredTeamId(registerData.teamId);
          // If backend returned a SUN redirect URL, navigate there to complete payment
          if (registerData.sunRedirectUrl) {
            window.location.href = registerData.sunRedirectUrl;
            return;
          }
          setSuccess(true);
        } else {
          setSubmitError(registerData.error || registerData.warning || "Registration failed. Please contact support.");
        }
      } catch (err) {
        setSubmitError("Network error. Please try again.");
      } finally {
        setSubmitting(false);
      }

    } catch (err) {
      setSubmitError("Network error. Please try again.");
      setSubmitting(false);
    }
  };

  // ── Success State ──────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-28 pb-16 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-12 text-center max-w-lg mx-auto"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle className="text-primary" size={48} />
            </div>
            <h2 className="font-display text-3xl font-bold text-text mb-2">
              🎉 Registration Successful!
            </h2>
            <p className="text-text-muted mb-2">
              Your Team ID: <span className="text-primary font-bold font-mono">{registeredTeamId}</span>
            </p>
            <p className="text-text-muted mb-8 text-sm">
              You can now login with your email and password. Access your dashboard
              to submit your project links and manage your team.
            </p>
            <div className="flex flex-col gap-3">
              <a href="/login" className="btn-primary w-full text-center">
                Login to Dashboard
              </a>
              <a href="/" className="btn-secondary w-full text-center">
                Back to Home
              </a>
            </div>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  const stepLabels: Record<number, string> = {
    1: "Category",
    2: "Team Details",
    3: "Review",
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
            <h1 className="font-display text-4xl md:text-5xl font-bold gradient-text mb-4">
              Register Now
            </h1>
            <p className="text-text-muted">
              Join India's Ultimate AI Gaming Hackathon —{" "}
              <span className="text-primary font-semibold">Secure Your Spot</span>
            </p>
          </motion.div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-0 mb-12">
            {[1, 2, 3].map((s, idx) => (
              <div key={s} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      s < step
                        ? "bg-primary text-background"
                        : s === step
                        ? "bg-primary text-background ring-4 ring-primary/20"
                        : "bg-surface-light text-text-dim"
                    }`}
                  >
                    {s < step ? <CheckCircle size={16} /> : s}
                  </div>
                  <span
                    className={`hidden md:block text-xs mt-1 font-medium ${
                      s <= step ? "text-primary" : "text-text-dim"
                    }`}
                  >
                    {stepLabels[s]}
                  </span>
                </div>
                {idx < 2 && (
                  <div
                    className={`h-px w-16 md:w-24 mx-2 transition-all ${
                      s < step ? "bg-primary" : "bg-white/10"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="glass-card p-8">
            <AnimatePresence mode="wait">
              {/* ── STEP 1 — Category ─────────────────────────────────────── */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="font-display text-2xl font-bold text-text mb-2">
                    Select Your Category
                  </h2>
                  <p className="text-text-muted text-sm mb-6">
                    Registration requires a mandatory payment fee based on your category and team size.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(Object.entries(PRICING) as [Category, typeof PRICING.STUDENT][]).map(
                      ([key, value]) => (
                        <button
                          key={key}
                          onClick={() => {
                            setCategory(key);
                            setErrors({});
                          }}
                          className={`glass-card p-6 text-left transition-all hover:border-primary/40 ${
                            category === key
                              ? "border-primary/60 bg-primary/8 ring-1 ring-primary/30"
                              : ""
                          }`}
                        >
                          <h3 className="font-display text-base font-bold text-text mb-1">
                            {key === "STUDENT"
                              ? "🎓 Students"
                              : key === "IT_PROFESSIONAL"
                              ? "💼 IT Professionals"
                              : "🚀 Startups"}
                          </h3>
                          <p className="text-2xl font-bold text-primary mb-1">
                            ₹{value.price}
                          </p>
                          <p className="text-text-muted text-xs">per person (paid upon registration)</p>
                          <p className="text-text-muted text-xs mt-2">
                            Team: {value.minTeam}–{value.maxTeam} members
                          </p>
                          {category === key && (
                            <CheckCircle
                              className="text-primary mt-3"
                              size={16}
                            />
                          )}
                        </button>
                      )
                    )}
                  </div>
                  <FieldError msg={errors.category} />
                  <button
                    onClick={() => {
                      if (validateStep1()) setStep(2);
                    }}
                    className="btn-primary w-full"
                  >
                    Continue →
                  </button>
                </motion.div>
              )}

              {/* ── STEP 2 — Team Details ─────────────────────────────────── */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="font-display text-2xl font-bold text-text mb-6">
                    Team Details
                  </h2>

                  {/* Team Name */}
                  <div>
                    <label className="label-text">
                      Team Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      className={`input-field ${errors.teamName ? "border-red-500/50" : ""}`}
                      placeholder="Enter a unique team name"
                    />
                    <FieldError msg={errors.teamName} />
                  </div>

                  {/* Leader Details */}
                  <div className="border-t border-white/5 pt-6">
                    <h3 className="font-bold text-text mb-4 flex items-center gap-2">
                      <Users size={16} className="text-primary" />
                      Team Leader Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="label-text">
                          Full Name <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          value={leaderName}
                          onChange={(e) => setLeaderName(e.target.value)}
                          className={`input-field ${errors.leaderName ? "border-red-500/50" : ""}`}
                          placeholder="Your full name"
                        />
                        <FieldError msg={errors.leaderName} />
                      </div>
                      <div>
                        <label className="label-text">
                          Email Address <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="email"
                          value={leaderEmail}
                          onChange={(e) => setLeaderEmail(e.target.value)}
                          className={`input-field ${errors.leaderEmail ? "border-red-500/50" : ""}`}
                          placeholder="you@example.com"
                        />
                        <FieldError msg={errors.leaderEmail} />
                      </div>
                      <div>
                        <label className="label-text">
                          Password <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            value={leaderPassword}
                            onChange={(e) => setLeaderPassword(e.target.value)}
                            className={`input-field pr-10 ${errors.leaderPassword ? "border-red-500/50" : ""}`}
                            placeholder="Min. 8 characters"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                        <FieldError msg={errors.leaderPassword} />
                      </div>
                      <div>
                        <label className="label-text">
                          Confirm Password <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={`input-field pr-10 ${errors.confirmPassword ? "border-red-500/50" : ""}`}
                            placeholder="Re-enter password"
                          />
                          <Lock
                            size={14}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted"
                          />
                        </div>
                        <FieldError msg={errors.confirmPassword} />
                      </div>
                      <div>
                        <label className="label-text">
                          Mobile Number <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="tel"
                          value={leaderMobile}
                          onChange={(e) => setLeaderMobile(e.target.value)}
                          className={`input-field ${errors.leaderMobile ? "border-red-500/50" : ""}`}
                          placeholder="10-digit mobile"
                          maxLength={10}
                        />
                        <FieldError msg={errors.leaderMobile} />
                      </div>
                      <div>
                        <label className="label-text">LinkedIn Profile</label>
                        <input
                          type="url"
                          value={leaderLinkedin}
                          onChange={(e) => setLeaderLinkedin(e.target.value)}
                          className="input-field"
                          placeholder="https://linkedin.com/in/..."
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="label-text">
                          College / Company <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          value={leaderCollege}
                          onChange={(e) => setLeaderCollege(e.target.value)}
                          className={`input-field ${errors.leaderCollege ? "border-red-500/50" : ""}`}
                          placeholder="Your institution or company name"
                        />
                        <FieldError msg={errors.leaderCollege} />
                      </div>
                    </div>
                  </div>

                  {/* Team Members */}
                  <div className="border-t border-white/5 pt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-text">
                        Team Members{" "}
                        <span className="text-text-dim text-sm font-normal">
                          ({members.length}/{pricing ? pricing.maxTeam - 1 : "?"})
                        </span>
                      </h3>
                      {pricing && members.length < pricing.maxTeam - 1 && (
                        <button
                          onClick={addMember}
                          className="text-primary text-sm hover:underline flex items-center gap-1"
                        >
                          + Add Member
                        </button>
                      )}
                    </div>
                    {members.map((member, i) => (
                      <div
                        key={i}
                        className="mb-4 p-4 bg-surface-light rounded-xl border border-white/5"
                      >
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-sm font-medium text-text-muted">
                            Member {i + 1}
                          </span>
                          {members.length > 1 && (
                            <button
                              onClick={() => removeMember(i)}
                              className="text-red-400 text-xs hover:underline"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <input
                              type="text"
                              placeholder="Full Name *"
                              value={member.name}
                              onChange={(e) => {
                                const n = [...members];
                                n[i].name = e.target.value;
                                setMembers(n);
                              }}
                              className={`input-field ${errors[`member_${i}_name`] ? "border-red-500/50" : ""}`}
                            />
                            <FieldError msg={errors[`member_${i}_name`]} />
                          </div>
                          <div>
                            <input
                              type="email"
                              placeholder="Email Address *"
                              value={member.email}
                              onChange={(e) => {
                                const n = [...members];
                                n[i].email = e.target.value;
                                setMembers(n);
                              }}
                              className={`input-field ${errors[`member_${i}_email`] ? "border-red-500/50" : ""}`}
                            />
                            <FieldError msg={errors[`member_${i}_email`]} />
                          </div>
                          <input
                            type="text"
                            placeholder="Skills (e.g., Python, Unity)"
                            value={member.skills}
                            onChange={(e) => {
                              const n = [...members];
                              n[i].skills = e.target.value;
                              setMembers(n);
                            }}
                            className="input-field"
                          />
                          <input
                            type="text"
                            placeholder="Role (e.g., Developer, Designer)"
                            value={member.role}
                            onChange={(e) => {
                              const n = [...members];
                              n[i].role = e.target.value;
                              setMembers(n);
                            }}
                            className="input-field"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Project Info */}
                  <div className="border-t border-white/5 pt-6">
                    <h3 className="font-bold text-text mb-4">
                      Project Information{" "}
                      <span className="text-text-dim text-sm font-normal">(optional)</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="label-text">Theme / Track</label>
                        <select
                          value={projectTheme}
                          onChange={(e) => setProjectTheme(e.target.value)}
                          className="input-field"
                        >
                          <option value="">Select a theme</option>
                          {TRACKS.map((track) => (
                            <option key={track.id} value={track.title}>
                              {track.title}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="label-text">Tech Stack</label>
                        <input
                          type="text"
                          value={techStack}
                          onChange={(e) => setTechStack(e.target.value)}
                          className="input-field"
                          placeholder="e.g., Unity, Python, TensorFlow"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button onClick={() => setStep(1)} className="btn-secondary flex-1">
                      ← Back
                    </button>
                    <button
                      onClick={() => {
                        if (validateStep2()) setStep(3);
                      }}
                      className="btn-primary flex-1"
                    >
                      Review →
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ── STEP 3 — Review & Submit ──────────────────────────────── */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="font-display text-2xl font-bold text-text mb-2">
                    Review & Register
                  </h2>
                  <p className="text-text-muted text-sm mb-6">
                    Please verify your details before registering. You will be prompted to complete the mandatory payment fee upon clicking register.
                  </p>

                  {/* Summary card */}
                  <div className="space-y-4">
                    <div className="glass-panel p-5 rounded-xl space-y-3">
                      <h3 className="font-bold text-text border-b border-white/5 pb-2">
                        Team Overview
                      </h3>
                      <Row label="Team Name" value={teamName} />
                      <Row
                        label="Category"
                        value={
                          category === "STUDENT"
                            ? "Students"
                            : category === "IT_PROFESSIONAL"
                            ? "IT Professionals"
                            : "Startups"
                        }
                      />
                      {projectTheme && <Row label="Theme" value={projectTheme} />}
                      {techStack && <Row label="Tech Stack" value={techStack} />}
                    </div>

                    <div className="glass-panel p-5 rounded-xl space-y-3">
                      <h3 className="font-bold text-text border-b border-white/5 pb-2">
                        Team Leader
                      </h3>
                      <Row label="Name" value={leaderName} />
                      <Row label="Email" value={leaderEmail} />
                      <Row label="Mobile" value={leaderMobile} />
                      <Row label="College/Company" value={leaderCollege} />
                    </div>

                    <div className="glass-panel p-5 rounded-xl space-y-3">
                      <h3 className="font-bold text-text border-b border-white/5 pb-2">
                        Team Members ({members.length})
                      </h3>
                      {members.map((m, i) => (
                        <div
                          key={i}
                          className="py-2 border-b border-white/5 last:border-0"
                        >
                          <p className="text-text text-sm font-medium">
                            {i + 1}. {m.name}
                          </p>
                          <p className="text-text-muted text-xs">{m.email}</p>
                        </div>
                      ))}
                    </div>

                    {/* Beautiful Payment Summary Panel */}
                    <div className="glass-panel p-5 rounded-xl bg-primary/5 border border-primary/20 space-y-3">
                      <h3 className="font-bold text-text border-b border-primary/20 pb-2">
                        💳 Payment Summary
                      </h3>
                      <Row label="Category Fee" value={`₹${pricing?.price || 0} per person`} />
                      <Row label="Total Members" value={`${members.length + 1} (Leader + ${members.length} Members)`} />
                      <Row label="Base Fee" value={`₹${pricing ? pricing.price * (members.length + 1) : 0}`} />
                      <Row label="Platform Charges (2%)" value={`₹${pricing ? Number((pricing.price * (members.length + 1) * 0.02).toFixed(2)) : 0}`} />
                      <div className="border-t border-primary/25 pt-2 flex justify-between items-center">
                        <span className="text-text font-bold">Total Amount to Pay</span>
                        <span className="text-primary font-bold text-xl">₹{pricing ? Number((pricing.price * (members.length + 1) * 1.02).toFixed(2)) : 0}</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex items-start gap-3">
                      <AlertCircle size={18} className="text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-text-muted">
                        After payment, log in with{" "}
                        <span className="text-text font-semibold">{leaderEmail}</span> and the
                        password you set. You can then access your dashboard and submit project links.
                      </p>
                    </div>
                  </div>

                  {submitError && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
                      <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
                      <p className="text-red-400 text-sm">{submitError}</p>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button onClick={() => setStep(2)} className="btn-secondary flex-1">
                      ← Back
                    </button>
                    <button
                      onClick={handleRegister}
                      disabled={submitting}
                      className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </span>
                      ) : (
                        `Proceed to Pay ₹${pricing ? Number((pricing.price * (members.length + 1) * 1.02).toFixed(2)) : 0} 💳`
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-text-muted">{label}</span>
      <span className="text-text font-medium">{value}</span>
    </div>
  );
}
