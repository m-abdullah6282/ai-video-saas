import { Link, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, VideoIcon, Library, Image, Mountain, BarChart2, Settings } from "lucide-react";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/create", label: "Create Video", icon: VideoIcon },
  { path: "/library", label: "Video Library", icon: Library },
  { path: "/assets?type=avatar", label: "Avatar Library", icon: Image },
  { path: "/assets?type=background", label: "Backgrounds", icon: Mountain },
  { path: "/reports", label: "Reports", icon: BarChart2 },
  { path: "/settings", label: "Settings", icon: Settings },
];

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex bg-black text-white font-body">
      <aside className="w-56 bg-black border-r border-white/10 flex flex-col">
        <div className="p-4 flex items-center gap-2 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-green to-cyan-blue flex items-center justify-center">
            <span className="text-black font-display font-bold text-sm">V</span>
          </div>
          <div>
            <div className="text-sm font-display font-semibold leading-none">VEYRA</div>
            <div className="text-[9px] text-white/40 tracking-widest">AI ORCHESTRATION</div>
          </div>
        </div>
        <nav className="flex-1 p-2">
          {navItems.map((item) => {
            const active = location.pathname === item.path.split("?")[0];
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