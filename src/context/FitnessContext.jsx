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
  const [waterLogs, setWaterLogs] = useLocalStorage('fitmate-water', []);
  const [workoutPlans, setWorkoutPlans] = useLocalStorage('fitmate-plans', []);

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

  // --- Water ---
  const addWater = useCallback((amount = 1) => {
    setWaterLogs((prev) => [{ id: generateId(), date: new Date().toISOString(), amount }, ...prev]);
  }, [setWaterLogs]);

  const removeWater = useCallback(() => {
    setWaterLogs((prev) => {
      const todayStr = new Date().toDateString();
      const latestTodayIndex = prev.findIndex(w => new Date(w.date).toDateString() === todayStr);
      if (latestTodayIndex !== -1) {
        const newLogs = [...prev];
        newLogs.splice(latestTodayIndex, 1);
        return newLogs;
      }
      return prev;
    });
  }, [setWaterLogs]);

  // --- Workout Plans ---
  const addToPlan = useCallback((exercise) => {
    setWorkoutPlans((prev) => {
      if (prev.some(p => p.exerciseId === exercise.id && new Date(p.date).toDateString() === new Date().toDateString())) return prev;
      return [...prev, {
        id: generateId(),
        exerciseId: exercise.id,
        name: exercise.name,
        category: typeof exercise.category === 'object' ? exercise.category?.name : exercise.category,
        sets: 3,
        reps: 12,
        completed: false,
        date: new Date().toISOString(),
      }];
    });
  }, [setWorkoutPlans]);

  const removeFromPlan = useCallback((planId) => {
    setWorkoutPlans((prev) => prev.filter((p) => p.id !== planId));
  }, [setWorkoutPlans]);

  const togglePlanComplete = useCallback((planId) => {
    setWorkoutPlans((prev) => prev.map((p) => p.id === planId ? { ...p, completed: !p.completed } : p));
  }, [setWorkoutPlans]);

  const updatePlanItem = useCallback((planId, updates) => {
    setWorkoutPlans((prev) => prev.map((p) => p.id === planId ? { ...p, ...updates } : p));
  }, [setWorkoutPlans]);

  const clearPlan = useCallback((dateStr) => {
    const target = dateStr || new Date().toDateString();
    setWorkoutPlans((prev) => prev.filter((p) => new Date(p.date).toDateString() !== target));
  }, [setWorkoutPlans]);

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
    const todayWater = waterLogs.filter((w) => new Date(w.date).toDateString() === today);
    
    // Count completed exercises from Workout Planner
    const completedPlansAll = workoutPlans.filter((p) => p.completed);
    const completedPlansToday = workoutPlans.filter((p) => p.completed && new Date(p.date).toDateString() === today);

    return {
      water: todayWater.reduce((sum, w) => sum + (w.amount || 0), 0),
      calories: todayMeals.reduce((sum, m) => sum + (m.calories || 0), 0),
      protein: todayMeals.reduce((sum, m) => sum + (m.protein || 0), 0),
      carbs: todayMeals.reduce((sum, m) => sum + (m.carbs || 0), 0),
      fat: todayMeals.reduce((sum, m) => sum + (m.fat || 0), 0),
      workoutsToday: todayWorkouts.length + completedPlansToday.length,
      totalWorkouts: workoutLogs.length + completedPlansAll.length,
    };
  }, [meals, workoutLogs, waterLogs, workoutPlans]);

  const value = {
    workoutLogs, addWorkout, updateWorkout, deleteWorkout,
    meals, addMeal, updateMeal, deleteMeal,
    goals, setGoals,
    bookmarks, toggleBookmark, isBookmarked,
    waterLogs, addWater, removeWater,
    workoutPlans, addToPlan, removeFromPlan, togglePlanComplete, updatePlanItem, clearPlan,
    todayStats,
  };

  return <FitnessContext.Provider value={value}>{children}</FitnessContext.Provider>;
};

export const useFitness = () => {
  const ctx = useContext(FitnessContext);
  if (!ctx) throw new Error('useFitness must be used inside FitnessProvider');
  return ctx;
};
