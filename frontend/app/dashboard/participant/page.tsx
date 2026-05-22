"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  Users,
  CreditCard,
  Clock,
  Bell,
  FileText,
  Github,
  ExternalLink,
  LogOut,
  CheckCircle,
  AlertCircle,
  Lock,
} from "lucide-react";

// ── Helpers ──────────────────────────────────────────────────────────────────
function isValidUrl(url: string) {
  try { new URL(url); return true; } catch { return false; }
}

// ── Nav Item ─────────────────────────────────────────────────────────────────
function NavItem({ icon, label, active, onClick, unread }: {
  icon: React.ReactNode; label: string; active: boolean; onClick: () => void; unread?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg transition-colors text-left ${
        active ? "bg-primary/10 text-primary" : "text-text-muted hover:text-text hover:bg-white/5"
      }`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      {unread && (
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
      )}
    </button>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function ParticipantDashboard() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState("overview");
  const [teamData, setTeamData] = useState<any>(null);
  const [paymentStatus, setPaymentStatus] = useState<string>("PENDING");
  const [loadingTeam, setLoadingTeam] = useState(true);
  const [hasUnreadNotification, setHasUnreadNotification] = useState(false);

  const fetchTeamData = async () => {
    try {
      const res = await fetch("/api/teams/me");
      if (res.ok) {
        const data = await res.json();
        setTeamData(data.team);
        setPaymentStatus(data.team?.payment?.status || "PENDING");
      }
    } catch (e) {
      console.error("Failed to load team data", e);
    } finally {
      setLoadingTeam(false);
    }
  };

  useEffect(() => {
    if (session) fetchTeamData();
  }, [session]);

  useEffect(() => {
    async function checkNotifications() {
      try {
        const res = await fetch("/api/admin/announcements");
        const data = await res.json();
        if (data.success && data.announcements) {
          const visibleAnnouncements = data.announcements.filter((a: any) => a.visibility !== "ADMIN");
          const lastSeenTime = localStorage.getItem("incux_last_seen_notification_time") || "0";
          const hasNew = visibleAnnouncements.some((a: any) => new Date(a.createdAt).getTime() > parseInt(lastSeenTime));
          setHasUnreadNotification(hasNew);
        }
      } catch (err) {
        console.error("Failed to check notifications", err);
      }
    }
    if (session) checkNotifications();
  }, [session]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-text mb-4">Please Login</h2>
          <Link href="/login" className="btn-primary">Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-28 pb-16">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="glass-card p-6 sticky top-28">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center mb-3">
                    <Users className="text-primary" size={32} />
                  </div>
                  <h3 className="font-display font-bold text-text">{session.user?.name || "Participant"}</h3>
                  <p className="text-text-muted text-sm truncate">{session.user?.email}</p>
                  {teamData && (
                    <p className="text-primary font-mono text-xs mt-1">{teamData.teamId}</p>
                  )}
                </div>

                <nav className="space-y-1">
                  <NavItem icon={<Clock size={16} />} label="Overview" active={activeTab === "overview"} onClick={() => setActiveTab("overview")} />
                  <NavItem icon={<Users size={16} />} label="My Team" active={activeTab === "team"} onClick={() => setActiveTab("team")} />
                  <NavItem icon={<CreditCard size={16} />} label="Payment" active={activeTab === "payment"} onClick={() => setActiveTab("payment")} />
                  <NavItem icon={<FileText size={16} />} label="Submission" active={activeTab === "submission"} onClick={() => setActiveTab("submission")} />
                  <NavItem
                    icon={<Bell size={16} />}
                    label="Notifications"
                    active={activeTab === "notifications"}
                    unread={hasUnreadNotification}
                    onClick={() => {
                      setActiveTab("notifications");
                      setHasUnreadNotification(false);
                      localStorage.setItem("incux_last_seen_notification_time", Date.now().toString());
                    }}
                  />
                </nav>

                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full mt-6 py-2 border border-white/10 rounded-lg text-text-muted hover:text-red-400 hover:border-red-400/30 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </aside>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {activeTab === "overview" && (
                <OverviewTab teamData={teamData} paymentStatus={paymentStatus} loading={loadingTeam} />
              )}
              {activeTab === "team" && (
                <TeamTab teamData={teamData} loading={loadingTeam} />
              )}
              {activeTab === "payment" && (
                <PaymentTab
                  teamData={teamData}
                  paymentStatus={paymentStatus}
                  onPaymentComplete={() => {
                    setPaymentStatus("SUCCESS");
                    fetchTeamData();
                  }}
                  session={session}
                />
              )}
              {activeTab === "submission" && (
                <SubmissionTab
                  teamData={teamData}
                  paymentStatus={paymentStatus}
                  onSubmitSuccess={fetchTeamData}
                />
              )}
              {activeTab === "notifications" && <NotificationsTab />}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// ── Overview Tab ──────────────────────────────────────────────────────────────
function OverviewTab({ teamData, paymentStatus, loading }: any) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h2 className="font-display text-2xl font-bold text-text">Dashboard Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Registration"
          value={teamData ? "Registered ✓" : loading ? "Loading..." : "Not Registered"}
          color={teamData ? "text-green-400" : "text-yellow-400"}
        />
        <StatCard
          label="Payment Status"
          value={paymentStatus === "SUCCESS" ? "Paid ✓" : "Pending"}
          color={paymentStatus === "SUCCESS" ? "text-green-400" : "text-yellow-400"}
        />
        <StatCard
          label="Submission"
          value={teamData?.submission ? "Submitted ✓" : "Pending"}
          color={teamData?.submission ? "text-green-400" : "text-text-dim"}
        />
      </div>

      {!teamData && !loading && (
        <div className="glass-card p-6 text-center">
          <AlertCircle className="text-yellow-400 mx-auto mb-3" size={32} />
          <p className="text-text-muted mb-4">You have not registered a team yet.</p>
          <Link href="/register" className="btn-primary inline-block">Register Now</Link>
        </div>
      )}

      <div className="glass-card p-6">
        <h3 className="font-bold text-text mb-4">Event Timeline</h3>
        <div className="space-y-3">
          <EventItem date="May 18" title="Registrations Open" done />
          <EventItem date="June 16" title="Online Submission Deadline" />
          <EventItem date="June 20" title="Results Announced" />
          <EventItem date="June 27–28" title="Final Offline Round" />
          <EventItem date="June 28" title="Winner Announcement" />
        </div>
      </div>
    </motion.div>
  );
}

// ── Team Tab ──────────────────────────────────────────────────────────────────
function TeamTab({ teamData, loading }: any) {
  if (loading) return <Spinner />;
  if (!teamData) return (
    <div className="glass-card p-8 text-center">
      <p className="text-text-muted mb-4">No team found for your account.</p>
      <Link href="/register" className="btn-primary">Register a Team</Link>
    </div>
  );

  const leader = teamData.members?.find((m: any) => m.role === "LEADER");
  const members = teamData.members?.filter((m: any) => m.role !== "LEADER") || [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h2 className="font-display text-2xl font-bold text-text">My Team</h2>

      <div className="glass-card p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-display font-bold text-xl text-text">{teamData.name}</h3>
            <p className="text-primary font-mono text-sm">{teamData.teamId}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
            teamData.status === "APPROVED" ? "bg-green-500/10 text-green-400" :
            teamData.status === "REJECTED" ? "bg-red-500/10 text-red-400" :
            "bg-yellow-500/10 text-yellow-400"
          }`}>
            {teamData.status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm border-t border-white/5 pt-4">
          <InfoRow label="Category" value={teamData.category} />
          {teamData.projectTheme && <InfoRow label="Theme" value={teamData.projectTheme} />}
          {teamData.techStack && <InfoRow label="Tech Stack" value={teamData.techStack} />}
        </div>
      </div>

      {leader && (
        <div className="glass-card p-6">
          <h3 className="font-bold text-text mb-4">Team Leader</h3>
          <MemberCard member={leader} isLeader />
        </div>
      )}

      {members.length > 0 && (
        <div className="glass-card p-6">
          <h3 className="font-bold text-text mb-4">Members ({members.length})</h3>
          <div className="space-y-3">
            {members.map((m: any, i: number) => (
              <MemberCard key={i} member={m} />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ── Payment Tab ───────────────────────────────────────────────────────────────
function PaymentTab({ teamData, paymentStatus, onPaymentComplete, session }: any) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePay = async () => {
    if (!teamData) return;
    setLoading(true);
    setError(null);

    try {
      // Create Razorpay order
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create-order", teamId: teamData.teamId }),
      });
      const data = await res.json();

      if (!res.ok || !data.orderId) {
        setError(data.error || "Failed to create payment order.");
        setLoading(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder",
        amount: data.amount,
        currency: data.currency,
        name: "IncuXAI Hackathon",
        description: "Registration Fee",
        order_id: data.orderId,
        handler: async (rpResponse: any) => {
          const verifyRes = await fetch("/api/payments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "verify",
              paymentId: rpResponse.razorpay_payment_id,
              orderId: rpResponse.razorpay_order_id,
              signature: rpResponse.razorpay_signature,
              teamId: teamData.teamId,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyRes.ok && verifyData.success) {
            onPaymentComplete();
          } else {
            setError("Payment verification failed. Contact support.");
          }
          setLoading(false);
        },
        prefill: {
          name: session?.user?.name || "",
          email: session?.user?.email || "",
        },
        theme: { color: "#a855f7" },
        modal: { ondismiss: () => setLoading(false) },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (e) {
      setError("Payment failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h2 className="font-display text-2xl font-bold text-text">Payment</h2>

      {paymentStatus === "SUCCESS" ? (
        <div className="glass-card p-8">
          <div className="text-center mb-6">
            <CheckCircle className="text-green-400 mx-auto mb-4" size={48} />
            <h3 className="font-bold text-text text-xl mb-2">Payment Complete!</h3>
            <p className="text-text-muted">
              Your registration fee has been successfully paid. You can now submit your project links.
            </p>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-3 mt-6">
            <h4 className="font-bold text-text mb-2 flex items-center gap-2">
              <FileText size={16} className="text-primary" /> Transaction Details
            </h4>
            <InfoRow label="Status" value={<span className="text-green-400 font-bold text-xs uppercase px-2 py-0.5 bg-green-500/10 rounded-full">SUCCESS</span>} />
            <InfoRow label="Transaction ID" value={teamData?.payment?.razorpayPaymentId || teamData?.payment?.razorpayOrderId || "N/A"} />
            <InfoRow label="Amount Paid" value={`₹${teamData?.payment?.amount || 0}`} />
            <InfoRow label="Date" value={teamData?.payment?.updatedAt ? new Date(teamData.payment.updatedAt).toLocaleString() : "N/A"} />
            {teamData?.payment?.gstInvoice && (
              <InfoRow 
                label="Invoice" 
                value={
                  <a href={teamData.payment.gstInvoice} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1 text-sm">
                    View Invoice <ExternalLink size={12}/>
                  </a>
                } 
              />
            )}
          </div>
        </div>
      ) : (
        <div className="glass-card p-6 space-y-6">
          {!teamData ? (
            <p className="text-text-muted text-center">Register a team first to make a payment.</p>
          ) : (
            <>
              <div className="space-y-3">
                <InfoRow label="Team" value={teamData.name} />
                <InfoRow label="Category" value={teamData.category} />
                <InfoRow label="Team Size" value={`${teamData.members?.length || 0} members`} />
                <div className="border-t border-white/5 pt-3 flex justify-between">
                  <span className="text-text font-bold">Total Due</span>
                  <span className="text-primary font-bold text-xl">₹{teamData.payment?.amount || 0}</span>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-center gap-2">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <button
                onClick={handlePay}
                disabled={loading}
                className="btn-primary w-full disabled:opacity-50"
              >
                {loading ? "Processing..." : `Pay ₹${teamData.payment?.amount || 0} Now`}
              </button>

              <p className="text-text-dim text-xs text-center">
                Secured by Razorpay • UPI, Cards, Net Banking & Wallets accepted
              </p>
            </>
          )}
        </div>
      )}
    </motion.div>
  );
}

// ── Submission Tab ────────────────────────────────────────────────────────────
function SubmissionTab({ teamData, paymentStatus, onSubmitSuccess }: any) {
  const [pptLink, setPptLink] = useState("");
  const [demoVideo, setDemoVideo] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [apkLink, setApkLink] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [existingSubmission, setExistingSubmission] = useState<any>(null);

  useEffect(() => {
    if (teamData?.submission) {
      const s = teamData.submission;
      setExistingSubmission(s);
      setPptLink(s.pptLink || "");
      setDemoVideo(s.demoVideo || "");
      setGithubLink(s.githubLink || "");
      setApkLink(s.apkLink || "");
    }
  }, [teamData]);

  const handleSubmit = async () => {
    if (!pptLink && !demoVideo && !githubLink && !apkLink) {
      setError("Please provide at least one link.");
      return;
    }
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/teams/${teamData.teamId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pptLink, demoVideo, githubLink, apkLink }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
        onSubmitSuccess();
      } else {
        setError(data.error || "Submission failed.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Payment gate
  if (paymentStatus !== "SUCCESS") {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <h2 className="font-display text-2xl font-bold text-text">Submission Portal</h2>
        <div className="glass-card p-10 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-yellow-500/10 flex items-center justify-center">
            <Lock className="text-yellow-400" size={28} />
          </div>
          <h3 className="font-bold text-text text-lg">Payment Required</h3>
          <p className="text-text-muted text-sm max-w-md mx-auto">
            You must complete your registration payment before you can submit project links.
          </p>
          <button
            className="btn-primary"
            onClick={() => {/* switch to payment tab handled by parent */}}
          >
            Go to Payment Tab
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h2 className="font-display text-2xl font-bold text-text">Submission Portal</h2>

      {submitted && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3">
          <CheckCircle size={18} className="text-green-400" />
          <span className="text-green-400 text-sm font-medium">
            Links submitted successfully!
          </span>
        </div>
      )}

      <div className="glass-card p-6 space-y-5">
        <p className="text-text-muted text-sm">
          Submit your project links below. You can update them until the deadline.
        </p>

        <LinkField
          label="PPT / Presentation"
          icon="📊"
          value={pptLink}
          onChange={setPptLink}
          placeholder="https://docs.google.com/presentation/..."
        />
        <LinkField
          label="Demo Video"
          icon="🎬"
          value={demoVideo}
          onChange={setDemoVideo}
          placeholder="https://youtube.com/watch?v=..."
        />
        <LinkField
          label="GitHub Repository"
          icon="🐙"
          value={githubLink}
          onChange={setGithubLink}
          placeholder="https://github.com/yourteam/project"
        />
        <LinkField
          label="APK / Game Build"
          icon="📦"
          value={apkLink}
          onChange={setApkLink}
          placeholder="https://drive.google.com/file/..."
        />

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-center gap-2">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="btn-primary w-full disabled:opacity-50"
        >
          {submitting
            ? "Saving..."
            : existingSubmission
            ? "Update Submission"
            : "Submit Project"}
        </button>
      </div>
    </motion.div>
  );
}

// ── Notifications Tab ─────────────────────────────────────────────────────────
function NotificationsTab() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnnouncements() {
      try {
        const res = await fetch("/api/admin/announcements");
        const data = await res.json();
        if (data.success && data.announcements) {
          setAnnouncements(data.announcements);
        }
      } catch (error) {
        console.error("Failed to load announcements:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAnnouncements();
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h2 className="font-display text-2xl font-bold text-text">Notifications</h2>
      <div className="glass-card p-6 space-y-3">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : announcements.length === 0 ? (
          <p className="text-center text-text-muted py-8">No new announcements right now.</p>
        ) : (
          announcements.map((a) => (
            <NotificationItem 
              key={a.id}
              title={a.title} 
              message={a.message}
              time={new Date(a.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} 
              unread={a.isPinned} 
            />
          ))
        )}
      </div>
    </motion.div>
  );
}

// ── Helper Components ─────────────────────────────────────────────────────────
function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="glass-card p-5">
      <p className="text-text-muted text-xs mb-1">{label}</p>
      <p className={`font-display text-xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

function EventItem({ date, title, done }: { date: string; title: string; done?: boolean }) {
  return (
    <div className={`flex items-center gap-4 p-3 rounded-lg ${done ? "bg-primary/5" : "bg-surface-light"}`}>
      <div className={`font-bold text-sm ${done ? "text-primary" : "text-text-muted"}`}>{date}</div>
      <div className={`text-sm ${done ? "text-text" : "text-text-muted"}`}>{title}</div>
      {done && <CheckCircle size={14} className="text-primary ml-auto" />}
    </div>
  );
}

function MemberCard({ member, isLeader }: { member: any; isLeader?: boolean }) {
  return (
    <div className="flex items-center gap-4 p-3 bg-surface-light rounded-lg">
      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
        {member.user?.name?.[0]?.toUpperCase() || "?"}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-text font-medium text-sm truncate">{member.user?.name}</p>
        <p className="text-text-muted text-xs truncate">{member.user?.email}</p>
        {member.skills && <p className="text-text-dim text-xs">{member.skills}</p>}
      </div>
      {isLeader && (
        <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-bold">
          Leader
        </span>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-text-muted">{label}</span>
      <span className="text-text font-medium">{value}</span>
    </div>
  );
}

function LinkField({ label, icon, value, onChange, placeholder }: {
  label: string; icon: string; value: string; onChange: (v: string) => void; placeholder: string;
}) {
  return (
    <div>
      <label className="label-text flex items-center gap-2">
        <span>{icon}</span>
        {label}
      </label>
      <div className="relative">
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input-field pr-10"
          placeholder={placeholder}
        />
        {value && (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary"
          >
            <ExternalLink size={14} />
          </a>
        )}
      </div>
    </div>
  );
}

function NotificationItem({ title, message, time, unread }: {
  title: string; message?: string; time: string; unread?: boolean;
}) {
  return (
    <div className={`p-4 rounded-lg ${unread ? "bg-primary/5 border border-primary/20" : "bg-surface-light"}`}>
      <div className="flex justify-between items-start gap-4 mb-2">
        <p className={`text-sm ${unread ? "text-text font-medium" : "text-text-muted"}`}>
          {unread && <span className="mr-2">📌</span>}
          {title}
        </p>
        <span className="text-text-dim text-xs whitespace-nowrap mt-0.5">{time}</span>
      </div>
      {message && (
        <p className="text-text-muted text-sm whitespace-pre-wrap">{message}</p>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <div className="flex justify-center py-12">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
