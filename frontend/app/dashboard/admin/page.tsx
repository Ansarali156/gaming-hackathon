"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  Users,
  CreditCard,
  TrendingUp,
  MessageCircle,
  CheckCircle,
  XCircle,
  Download,
  Search,
  Filter,
  Megaphone,
  Shield,
  Plus,
  Trash2,
  ExternalLink,
  DollarSign,
  AlertCircle,
  LogOut,
  Bell,
  Handshake
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [analytics, setAnalytics] = useState<any>({});
  const [participants, setParticipants] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [sponsors, setSponsors] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasUnreadNotification, setHasUnreadNotification] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated" && (session as any)?.user?.role !== "ADMIN") {
      router.push("/dashboard/participant");
    }
  }, [session, status, router]);

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("ALL");


  // Selected Item Modals
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);

  // New Sponsor Form
  const [showAddSponsor, setShowAddSponsor] = useState(false);
  const [newSponsor, setNewSponsor] = useState({
    name: "",
    tier: "GOLD",
    logo: "",
    website: "",
    description: "",
    contact: "",
    isActive: true
  });
  // New Announcement Form
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementMsg, setAnnouncementMsg] = useState("");
  const [announcementTarget, setAnnouncementTarget] = useState("ALL");
  const [channels, setChannels] = useState({ dashboard: true, email: false, discord: false });
  const [announcementLogs, setAnnouncementLogs] = useState<string[]>([]);

  const fetchData = async () => {
    try {
      // Fetch sequentially to prevent Vercel/Render connection pool exhaustion
      const analyticsRes = await fetch("/api/admin/analytics");
      if (analyticsRes.ok) {
        setAnalytics(await analyticsRes.json());
      } else {
        const txt = await analyticsRes.text();
        setApiError(`Analytics API Error (${analyticsRes.status}): ${txt.substring(0, 100)}`);
      }

      const participantsRes = await fetch("/api/admin/participants");
      if (participantsRes.ok) {
        setParticipants((await participantsRes.json()).teams || []);
      } else {
        const txt = await participantsRes.text();
        setApiError(prev => (prev ? prev + " | " : "") + `Participants API Error (${participantsRes.status}): ${txt.substring(0, 100)}`);
      }

      const paymentsRes = await fetch("/api/admin/payments");
      if (paymentsRes.ok) setPayments((await paymentsRes.json()).payments || []);

      const sponsorsRes = await fetch("/api/admin/sponsors");
      if (sponsorsRes.ok) {
        const sData = await sponsorsRes.json();
        setSponsors(sData.sponsors || []);
        setInquiries(sData.inquiries || []);
      }

      const announcementsRes = await fetch("/api/admin/announcements");
      if (announcementsRes.ok) setAnnouncements((await announcementsRes.json()).announcements || []);

      const submissionsRes = await fetch("/api/admin/submissions");
      if (submissionsRes.ok) setSubmissions((await submissionsRes.json()).submissions || []);
    } catch (error) {
      console.error("Failed to fetch admin data:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (announcements.length > 0) {
      const lastSeenTime = localStorage.getItem("incux_admin_last_seen_notification_time") || "0";
      const hasNew = announcements.some((a: any) => new Date(a.createdAt).getTime() > parseInt(lastSeenTime));
      setHasUnreadNotification(hasNew);
    }
  }, [announcements]);


  const handleToggleSponsorStatus = async (sponsorId: string, isActive: boolean) => {
    try {
      const res = await fetch("/api/admin/sponsors", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sponsorId, isActive })
      });
      if (res.ok) fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteSponsor = async (sponsorId: string) => {
    try {
      const res = await fetch(`/api/admin/sponsors?sponsorId=${sponsorId}`, {
        method: "DELETE"
      });
      if (res.ok) fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateInquiryStatus = async (inquiryId: string, status: string) => {
    try {
      const res = await fetch("/api/admin/sponsors", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inquiryId, status })
      });
      if (res.ok) fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddSponsorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/sponsors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSponsor)
      });
      if (res.ok) {
        setShowAddSponsor(false);
        setNewSponsor({
          name: "",
          tier: "GOLD",
          logo: "",
          website: "",
          description: "",
          contact: "",
          isActive: true
        });
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: announcementTitle,
          message: announcementMsg,
          visibility: announcementTarget,
          channels
        })
      });
      const data = await res.json();
      if (res.ok) {
        setAnnouncementTitle("");
        setAnnouncementMsg("");
        setAnnouncementLogs(data.logs || []);
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };





  // CSV Exporter for teams
  const handleExportCSV = () => {
    const headers = ["Team ID", "Team Name", "Category", "Approval Status", "Payment Status", "Members"];
    const rows = participants.map((team: any) => [
      team.teamId,
      `"${team.name}"`,
      team.category,
      team.status,
      team.payment?.status || "N/A",
      team.members?.length || 0
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e: any) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `incuxai_participants_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Participant filters
  const filteredParticipants = participants.filter((team) => {
    const matchesSearch =
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.teamId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "ALL" || team.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-text-muted">Loading IncuXai Admin Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-28 pb-16">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="glass-card p-6 sticky top-28 space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-secondary/10 flex items-center justify-center mb-3">
                    <Shield className="text-secondary" size={28} />
                  </div>
                  <h3 className="font-display font-bold text-text text-lg">IncuXai Admin</h3>
                  <p className="text-text-muted text-xs">Event Management Hub</p>
                </div>

                <nav className="space-y-1">
                  <NavItem icon={<TrendingUp size={16} />} label="Overview" active={activeTab === "overview"} onClick={() => setActiveTab("overview")} />
                  <NavItem icon={<Users size={16} />} label="Participants" active={activeTab === "participants"} onClick={() => setActiveTab("participants")} />
                  <NavItem icon={<CreditCard size={16} />} label="Payments" active={activeTab === "payments"} onClick={() => setActiveTab("payments")} />
                  <NavItem icon={<ExternalLink size={16} />} label="Submissions" active={activeTab === "submissions"} onClick={() => setActiveTab("submissions")} />
                  <NavItem icon={<Megaphone size={16} />} label="Announcements" active={activeTab === "announcements"} onClick={() => setActiveTab("announcements")} />
                  <NavItem
                    icon={<Bell size={16} />}
                    label="Notifications"
                    active={activeTab === "notifications"}
                    unread={hasUnreadNotification}
                    onClick={() => {
                      setActiveTab("notifications");
                      setHasUnreadNotification(false);
                      localStorage.setItem("incux_admin_last_seen_notification_time", Date.now().toString());
                    }}
                  />
                </nav>

                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full mt-4 py-2 border border-white/10 rounded-lg text-text-muted hover:text-red-400 hover:border-red-400/30 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </aside>

            {/* Dashboard Content Panes */}
            <div className="flex-1 min-w-0">
              {activeTab === "overview" && analytics && (
                <OverviewPane analytics={analytics} sponsors={sponsors} />
              )}
              {activeTab === "participants" && (
                <ParticipantsPane
                  participants={filteredParticipants}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  filterCategory={filterCategory}
                  setFilterCategory={setFilterCategory}
                  handleExportCSV={handleExportCSV}
                  setSelectedReceipt={setSelectedReceipt}
                  setSelectedTeam={setSelectedTeam}
                />
              )}
              {activeTab === "submissions" && (
                <SubmissionsPane submissions={submissions} />
              )}
              {activeTab === "payments" && (
                <PaymentsPane
                  payments={payments}
                  setSelectedReceipt={setSelectedReceipt}
                />
              )}
              {activeTab === "announcements" && (
                <AnnouncementsPane
                  announcements={announcements}
                  announcementTitle={announcementTitle}
                  setAnnouncementTitle={setAnnouncementTitle}
                  announcementMsg={announcementMsg}
                  setAnnouncementMsg={setAnnouncementMsg}
                  announcementTarget={announcementTarget}
                  setAnnouncementTarget={setAnnouncementTarget}
                  channels={channels}
                  setChannels={setChannels}
                  handleSendAnnouncement={handleSendAnnouncement}
                  announcementLogs={announcementLogs}
                />
              )}
              {activeTab === "notifications" && (
                <AdminNotificationsPane announcements={announcements} />
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Payment Receipt Details Modal */}
      <AnimatePresence>
        {selectedReceipt && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card p-6 w-full max-w-md relative space-y-6"
            >
              <button
                onClick={() => setSelectedReceipt(null)}
                className="absolute top-4 right-4 text-text-muted hover:text-text"
              >
                <XCircle size={20} />
              </button>
              <div className="text-center border-b border-white/5 pb-4">
                <h3 className="font-display font-bold text-lg text-text">GST Payment Receipt</h3>
                <p className="text-text-muted text-xs">Official Registration Invoice</p>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-muted">GSTIN Invoice ID:</span>
                  <span className="text-text font-mono font-bold text-primary">{selectedReceipt.gstInvoice || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Team ID:</span>
                  <span className="text-text font-mono">{selectedReceipt.team?.teamId || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Team Name:</span>
                  <span className="text-text">{selectedReceipt.team?.name || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Category:</span>
                  <span className="text-text font-bold">{selectedReceipt.team?.category || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Razorpay Order ID:</span>
                  <span className="text-text font-mono text-xs">{selectedReceipt.razorpayOrderId || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Razorpay Payment ID:</span>
                  <span className="text-text font-mono text-xs">{selectedReceipt.razorpayPaymentId || "N/A"}</span>
                </div>
                <div className="flex justify-between border-t border-white/5 pt-3">
                  <span className="text-text-muted">Transaction Status:</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    selectedReceipt.status === "SUCCESS" ? "bg-green-500/10 text-green-400" :
                    selectedReceipt.status === "PENDING" ? "bg-yellow-500/10 text-yellow-400" :
                    selectedReceipt.status === "REFUNDED" ? "bg-purple-500/10 text-purple-400" :
                    "bg-red-500/10 text-red-400"
                  }`}>{selectedReceipt.status}</span>
                </div>
                <div className="flex justify-between border-t border-white/5 pt-3">
                  <span className="text-text font-bold">Total Amount Paid (INR):</span>
                  <span className="text-neon-green font-bold text-lg">₹{selectedReceipt.amount}</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {apiError && (
        <div className="fixed bottom-4 right-4 max-w-sm bg-red-900/90 text-white p-4 rounded-xl shadow-2xl border border-red-500/50 z-50">
          <h3 className="font-bold mb-1 flex items-center gap-2"><AlertCircle size={16}/> API Error Detected</h3>
          <p className="text-sm font-mono text-red-200">{apiError}</p>
          <button onClick={() => setApiError(null)} className="absolute top-2 right-2 text-white/50 hover:text-white"><XCircle size={16}/></button>
        </div>
      )}

      <TeamDetailsModal team={selectedTeam} onClose={() => setSelectedTeam(null)} />
    </div>
  );
}

