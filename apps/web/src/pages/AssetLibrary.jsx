import { useState, useEffect } from "react";
import { fetchAssetsByType } from "../lib/api";

export default function AssetLibrary() {
  const [assetType, setAssetType] = useState("avatar");
  const [assets, setAssets] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadAssets() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchAssetsByType(assetType);
        setAssets(data);
        setSelectedId(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadAssets();
  }, [assetType]);

  return (
    <div>
      <h1 className="text-3xl font-display font-semibold mb-1">Asset Library</h1>
      <p className="text-white/50 mb-6">Browse and select avatars or backgrounds.</p>

      <div className="flex gap-2 mb-6">
        {["avatar", "background"].map((t) => (
          <button
            key={t}
            onClick={() => setAssetType(t)}
            className={`px-4 py-2 rounded-lg text-sm capitalize ${
              assetType === t ? "bg-neon-green text-black font-medium" : "bg-white/[0.03] border border-white/10 text-white/70"
            }`}
          >
            {t}s
          </button>
        ))}
      </div>

      {loading && <p className="text-white/50">Loading...</p>}
      {error && <p className="text-error">{error}</p>}

      {!loading && !error && assets.length === 0 && (
        <p className="text-white/50">No {assetType}s found for your organization.</p>
      )}

      <div className="grid grid-cols-3 gap-4">
        {assets.map((a) => (
          <button
            key={a.id}
            onClick={() => setSelectedId(a.id)}
            className={`text-left rounded-xl border p-4 transition ${
              selectedId === a.id
                ? "border-neon-green bg-neon-green/10"
                : "border-white/10 bg-white/[0.03] hover:border-white/30"
            }`}
          >
            <div className="h-24 bg-white/5 rounded-lg mb-3 flex items-center justify-center text-white/30 text-xs">
              {assetType} preview
            </div>
            <div className="font-medium text-sm">{a.id}</div>
            <div className="text-xs text-white/50 mt-1">{a.sector}</div>
            <div className="text-xs text-white/40 mt-1 line-clamp-2">{a.text}</div>
          </button>
        ))}
      </div>

      {selectedId && (
        <div className="mt-6 p-4 bg-neon-green/10 border border-neon-green/30 rounded-xl">
          <span className="text-neon-green font-medium">Selected:</span> {selectedId}
        </div>
      )}
    </div>
  );
}