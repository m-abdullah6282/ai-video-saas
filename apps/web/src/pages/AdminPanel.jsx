import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { fetchAdminOrganizations, fetchAdminVideos, fetchAdminAssets, deleteAdminAsset } from "../lib/api";

const TABS = [
  { key: "organizations", label: "Organizations" },
  { key: "videos", label: "All Videos" },
  { key: "assets", label: "RAG Assets" },
];

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("organizations");
  const [organizations, setOrganizations] = useState([]);
  const [videos, setVideos] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [orgsData, videosData, assetsData] = await Promise.all([
          fetchAdminOrganizations(),
          fetchAdminVideos(),
          fetchAdminAssets(),
        ]);
        setOrganizations(orgsData);
        setVideos(videosData);
        setAssets(assetsData);
      } catch (err) {
        if (err.message.includes("403")) {
          setForbidden(true);
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  async function handleDeleteAsset(assetId) {
    if (!window.confirm("Delete this asset? This cannot be undone.")) return;
    try {
      await deleteAdminAsset(assetId);
      setAssets((prev) => prev.filter((a) => a.id !== assetId));
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <p className="text-white/50">Loading admin panel...</p>;

  if (forbidden) {
    return (
      <div className="bg-white/[0.03] border border-white/10 rounded-xl p-8 text-center">
        <p className="text-lg font-display font-semibold mb-1">Admin access required</p>
        <p className="text-white/50 text-sm">You don't have permission to view this page.</p>
      </div>
    );
  }

  if (error) return <p className="text-error">Failed to load admin data: {error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-display font-semibold mb-1">Admin Panel</h1>
      <p className="text-white/50 mb-8">Platform-wide overview across all organizations.</p>

      <div className="flex gap-2 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              activeTab === tab.key
                ? "bg-neon-green text-black"
                : "bg-white/[0.03] border border-white/10 text-white/70 hover:bg-white/10"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "organizations" && (
        <div className="bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-white/50">
                <th className="p-4 font-medium">Organization</th>
                <th className="p-4 font-medium">Total Videos</th>
                <th className="p-4 font-medium">Total Spend</th>
                <th className="p-4 font-medium">Avg Reuse Rate</th>
              </tr>
            </thead>
            <tbody>
              {organizations.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-4 text-white/50">
                    No organizations found.
                  </td>
                </tr>
              ) : (
                organizations.map((org) => (
                  <tr key={org.organization_id} className="border-b border-white/10 last:border-0">
                    <td className="p-4 font-medium">{org.organization_id}</td>
                    <td className="p-4">{org.total_videos}</td>
                    <td className="p-4">£{org.total_spend.toFixed(2)}</td>
                    <td className="p-4 text-neon-green">{org.avg_reuse_rate}%</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "videos" && (
        <div className="bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-white/50">
                <th className="p-4 font-medium">Title</th>
                <th className="p-4 font-medium">Organization</th>
                <th className="p-4 font-medium">Sector</th>
                <th className="p-4 font-medium">Country</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Reuse %</th>
                <th className="p-4 font-medium">Cost</th>
                <th className="p-4 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {videos.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-4 text-white/50">
                    No videos found.
                  </td>
                </tr>
              ) : (
                videos.map((v) => (
                  <tr key={v.id} className="border-b border-white/10 last:border-0">
                    <td className="p-4 font-medium">{v.title}</td>
                    <td className="p-4 text-cyan-blue">{v.organization_id}</td>
                    <td className="p-4">{v.sector}</td>
                    <td className="p-4">{v.country}</td>
                    <td className="p-4">
                      <span className="text-xs px-2 py-1 rounded bg-neon-green/10 text-neon-green">
                        {v.status}
                      </span>
                    </td>
                    <td className="p-4">{v.reuse_percentage}%</td>
                    <td className="p-4">£{v.cost}</td>
                    <td className="p-4 text-white/50">{v.created_at}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "assets" && (
        <div className="bg-white/[0.03] border border-white/10 rounded-xl divide-y divide-white/10">
          {assets.length === 0 ? (
            <p className="p-4 text-white/50">No RAG assets found.</p>
          ) : (
            assets.map((asset) => (
              <div key={asset.id} className="p-4 flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="text-sm text-white/50 mb-1">
                    {asset.organization_id} · {asset.sector}
                  </div>
                  <div className="text-sm">{asset.text}</div>
                </div>
                <button
                  onClick={() => handleDeleteAsset(asset.id)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-error border border-error/30 hover:bg-error/10 shrink-0"
                >
                  <Trash2 size={14} strokeWidth={1.75} />
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
