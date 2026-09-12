import { Link, Outlet, useLocation } from "react-router-dom";

const navItems = [
  { path: "/", label: "Dashboard" },
  { path: "/create", label: "Create Video" },
  { path: "/library", label: "Video Library" },
];

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex">
      <aside className="w-56 bg-navy text-white flex flex-col">
        <div className="p-4 text-lg font-semibold border-b border-white/10">
          AI Video SaaS
        </div>
        <nav className="flex-1 p-2">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-3 py-2 rounded mb-1 text-sm ${
                  active ? "bg-teal text-white" : "text-white/80 hover:bg-white/10"
                }`}
              >
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
