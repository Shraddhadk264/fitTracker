import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutGrid,
  Dumbbell,
  Apple,
  UserRound,
  LogOut,
  Activity,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "../styles/AppLayout.css";

const navItems = [
  { to: "/", label: "Overview", icon: LayoutGrid, end: true },
  { to: "/workouts", label: "Workouts", icon: Dumbbell },
  { to: "/nutrition", label: "Nutrition", icon: Apple },
  { to: "/profile", label: "Profile", icon: UserRound },
];

const AppLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-mark">
            <Activity size={20} strokeWidth={2.4} />
          </span>
          <span className="brand-name">FitPulse</span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                "nav-item" + (isActive ? " nav-item-active" : "")
              }
            >
              <Icon size={18} strokeWidth={2} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="sidebar-user-meta">
              <p className="sidebar-user-name">{user?.name}</p>
              <p className="sidebar-user-email">{user?.email}</p>
            </div>
          </div>
          <button className="logout-btn" onClick={logout}>
            <LogOut size={16} strokeWidth={2} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
