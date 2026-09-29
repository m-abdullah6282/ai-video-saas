import { useState, useEffect } from "react";
import { Server } from "lucide-react";
import { fetchAdminProviders } from "../../lib/api";

export default function ProviderManagement() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setProviders(await fetchAdminProviders());
      } catch (err) {
        if (err.message.includes("403")) setForbidden(true);
        else setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <p className="text-white/50">Loading providers...</p>;

  if (forbidden) {
    return (
      <div className="bg-white/[0.03] border border-white/10 rounded-xl p-8 text-center">
        <p className="text-lg font-display font-semibold mb-1">Admin access required</p>
        <p className="text-white/50 text-sm">You don't have permission to view this page.</p>
      </div>
    );
  }

  if (error) return <p className="text-error">Failed to load providers: {error}</p>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-display font-semibold">Provider Management</h1>
        <p className="text-white/40 text-sm mt-1">N2X System / Global Administrator Panel</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {providers.map((p) => (
          <div key={p.provider} className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Server size={16} strokeWidth={1.75} className="text-cyan-blue" />
              <span className="font-medium text-sm capitalize">{p.provider}</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-white/60">
              {p.status}
            </span>
          </div>
        ))}
      </div>

      <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
        <p className="text-xs text-white/30 italic">
          Live health metrics require real provider API integration — not yet implemented.
        </p>
      </div>
    </div>
  );
}
