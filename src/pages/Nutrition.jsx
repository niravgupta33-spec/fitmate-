// Nutrition Tracker Page (Lectures 67-72: CRUD operations)
import { useState } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { useFitness } from '../context/FitnessContext';
import FormInput from '../components/common/FormInput';
import { formatDate } from '../utils/helpers';
import './Pages.css';

const Nutrition = () => {
  const { meals, addMeal, deleteMeal, todayStats, goals } = useFitness();
  const [form, setForm] = useState({ name: '', calories: '', protein: '', carbs: '', fat: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.calories) return;
    addMeal({
      name: form.name,
      calories: Number(form.calories),
      protein: Number(form.protein) || 0,
      carbs: Number(form.carbs) || 0,
      fat: Number(form.fat) || 0,
    });
    setForm({ name: '', calories: '', protein: '', carbs: '', fat: '' });
  };

  const calPercent = goals.dailyCalories ? Math.round((todayStats.calories / goals.dailyCalories) * 100) : 0;

  return (
    <div className="nutrition-page page-enter">
      <div className="container">
        <h1 className="section-title">Nutrition <span className="text-accent">Tracker</span></h1>
        <p className="section-subtitle">Log your meals and track daily macros.</p>

        {/* Today's Summary */}
        <div className="nutrition-summary">
          <div className="summary-card">
            <div className="summary-value" style={{ color: 'var(--color-accent)' }}>{todayStats.calories}</div>
            <div className="summary-label">Calories ({calPercent}%)</div>
          </div>
          <div className="summary-card">
            <div className="summary-value" style={{ color: 'var(--color-danger)' }}>{todayStats.protein}g</div>
            <div className="summary-label">Protein</div>
          </div>
          <div className="summary-card">
            <div className="summary-value" style={{ color: 'var(--color-info)' }}>{todayStats.carbs}g</div>
            <div className="summary-label">Carbs</div>
          </div>
          <div className="summary-card">
            <div className="summary-value" style={{ color: 'var(--color-warning)' }}>{todayStats.fat}g</div>
            <div className="summary-label">Fat</div>
          </div>
        </div>

        {/* Add Meal Form */}
        <form className="meal-form" onSubmit={handleSubmit}>
          <FormInput id="meal-name" label="Meal Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g., Grilled Chicken" />
          <FormInput id="meal-cal" label="Calories" type="number" value={form.calories} onChange={(e) => setForm({ ...form, calories: e.target.value })} placeholder="500" />
          <FormInput id="meal-pro" label="Protein (g)" type="number" value={form.protein} onChange={(e) => setForm({ ...form, protein: e.target.value })} placeholder="30" />
          <FormInput id="meal-carb" label="Carbs (g)" type="number" value={form.carbs} onChange={(e) => setForm({ ...form, carbs: e.target.value })} placeholder="50" />
          <FormInput id="meal-fat" label="Fat (g)" type="number" value={form.fat} onChange={(e) => setForm({ ...form, fat: e.target.value })} placeholder="15" />
          <button type="submit" className="btn btn-primary"><FiPlus /> Add</button>
        </form>

        {/* Meal List */}
        <h2 style={{ marginBottom: 'var(--space-lg)' }}>Recent Meals</h2>
        {meals.length === 0 ? (
          <div className="workout-empty"><p>No meals logged yet</p><span style={{ color: 'var(--color-text-muted)' }}>Add your first meal above!</span></div>
        ) : (
          <div className="meal-list">
            {meals.slice(0, 20).map((meal) => (
              <div key={meal.id} className="meal-item">
                <div className="meal-info">
                  <h4>{meal.name}</h4>
                  <span>{formatDate(meal.date)}</span>
                </div>
                <div className="meal-macros">
                  <span><strong>{meal.calories}</strong> cal</span>
                  <span><strong>{meal.protein}g</strong> P</span>
                  <span><strong>{meal.carbs}g</strong> C</span>
                  <span><strong>{meal.fat}g</strong> F</span>
                </div>
                <div className="meal-actions">
                  <button className="btn btn-ghost btn-sm" onClick={() => deleteMeal(meal.id)} aria-label="Delete meal" style={{ color: 'var(--color-danger)' }}>
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Nutrition;
