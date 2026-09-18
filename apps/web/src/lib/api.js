const API_BASE = "http://localhost:8000";

export async function fetchVideoPlan(query, sector) {
  const response = await fetch(`${API_BASE}/videos/plan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, sector }),
  });
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  return response.json();
}

export async function fetchDashboardStats() {
  const response = await fetch(`${API_BASE}/dashboard/stats`);
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  return response.json();
}

export async function fetchRecentVideos() {
  const response = await fetch(`${API_BASE}/dashboard/recent-videos`);
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  return response.json();
}