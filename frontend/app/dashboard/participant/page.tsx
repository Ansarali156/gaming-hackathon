"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ChatBot } from "@/components/ui/ChatBot";
import { Users, CreditCard, Clock, Bell, FileText, Video, Github, MessageCircle, LogOut, Settings } from "lucide-react";

export default function ParticipantDashboard() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState("overview");

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center"><div className="text-primary">Loading...</div></div>;
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
            <aside className="lg:w-64 flex-shrink-0">
              <div className="glass-card p-6 sticky top-28">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center mb-3">
                    <Users className="text-primary" size={32} />
                  </div>
                  <h3 className="font-display font-bold text-text">{session.user?.name || "Participant"}</h3>
                  <p className="text-text-muted text-sm">{session.user?.email}</p>
                </div>

                <nav className="space-y-2">
                  <NavItem icon={<Clock size={18} />} label="Overview" active={activeTab === "overview"} onClick={() => setActiveTab("overview")} />
                  <NavItem icon={<Users size={18} />} label="Team" active={activeTab === "team"} onClick={() => setActiveTab("team")} />
                  <NavItem icon={<FileText size={18} />} label="Submission" active={activeTab === "submission"} onClick={() => setActiveTab("submission")} />
                  <NavItem icon={<CreditCard size={18} />} label="Payment" active={activeTab === "payment"} onClick={() => setActiveTab("payment")} />
                  <NavItem icon={<Bell size={18} />} label="Notifications" active={activeTab === "notifications"} onClick={() => setActiveTab("notifications")} />
                  <NavItem icon={<MessageCircle size={18} />} label="Discord" active={activeTab === "discord"} onClick={() => setActiveTab("discord")} />
                  <NavItem icon={<Settings size={18} />} label="Settings" active={activeTab === "settings"} onClick={() => setActiveTab("settings")} />
                </nav>

                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full mt-6 py-2 border border-white/10 rounded-lg text-text-muted hover:text-red-400 hover:border-red-400/30 transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </aside>

            <div className="flex-1">
              {activeTab === "overview" && <OverviewTab />}
              {activeTab === "team" && <TeamTab />}
              {activeTab === "submission" && <SubmissionTab />}
              {activeTab === "payment" && <PaymentTab />}
              {activeTab === "notifications" && <NotificationsTab />}
              {activeTab === "discord" && <DiscordTab />}
              {activeTab === "settings" && <SettingsTab />}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-left ${
        active ? "bg-primary/10 text-primary" : "text-text-muted hover:text-text hover:bg-white/5"
      }`}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </button>
  );
}

function OverviewTab() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h2 className="font-display text-2xl font-bold text-text">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Team Status" value="Registered" color="text-primary" />
        <StatCard label="Payment Status" value="Pending" color="text-yellow-400" />
        <StatCard label="Submission Deadline" value="June 28" color="text-neon-blue" />
      </div>
      <div className="glass-card p-6">
        <h3 className="font-bold text-text mb-4">Upcoming Events</h3>
        <div className="space-y-3">
          <EventItem date="June 20" title="Round 1 Begins" />
          <EventItem date="June 27" title="Round 2 Begins" />
          <EventItem date="June 28" title="Hackathon & Final Submission" />
        </div>
      </div>
    </motion.div>
  );
}

function TeamTab() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h2 className="font-display text-2xl font-bold text-text">Team Management</h2>
      <div className="glass-card p-6">
        <h3 className="font-bold text-text mb-4">Team Members</h3>
        <p className="text-text-muted">Your team details will appear here once registered.</p>
      </div>
    </motion.div>
  );
}

function SubmissionTab() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h2 className="font-display text-2xl font-bold text-text">Submission Portal</h2>
      <div className="glass-card p-6 space-y-4">
        <div>
          <label className="label-text">PPT Link</label>
          <input type="url" className="input-field" placeholder="https://docs.google.com/presentation/..." />
        </div>
        <div>
          <label className="label-text">Demo Video</label>
          <input type="url" className="input-field" placeholder="https://youtube.com/watch?v=..." />
        </div>
        <div>
          <label className="label-text">GitHub Repository</label>
          <input type="url" className="input-field" placeholder="https://github.com/..." />
        </div>
        <div>
          <label className="label-text">APK/Game Build</label>
          <input type="url" className="input-field" placeholder="https://drive.google.com/..." />
        </div>
        <button className="btn-primary">Submit Project</button>
      </div>
    </motion.div>
  );
}

function PaymentTab() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h2 className="font-display text-2xl font-bold text-text">Payment Status</h2>
      <div className="glass-card p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-text-muted">Status</span>
          <span className="px-3 py-1 bg-yellow-500/10 text-yellow-400 rounded-full text-sm">Pending</span>
        </div>
        <button className="btn-primary w-full">Complete Payment</button>
      </div>
    </motion.div>
  );
}

function NotificationsTab() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h2 className="font-display text-2xl font-bold text-text">Notifications</h2>
      <div className="glass-card p-6">
        <NotificationItem title="Registration Open" time="2 days ago" unread />
        <NotificationItem title="Welcome to IncuXai Hackathon!" time="1 day ago" />
      </div>
    </motion.div>
  );
}

function DiscordTab() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h2 className="font-display text-2xl font-bold text-text">Discord Community</h2>
      <div className="glass-card p-6 text-center">
        <MessageCircle className="text-primary mx-auto mb-4" size={48} />
        <h3 className="font-bold text-text mb-2">Join Our Discord Server</h3>
        <p className="text-text-muted mb-6">Connect with mentors, teammates, and fellow participants.</p>
        <a href="#" className="btn-secondary inline-flex items-center gap-2">
          <MessageCircle size={18} />
          Join Discord
        </a>
      </div>
    </motion.div>
  );
}

function SettingsTab() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h2 className="font-display text-2xl font-bold text-text">Settings</h2>
      <div className="glass-card p-6 space-y-4">
        <div>
          <label className="label-text">Name</label>
          <input type="text" className="input-field" />
        </div>
        <div>
          <label className="label-text">Email</label>
          <input type="email" className="input-field" disabled />
        </div>
        <div>
          <label className="label-text">Mobile</label>
          <input type="tel" className="input-field" />
        </div>
        <button className="btn-primary">Save Changes</button>
      </div>
    </motion.div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="glass-card p-6">
      <p className="text-text-muted text-sm">{label}</p>
      <p className={`font-display text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

function EventItem({ date, title }: { date: string; title: string }) {
  return (
    <div className="flex items-center gap-4 p-3 bg-surface-light rounded-lg">
      <div className="text-primary font-bold text-sm">{date}</div>
      <div className="text-text">{title}</div>
    </div>
  );
}

function NotificationItem({ title, time, unread }: { title: string; time: string; unread?: boolean }) {
  return (
    <div className={`p-4 rounded-lg mb-3 ${unread ? "bg-primary/5 border border-primary/20" : "bg-surface-light"}`}>
      <div className="flex justify-between items-start">
        <h4 className={`text-sm ${unread ? "text-text font-medium" : "text-text-muted"}`}>{title}</h4>
        <span className="text-text-dim text-xs">{time}</span>
      </div>
    </div>
  );
}
