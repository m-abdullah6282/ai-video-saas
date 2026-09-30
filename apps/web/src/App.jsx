import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import AdminLayout from "./components/AdminLayout";
import Dashboard from "./pages/Dashboard";
import CreateVideo from "./pages/CreateVideo";
import VideoPlan from "./pages/VideoPlan";
import CostEstimate from "./pages/CostEstimate";
import VideoLibrary from "./pages/VideoLibrary";
import Login from "./pages/Login";
import AssetLibrary from "./pages/AssetLibrary";
import VideoDetail from "./pages/VideoDetail";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import RagAssetLibrary from "./pages/admin/RagAssetLibrary";
import ProviderManagement from "./pages/admin/ProviderManagement";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" />;
  const role = localStorage.getItem("role");
  return role === "admin" ? children : <Navigate to="/" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/create" element={<CreateVideo />} />
          <Route path="/create/plan" element={<VideoPlan />} />
          <Route path="/create/cost" element={<CostEstimate />} />
          <Route path="/library" element={<VideoLibrary />} />
          <Route path="/assets" element={<AssetLibrary />} />
          <Route path="/library/:videoId" element={<VideoDetail />} />
        </Route>

        <Route
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/assets" element={<RagAssetLibrary />} />
          <Route path="/admin/providers" element={<ProviderManagement />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
