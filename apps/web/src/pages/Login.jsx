import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, register } from "../lib/api";

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [organizationId, setOrganizationId] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isRegister) {
        await register(email, password, organizationId);
      } else {
        await login(email, password);
      }
      const role = localStorage.getItem("role");
      navigate(role === "admin" ? "/admin" : "/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-sm bg-white/[0.02] border border-white/10 rounded-2xl p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-green to-cyan-blue flex items-center justify-center mb-3">
            <span className="text-black font-display font-bold text-xl">V</span>
          </div>
          <h1 className="text-xl font-display font-bold tracking-wide">VEYRA</h1>
          <p className="text-xs text-neon-green tracking-widest mt-1">— AI VIDEO ORCHESTRATION —</p>
        </div>

        <div className="border-t border-white/10 mb-6" />

        <form onSubmit={handleSubmit}>
          <label className="text-xs text-white/50 uppercase tracking-wide mb-1 block">Email Address</label>
          <input
            type="email"
            placeholder="operator@veyra.ai"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-white/[0.03] border border-white/10 rounded-lg p-3 mb-4 text-sm text-white placeholder-white/30 focus:border-neon-green outline-none"
          />

          <div className="flex justify-between items-center mb-1">
            <label className="text-xs text-white/50 uppercase tracking-wide">Password</label>
            {!isRegister && (
              <span className="text-xs text-cyan-blue cursor-pointer">Forgot password?</span>
            )}
          </div>
          <input
            type="password"
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-white/[0.03] border border-neon-green/50 rounded-lg p-3 mb-4 text-sm text-white placeholder-white/30 focus:border-neon-green outline-none"
          />

          {isRegister && (
            <>
              <label className="text-xs text-white/50 uppercase tracking-wide mb-1 block">Organization</label>
              <input
                type="text"
                placeholder="my-company"
                value={organizationId}
                onChange={(e) => setOrganizationId(e.target.value)}
                required
                className="w-full bg-white/[0.03] border border-white/10 rounded-lg p-3 mb-4 text-sm text-white placeholder-white/30 focus:border-neon-green outline-none"
              />
            </>
          )}

          {error && <p className="text-error text-sm mb-4">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-neon-green text-black font-medium py-3 rounded-lg mb-4 disabled:opacity-30 flex items-center justify-center gap-2"
          >
            {loading ? "Please wait..." : isRegister ? "Create Account" : "Sign In to Veyra"}
            {!loading && <span>→</span>}
          </button>

          <div className="text-center text-xs text-white/30 mb-4">OR</div>

          <button
            type="button"
            className="w-full border border-white/10 text-white/70 py-3 rounded-lg text-sm flex items-center justify-center gap-2"
          >
            ⚡ Send Magic Sign-In Link
          </button>
        </form>

        <button
          onClick={() => setIsRegister(!isRegister)}
          className="text-white/40 text-xs mt-6 hover:text-white block mx-auto"
        >
          {isRegister ? "Already have an account? Sign in" : "New here? Create an account"}
        </button>

        <p className="text-center text-[10px] text-white/20 mt-6">
          Protected by enterprise-grade encryption · UK/EU compliant
        </p>
      </div>
    </div>
  );
}