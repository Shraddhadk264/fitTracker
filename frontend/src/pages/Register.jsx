import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Activity } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "../styles/Auth.css";
import "../styles/forms.css";

const Register = () => {
  const { register, authError, authLoading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await register(form.name, form.email, form.password);
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
          <span className="eyebrow">Join 24,000+ athletes</span>
          <h1>One dashboard for lifting, running, and eating well.</h1>
          <p>
            Set weekly goals, log workouts in seconds, and watch your weekly
            pulse ring fill up as you show up for yourself.
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
            stroke="url(#lineGradient2)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <defs>
            <linearGradient id="lineGradient2" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3ddc97" />
              <stop offset="100%" stopColor="#ff6b4a" />
            </linearGradient>
          </defs>
        </svg>
      </section>

      <section className="auth-form-side">
        <div className="auth-card glass">
          <span className="eyebrow">Get started</span>
          <h2>Create your account</h2>
          <p className="auth-subtitle">
            Free to use. Set it up in under a minute.
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            {authError && <div className="form-error">{authError}</div>}

            <div className="field">
              <label htmlFor="name">Full name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Alex Rivera"
              />
            </div>

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
                minLength={6}
                autoComplete="new-password"
                value={form.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={authLoading}
            >
              {authLoading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="auth-switch">
            Already training with us? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </section>
    </div>
  );
};

export default Register;
