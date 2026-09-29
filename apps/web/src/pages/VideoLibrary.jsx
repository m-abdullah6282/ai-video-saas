import { useState, useEffect } from "react";
import { fetchVideoLibrary } from "../lib/api";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";

const PAGE_SIZE = 6;

export default function VideoLibrary() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [sectorFilter, setSectorFilter] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function loadVideos() {
      try {
        const data = await fetchVideoLibrary();
        setVideos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadVideos();
  }, []);

  if (loading) return <p className="text-white/50">Loading videos...</p>;
  if (error) return <p className="text-error">Failed to load: {error}</p>;

  const sectors = [...new Set(videos.map((v) => v.sector))];

  const filtered = videos.filter((v) => {
    const matchesSearch = v.title.toLowerCase().includes(search.toLowerCase());
    const matchesSector = !sectorFilter || v.sector === sectorFilter;
    return matchesSearch && matchesSector;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold">Video Library</h1>
      <p className="text-white/40 text-sm mb-6">Veyra Orchestration Engine</p>

      <div className="flex gap-3 mb-4">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Search video assets..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full bg-white/[0.03] border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-white/30 focus:border-neon-green outline-none"
          />
        </div>
        <select
          value={sectorFilter}
          onChange={(e) => { setSectorFilter(e.target.value); setPage(1); }}
          className="bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2 text-sm text-white/70"
        >
          <option value="">Sector</option>
          {sectors.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        {["Country", "Provider", "Avatar", "Status", "Date"].map((label) => (
          <select
            key={label}
            disabled
            title="Not yet available — backend field not tracked"
            className="bg-white/[0.02] border border-white/5 rounded-lg px-3 py-2 text-sm text-white/20 cursor-not-allowed"
          >
            <option>{label}</option>
          </select>
        ))}
      </div>

      <div className="text-xs text-white/30 mb-4">{filtered.length} videos</div>

      {pageItems.length === 0 ? (
        <p className="text-white/50">No videos found.</p>
      ) : (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {pageItems.map((v) => (
            <Link
              key={v.id}
              to={`/library/${v.id}`}
              className="bg-white/[0.02] border border-white/10 rounded-xl overflow-hidden hover:border-neon-green/40 transition"
            >
              <div className="h-32 bg-white/5 flex items-center justify-center text-white/20 text-xs">
                thumbnail
              </div>
              <div className="p-3">
                <div className="flex gap-2 text-[10px] mb-1">
                  <span className="text-neon-green">{v.sector}</span>
                  <span className="text-white/30">{v.country}</span>
                </div>
                <div className="font-medium text-sm">{v.title}</div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-[10px] text-white/40">{v.reuse_percentage}% reused</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-neon-green/10 text-neon-green">{v.status}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 text-sm border border-white/10 rounded-lg disabled:opacity-30"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-1.5 text-sm rounded-lg ${p === page ? "bg-neon-green text-black" : "border border-white/10"}`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 text-sm border border-white/10 rounded-lg disabled:opacity-30"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}