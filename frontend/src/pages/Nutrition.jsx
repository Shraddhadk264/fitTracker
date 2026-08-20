import { useEffect, useState, useCallback } from "react";
import { Plus, Apple, Trash2, Pencil, Flame } from "lucide-react";
import api from "../api/axios";
import Modal from "../components/Modal";
import StatCard from "../components/StatCard";
import "../styles/Nutrition.css";
import "../styles/forms.css";

const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snack"];

const emptyForm = {
  mealName: "",
  mealType: "Breakfast",
  calories: 300,
  carbsG: 30,
  proteinG: 20,
  fatsG: 10,
};

const todayISO = () => new Date().toISOString().slice(0, 10);

const Nutrition = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [date, setDate] = useState(todayISO());
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async (forDate) => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/nutrition", {
        params: { date: forDate },
      });
      setEntries(data);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't load meals");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(date);
  }, [date, load]);

  const totals = entries.reduce(
    (acc, e) => ({
      calories: acc.calories + (e.calories || 0),
      carbs: acc.carbs + (e.macros?.carbsG || 0),
      protein: acc.protein + (e.macros?.proteinG || 0),
      fats: acc.fats + (e.macros?.fatsG || 0),
    }),
    { calories: 0, carbs: 0, protein: 0, fats: 0 }
  );

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setModalOpen(true);
  };

  const openEdit = (entry) => {
    setForm({
      mealName: entry.mealName,
      mealType: entry.mealType,
      calories: entry.calories,
      carbsG: entry.macros?.carbsG || 0,
      proteinG: entry.macros?.proteinG || 0,
      fatsG: entry.macros?.fatsG || 0,
    });
    setEditingId(entry._id);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this meal entry?")) return;
    try {
      await api.delete(`/nutrition/${id}`);
      setEntries((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Couldn't delete entry");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        mealName: form.mealName,
        mealType: form.mealType,
        calories: Number(form.calories),
        macros: {
          carbsG: Number(form.carbsG),
          proteinG: Number(form.proteinG),
          fatsG: Number(form.fatsG),
        },
        date,
      };

      if (editingId) {
        const { data } = await api.put(`/nutrition/${editingId}`, payload);
        setEntries((prev) =>
          prev.map((item) => (item._id === editingId ? data : item))
        );
      } else {
        const { data } = await api.post("/nutrition", payload);
        setEntries((prev) => [data, ...prev]);
      }
      setModalOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || "Couldn't save meal");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <span className="eyebrow">Fuel the work</span>
          <h1>Nutrition</h1>
        </div>
        <div className="date-picker">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <button className="btn btn-primary" onClick={openCreate}>
            <Plus size={16} /> Log meal
          </button>
        </div>
      </div>

      {error && <div className="form-error" style={{ marginBottom: 18 }}>{error}</div>}

      <div className="macro-summary">
        <StatCard icon={Flame} label="Calories" value={totals.calories} unit="kcal" accent="ember" />
        <StatCard icon={Apple} label="Carbs" value={totals.carbs} unit="g" accent="pulse" />
        <StatCard icon={Apple} label="Protein" value={totals.protein} unit="g" accent="sage" />
        <StatCard icon={Apple} label="Fats" value={totals.fats} unit="g" accent="ember" />
      </div>

      {!loading && entries.length === 0 && (
        <div className="empty-state glass">
          <h3>No meals logged for this day</h3>
          <p>Add breakfast, lunch, dinner, or a snack to see your macros.</p>
        </div>
      )}

      <div className="meal-list">
        {entries.map((entry) => (
          <div className="meal-row glass" key={entry._id}>
            <span className="meal-row-icon">
              <Apple size={18} />
            </span>
            <div className="meal-row-body">
              <p className="meal-row-title">{entry.mealName}</p>
              <p className="meal-row-meta">{entry.mealType}</p>
              <div className="meal-row-macros">
                <span>C {entry.macros?.carbsG || 0}g</span>
                <span>P {entry.macros?.proteinG || 0}g</span>
                <span>F {entry.macros?.fatsG || 0}g</span>
              </div>
            </div>
            <span className="meal-row-cals mono">{entry.calories} kcal</span>
            <div className="meal-row-actions">
              <button className="icon-btn" onClick={() => openEdit(entry)}>
                <Pencil size={14} />
              </button>
              <button
                className="icon-btn danger"
                onClick={() => handleDelete(entry._id)}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Edit meal" : "Log a meal"}
      >
        <form className="modal-body" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="mealName">Meal name</label>
            <input
              id="mealName"
              required
              value={form.mealName}
              onChange={(e) =>
                setForm((f) => ({ ...f, mealName: e.target.value }))
              }
              placeholder="Grilled chicken salad"
            />
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="mealType">Meal type</label>
              <select
                id="mealType"
                value={form.mealType}
                onChange={(e) =>
                  setForm((f) => ({ ...f, mealType: e.target.value }))
                }
              >
                {MEAL_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="calories">Calories</label>
              <input
                id="calories"
                type="number"
                min="0"
                value={form.calories}
                onChange={(e) =>
                  setForm((f) => ({ ...f, calories: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="field-row-3">
            <div className="field">
              <label htmlFor="carbs">Carbs (g)</label>
              <input
                id="carbs"
                type="number"
                min="0"
                value={form.carbsG}
                onChange={(e) =>
                  setForm((f) => ({ ...f, carbsG: e.target.value }))
                }
              />
            </div>
            <div className="field">
              <label htmlFor="protein">Protein (g)</label>
              <input
                id="protein"
                type="number"
                min="0"
                value={form.proteinG}
                onChange={(e) =>
                  setForm((f) => ({ ...f, proteinG: e.target.value }))
                }
              />
            </div>
            <div className="field">
              <label htmlFor="fats">Fats (g)</label>
              <input
                id="fats"
                type="number"
                min="0"
                value={form.fatsG}
                onChange={(e) =>
                  setForm((f) => ({ ...f, fatsG: e.target.value }))
                }
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={saving}
          >
            {saving ? "Saving…" : editingId ? "Save changes" : "Log meal"}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Nutrition;
