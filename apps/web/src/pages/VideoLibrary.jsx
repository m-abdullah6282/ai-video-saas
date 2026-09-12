import { mockVideos } from "../lib/mockData";

export default function VideoLibrary() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-navy mb-6">Video Library</h1>
      <div className="grid grid-cols-3 gap-4">
        {mockVideos.map((v) => (
          <div key={v.id} className="bg-white rounded-lg shadow p-4">
            <div className="h-32 bg-steel/20 rounded mb-3 flex items-center justify-center text-steel text-sm">
              thumbnail placeholder
            </div>
            <div className="font-medium text-navy">{v.title}</div>
            <div className="text-sm text-steel">{v.sector} · {v.country}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
