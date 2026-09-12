import { mockDashboardStats, mockVideos } from "../lib/mockData";

// Prototype dashboard — brief Section 21: "Videos Created", "AI Spend",
// "RAG Savings", "Reuse %" are the core cards. Real numbers come from
// apps/api once Phase 2 is built; for now, mockData.ts feeds this.
export default function Dashboard() {
  const stats = mockDashboardStats;

  const cards = [
    { label: "Videos This Month", value: stats.videosThisMonth },
    { label: "AI Spend This Month", value: `£${stats.aiSpendThisMonth.toFixed(2)}` },
    { label: "RAG Savings This Month", value: `£${stats.ragSavingsThisMonth.toFixed(2)}` },
    { label: "Overall Reuse Rate", value: `${stats.overallReuseRate}%` },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-navy mb-6">Dashboard</h1>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-lg shadow p-4 border-t-4 border-teal">
            <div className="text-sm text-steel">{c.label}</div>
            <div className="text-2xl font-bold text-navy mt-1">{c.value}</div>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-semibold text-navy mb-3">Recent Videos</h2>
      <div className="bg-white rounded-lg shadow divide-y">
        {mockVideos.map((v) => (
          <div key={v.id} className="p-4 flex justify-between items-center">
            <div>
              <div className="font-medium text-navy">{v.title}</div>
              <div className="text-sm text-steel">
                {v.sector} · {v.country} · {v.createdAt}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm px-2 py-1 rounded bg-teal/10 text-teal inline-block">
                {v.status}
              </div>
              <div className="text-xs text-steel mt-1">{v.reusePercentage}% reused</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
