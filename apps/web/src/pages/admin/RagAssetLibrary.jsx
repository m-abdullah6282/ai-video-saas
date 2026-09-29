import { useState, useEffect, useMemo } from "react";
import { Trash2 } from "lucide-react";
import { fetchAdminAssets, deleteAdminAsset } from "../../lib/api";

const TAB_ORDER = ["video", "avatar", "voice", "background", "script"];
const TAB_LABELS = {
  video: "Videos",
  avatar: "Avatars",
  voice: "Voices",
  background: "Backgrounds",
  script: "Scripts",
};

export default function RagAssetLibrary() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchAdminAssets();
        setAssets(data);
        const firstType = TAB_ORDER.find((t) => data.some((a) => a.asset_type === t));
        setActiveTab(firstType || null);
      } catch (err) {
        if (err.message.includes("403")) setForbidden(true);
        else setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const availableTabs = useMemo(
    () => TAB_ORDER.filter((t) => assets.some((a) => a.asset_type === t)),
    [assets]
  );

  const visibleAssets = assets.filter((a) => a.asset_type === activeTab);

  async function handleDeleteAsset(assetId) {
    if (!window.confirm("Delete this asset? This cannot be undone.")) return;
    try {
      await deleteAdminAsset(assetId);
      setAssets((prev) => prev.filter((a) => a.id !== assetId));
      if (selectedAsset?.id === assetId) setSelectedAsset(null);
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <p className="text-white/50">Loading asset library...</p>;

  if (forbidden) {
    return (
      <div className="bg-white/[0.03] border border-white/10 rounded-xl p-8 text-center">
        <p className="text-lg font-display font-semibold mb-1">Admin access required</p>
        <p className="text-white/50 text-sm">You don't have permission to view this page.</p>
      </div>
    );
  }

  if (error) return <p className="text-error">Failed to load assets: {error}</p>;

  return (
    <div>
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-display font-semibold">RAG Asset Library</h1>
          <p className="text-white/40 text-sm mt-1">N2X System / Global Administrator Panel</p>
        </div>
        <button
          disabled
          title="Manual asset upload not yet built"
          className="bg-neon-green text-black font-medium px-4 py-2 rounded-lg text-sm opacity-30 cursor-not-allowed"
        >
          + Add New Asset
        </button>
      </div>

      {availableTabs.length === 0 ? (
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-8 text-center">
          <p className="text-white/50 text-sm">No RAG assets found.</p>
        </div>
      ) : (
        <>
          <div className="flex gap-2 mb-6">
            {availableTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setSelectedAsset(null);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeTab === tab
                    ? "bg-neon-green text-black"
                    : "bg-white/[0.03] border border-white/10 text-white/70 hover:bg-white/10"
                }`}
              >
                {TAB_LABELS[tab]}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 grid grid-cols-2 gap-4">
              {visibleAssets.map((asset) => (
                <div
                  key={asset.id}
                  onClick={() => setSelectedAsset(asset)}
                  className={`bg-white/[0.03] border rounded-xl p-4 cursor-pointer transition ${
                    selectedAsset?.id === asset.id
                      ? "border-neon-green/50"
                      : "border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-blue/10 text-cyan-blue">
                      {asset.sector}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAsset(asset.id);
                      }}
                      className="text-error hover:bg-error/10 rounded p-1"
                    >
                      <Trash2 size={14} strokeWidth={1.75} />
                    </button>
                  </div>
                  <div className="text-xs text-white/40 mb-1">{asset.organization_id}</div>
                  <div className="text-sm text-white/80 line-clamp-3">{asset.text}</div>
                </div>
              ))}
            </div>

            <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
              <h3 className="text-sm font-display font-semibold mb-4">Asset Detail View</h3>
              {selectedAsset ? (
                <div className="space-y-3 text-xs">
                  <div>
                    <div className="text-white/30 mb-1">ID</div>
                    <div className="text-white/80">{selectedAsset.id}</div>
                  </div>
                  <div>
                    <div className="text-white/30 mb-1">Sector</div>
                    <div className="text-white/80">{selectedAsset.sector}</div>
                  </div>
                  <div>
                    <div className="text-white/30 mb-1">Organization</div>
                    <div className="text-white/80">{selectedAsset.organization_id}</div>
                  </div>
                  <div>
                    <div className="text-white/30 mb-1">Full Text</div>
                    <div className="text-white/80 whitespace-pre-wrap">{selectedAsset.text}</div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-white/30 italic">Select an asset to view details.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
