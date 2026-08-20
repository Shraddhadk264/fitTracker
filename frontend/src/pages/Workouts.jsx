import { useEffect, useState, useCallback } from "react";
import {
  Plus,
  Dumbbell,
  Clock,
  Flame,
  Check,
  Pencil,
  Trash2,
} from "lucide-react";
import api from "../api/axios";
import Modal from "../components/Modal";
import "../styles/Workouts.css";
import "../styles/forms.css";

const CATEGORIES = ["Strength", "HIIT", "Cardio", "Core", "Yoga", "Mobility"];
const INTENSITIES = ["Beginner", "Intermediate", "Advanced"];

const emptyForm = {
  title: "",
  category: "Strength",
  intensity: "Intermediate",
  durationMin: 30,
  caloriesBurned: 200,
  exercises: [],
};

const emptyExercise = { name: "", sets: 3, reps: 10, weightKg: 0 };

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/workouts");
      setWorkouts(data);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't load workouts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setModalOpen(true);
  };

  const openEdit = (w) => {
    setForm({
      title: w.title,
      category: w.category,
      intensity: w.intensity,
      durationMin: w.durationMin,
      caloriesBurned: w.caloriesBurned,
      exercises: w.exercises || [],
    });
    setEditingId(w._id);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this workout?")) return;
    try {
      await api.delete(`/workouts/${id}`);
      setWorkouts((prev) => prev.filter((w) => w._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Couldn't delete workout");
    }
  };

  const toggleComplete = async (w) => {
    try {
      const { data } = await api.put(`/workouts/${w._id}`, {
        completed: !w.completed,
      });
      setWorkouts((prev) =>
        prev.map((item) => (item._id === w._id ? data : item))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Couldn't update workout");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        durationMin: Number(form.durationMin),
        caloriesBurned: Number(form.caloriesBurned),
        exercises: form.exercises
          .filter((ex) => ex.name.trim())
          .map((ex) => ({
            ...ex,
            sets: Number(ex.sets),
            reps: Number(ex.reps),
            weightKg: Number(ex.weightKg),
          })),
      };

      if (editingId) {
        const { data } = await api.put(`/workouts/${editingId}`, payload);
        setWorkouts((prev) =>
          prev.map((w) => (w._id === editingId ? data : w))
        );
      } else {
        const { data } = await api.post("/workouts", payload);
        setWorkouts((prev) => [data, ...prev]);
      }
      setModalOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || "Couldn't save workout");
    } finally {
      setSaving(false);
    }
  };

  const updateExercise = (index, field, value) => {
    setForm((f) => {
      const exercises = [...f.exercises];
      exercises[index] = { ...exercises[index], [field]: value };
      return { ...f, exercises };
    });
  };

  const addExerciseRow = () => {
    setForm((f) => ({
      ...f,
      exercises: [...f.exercises, { ...emptyExercise }],
    }));
  };

  const removeExerciseRow = (index) => {
    setForm((f) => ({
      ...f,
      exercises: f.exercises.filter((_, i) => i !== index),
    }));
  };

  const filtered =
    filter === "All" ? workouts : workouts.filter((w) => w.category === filter);

  return (
    <div>
      <div className="page-header">
        <div>
          <span className="eyebrow">Full body strength &amp; more</span>
          <h1>Workouts</h1>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={16} /> Log workout
        </button>
      </div>

      <div className="filter-row">
        {["All", ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            className={"filter-chip" + (filter === cat ? " active" : "")}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {error && <div className="form-error" style={{ marginBottom: 18 }}>{error}</div>}

      {!loading && filtered.length === 0 && (
        <div className="empty-state glass">
          <h3>No workouts here yet</h3>
          <p>Log your first session and start filling your weekly pulse ring.</p>
        </div>
      )}

      <div className="card-grid">
        {filtered.map((w) => (
          <div className="workout-card glass" key={w._id}>
            <div
              className={
                "workout-card-top cat-" + w.category.toLowerCase()
              }
            >
              <span className="workout-card-badge">{w.intensity}</span>
              <button
                className={
                  "workout-card-check" + (w.completed ? " done" : "")
                }
                onClick={() => toggleComplete(w)}
                title={w.completed ? "Mark as not done" : "Mark as done"}
              >
                <Check size={16} strokeWidth={2.5} />
              </button>
              <Dumbbell size={40} className="workout-card-icon" />
            </div>
            <div className="workout-card-body">
              <p className="workout-card-title">{w.title}</p>
              <div className="workout-card-meta">
                <span>
                  <Clock size={13} /> {w.durationMin} min
                </span>
                <span>
                  <Flame size={13} /> {w.caloriesBurned} kcal
                </span>
              </div>
              {w.exercises?.length > 0 && (
                <p className="workout-card-exercises">
                  {w.exercises.map((ex) => ex.name).join(" · ")}
                </p>
              )}
              <div className="workout-card-actions">
                <button className="icon-btn" onClick={() => openEdit(w)}>
                  <Pencil size={14} />
                </button>
                <button
                  className="icon-btn danger"
                  onClick={() => handleDelete(w._id)}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Edit workout" : "Log a workout"}
      >
        <form className="modal-body" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="title">Workout name</label>
            <input
              id="title"
              required
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Full Body Strength"
            />
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value }))
                }
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="intensity">Intensity</label>
              <select
                id="intensity"
                value={form.intensity}
                onChange={(e) =>
                  setForm((f) => ({ ...f, intensity: e.target.value }))
                }
              >
                {INTENSITIES.map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="duration">Duration (min)</label>
              <input
                id="duration"
                type="number"
                min="0"
                value={form.durationMin}
                onChange={(e) =>
                  setForm((f) => ({ ...f, durationMin: e.target.value }))
                }
              />
            </div>
            <div className="field">
              <label htmlFor="calories">Calories burned</label>
              <input
                id="calories"
                type="number"
                min="0"
                value={form.caloriesBurned}
                onChange={(e) =>
                  setForm((f) => ({ ...f, caloriesBurned: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="field">
            <label>Exercises</label>
            {form.exercises.map((ex, i) => (
              <div className="exercise-row" key={i} style={{ marginBottom: 8 }}>
                <input
                  placeholder="Goblet squat"
                  value={ex.name}
                  onChange={(e) => updateExercise(i, "name", e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Sets"
                  value={ex.sets}
                  onChange={(e) => updateExercise(i, "sets", e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Reps"
                  value={ex.reps}
                  onChange={(e) => updateExercise(i, "reps", e.target.value)}
                />
                <input
                  type="number"
                  placeholder="kg"
                  value={ex.weightKg}
                  onChange={(e) =>
                    updateExercise(i, "weightKg", e.target.value)
                  }
                />
                <button
                  type="button"
                  className="icon-btn danger"
                  onClick={() => removeExerciseRow(i)}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-ghost"
              style={{ marginTop: 6 }}
              onClick={addExerciseRow}
            >
              <Plus size={14} /> Add exercise
            </button>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={saving}
          >
            {saving ? "Saving…" : editingId ? "Save changes" : "Log workout"}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Workouts;
