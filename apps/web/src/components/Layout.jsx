import { Link, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, VideoIcon, Library, Shield } from "lucide-react";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/create", label: "Create Video", icon: VideoIcon },
  { path: "/library", label: "Video Library", icon: Library },
  { path: "/admin", label: "Admin Panel", icon: Shield },
];

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex bg-black text-white font-body">
      <aside className="w-56 bg-black border-r border-white/10 flex flex-col">
        <div className="p-4 text-lg font-display font-semibold border-b border-white/10">
          AI Video SaaS
        </div>
        <nav className="flex-1 p-2">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3 py-2 rounded mb-1 text-sm ${
                  active
                    ? "bg-neon-green text-black font-medium"
                    : "text-white/70 hover:bg-white/10"
                }`}
              >
                <Icon size={18} strokeWidth={1.75} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}