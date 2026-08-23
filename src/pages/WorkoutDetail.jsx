// Workout Detail Page (Lectures 37-42: Dynamic routes with params)
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiBookmark } from 'react-icons/fi';
import { fetchExerciseById } from '../services/api';
import { useFitness } from '../context/FitnessContext';
import Loader from '../components/common/Loader';
import { capitalizeFirst } from '../utils/helpers';
import './Workouts.css';

const WorkoutDetail = () => {
  const { id } = useParams();
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toggleBookmark, isBookmarked } = useFitness();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchExerciseById(id);
        setExercise(data);
      } catch {
        setError('Exercise not found.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <Loader fullPage />;
  if (error) return (
    <div className="workout-detail page-enter">
      <div className="container" style={{ textAlign: 'center', paddingTop: 'var(--space-4xl)' }}>
        <p style={{ fontSize: 'var(--fs-xl)', marginBottom: 'var(--space-lg)' }}>😕 {error}</p>
        <Link to="/workouts" className="btn btn-primary"><FiArrowLeft /> Back to Workouts</Link>
      </div>
    </div>
  );

  const stripHTML = (html) => {
    if (!html) return 'No description available.';
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || 'No description available.';
  };

  return (
    <div className="workout-detail page-enter">
      <div className="container">
        <Link to="/workouts" className="btn btn-ghost" style={{ marginBottom: 'var(--space-lg)' }}><FiArrowLeft /> Back to Workouts</Link>

        <div className="workout-detail-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
            <h1>{capitalizeFirst(exercise?.name) || 'Exercise'}</h1>
            <button
              className={`bookmark-btn ${isBookmarked(Number(id)) ? 'active' : ''}`}
              onClick={() => toggleBookmark(Number(id))}
              style={{ fontSize: '1.5rem' }}
              aria-label="Toggle bookmark"
            >
              <FiBookmark fill={isBookmarked(Number(id)) ? 'currentColor' : 'none'} />
            </button>
          </div>
          <div className="workout-detail-meta">
            {exercise?.category?.name && <span className="badge badge-accent">{exercise.category.name}</span>}
            <span className="badge badge-secondary">ID #{id}</span>
          </div>
        </div>

        <div className="workout-detail-body">
          <div className="card">
            <h3 style={{ marginBottom: 'var(--space-md)' }}>Description</h3>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
              {stripHTML(exercise?.description)}
            </p>
          </div>
          <div>
            {exercise?.muscles?.length > 0 && (
              <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
                <h3>Primary Muscles</h3>
                <div className="muscle-list">
                  {exercise.muscles.map((m) => (
                    <span key={m.id} className="badge badge-accent">{m.name_en || m.name}</span>
                  ))}
                </div>
              </div>
            )}
            {exercise?.muscles_secondary?.length > 0 && (
              <div className="card">
                <h3>Secondary Muscles</h3>
                <div className="muscle-list">
                  {exercise.muscles_secondary.map((m) => (
                    <span key={m.id} className="badge badge-secondary">{m.name_en || m.name}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutDetail;
