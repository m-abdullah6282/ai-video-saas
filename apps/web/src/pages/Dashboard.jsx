import { useState, useEffect } from "react";
import { VideoIcon, Wallet, PiggyBank, Recycle } from "lucide-react";
import { fetchDashboardStats, fetchRecentVideos } from "../lib/api";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, videosData] = await Promise.all([
          fetchDashboardStats(),
          fetchRecentVideos(),
        ]);
        setStats(statsData);
        setVideos(videosData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <p className="text-white/50">Loading dashboard...</p>;
  if (error) return <p className="text-error">Failed to load dashboard: {error}</p>;

  const cards = [
    { label: "Videos This Month", value: stats.videos_this_month, accent: "bg-neon-green", icon: VideoIcon },
    { label: "AI Spend This Month", value: `£${stats.ai_spend_this_month.toFixed(2)}`, accent: "bg-cyan-blue", icon: Wallet },
    { label: "RAG Savings This Month", value: `£${stats.rag_savings_this_month.toFixed(2)}`, accent: "bg-neon-green", icon: PiggyBank },
    { label: "Overall Reuse Rate", value: `${stats.overall_reuse_rate}%`, accent: "bg-cyan-blue", icon: Recycle },
  ];

  return (
    <div>
      <h1 className="text-3xl font-display font-semibold mb-1">Dashboard</h1>
      <p className="text-white/50 mb-8">Let's see how the library is performing.</p>

      <div className="grid grid-cols-4 gap-4 mb-10">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
              <div className={`w-9 h-9 rounded-lg ${c.accent} flex items-center justify-center mb-4`}>
                <Icon size={18} strokeWidth={1.75} className="text-black" />
              </div>
              <div className="text-2xl font-display font-semibold">{c.value}</div>
              <div className="text-sm text-white/50 mt-1">{c.label}</div>
            </div>
          );
        })}
      </div>

      <h2 className="text-lg font-display font-semibold mb-3">Recent Videos</h2>
      <div className="bg-white/[0.03] border border-white/10 rounded-xl divide-y divide-white/10">
        {videos.map((v) => (
          <div key={v.id} className="p-4 flex justify-between items-center">
            <div>
              <div className="font-medium">{v.title}</div>
              <div className="text-sm text-white/50">
                {v.sector} · {v.country} · {v.created_at}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm px-2 py-1 rounded bg-neon-green/10 text-neon-green inline-block">
                {v.status}
              </div>
              <div className="text-xs text-white/50 mt-1">{v.reuse_percentage}% reused</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}