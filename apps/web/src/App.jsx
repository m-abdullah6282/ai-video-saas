import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import CreateVideo from "./pages/CreateVideo";
import VideoLibrary from "./pages/VideoLibrary";

// React Router replaces what Next.js would've given us for free
// (file-based routing). Every route renders inside <Layout>, which
// keeps the sidebar persistent across page changes.
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/create" element={<CreateVideo />} />
          <Route path="/library" element={<VideoLibrary />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