function NavItem({ icon, label, active, onClick, unread }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void; unread?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg transition-colors text-left font-display font-medium ${
        active ? "bg-secondary/10 text-secondary" : "text-text-muted hover:text-text hover:bg-white/5"
      }`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      {unread && (
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
      )}
    </button>
  );
}

/* ============================================================================
   A. OVERVIEW PANE
   ============================================================================ */
function OverviewPane({ analytics, sponsors }: { analytics: any; sponsors: any[] }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div>
        <h2 className="font-display text-2xl font-bold text-text">Overview Analytics</h2>
        <p className="text-text-muted text-sm">Visual tracking for registrations, financials, and community metrics.</p>
        {analytics?.error && (
          <div className="bg-red-500/10 text-red-400 p-4 rounded mt-4 border border-red-500/20">
            <strong>API Internal Error:</strong> {analytics.error}
          </div>
        )}
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <OverviewCard icon={<Users className="text-primary" />} label="Total Teams" value={analytics.totalRegistrations || 0} />
        <OverviewCard icon={<DollarSign className="text-neon-green" />} label="Total Revenue" value={`₹${analytics.totalRevenue || 0}`} />
        <OverviewCard icon={<CreditCard className="text-yellow-400" />} label="Pending Payments" value={analytics.pendingPayments || 0} />
        <OverviewCard icon={<MessageCircle className="text-neon-blue" />} label="Discord Joins" value={analytics.discordJoins || 0} />
        <OverviewCard icon={<TrendingUp className="text-neon-purple" />} label="Referrals Made" value={analytics.referralAnalytics?.totalReferrals || 0} />
      </div>

      {/* Charts & Trends Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Registration Line Trend Chart (SVG) */}
        <div className="glass-card p-6">
          <h3 className="font-display font-bold text-text mb-4">Registration Trends (7 Days)</h3>
          <div className="h-64 flex items-end justify-between gap-2 pt-6 relative border-l border-b border-white/10 pb-2 pl-2">
            {analytics.dailyRegistrations?.map((item: any, idx: number) => {
              const maxCount = Math.max(...analytics.dailyRegistrations.map((d: any) => d._count), 1);
              const pct = (item._count / maxCount) * 100;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                  <span className="absolute bottom-full mb-1 bg-surface-light px-2 py-0.5 rounded text-xs text-primary font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    {item._count} teams
                  </span>
                  <div
                    style={{ height: `${pct}%` }}
                    className="w-full bg-gradient-to-t from-primary/20 to-primary rounded-t border-t border-primary/50 hover:to-secondary transition-all"
                  />
                  <span className="text-[10px] text-text-dim mt-2 truncate w-full text-center">{item.date}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Revenue Area Trend Chart (SVG) */}
        <div className="glass-card p-6">
          <h3 className="font-display font-bold text-text mb-4">Revenue Analytics (7 Days)</h3>
          <div className="h-64 flex items-end justify-between gap-2 pt-6 relative border-l border-b border-white/10 pb-2 pl-2">
            {analytics.revenueTrends?.map((item: any, idx: number) => {
              const maxAmount = Math.max(...analytics.revenueTrends.map((d: any) => d.amount), 1);
              const pct = (item.amount / maxAmount) * 100;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                  <span className="absolute bottom-full mb-1 bg-surface-light px-2 py-0.5 rounded text-xs text-neon-green font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    ₹{item.amount}
                  </span>
                  <div
                    style={{ height: `${pct}%` }}
                    className="w-full bg-gradient-to-t from-neon-green/20 to-neon-green rounded-t border-t border-neon-green/50 hover:to-primary transition-all"
                  />
                  <span className="text-[10px] text-text-dim mt-2 truncate w-full text-center">{item.date}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category distribution */}
        <div className="glass-card p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-display font-bold text-text mb-4">Category Distribution</h3>
            <div className="space-y-4">
              {analytics.categoryDistribution?.map((cat: any) => {
                const total = analytics.totalRegistrations || 1;
                const percent = Math.round((cat._count / total) * 100);
                return (
                  <div key={cat.category} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-text font-medium">{cat.category}</span>
                      <span className="text-text-muted">{cat._count} ({percent}%)</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${percent}%` }}
                        className={`h-full rounded-full bg-gradient-to-r ${
                          cat.category === "STUDENT" ? "from-primary to-neon-blue" :
                          cat.category === "IT_PROFESSIONAL" ? "from-secondary to-neon-purple" :
                          "from-neon-green to-yellow-400"
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Lead Analytics / Referral points */}
        <div className="glass-card p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-display font-bold text-text mb-4">Sponsorship & Referral Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-lg text-center">
                <span className="text-xs text-text-muted">Total Sponsors</span>
                <p className="text-2xl font-display font-bold text-secondary mt-1">2</p>
              </div>
              <div className="p-4 bg-white/5 rounded-lg text-center">
                <span className="text-xs text-text-muted">Referrals Points</span>
                <p className="text-2xl font-display font-bold text-neon-purple mt-1">{analytics.referralAnalytics?.totalPoints || 0}</p>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/5">
            <p className="text-xs text-text-dim italic">Referral analytics reflect registered ambassadors and organic user links.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function OverviewCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="glass-card p-5 relative overflow-hidden">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-text-muted text-xs font-medium truncate">{label}</span>
      </div>
      <p className="font-display text-2xl font-bold text-text mt-1">{value}</p>
    </div>
  );
}

/* ============================================================================
   B. PARTICIPANT MANAGEMENT
   ============================================================================ */
function ParticipantsPane({
  participants,
  searchTerm,
  setSearchTerm,
  filterCategory,
  setFilterCategory,
  handleExportCSV,
  setSelectedReceipt,
  setSelectedTeam
}: any) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-text">Participant Teams</h2>
          <p className="text-text-muted text-sm">View registration logs and verify payments.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExportCSV} className="btn-secondary inline-flex items-center gap-2 text-sm py-2">
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-white/5 p-4 rounded-xl border border-white/5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim" size={16} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search team ID/name..."
            className="input-field pl-10 text-sm"
          />
        </div>
        <div>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="input-field text-sm h-full">
            <option value="ALL">All Categories</option>
            <option value="STUDENT">Student</option>
            <option value="IT_PROFESSIONAL">IT Professional</option>
            <option value="STARTUP">Startup</option>
          </select>
        </div>
      </div>

      {/* Participants Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-light border-b border-white/5 text-text-muted text-xs font-semibold uppercase">
              <tr>
                <th className="p-4">Team ID</th>
                <th className="p-4">Team Name</th>
                <th className="p-4">Category</th>
                <th className="p-4 text-center">Payment Status</th>
                <th className="p-4 text-center">Submitted</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {participants.length > 0 ? (
                participants.map((team: any) => {
                  const hasSubmission = !!team.submission;
                  return (
                    <tr key={team.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 text-text font-mono font-bold text-primary">{team.teamId}</td>
                      <td className="p-4 text-text font-medium">{team.name}</td>
                      <td className="p-4 text-text-muted">{team.category}</td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => team.payment && setSelectedReceipt(team.payment)}
                          disabled={!team.payment}
                          className={`px-2 py-0.5 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                            team.payment?.status === "SUCCESS" ? "bg-green-500/10 text-green-400 cursor-pointer hover:bg-green-500/20" :
                            team.payment?.status === "PENDING" ? "bg-yellow-500/10 text-yellow-400" :
                            team.payment?.status === "REFUNDED" ? "bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 cursor-pointer" :
                            "bg-red-500/10 text-red-400"
                          }`}
                        >
                          {team.payment?.status || "PENDING"}
                          {team.payment?.status === "SUCCESS" && <ExternalLink size={10} />}
                        </button>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          hasSubmission ? "bg-green-500/10 text-green-400" : "bg-white/5 text-text-dim"
                        }`}>
                          {hasSubmission ? "Yes ✓" : "Pending"}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setSelectedTeam(team)}
                          className="px-3 py-1 text-xs font-medium text-primary hover:bg-primary/10 rounded transition-colors"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-text-muted">No teams match selected filters</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

