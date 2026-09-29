import { useState, useEffect } from "react";
import { VideoIcon, Wallet, PiggyBank, Recycle } from "lucide-react";
import { fetchDashboardStats, fetchRecentVideos } from "../lib/api";
import { Link, useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
    { label: "Videos Created (This Month)", value: stats.videos_this_month, icon: VideoIcon },
    { label: "Total AI Spend (This Month)", value: `£${stats.ai_spend_this_month.toFixed(2)}`, icon: Wallet },
    { label: "RAG Reusage Savings", value: `£${stats.rag_savings_this_month.toFixed(2)}`, icon: PiggyBank, sub: "Saved via local cache" },
    { label: "Asset Reuse Rate", value: `${stats.overall_reuse_rate}%`, icon: Recycle },
  ];

  return (
    <div>
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-display font-semibold">Welcome back</h1>
          <p className="text-white/40 text-sm mt-1">Veyra Orchestration Engine</p>
        </div>
        <button
          onClick={() => navigate("/create")}
          className="bg-neon-green text-black font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-1"
        >
          + Create New Video
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="bg-white/[0.02] border border-white/10 rounded-xl p-4">
            <div className="text-xs text-white/40 mb-2">{c.label}</div>
            <div className="text-2xl font-display font-semibold">{c.value}</div>
            {c.sub && <div className="text-xs text-neon-green mt-1">{c.sub}</div>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-display font-semibold">Recent Videos</h2>
            <Link to="/library" className="text-xs text-cyan-blue">View Library</Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {videos.map((v) => (
              <Link
                key={v.id}
                to={`/library/${v.id}`}
                className="bg-white/[0.02] border border-white/10 rounded-xl overflow-hidden hover:border-neon-green/30 transition"
              >
                <div className="h-28 bg-white/5 flex items-center justify-center text-white/20 text-xs">
                  thumbnail
                </div>
                <div className="p-3">
                  <div className="flex gap-2 text-[10px] text-white/40 mb-1">
                    <span>{v.sector}</span>
                    <span>·</span>
                    <span>{v.country}</span>
                  </div>
                  <div className="font-medium text-sm">{v.title}</div>
                  <div className="text-[10px] text-neon-green mt-1">{v.status}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity — PLACEHOLDER, no backend audit-log yet */}
        <div>
          <h2 className="text-lg font-display font-semibold mb-3">Recent Activity</h2>
          <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4">
            <p className="text-xs text-white/30 italic">
              Activity feed requires audit-log backend (not yet built).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}