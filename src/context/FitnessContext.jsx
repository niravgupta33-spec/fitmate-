// FitnessContext — Global Fitness Data (Lectures 49-54)
import { createContext, useContext, useCallback, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { generateId } from '../utils/helpers';

const FitnessContext = createContext();

export const FitnessProvider = ({ children }) => {
  const [workoutLogs, setWorkoutLogs] = useLocalStorage('fitmate-workouts', []);
  const [meals, setMeals] = useLocalStorage('fitmate-meals', []);
  const [goals, setGoals] = useLocalStorage('fitmate-goals', { dailyCalories: 2000, dailyProtein: 150, weeklyWorkouts: 4 });
  const [bookmarks, setBookmarks] = useLocalStorage('fitmate-bookmarks', []);

  // --- CRUD: Workout Logs (Lectures 67-72) ---
  const addWorkout = useCallback((workout) => {
    setWorkoutLogs((prev) => [{ ...workout, id: generateId(), date: new Date().toISOString() }, ...prev]);
  }, [setWorkoutLogs]);

  const updateWorkout = useCallback((id, updates) => {
    setWorkoutLogs((prev) => prev.map((w) => (w.id === id ? { ...w, ...updates } : w)));
  }, [setWorkoutLogs]);

  const deleteWorkout = useCallback((id) => {
    setWorkoutLogs((prev) => prev.filter((w) => w.id !== id));
  }, [setWorkoutLogs]);

  // --- CRUD: Meals ---
  const addMeal = useCallback((meal) => {
    setMeals((prev) => [{ ...meal, id: generateId(), date: new Date().toISOString() }, ...prev]);
  }, [setMeals]);

  const updateMeal = useCallback((id, updates) => {
    setMeals((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
  }, [setMeals]);

  const deleteMeal = useCallback((id) => {
    setMeals((prev) => prev.filter((m) => m.id !== id));
  }, [setMeals]);

  // --- Bookmarks ---
  const toggleBookmark = useCallback((exerciseId) => {
    setBookmarks((prev) =>
      prev.includes(exerciseId) ? prev.filter((id) => id !== exerciseId) : [...prev, exerciseId]
    );
  }, [setBookmarks]);

  const isBookmarked = useCallback((exerciseId) => bookmarks.includes(exerciseId), [bookmarks]);

  // --- Computed Stats (useMemo - Lectures 31-36) ---
  const todayStats = useMemo(() => {
    const today = new Date().toDateString();
    const todayMeals = meals.filter((m) => new Date(m.date).toDateString() === today);
    const todayWorkouts = workoutLogs.filter((w) => new Date(w.date).toDateString() === today);
    return {
      calories: todayMeals.reduce((sum, m) => sum + (m.calories || 0), 0),
      protein: todayMeals.reduce((sum, m) => sum + (m.protein || 0), 0),
      carbs: todayMeals.reduce((sum, m) => sum + (m.carbs || 0), 0),
      fat: todayMeals.reduce((sum, m) => sum + (m.fat || 0), 0),
      workoutsToday: todayWorkouts.length,
      totalWorkouts: workoutLogs.length,
    };
  }, [meals, workoutLogs]);

  const value = {
    workoutLogs, addWorkout, updateWorkout, deleteWorkout,
    meals, addMeal, updateMeal, deleteMeal,
    goals, setGoals,
    bookmarks, toggleBookmark, isBookmarked,
    todayStats,
  };

  return <FitnessContext.Provider value={value}>{children}</FitnessContext.Provider>;
};

export const useFitness = () => {
  const ctx = useContext(FitnessContext);
  if (!ctx) throw new Error('useFitness must be used inside FitnessProvider');
  return ctx;
};
