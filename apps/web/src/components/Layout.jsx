import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  VideoIcon,
  Library,
  Image,
  Mountain,
  BarChart2,
  Settings,
  ShieldCheck,
  Users,
  Database,
  Server,
  LogOut,
} from "lucide-react";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/create", label: "Create Video", icon: VideoIcon },
  { path: "/library", label: "Video Library", icon: Library },
  { path: "/assets?type=avatar", label: "Avatar Library", icon: Image },
  { path: "/assets?type=background", label: "Backgrounds", icon: Mountain },
  { path: "/reports", label: "Reports", icon: BarChart2 },
  { path: "/settings", label: "Settings", icon: Settings },
];

const adminNavItems = [
  { path: "/admin", label: "Dashboard", icon: ShieldCheck },
  { path: "/admin/users", label: "Users", icon: Users },
  { path: "/admin/assets", label: "RAG Assets", icon: Database },
  { path: "/admin/providers", label: "Providers", icon: Server },
];

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const email = localStorage.getItem("email");

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    navigate("/login");
  }

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
        <nav className="flex-1 p-2 overflow-y-auto">
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

          {role === "admin" && (
            <>
              <div className="text-[10px] text-white/30 uppercase tracking-widest px-3 mt-4 mb-2">
                Super Admin
              </div>
              {adminNavItems.map((item) => {
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
            </>
          )}
        </nav>
        <div className="p-2 border-t border-white/10">
          {email && <div className="px-3 py-1 text-xs text-white/40 truncate">{email}</div>}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded text-sm text-white/50 hover:text-white hover:bg-white/10"
          >
            <LogOut size={16} strokeWidth={1.75} />
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
