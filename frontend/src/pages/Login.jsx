import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Activity } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "../styles/Auth.css";
import "../styles/forms.css";

const Login = () => {
  const { login, authError, authLoading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await login(form.email, form.password);
    if (ok) navigate("/");
  };

  return (
    <div className="auth-screen">
      <section className="auth-showcase">
        <div className="auth-showcase-brand">
          <span className="brand-mark">
            <Activity size={20} strokeWidth={2.4} />
          </span>
          <span className="brand-name">FitPulse</span>
        </div>

        <div className="auth-showcase-copy">
          <span className="eyebrow">Your fitness journey starts here</span>
          <h1>Train with intent. Track with precision.</h1>
          <p>
            Log every rep, meal, and mile in one glassy dashboard built for
            people who take their progress seriously.
          </p>
        </div>

        <svg
          className="auth-heartbeat"
          viewBox="0 0 400 60"
          preserveAspectRatio="none"
        >
          <polyline
            points="0,30 60,30 80,10 100,50 120,30 160,30 180,5 200,55 220,30 400,30"
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3ddc97" />
              <stop offset="100%" stopColor="#ff6b4a" />
            </linearGradient>
          </defs>
        </svg>
      </section>

      <section className="auth-form-side">
        <div className="auth-card glass">
          <span className="eyebrow">Welcome back</span>
          <h2>Sign in</h2>
          <p className="auth-subtitle">
            Pick up right where your last session left off.
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            {authError && <div className="form-error">{authError}</div>}

            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
              />
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={authLoading}
            >
              {authLoading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="auth-switch">
            New to FitPulse? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </section>
    </div>
  );
};

export default Login;