/* ============================================================================
   B2. SUBMISSIONS PANE
   ============================================================================ */
function SubmissionsPane({ submissions }: { submissions: any[] }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-text">Project Submissions</h2>
        <p className="text-text-muted text-sm">{submissions.length} team(s) have submitted project links.</p>
      </div>
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-light border-b border-white/5 text-text-muted text-xs font-semibold uppercase">
              <tr>
                <th className="p-4">Team</th>
                <th className="p-4">Category</th>
                <th className="p-4">GitHub</th>
                <th className="p-4">Demo Video</th>
                <th className="p-4">PPT</th>
                <th className="p-4">APK</th>
                <th className="p-4">Submitted At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {submissions.length > 0 ? (
                submissions.map((sub: any) => (
                  <tr key={sub.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <span className="text-text font-medium block">{sub.team?.name}</span>
                      <span className="text-primary font-mono text-xs">{sub.team?.teamId}</span>
                    </td>
                    <td className="p-4 text-text-muted text-xs">{sub.team?.category}</td>
                    <td className="p-4">
                      {sub.githubLink ? <LinkBadge url={sub.githubLink} label="GitHub" /> : <span className="text-text-dim text-xs">—</span>}
                    </td>
                    <td className="p-4">
                      {sub.demoVideo ? <LinkBadge url={sub.demoVideo} label="Video" color="text-neon-blue" /> : <span className="text-text-dim text-xs">—</span>}
                    </td>
                    <td className="p-4">
                      {sub.pptLink ? <LinkBadge url={sub.pptLink} label="PPT" color="text-yellow-400" /> : <span className="text-text-dim text-xs">—</span>}
                    </td>
                    <td className="p-4">
                      {sub.apkLink ? <LinkBadge url={sub.apkLink} label="APK" color="text-neon-green" /> : <span className="text-text-dim text-xs">—</span>}
                    </td>
                    <td className="p-4 text-text-muted text-xs">
                      {sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-text-muted">No submissions yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

function LinkBadge({ url, label, color = "text-primary" }: { url: string; label: string; color?: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1 text-xs font-medium hover:underline ${color}`}
    >
      {label}
      <ExternalLink size={10} />
    </a>
  );
}

/* ============================================================================
   C. PAYMENT MANAGEMENT
   ============================================================================ */
function PaymentsPane({ payments, setSelectedReceipt }: any) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-text">Payment Management</h2>
        <p className="text-text-muted text-sm">Track GST billing, audit transactions, and process team refunds.</p>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-light border-b border-white/5 text-text-muted text-xs font-semibold uppercase">
              <tr>
                <th className="p-4">GST Invoice ID</th>
                <th className="p-4">Team</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Order ID</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {payments.length > 0 ? (
                payments.map((payment: any) => (
                  <tr key={payment.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 text-text font-mono font-bold text-primary">
                      {payment.gstInvoice ? (
                        <button
                          onClick={() => setSelectedReceipt(payment)}
                          className="hover:underline text-left inline-flex items-center gap-1 text-primary font-bold"
                        >
                          {payment.gstInvoice}
                          <ExternalLink size={10} />
                        </button>
                      ) : (
                        <span className="text-text-dim italic">Pending</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="text-text font-medium block">{payment.team?.name}</span>
                      <span className="text-xs text-text-muted font-mono">{payment.team?.teamId}</span>
                    </td>
                    <td className="p-4 text-neon-green font-bold">₹{payment.amount}</td>
                    <td className="p-4 text-text-muted font-mono text-xs truncate max-w-[120px]">{payment.razorpayOrderId || "N/A"}</td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        payment.status === "SUCCESS" ? "bg-green-500/10 text-green-400" :
                        payment.status === "PENDING" ? "bg-yellow-500/10 text-yellow-400" :
                        payment.status === "REFUNDED" ? "bg-purple-500/10 text-purple-400" :
                        "bg-red-500/10 text-red-400"
                      }`}>{payment.status}</span>
                    </td>
                    <td className="p-4 text-right">
                      {/* Refund option removed */}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-text-muted">No transactions found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

/* ============================================================================
   D. ANNOUNCEMENT SYSTEM
   ============================================================================ */
function AnnouncementsPane({
  announcements,
  announcementTitle,
  setAnnouncementTitle,
  announcementMsg,
  setAnnouncementMsg,
  announcementTarget,
  setAnnouncementTarget,
  channels,
  setChannels,
  handleSendAnnouncement,
  announcementLogs
}: any) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Create Announcement Form */}
      <div className="lg:col-span-2 space-y-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-text">Broadcast Announcements</h2>
          <p className="text-text-muted text-sm">Send real-time alerts to dashboard, emails, and discord channels.</p>
        </div>

        <form onSubmit={handleSendAnnouncement} className="glass-card p-6 space-y-4">
          <div>
            <label className="label-text text-sm">Announcement Title</label>
            <input
              type="text"
              value={announcementTitle}
              onChange={(e) => setAnnouncementTitle(e.target.value)}
              className="input-field text-sm"
              placeholder="e.g. Round 1 details released!"
              required
            />
          </div>

          <div>
            <label className="label-text text-sm">Target Audience</label>
            <select
              value={announcementTarget}
              onChange={(e) => setAnnouncementTarget(e.target.value)}
              className="input-field text-sm"
            >
              <option value="ALL">All Participants</option>
              <option value="STUDENT">Students Only</option>
              <option value="IT_PROFESSIONAL">IT Professionals Only</option>
              <option value="STARTUP">Startups Only</option>
            </select>
          </div>

          <div>
            <label className="label-text text-sm">Select Output Channels</label>
            <div className="flex flex-wrap gap-4 mt-2">
              <label className="flex items-center gap-2 text-sm text-text-muted cursor-pointer">
                <input
                  type="checkbox"
                  checked={channels.dashboard}
                  onChange={(e) => setChannels({ ...channels, dashboard: e.target.checked })}
                  className="rounded border-white/10 text-primary focus:ring-primary"
                />
                Dashboard Feed
              </label>
              <label className="flex items-center gap-2 text-sm text-text-muted cursor-pointer">
                <input
                  type="checkbox"
                  checked={channels.email}
                  onChange={(e) => setChannels({ ...channels, email: e.target.checked })}
                  className="rounded border-white/10 text-primary focus:ring-primary"
                />
                Broadcast Email (Resend)
              </label>
              <label className="flex items-center gap-2 text-sm text-text-muted cursor-pointer">
                <input
                  type="checkbox"
                  checked={channels.discord}
                  onChange={(e) => setChannels({ ...channels, discord: e.target.checked })}
                  className="rounded border-white/10 text-primary focus:ring-primary"
                />
                Discord Hook (#announcements)
              </label>
            </div>
          </div>

          <div>
            <label className="label-text text-sm">Message</label>
            <textarea
              value={announcementMsg}
              onChange={(e) => setAnnouncementMsg(e.target.value)}
              className="input-field text-sm h-32"
              placeholder="Write the announcement description..."
              required
            />
          </div>

          <button type="submit" className="btn-primary w-full text-sm">
            Publish Broadcast
          </button>
        </form>

        {announcementLogs.length > 0 && (
          <div className="bg-green-500/5 border border-green-500/20 p-4 rounded-xl space-y-2">
            <h4 className="text-green-400 font-bold text-sm flex items-center gap-2">
              <CheckCircle size={16} /> Broadcast Executed Successfully
            </h4>
            <ul className="list-disc pl-4 text-xs text-text-muted space-y-1">
              {announcementLogs.map((log: string, idx: number) => (
                <li key={idx}>{log}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Broadcast History */}
      <div className="space-y-4">
        <h3 className="font-display font-bold text-lg text-text">Broadcast Log</h3>
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
          {announcements.map((ann: any) => (
            <div key={ann.id} className="p-4 bg-white/5 border border-white/5 rounded-xl space-y-2 relative">
              {ann.isPinned && (
                <span className="absolute top-4 right-4 bg-primary/10 text-primary px-1.5 py-0.5 rounded text-[10px] font-bold">
                  PINNED
                </span>
              )}
              <h4 className="text-text font-bold text-sm leading-snug">{ann.title}</h4>
              <p className="text-xs text-text-muted line-clamp-3">{ann.message}</p>
              <span className="text-[10px] text-text-dim block">
                {new Date(ann.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}



/* ============================================================================
   G. ADMIN NOTIFICATIONS PANEL
   ============================================================================ */
function AdminNotificationsPane({ announcements }: { announcements: any[] }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-text">Notifications</h2>
        <p className="text-text-muted text-sm">Incoming alerts, sponsor inquiries, and system updates.</p>
      </div>

      <div className="glass-card p-6 space-y-3">
        {announcements.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <Bell className="mx-auto text-text-dim" size={36} />
            <p className="text-text-muted">No notifications yet.</p>
            <p className="text-text-dim text-xs">Notifications from sponsor inquiries and system events will appear here.</p>
          </div>
        ) : (
          announcements.map((a: any) => (
            <div
              key={a.id}
              className={`p-4 rounded-xl transition-colors ${
                a.isPinned
                  ? "bg-primary/5 border border-primary/20"
                  : "bg-white/5 border border-white/5 hover:bg-white/[0.07]"
              }`}
            >
              <div className="flex justify-between items-start gap-4 mb-2">
                <p className={`text-sm ${a.isPinned ? "text-text font-medium" : "text-text-muted"}`}>
                  {a.isPinned && <span className="mr-2">📌</span>}
                  {a.title}
                </p>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {a.visibility === "ADMIN" && (
                    <span className="px-1.5 py-0.5 bg-secondary/10 text-secondary text-[9px] font-bold rounded uppercase">
                      Admin
                    </span>
                  )}
                  <span className="text-text-dim text-xs whitespace-nowrap">
                    {new Date(a.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
              {a.message && (
                <p className="text-text-muted text-sm whitespace-pre-wrap leading-relaxed">{a.message}</p>
              )}
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}


function TeamDetailsModal({ team, onClose }: { team: any; onClose: () => void }) {
  if (!team) return null;

  // Extract leader and members correctly from Prisma structure
  const leaderData = team.members?.find((m: any) => m.role === "LEADER");
  const leader = leaderData?.user;
  const regularMembers = team.members?.filter((m: any) => m.role !== "LEADER") || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="font-display text-2xl font-bold text-text">{team.name}</h2>
            <p className="text-primary font-mono text-sm">{team.teamId}</p>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-text p-1">
            <XCircle size={24} />
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 p-4 rounded-xl">
              <p className="text-text-muted text-xs mb-1">Category</p>
              <p className="text-text font-medium">{team.category}</p>
            </div>
            <div className="bg-white/5 p-4 rounded-xl">
              <p className="text-text-muted text-xs mb-1">Payment Status</p>
              <p className="text-text font-medium">{team.payment?.status || "PENDING"}</p>
            </div>
            <div className="bg-white/5 p-4 rounded-xl">
              <p className="text-text-muted text-xs mb-1">Project Submitted</p>
              <p className="text-text font-medium">{team.submission ? "Yes ✓" : "No"}</p>
            </div>
            <div className="bg-white/5 p-4 rounded-xl">
              <p className="text-text-muted text-xs mb-1">Registered At</p>
              <p className="text-text font-medium">{new Date(team.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {leader && (
            <div className="bg-white/5 p-4 rounded-xl">
              <h3 className="font-bold text-text mb-3 flex items-center gap-2">
                <Users size={16} className="text-primary" />
                Team Leader
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-text-muted">Name:</span> <span className="text-text">{leader.name}</span></div>
                <div><span className="text-text-muted">Email:</span> <span className="text-text">{leader.email}</span></div>
                <div><span className="text-text-muted">Mobile:</span> <span className="text-text">{leader.mobile || "N/A"}</span></div>
                <div><span className="text-text-muted">College/Company:</span> <span className="text-text">{leaderData.college || "N/A"}</span></div>
                {leaderData.linkedin && <div className="col-span-2"><span className="text-text-muted">LinkedIn:</span> <a href={leaderData.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">{leaderData.linkedin}</a></div>}
              </div>
            </div>
          )}

          {regularMembers.length > 0 && (
            <div className="bg-white/5 p-4 rounded-xl">
              <h3 className="font-bold text-text mb-3">Team Members ({regularMembers.length})</h3>
              <div className="space-y-2">
                {regularMembers.map((m: any, i: number) => (
                  <div key={i} className="flex justify-between text-sm border-b border-white/5 pb-2 last:border-0">
                    <span className="text-text">{m.user?.name || "Unknown"}</span>
                    <span className="text-text-muted">{m.user?.email || "No Email"}</span>
                    {m.skills && <span className="text-text-dim text-xs">{m.skills}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {team.submission && (
            <div className="bg-white/5 p-4 rounded-xl">
              <h3 className="font-bold text-text mb-3">Project Submission</h3>
              <div className="space-y-2 text-sm">
                {team.submission.theme && <div><span className="text-text-muted">Theme:</span> <span className="text-text">{team.submission.theme}</span></div>}
                {team.submission.techStack && <div><span className="text-text-muted">Tech Stack:</span> <span className="text-text">{team.submission.techStack}</span></div>}
                {team.submission.repoUrl && <div><span className="text-text-muted">Repo:</span> <a href={team.submission.repoUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">{team.submission.repoUrl}</a></div>}
                {team.submission.demoUrl && <div><span className="text-text-muted">Demo:</span> <a href={team.submission.demoUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">{team.submission.demoUrl}</a></div>}
                {team.submission.description && <div><span className="text-text-muted">Description:</span> <p className="text-text mt-1">{team.submission.description}</p></div>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   H. SPONSOR MANAGEMENT
   ============================================================================ */
function SponsorsPane({
  sponsors,
  inquiries,
  showAddSponsor,
  setShowAddSponsor,
  newSponsor,
  setNewSponsor,
  handleAddSponsorSubmit,
  handleToggleSponsorStatus,
  handleDeleteSponsor,
  handleUpdateInquiryStatus
}: any) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-display text-2xl font-bold text-text">Sponsor Hub</h2>
          <p className="text-text-muted text-sm">Manage banner displays, logos, contact info, and active tier layouts.</p>
        </div>
        <button
          onClick={() => setShowAddSponsor(!showAddSponsor)}
          className="btn-primary inline-flex items-center gap-1.5 text-sm py-2"
        >
          <Plus size={16} /> Add Sponsor
        </button>
      </div>

      {showAddSponsor && (
        <form onSubmit={handleAddSponsorSubmit} className="glass-card p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 border-b border-white/5 pb-2">
            <h3 className="font-display font-bold text-text">New Partner Record</h3>
          </div>
          <div>
            <label className="label-text text-xs">Sponsor Name</label>
            <input
              type="text"
              value={newSponsor.name}
              onChange={(e) => setNewSponsor({ ...newSponsor, name: e.target.value })}
              className="input-field text-sm"
              placeholder="e.g. Microsoft"
              required
            />
          </div>
          <div>
            <label className="label-text text-xs">Tier</label>
            <select
              value={newSponsor.tier}
              onChange={(e) => setNewSponsor({ ...newSponsor, tier: e.target.value })}
              className="input-field text-sm"
            >
              <option value="PLATINUM">PLATINUM</option>
              <option value="GOLD">GOLD</option>
              <option value="SILVER">SILVER</option>
            </select>
          </div>
          <div>
            <label className="label-text text-xs">Website URL</label>
            <input
              type="url"
              value={newSponsor.website}
              onChange={(e) => setNewSponsor({ ...newSponsor, website: e.target.value })}
              className="input-field text-sm"
              placeholder="https://microsoft.com"
            />
          </div>
          <div>
            <label className="label-text text-xs">Logo Image Link</label>
            <input
              type="url"
              value={newSponsor.logo}
              onChange={(e) => setNewSponsor({ ...newSponsor, logo: e.target.value })}
              className="input-field text-sm"
              placeholder="https://image-source.com/logo.png"
            />
          </div>
          <div>
            <label className="label-text text-xs">Contact E-mail</label>
            <input
              type="email"
              value={newSponsor.contact}
              onChange={(e) => setNewSponsor({ ...newSponsor, contact: e.target.value })}
              className="input-field text-sm"
              placeholder="partner@sponsors.com"
            />
          </div>
          <div>
            <label className="label-text text-xs">Description</label>
            <input
              type="text"
              value={newSponsor.description}
              onChange={(e) => setNewSponsor({ ...newSponsor, description: e.target.value })}
              className="input-field text-sm"
              placeholder="Partner contributions/sponsorship notes..."
            />
          </div>
          <div className="md:col-span-2 flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddSponsor(false)}
              className="btn-secondary py-2 text-sm"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary py-2 text-sm">
              Save Partner
            </button>
          </div>
        </form>
      )}

      {/* Sponsors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sponsors.map((sp: any) => (
          <div key={sp.id} className="glass-card p-5 flex flex-col justify-between border border-white/5 relative">
            <div className="flex gap-4">
              <div className="w-16 h-16 rounded bg-white/5 flex-shrink-0 flex items-center justify-center overflow-hidden border border-white/10">
                {sp.logo ? (
                  <img src={sp.logo} alt={sp.name} className="object-cover w-full h-full" />
                ) : (
                  <Plus className="text-text-dim" size={24} />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-text font-bold text-base leading-tight">{sp.name}</h4>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                    sp.tier === "PLATINUM" ? "bg-purple-500/10 text-purple-400" :
                    sp.tier === "GOLD" ? "bg-yellow-500/10 text-yellow-400" :
                    "bg-gray-500/10 text-gray-400"
                  }`}>{sp.tier}</span>
                </div>
                <p className="text-xs text-text-muted mt-1 leading-snug">{sp.description || "No description set."}</p>
                {sp.website && (
                  <a
                    href={sp.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-primary hover:underline inline-flex items-center gap-1 mt-2"
                  >
                    Visit Website
                    <ExternalLink size={10} />
                  </a>
                )}
              </div>
            </div>

            <div className="border-t border-white/5 mt-4 pt-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-text-muted font-medium">Dashboard Active Layout:</span>
                <button
                  onClick={() => handleToggleSponsorStatus(sp.id, !sp.isActive)}
                  className={`w-10 h-5 rounded-full p-0.5 transition-colors relative ${
                    sp.isActive ? "bg-neon-green" : "bg-white/10"
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-background rounded-full transition-transform ${
                      sp.isActive ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
              <button
                onClick={() => handleDeleteSponsor(sp.id)}
                className="text-text-dim hover:text-red-400 p-1"
                title="Remove Sponsor"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Sponsorship Inquiries */}
      <div className="mt-12 space-y-4">
        <div>
          <h3 className="font-display text-xl font-bold text-text">Sponsorship Inquiries</h3>
          <p className="text-text-muted text-sm">Review applications submitted from the landing page.</p>
        </div>
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-light border-b border-white/5 text-text-muted text-xs font-semibold uppercase">
                <tr>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Company</th>
                  <th className="p-4">Message</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {inquiries?.length > 0 ? (
                  inquiries.map((inq: any) => (
                    <tr key={inq.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <span className="text-text font-medium block">{inq.name}</span>
                        <span className="text-xs text-text-muted block">{inq.email}</span>
                        <span className="text-xs text-text-dim block">{inq.phone}</span>
                      </td>
                      <td className="p-4 text-text">{inq.company || "—"}</td>
                      <td className="p-4 text-text-muted text-xs max-w-xs truncate" title={inq.message}>
                        {inq.message || "—"}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          inq.status === "REVIEWED" ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"
                        }`}>
                          {inq.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {inq.status === "PENDING" && (
                          <button
                            onClick={() => handleUpdateInquiryStatus(inq.id, "REVIEWED")}
                            className="btn-secondary py-1 px-3 text-xs"
                          >
                            Mark Reviewed
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-text-muted">No pending inquiries</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
