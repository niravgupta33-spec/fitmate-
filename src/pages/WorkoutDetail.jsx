// Workout Detail Page (Lectures 37-42: Dynamic routes with params)
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiBookmark } from 'react-icons/fi';
import { fetchExerciseById } from '../services/api';
import { useFitness } from '../context/FitnessContext';
import Loader from '../components/common/Loader';
import { capitalizeFirst } from '../utils/helpers';
import AnatomicalTargetMap from '../components/common/AnatomicalTargetMap';
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

  const getDescription = (html, exerciseName, categoryName) => {
    const fallbackText = `${exerciseName ? capitalizeFirst(exerciseName) : 'This exercise'} is an effective${categoryName ? ` ${categoryName.toLowerCase()}` : ''} movement designed to build strength, improve endurance, and enhance overall fitness. Focus on maintaining proper form and controlled motions to maximize results and minimize the risk of injury. Incorporate this into your regular workout routine for optimal benefits.`;
    
    if (!html || html.trim() === '') return fallbackText;
    
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    const text = tmp.textContent || tmp.innerText || '';
    
    return text.trim().length < 10 ? fallbackText : text;
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
              {getDescription(exercise?.description, exercise?.name, exercise?.category?.name)}
            </p>
          </div>
          <div>
            <div className="card" style={{ marginBottom: 'var(--space-lg)', overflow: 'hidden', padding: 0 }}>
              <AnatomicalTargetMap
                category={exercise?.category}
                muscles={exercise?.muscles || []}
                secondaryMuscles={exercise?.muscles_secondary || []}
              />
            </div>

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
