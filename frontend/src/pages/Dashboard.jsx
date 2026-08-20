import { useEffect, useState, useCallback } from "react";
import { Flame, Footprints, Timer, Dumbbell, Apple, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import PulseRing from "../components/PulseRing";
import StatCard from "../components/StatCard";
import ActivityChart from "../components/ActivityChart";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/users/dashboard");
      setStats(data);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't load your dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const calorieTarget = user?.goals?.dailyCalorieTarget || 2000;
  const caloriesEaten = stats?.caloriesEatenToday || 0;
  const calorieProgress = Math.round((caloriesEaten / calorieTarget) * 100);

  const firstName = user?.name?.split(" ")[0] || "there";
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div>
      <div className="dash-header">
        <div className="dash-greeting">
          <span className="eyebrow">Your fitness journey starts here</span>
          <h1>
            {greeting}, {firstName}
          </h1>
          <p className="dash-date">
            {new Date().toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="dash-actions">
          <button
            className="btn btn-ghost"
            onClick={() => navigate("/nutrition")}
          >
            <Apple size={16} /> Log meal
          </button>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/workouts")}
          >
            <Plus size={16} /> Log workout
          </button>
        </div>
      </div>

      {error && <div className="form-error" style={{ marginBottom: 18 }}>{error}</div>}

      <div className="dash-grid">
        <div className="hero-card glass">
          <div className="hero-card-heading">
            <span className="eyebrow">Today's calories</span>
          </div>
          <PulseRing
            percent={loading ? 0 : calorieProgress}
            value={caloriesEaten}
            unit="kcal"
            label={`of ${calorieTarget} kcal goal`}
          />
          <p className="hero-card-sub">
            Burned today: <strong>{stats?.caloriesBurnedToday || 0} kcal</strong>
          </p>
        </div>

        <div className="stat-grid">
          <StatCard
            icon={Dumbbell}
            label="Workouts this week"
            value={stats?.weeklyWorkoutCount ?? "–"}
            accent="pulse"
          />
          <StatCard
            icon={Flame}
            label="Calories burned today"
            value={stats?.caloriesBurnedToday ?? "–"}
            unit="kcal"
            accent="ember"
          />
          <StatCard
            icon={Timer}
            label="Weekly goal"
            value={user?.goals?.weeklyWorkoutTarget ?? "–"}
            unit="sessions"
            accent="sage"
          />
          <StatCard
            icon={Footprints}
            label="Daily step target"
            value={(user?.goals?.dailyStepTarget ?? 0).toLocaleString()}
            accent="pulse"
          />
          <StatCard
            icon={Apple}
            label="Meals logged today"
            value={stats?.todaysMeals?.length ?? "–"}
            accent="ember"
          />
          <StatCard
            icon={Flame}
            label="Calories remaining"
            value={Math.max(calorieTarget - caloriesEaten, 0)}
            unit="kcal"
            accent="sage"
          />

          <div className="panel glass" style={{ gridColumn: "1 / -1" }}>
            <div className="panel-head">
              <div>
                <span className="eyebrow">This week</span>
                <h3>Active minutes by day</h3>
              </div>
            </div>
            <ActivityChart activityByDay={stats?.activityByDay} />
          </div>
        </div>
      </div>

      <div className="dash-lower-grid">
        <div className="panel glass">
          <div className="panel-head">
            <div>
              <span className="eyebrow">Recently logged</span>
              <h3>Latest workouts</h3>
            </div>
            <button className="link-btn" onClick={() => navigate("/workouts")}>
              View all
            </button>
          </div>
          <div className="mini-list">
            {!stats?.recentWorkouts?.length && (
              <p className="mini-empty">
                No workouts logged this week yet. Log your first session to
                fill your pulse ring.
              </p>
            )}
            {stats?.recentWorkouts?.map((w) => (
              <div className="mini-row" key={w._id}>
                <span className="mini-row-icon">
                  <Dumbbell size={16} />
                </span>
                <div className="mini-row-body">
                  <p className="mini-row-title">{w.title}</p>
                  <p className="mini-row-meta">
                    {w.category} · {w.durationMin} min ·{" "}
                    {new Date(w.date).toLocaleDateString(undefined, {
                      weekday: "short",
                    })}
                  </p>
                </div>
                <span className="mini-row-value mono">
                  {w.caloriesBurned} kcal
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel glass">
          <div className="panel-head">
            <div>
              <span className="eyebrow">Today</span>
              <h3>Meals</h3>
            </div>
            <button className="link-btn" onClick={() => navigate("/nutrition")}>
              View all
            </button>
          </div>
          <div className="mini-list">
            {!stats?.todaysMeals?.length && (
              <p className="mini-empty">
                Nothing logged today. Add a meal to track your macros.
              </p>
            )}
            {stats?.todaysMeals?.map((m) => (
              <div className="mini-row" key={m._id}>
                <span className="mini-row-icon ember">
                  <Apple size={16} />
                </span>
                <div className="mini-row-body">
                  <p className="mini-row-title">{m.mealName}</p>
                  <p className="mini-row-meta">{m.mealType}</p>
                </div>
                <span className="mini-row-value mono">{m.calories} kcal</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
