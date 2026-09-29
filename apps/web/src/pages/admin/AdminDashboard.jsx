import { useState, useEffect } from "react";
import { Video, Wallet, Recycle, Building2 } from "lucide-react";
import { fetchAdminOrganizations, fetchAdminVideos } from "../../lib/api";

export default function AdminDashboard() {
  const [organizations, setOrganizations] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [orgsData, videosData] = await Promise.all([
          fetchAdminOrganizations(),
          fetchAdminVideos(),
        ]);
        setOrganizations(orgsData);
        setVideos(videosData);
      } catch (err) {
        if (err.message.includes("403")) setForbidden(true);
        else setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <p className="text-white/50">Loading control tower...</p>;

  if (forbidden) {
    return (
      <div className="bg-white/[0.03] border border-white/10 rounded-xl p-8 text-center">
        <p className="text-lg font-display font-semibold mb-1">Admin access required</p>
        <p className="text-white/50 text-sm">You don't have permission to view this page.</p>
      </div>
    );
  }

  if (error) return <p className="text-error">Failed to load admin data: {error}</p>;

  const totalVideos = videos.length;
  const totalSpend = videos.reduce((sum, v) => sum + (v.cost || 0), 0);
  const avgReuseRate = videos.length
    ? Math.round(videos.reduce((sum, v) => sum + (v.reuse_percentage || 0), 0) / videos.length)
    : 0;
  const totalOrgs = organizations.length;

  const cards = [
    { label: "Total Videos", value: totalVideos, icon: Video },
    { label: "Total Spend", value: `£${totalSpend.toFixed(2)}`, icon: Wallet },
    { label: "Avg Reuse Rate", value: `${avgReuseRate}%`, icon: Recycle },
    { label: "Organizations", value: totalOrgs, icon: Building2 },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-display font-semibold">Orchestrator Control Tower</h1>
        <p className="text-white/40 text-sm mt-1">N2X System / Global Administrator Panel</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2 text-xs text-white/40 mb-2">
              <c.icon size={14} strokeWidth={1.75} />
              {c.label}
            </div>
            <div className="text-2xl font-display font-semibold">{c.value}</div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-lg font-display font-semibold mb-3">Dispatch Metrics by Provider</h2>
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
          <p className="text-xs text-white/30 italic">
            Provider-level cost breakdown not tracked per video yet.
          </p>
        </div>
      </div>
    </div>
  );
}
