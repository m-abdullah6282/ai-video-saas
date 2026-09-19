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
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-sm bg-white/[0.03] border border-white/10 rounded-xl p-8">
        <h1 className="text-2xl font-display font-semibold mb-1 text-white">
          {isRegister ? "Create Account" : "Sign In"}
        </h1>
        <p className="text-white/50 mb-6 text-sm">AI Video SaaS</p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-white/[0.03] border border-white/10 rounded-lg p-3 mb-3 text-white placeholder-white/30 focus:border-neon-green outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-white/[0.03] border border-white/10 rounded-lg p-3 mb-3 text-white placeholder-white/30 focus:border-neon-green outline-none"
          />

          {isRegister && (
            <input
              type="text"
              placeholder="Organization Name (e.g. my-company)"
              value={organizationId}
              onChange={(e) => setOrganizationId(e.target.value)}
              required
              className="w-full bg-white/[0.03] border border-white/10 rounded-lg p-3 mb-4 text-white placeholder-white/30 focus:border-neon-green outline-none"
            />
          )}

          {error && <p className="text-error text-sm mb-4">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-neon-green text-black font-medium py-3 rounded-lg disabled:opacity-30"
          >
            {loading ? "Please wait..." : isRegister ? "Create Account" : "Sign In"}
          </button>
        </form>

        <button
          onClick={() => setIsRegister(!isRegister)}
          className="text-white/50 text-sm mt-4 hover:text-white"
        >
          {isRegister ? "Already have an account? Sign in" : "New here? Create an account"}
        </button>
      </div>
    </div>
  );
}