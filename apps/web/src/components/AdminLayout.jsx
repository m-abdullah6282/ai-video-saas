import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Users,
  Database,
  Server,
  ScrollText,
  Lock,
  Settings,
  LogOut,
} from "lucide-react";

const adminNavItems = [
  { path: "/admin", label: "Dashboard", icon: ShieldCheck },
  { path: "/admin/users", label: "Users", icon: Users },
  { path: "/admin/assets", label: "RAG Management", icon: Database },
  { path: "/admin/providers", label: "Providers", icon: Server },
];

const disabledNavItems = [
  { label: "Audit Trail", icon: ScrollText },
  { label: "Security", icon: Lock },
  { label: "Settings", icon: Settings },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
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
            <div className="text-[9px] text-neon-green tracking-widest">SUPER ADMIN</div>
          </div>
        </div>
        <nav className="flex-1 p-2 overflow-y-auto">
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

          {disabledNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                title="Not built yet"
                className="flex items-center gap-2 px-3 py-2 rounded mb-1 text-sm text-white/25 cursor-not-allowed"
              >
                <Icon size={18} strokeWidth={1.75} />
                {item.label}
              </div>
            );
          })}
        </nav>
        <div className="p-2 border-t border-white/10">
          {email && (
            <div className="px-3 py-2">
              <div className="text-xs text-white/60 truncate">{email}</div>
              <div className="text-[10px] text-white/30 uppercase tracking-widest">System Superuser</div>
            </div>
          )}
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
