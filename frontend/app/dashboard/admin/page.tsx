"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Users, CreditCard, TrendingUp, MessageCircle, CheckCircle, XCircle, Download, Search, Filter } from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [analytics, setAnalytics] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, participantsRes] = await Promise.all([
          fetch("/api/admin/analytics"),
          fetch("/api/admin/participants"),
        ]);
        const analyticsData = await analyticsRes.json();
        const participantsData = await participantsRes.json();
        setAnalytics(analyticsData);
        setParticipants(participantsData.teams || []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const filteredParticipants = participants.filter((team) => {
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase()) || team.teamId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "ALL" || team.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="text-primary">Loading admin dashboard...</div></div>;
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
                  <div className="w-20 h-20 mx-auto rounded-full bg-secondary/20 flex items-center justify-center mb-3">
                    <Users className="text-secondary" size={32} />
                  </div>
                  <h3 className="font-display font-bold text-text">Admin Panel</h3>
                  <p className="text-text-muted text-sm">Event Management</p>
                </div>

                <nav className="space-y-2">
                  <NavItem icon={<TrendingUp size={18} />} label="Overview" active={activeTab === "overview"} onClick={() => setActiveTab("overview")} />
                  <NavItem icon={<Users size={18} />} label="Participants" active={activeTab === "participants"} onClick={() => setActiveTab("participants")} />
                  <NavItem icon={<CreditCard size={18} />} label="Payments" active={activeTab === "payments"} onClick={() => setActiveTab("payments")} />
                  <NavItem icon={<MessageCircle size={18} />} label="Announcements" active={activeTab === "announcements"} onClick={() => setActiveTab("announcements")} />
                  <NavItem icon={<CheckCircle size={18} />} label="Support" active={activeTab === "support"} onClick={() => setActiveTab("support")} />
                </nav>
              </div>
            </aside>

            <div className="flex-1">
              {activeTab === "overview" && analytics && <OverviewTab analytics={analytics} />}
              {activeTab === "participants" && (
                <ParticipantsTab
                  participants={filteredParticipants}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  filterStatus={filterStatus}
                  setFilterStatus={setFilterStatus}
                />
              )}
              {activeTab === "payments" && <PaymentsTab />}
              {activeTab === "announcements" && <AnnouncementsTab />}
              {activeTab === "support" && <SupportTab />}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-left ${
        active ? "bg-secondary/10 text-secondary" : "text-text-muted hover:text-text hover:bg-white/5"
      }`}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </button>
  );
}

function OverviewTab({ analytics }: { analytics: any }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h2 className="font-display text-2xl font-bold text-text">Analytics Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Users className="text-primary" />} label="Total Registrations" value={analytics.totalRegistrations || 0} />
        <StatCard icon={<CreditCard className="text-neon-green" />} label="Total Revenue" value={`₹${analytics.totalRevenue || 0}`} />
        <StatCard icon={<MessageCircle className="text-neon-blue" />} label="Discord Joins" value={analytics.discordJoins || 0} />
        <StatCard icon={<TrendingUp className="text-neon-purple" />} label="Pending Payments" value={analytics.pendingPayments || 0} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="font-bold text-text mb-4">Category Distribution</h3>
          <div className="space-y-3">
            {analytics.categoryDistribution?.map((cat: any) => (
              <div key={cat.category} className="flex justify-between items-center">
                <span className="text-text-muted">{cat.category}</span>
                <span className="text-primary font-bold">{cat._count}</span>
              </div>
            )) || <p className="text-text-muted">No data yet</p>}
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="font-bold text-text mb-4">Recent Registrations</h3>
          <div className="space-y-3">
            {analytics.dailyRegistrations?.slice(0, 5).map((reg: any, i: number) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-text-muted">{new Date(reg.createdAt).toLocaleDateString()}</span>
                <span className="text-primary font-bold">{reg._count}</span>
              </div>
            )) || <p className="text-text-muted">No data yet</p>}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ParticipantsTab({ participants, searchTerm, setSearchTerm, filterStatus, setFilterStatus }: any) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="font-display text-2xl font-bold text-text">Participant Management</h2>
        <button className="btn-secondary inline-flex items-center gap-2">
          <Download size={18} />
          Export CSV
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim" size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search teams..."
            className="input-field pl-10"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="input-field md:w-48"
        >
          <option value="ALL">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-light">
              <tr>
                <th className="text-left p-4 text-text-muted text-sm font-medium">Team ID</th>
                <th className="text-left p-4 text-text-muted text-sm font-medium">Team Name</th>
                <th className="text-left p-4 text-text-muted text-sm font-medium">Category</th>
                <th className="text-left p-4 text-text-muted text-sm font-medium">Payment</th>
                <th className="text-left p-4 text-text-muted text-sm font-medium">Status</th>
                <th className="text-left p-4 text-text-muted text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {participants.length > 0 ? (
                participants.map((team: any) => (
                  <tr key={team.id} className="border-t border-white/5">
                    <td className="p-4 text-text font-mono text-sm">{team.teamId}</td>
                    <td className="p-4 text-text">{team.name}</td>
                    <td className="p-4 text-text-muted">{team.category}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        team.payment?.status === "SUCCESS" ? "bg-green-500/10 text-green-400" :
                        team.payment?.status === "PENDING" ? "bg-yellow-500/10 text-yellow-400" :
                        "bg-red-500/10 text-red-400"
                      }`}>
                        {team.payment?.status || "N/A"}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        team.status === "APPROVED" ? "bg-green-500/10 text-green-400" :
                        team.status === "REJECTED" ? "bg-red-500/10 text-red-400" :
                        "bg-yellow-500/10 text-yellow-400"
                      }`}>
                        {team.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button className="p-1 text-green-400 hover:bg-green-500/10 rounded"><CheckCircle size={16} /></button>
                        <button className="p-1 text-red-400 hover:bg-red-500/10 rounded"><XCircle size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-text-muted">No participants found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

function PaymentsTab() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h2 className="font-display text-2xl font-bold text-text">Payment Management</h2>
      <div className="glass-card p-6">
        <p className="text-text-muted">Payment tracking and management will appear here.</p>
      </div>
    </motion.div>
  );
}

function AnnouncementsTab() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h2 className="font-display text-2xl font-bold text-text">Announcements</h2>
      <div className="glass-card p-6 space-y-4">
        <div>
          <label className="label-text">Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="input-field" placeholder="Announcement title" />
        </div>
        <div>
          <label className="label-text">Message</label>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="input-field h-32" placeholder="Announcement message" />
        </div>
        <button className="btn-primary">Send Announcement</button>
      </div>
    </motion.div>
  );
}

function SupportTab() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h2 className="font-display text-2xl font-bold text-text">Support Tickets</h2>
      <div className="glass-card p-6">
        <p className="text-text-muted">Support ticket management will appear here.</p>
      </div>
    </motion.div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-3">
        {icon}
        <span className="text-text-muted text-sm">{label}</span>
      </div>
      <p className="font-display text-3xl font-bold text-text">{value}</p>
    </div>
  );
}
