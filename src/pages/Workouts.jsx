// Workouts Page (Lectures 61-66: Search/Filter/Sort, 67-72: API + Pagination + Debounce)
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiBookmark, FiSearch, FiActivity, FiCalendar } from 'react-icons/fi';
import { fetchExercises, fetchExerciseCategories } from '../services/api';
import { useDebounce } from '../hooks/useDebounce';
import { useFitness } from '../context/FitnessContext';
import SearchBar from '../components/common/SearchBar';
import Dropdown from '../components/common/Dropdown';
import Pagination from '../components/common/Pagination';
import Loader from '../components/common/Loader';
import { capitalizeFirst, truncateText } from '../utils/helpers';
import AnatomicalTargetMap from '../components/common/AnatomicalTargetMap';
import './Workouts.css';


const sortOptions = [
  { value: 'name-asc', label: 'Name A-Z' },
  { value: 'name-desc', label: 'Name Z-A' },
  { value: 'id-asc', label: 'Oldest First' },
  { value: 'id-desc', label: 'Newest First' },
];

const Workouts = () => {
  const [exercises, setExercises] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');
  const [filterCat, setFilterCat] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const { toggleBookmark, isBookmarked } = useFitness();

  const debouncedSearch = useDebounce(searchTerm, 400);

  // Fetch categories once
  useEffect(() => {
    fetchExerciseCategories().then(setCategories).catch(() => {});
  }, []);

  // Reset page when filter/search changes
  useEffect(() => {
    setPage(1);
  }, [filterCat, debouncedSearch]);

  // Fetch exercises
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchExercises(page, 20, filterCat || undefined);
        setExercises(data.results);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError('Failed to load exercises. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [page, filterCat]);

  // Category options for dropdown
  const categoryOptions = useMemo(() => [
    { value: '', label: 'All Categories' },
    ...categories.map((c) => ({ value: c.id.toString(), label: c.name })),
  ], [categories]);

  // Filtered + sorted exercises (client-side for current page)
  const filteredExercises = useMemo(() => {
    let filtered = [...exercises];

    // Search filter (debounced)
    if (debouncedSearch) {
      const term = debouncedSearch.toLowerCase();
      filtered = filtered.filter((e) =>
        (e.name && e.name.toLowerCase().includes(term)) ||
        (e.description && e.description.toLowerCase().includes(term))
      );
    }

    // Category filter (category is an object with id property from exerciseinfo endpoint)
    if (filterCat) {
      filtered = filtered.filter((e) => {
        const catId = typeof e.category === 'object' ? e.category?.id : e.category;
        return catId?.toString() === filterCat;
      });
    }

    // Sort
    const [field, dir] = sortBy.split('-');
    filtered.sort((a, b) => {
      const valA = field === 'name' ? (a.name || '').toLowerCase() : a.id;
      const valB = field === 'name' ? (b.name || '').toLowerCase() : b.id;
      if (valA < valB) return dir === 'asc' ? -1 : 1;
      if (valA > valB) return dir === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [exercises, debouncedSearch, filterCat, sortBy]);

  const stripHTML = (html) => {
    if (!html) return '';
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  return (
    <div className="workouts-page page-enter">
      <div className="container">
        <h1 className="section-title">
          Workout <span className="text-accent">Library</span>
        </h1>
        <p className="section-subtitle">Browse, search, and bookmark exercises from our database.</p>

        <div style={{ marginBottom: 'var(--space-xl)' }}>
          <Link to="/workouts/planner" className="btn btn-primary">
            <FiCalendar style={{ marginRight: 6 }} /> Plan Today's Workout
          </Link>
        </div>

        <div className="workouts-header">
          <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search exercises..." />
          <div className="workouts-filters">
            <Dropdown label="Category" options={categoryOptions} value={filterCat} onChange={setFilterCat} />
            <Dropdown label="Sort" options={sortOptions} value={sortBy} onChange={setSortBy} />
          </div>
        </div>

        {loading ? (
          <Loader />
        ) : error ? (
          <div className="workout-empty">
            <p>⚠️ {error}</p>
            <button className="btn btn-primary" onClick={() => setPage(1)}>Retry</button>
          </div>
        ) : filteredExercises.length === 0 ? (
          <div className="workout-empty">
            <p>No exercises found</p>
            <span style={{ color: 'var(--color-text-muted)' }}>Try a different search or filter</span>
          </div>
        ) : (
          <>
            <div className="workouts-grid">
              {filteredExercises.map((ex) => {
                const catName = typeof ex.category === 'object' ? ex.category?.name : null;
                return (
                  <article key={ex.id} className="workout-card" onClick={() => navigate(`/workouts/${ex.id}`)}>
                    <div className="workout-card-img">
                      <AnatomicalTargetMap
                        category={ex.category}
                        muscles={ex.muscles}
                        secondaryMuscles={ex.muscles_secondary}
                        compact
                      />
                    </div>
                    <div className="workout-card-body">
                      <h3>{capitalizeFirst(ex.name) || 'Unnamed Exercise'}</h3>
                      <p>{truncateText(stripHTML(ex.description), 80) || 'No description available.'}</p>
                    </div>
                    <div className="workout-card-footer">
                      <div className="workout-card-tags">
                        {catName && <span className="badge badge-accent">{catName}</span>}
                        <span className="badge badge-secondary">ID #{ex.id}</span>
                      </div>
                      <button
                        className={`bookmark-btn ${isBookmarked(ex.id) ? 'active' : ''}`}
                        onClick={(e) => { e.stopPropagation(); toggleBookmark(ex.id); }}
                        aria-label={isBookmarked(ex.id) ? 'Remove bookmark' : 'Bookmark exercise'}
                      >
                        <FiBookmark fill={isBookmarked(ex.id) ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
};

export default Workouts;
