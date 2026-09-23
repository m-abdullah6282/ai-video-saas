import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import CreateVideo from "./pages/CreateVideo";
import VideoLibrary from "./pages/VideoLibrary";
import AdminPanel from "./pages/AdminPanel";
import Login from "./pages/Login";
import AssetLibrary from "./pages/AssetLibrary";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
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
          <Route path="/library" element={<VideoLibrary />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/assets" element={<AssetLibrary />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}