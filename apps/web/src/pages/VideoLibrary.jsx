import { useState, useEffect } from "react";
import { fetchVideoLibrary } from "../lib/api";

export default function VideoLibrary() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div>
      <h1 className="text-3xl font-display font-semibold mb-8">Video Library</h1>
      {videos.length === 0 ? (
        <p className="text-white/50">No videos yet. Create one to get started.</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {videos.map((v) => (
            <div key={v.id} className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
              <div className="h-32 bg-white/5 rounded-lg mb-3 flex items-center justify-center text-white/30 text-sm">
                thumbnail placeholder
              </div>
              <div className="font-medium">{v.title}</div>
              <div className="text-sm text-white/50">
                {v.sector} · {v.country}
              </div>
              <div className="text-xs text-neon-green mt-2">{v.reuse_percentage}% reused</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}