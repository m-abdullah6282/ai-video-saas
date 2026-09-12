import { mockVideos } from "../lib/mockData";

export default function VideoLibrary() {
  return (
    <div>
      <h1 className="text-3xl font-display font-semibold mb-8">Video Library</h1>
      <div className="grid grid-cols-3 gap-4">
        {mockVideos.map((v) => (
          <div
            key={v.id}
            className="bg-white/[0.03] border border-white/10 rounded-xl p-4"
          >
            <div className="h-32 bg-white/5 rounded-lg mb-3 flex items-center justify-center text-white/30 text-sm">
              thumbnail placeholder
            </div>
            <div className="font-medium">{v.title}</div>
            <div className="text-sm text-white/50">
              {v.sector} · {v.country}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}