import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchVideoDetail } from "../lib/api";

export default function VideoDetail() {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadVideo() {
      try {
        const data = await fetchVideoDetail(videoId);
        setVideo(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadVideo();
  }, [videoId]);

  if (loading) return <p className="text-white/50">Loading...</p>;
  if (error) return <p className="text-error">{error}</p>;
  if (!video) return null;

  return (
    <div>
      <Link to="/library" className="text-white/50 text-sm hover:text-white mb-4 inline-block">
        ← Back to Library
      </Link>
      <h1 className="text-3xl font-display font-semibold mb-6">{video.title}</h1>

      <div className="bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden mb-4">
        <div className="aspect-video bg-black flex flex-col items-center justify-center p-8 relative border-b border-white/10">
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
            <span className="text-xs text-white/50">PREVIEW</span>
          </div>
          <pre className="whitespace-pre-wrap text-sm text-white/90 max-h-full overflow-y-auto leading-relaxed">
            {video.script}
          </pre>
        </div>
        <div className="p-4 flex items-center justify-between">
          <div className="text-sm text-white/50">{video.sector} · {video.country} · {video.created_at}</div>
          <div className="text-xs px-2 py-1 rounded bg-neon-green/10 text-neon-green">{video.status}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
          <div className="text-sm text-white/50 mb-1">Reuse Rate</div>
          <div className="text-2xl font-display">{video.reuse_percentage}%</div>
        </div>
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
          <div className="text-sm text-white/50 mb-1">Cost</div>
          <div className="text-2xl font-display">£{video.cost}</div>
        </div>
      </div>
    </div>
  );
}