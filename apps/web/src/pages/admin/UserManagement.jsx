import { useState, useEffect, useMemo } from "react";
import { fetchAdminUsers } from "../../lib/api";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [orgFilter, setOrgFilter] = useState("all");

  useEffect(() => {
    async function loadData() {
      try {
        setUsers(await fetchAdminUsers());
      } catch (err) {
        if (err.message.includes("403")) setForbidden(true);
        else setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const organizations = useMemo(
    () => [...new Set(users.map((u) => u.organization_id))],
    [users]
  );

  const filtered = users.filter((u) => {
    if (search && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    if (roleFilter !== "all" && u.role !== roleFilter) return false;
    if (orgFilter !== "all" && u.organization_id !== orgFilter) return false;
    return true;
  });

  if (loading) return <p className="text-white/50">Loading users...</p>;

  if (forbidden) {
    return (
      <div className="bg-white/[0.03] border border-white/10 rounded-xl p-8 text-center">
        <p className="text-lg font-display font-semibold mb-1">Admin access required</p>
        <p className="text-white/50 text-sm">You don't have permission to view this page.</p>
      </div>
    );
  }

  if (error) return <p className="text-error">Failed to load users: {error}</p>;

  return (
    <div>
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-display font-semibold">User Management</h1>
          <p className="text-white/40 text-sm mt-1">N2X System / Global Administrator Panel</p>
        </div>
        <button
          disabled
          title="Magic-link invite flow not yet built"
          className="bg-neon-green text-black font-medium px-4 py-2 rounded-lg text-sm opacity-30 cursor-not-allowed"
        >
          + Invite User
        </button>
      </div>

      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-white/[0.03] border border-dashed border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:border-neon-green outline-none"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="bg-white/[0.03] border border-white/20 rounded-lg px-3 py-2 text-sm text-white outline-none"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
        <select
          value={orgFilter}
          onChange={(e) => setOrgFilter(e.target.value)}
          className="bg-white/[0.03] border border-white/20 rounded-lg px-3 py-2 text-sm text-white outline-none"
        >
          <option value="all">All Organizations</option>
          {organizations.map((org) => (
            <option key={org} value={org}>{org}</option>
          ))}
        </select>
      </div>

      <div className="bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-white/5 text-left text-white/30">
              <th className="p-4 font-medium">Email</th>
              <th className="p-4 font-medium">Role</th>
              <th className="p-4 font-medium">Organization</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-4 text-white/50">No users found.</td>
              </tr>
            ) : (
              filtered.map((u) => (
                <tr key={u.email} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                  <td className="p-4 font-medium">{u.email}</td>
                  <td className="p-4">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded ${
                        u.role === "admin"
                          ? "bg-neon-green/10 text-neon-green"
                          : "bg-cyan-blue/10 text-cyan-blue"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 text-white/70">{u.organization_id}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
