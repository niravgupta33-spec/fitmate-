// Workout Planner Page — Plan today's workout by selecting exercises
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiTrash2, FiCheck, FiCheckCircle, FiSearch, FiX, FiChevronDown, FiChevronUp, FiClock, FiTarget } from 'react-icons/fi';
import { fetchExercises, fetchExerciseCategories } from '../services/api';
import { useDebounce } from '../hooks/useDebounce';
import { useFitness } from '../context/FitnessContext';
import { capitalizeFirst } from '../utils/helpers';
import Loader from '../components/common/Loader';
import Dropdown from '../components/common/Dropdown';
import './Workouts.css';

const WorkoutPlanner = () => {
  const navigate = useNavigate();
  const { workoutPlans, addToPlan, removeFromPlan, togglePlanComplete, updatePlanItem, clearPlan } = useFitness();

  // Exercise browser state
  const [showBrowser, setShowBrowser] = useState(false);
  const [exercises, setExercises] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const debouncedSearch = useDebounce(searchTerm, 400);

  // Today's plan
  const todayPlan = useMemo(() => {
    const today = new Date().toDateString();
    return workoutPlans.filter(p => new Date(p.date).toDateString() === today);
  }, [workoutPlans]);

  const completedCount = todayPlan.filter(p => p.completed).length;
  const progressPercent = todayPlan.length > 0 ? Math.round((completedCount / todayPlan.length) * 100) : 0;

  // Fetch categories
  useEffect(() => {
    fetchExerciseCategories().then(setCategories).catch(() => {});
  }, []);

  // Fetch exercises when browser is open
  useEffect(() => {
    if (!showBrowser) return;
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchExercises(page, 20, filterCat || undefined);
        setExercises(data.results);
        setTotalPages(data.totalPages);
      } catch {
        setExercises([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [showBrowser, page, filterCat]);

  useEffect(() => { setPage(1); }, [filterCat, debouncedSearch]);

  const categoryOptions = useMemo(() => [
    { value: '', label: 'All Categories' },
    ...categories.map((c) => ({ value: c.id.toString(), label: c.name })),
  ], [categories]);

  // Client-side search filter
  const filteredExercises = useMemo(() => {
    if (!debouncedSearch) return exercises;
    const term = debouncedSearch.toLowerCase();
    return exercises.filter(e =>
      (e.name && e.name.toLowerCase().includes(term))
    );
  }, [exercises, debouncedSearch]);

  // Check if exercise already in today's plan
  const isInPlan = useCallback((exerciseId) => {
    return todayPlan.some(p => p.exerciseId === exerciseId);
  }, [todayPlan]);

  const handleAddExercise = (ex) => {
    addToPlan(ex);
  };

  return (
    <div className="workouts-page page-enter">
      <div className="container">
        <h1 className="section-title">
          Today's <span className="text-accent">Workout Plan</span>
        </h1>
        <p className="section-subtitle">
          Build your workout — add exercises, set your reps & sets, and check them off as you go.
        </p>

        {/* Progress Bar */}
        {todayPlan.length > 0 && (
          <div className="planner-progress-wrapper">
            <div className="planner-progress-info">
              <span><FiTarget style={{ marginRight: 4 }} /> {completedCount} / {todayPlan.length} exercises completed</span>
              <span className="planner-progress-pct">{progressPercent}%</span>
            </div>
            <div className="planner-progress-bar">
              <div
                className="planner-progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            {progressPercent === 100 && (
              <p className="planner-complete-msg">Workout complete! Great job! 💪</p>
            )}
          </div>
        )}

        {/* Today's Plan List */}
        <div className="planner-list">
          {todayPlan.length === 0 ? (
            <div className="planner-empty">
              <FiClock style={{ fontSize: '2.5rem', marginBottom: 'var(--space-md)', opacity: 0.4 }} />
              <p>No exercises planned for today</p>
              <span>Click "Add Exercises" to build your workout</span>
            </div>
          ) : (
            todayPlan.map((item, index) => (
              <div key={item.id} className={`planner-item ${item.completed ? 'completed' : ''}`}>
                <div className="planner-item-left">
                  <button
                    className={`planner-check-btn ${item.completed ? 'checked' : ''}`}
                    onClick={() => togglePlanComplete(item.id)}
                    aria-label={item.completed ? 'Mark incomplete' : 'Mark complete'}
                  >
                    {item.completed ? <FiCheckCircle /> : <span className="planner-check-empty" />}
                  </button>
                  <div className="planner-item-info">
                    <span className="planner-item-index">{index + 1}</span>
                    <div>
                      <h4
                        className="planner-item-name"
                        onClick={() => navigate(`/workouts/${item.exerciseId}`)}
                      >
                        {capitalizeFirst(item.name)}
                      </h4>
                      {item.category && <span className="planner-item-cat">{item.category}</span>}
                    </div>
                  </div>
                </div>
                <div className="planner-item-right">
                  <div className="planner-input-group">
                    <label>Sets</label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={item.sets}
                      onChange={(e) => updatePlanItem(item.id, { sets: parseInt(e.target.value) || 1 })}
                    />
                  </div>
                  <span className="planner-x">×</span>
                  <div className="planner-input-group">
                    <label>Reps</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={item.reps}
                      onChange={(e) => updatePlanItem(item.id, { reps: parseInt(e.target.value) || 1 })}
                    />
                  </div>
                  <button
                    className="planner-remove-btn"
                    onClick={() => removeFromPlan(item.id)}
                    aria-label="Remove exercise"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Action Buttons */}
        <div className="planner-actions">
          <button
            className="btn btn-primary"
            onClick={() => setShowBrowser(!showBrowser)}
          >
            {showBrowser ? <><FiX style={{ marginRight: 4 }} /> Close Browser</> : <><FiPlus style={{ marginRight: 4 }} /> Add Exercises</>}
          </button>
          {todayPlan.length > 0 && (
            <button className="btn btn-ghost" onClick={() => clearPlan()}>
              <FiTrash2 style={{ marginRight: 4 }} /> Clear Plan
            </button>
          )}
        </div>

        {/* Exercise Browser */}
        {showBrowser && (
          <div className="planner-browser">
            <h2 className="planner-browser-title">
              <FiSearch style={{ marginRight: 8 }} /> Browse Exercises
            </h2>

            <div className="planner-browser-filters">
              <div className="planner-search-box">
                <FiSearch className="planner-search-icon" />
                <input
                  type="text"
                  placeholder="Search exercises..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Dropdown label="Category" options={categoryOptions} value={filterCat} onChange={setFilterCat} />
            </div>

            {loading ? (
              <Loader />
            ) : filteredExercises.length === 0 ? (
              <div className="planner-empty" style={{ padding: 'var(--space-2xl)' }}>
                <p>No exercises found</p>
              </div>
            ) : (
              <div className="planner-browser-grid">
                {filteredExercises.map((ex) => {
                  const alreadyAdded = isInPlan(ex.id);
                  const catName = typeof ex.category === 'object' ? ex.category?.name : null;
                  return (
                    <div key={ex.id} className={`planner-browser-card ${alreadyAdded ? 'added' : ''}`}>
                      <div className="planner-browser-card-body">
                        <h4>{capitalizeFirst(ex.name)}</h4>
                        {catName && <span className="badge badge-accent" style={{ fontSize: '0.65rem' }}>{catName}</span>}
                      </div>
                      <button
                        className={`planner-add-btn ${alreadyAdded ? 'added' : ''}`}
                        onClick={() => !alreadyAdded && handleAddExercise(ex)}
                        disabled={alreadyAdded}
                      >
                        {alreadyAdded ? <><FiCheck /> Added</> : <><FiPlus /> Add</>}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Simple pagination */}
            {totalPages > 1 && (
              <div className="planner-pagination">
                <button
                  className="btn btn-ghost btn-sm"
                  disabled={page <= 1}
                  onClick={() => setPage(p => p - 1)}
                >
                  Previous
                </button>
                <span className="planner-page-info">Page {page} of {totalPages}</span>
                <button
                  className="btn btn-ghost btn-sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => p + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutPlanner;
