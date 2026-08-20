import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import "../styles/Profile.css";
import "../styles/forms.css";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    dailyCalorieTarget: user?.goals?.dailyCalorieTarget || 2000,
    weeklyWorkoutTarget: user?.goals?.weeklyWorkoutTarget || 5,
    dailyStepTarget: user?.goals?.dailyStepTarget || 10000,
    weightKg: user?.stats?.weightKg || "",
    heightCm: user?.stats?.heightCm || "",
    age: user?.stats?.age || "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      const { data } = await api.put("/users/profile", {
        name: form.name,
        email: form.email,
        goals: {
          dailyCalorieTarget: Number(form.dailyCalorieTarget),
          weeklyWorkoutTarget: Number(form.weeklyWorkoutTarget),
          dailyStepTarget: Number(form.dailyStepTarget),
        },
        stats: {
          weightKg: form.weightKg ? Number(form.weightKg) : undefined,
          heightCm: form.heightCm ? Number(form.heightCm) : undefined,
          age: form.age ? Number(form.age) : undefined,
        },
      });
      updateUser(data);
      setSaved(true);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't save profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <span className="eyebrow">Your account</span>
          <h1>Profile &amp; goals</h1>
        </div>
      </div>

      <div className="profile-grid">
        <div className="profile-card glass">
          <div className="profile-avatar-lg">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <h3>{user?.name}</h3>
          <p>{user?.email}</p>
        </div>

        <div className="profile-form-panel glass">
          {error && <div className="form-error" style={{ marginBottom: 16 }}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <p className="form-section-title">Account details</p>
            <div className="field-row">
              <div className="field">
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <p className="form-section-title">Weekly goals</p>
            <div className="field-row-3">
              <div className="field">
                <label htmlFor="dailyCalorieTarget">Daily calories</label>
                <input
                  id="dailyCalorieTarget"
                  name="dailyCalorieTarget"
                  type="number"
                  min="0"
                  value={form.dailyCalorieTarget}
                  onChange={handleChange}
                />
              </div>
              <div className="field">
                <label htmlFor="weeklyWorkoutTarget">Sessions / week</label>
                <input
                  id="weeklyWorkoutTarget"
                  name="weeklyWorkoutTarget"
                  type="number"
                  min="0"
                  value={form.weeklyWorkoutTarget}
                  onChange={handleChange}
                />
              </div>
              <div className="field">
                <label htmlFor="dailyStepTarget">Daily steps</label>
                <input
                  id="dailyStepTarget"
                  name="dailyStepTarget"
                  type="number"
                  min="0"
                  value={form.dailyStepTarget}
                  onChange={handleChange}
                />
              </div>
            </div>

            <p className="form-section-title">Body stats</p>
            <div className="field-row-3">
              <div className="field">
                <label htmlFor="weightKg">Weight (kg)</label>
                <input
                  id="weightKg"
                  name="weightKg"
                  type="number"
                  min="0"
                  value={form.weightKg}
                  onChange={handleChange}
                />
              </div>
              <div className="field">
                <label htmlFor="heightCm">Height (cm)</label>
                <input
                  id="heightCm"
                  name="heightCm"
                  type="number"
                  min="0"
                  value={form.heightCm}
                  onChange={handleChange}
                />
              </div>
              <div className="field">
                <label htmlFor="age">Age</label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  min="0"
                  value={form.age}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="save-row">
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? "Saving…" : "Save changes"}
              </button>
              {saved && <span className="save-confirm">Saved ✓</span>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
