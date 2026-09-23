const API_BASE = "http://localhost:8000";

export async function fetchVideoPlan(query, sector) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE}/videos/plan`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query, sector }),
  });
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  return response.json();
}

export async function fetchDashboardStats() {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE}/dashboard/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  return response.json();
}

export async function fetchRecentVideos() {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE}/dashboard/recent-videos`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  return response.json();
}

export async function fetchVideoLibrary() {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE}/videos/library`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  return response.json();
}

export async function login(email, password) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error("Invalid email or password");
  const data = await response.json();
  localStorage.setItem("token", data.access_token);
  return data;
}

export async function register(email, password, organizationId) {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, organization_id: organizationId }),
  });
  if (!response.ok) throw new Error("Registration failed");
  const data = await response.json();
  localStorage.setItem("token", data.access_token);
  return data;
}

export async function fetchAdminOrganizations() {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE}/admin/organizations`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  return response.json();
}

export async function fetchAdminVideos() {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE}/admin/videos`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  return response.json();
}

export async function fetchAdminAssets() {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE}/admin/assets`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  return response.json();
}

export async function deleteAdminAsset(assetId) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE}/admin/assets/${assetId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  return response.json();
}
export async function fetchAssetsByType(assetType) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE}/assets/browse/${assetType}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  return response.json();
}