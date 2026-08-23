// Profile Page — Protected (Lectures 37-42: Protected routes)
import { useAuth } from '../context/AuthContext';
import { useFitness } from '../context/FitnessContext';
import FormInput from '../components/common/FormInput';
import { formatDate } from '../utils/helpers';
import './Pages.css';

const Profile = () => {
  const { user } = useAuth();
  const { goals, setGoals, workoutLogs, meals } = useFitness();

  const handleGoalChange = (key, value) => {
    setGoals((prev) => ({ ...prev, [key]: Number(value) || 0 }));
  };

  return (
    <div className="profile-page page-enter">
      <div className="container">
        <h1 className="section-title">Your <span className="text-accent">Profile</span></h1>

        <div className="profile-header">
          <div className="profile-avatar">{user?.name?.[0]?.toUpperCase() || 'U'}</div>
          <div>
            <h2>{user?.name || 'User'}</h2>
            <p style={{ color: 'var(--color-text-secondary)' }}>{user?.email}</p>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-sm)' }}>
              Member since {user?.joinedAt ? formatDate(user.joinedAt) : 'N/A'}
            </p>
          </div>
        </div>

        <h2 style={{ marginBottom: 'var(--space-lg)' }}>Daily Goals</h2>
        <div className="goals-grid">
          <div className="goal-card">
            <label className="form-label" htmlFor="goal-calories">🔥 Daily Calories Target</label>
            <FormInput id="goal-calories" type="number" value={goals.dailyCalories} onChange={(e) => handleGoalChange('dailyCalories', e.target.value)} />
          </div>
          <div className="goal-card">
            <label className="form-label" htmlFor="goal-protein">🥩 Daily Protein Target (g)</label>
            <FormInput id="goal-protein" type="number" value={goals.dailyProtein} onChange={(e) => handleGoalChange('dailyProtein', e.target.value)} />
          </div>
          <div className="goal-card">
            <label className="form-label" htmlFor="goal-workouts">💪 Weekly Workouts Target</label>
            <FormInput id="goal-workouts" type="number" value={goals.weeklyWorkouts} onChange={(e) => handleGoalChange('weeklyWorkouts', e.target.value)} />
          </div>
        </div>

        <h2 style={{ margin: 'var(--space-2xl) 0 var(--space-lg)' }}>Stats Overview</h2>
        <div className="nutrition-summary">
          <div className="summary-card">
            <div className="summary-value" style={{ color: 'var(--color-accent)' }}>{workoutLogs.length}</div>
            <div className="summary-label">Total Workouts</div>
          </div>
          <div className="summary-card">
            <div className="summary-value" style={{ color: 'var(--color-secondary)' }}>{meals.length}</div>
            <div className="summary-label">Meals Logged</div>
          </div>
          <div className="summary-card">
            <div className="summary-value" style={{ color: 'var(--color-tertiary)' }}>{goals.dailyCalories}</div>
            <div className="summary-label">Calorie Goal</div>
          </div>
          <div className="summary-card">
            <div className="summary-value" style={{ color: 'var(--color-info)' }}>{goals.weeklyWorkouts}</div>
            <div className="summary-label">Weekly Goal</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
