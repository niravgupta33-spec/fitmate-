// Dashboard Page — Protected (Lectures 49-54, 73-78: useMemo, Charts)
import { useMemo } from 'react';
import { FiActivity, FiTarget, FiTrendingUp, FiCalendar, FiDroplet } from 'react-icons/fi';
import { useFitness } from '../context/FitnessContext';
import { useAuth } from '../context/AuthContext';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';
import { formatDate } from '../utils/helpers';
import './Pages.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const { user } = useAuth();
  const { workoutLogs, meals, todayStats, goals, addWater, removeWater } = useFitness();

  // Weekly calories chart data (useMemo for performance)
  const weeklyData = useMemo(() => {
    const days = [];
    const cals = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayStr = d.toDateString();
      days.push(d.toLocaleDateString('en-US', { weekday: 'short' }));
      const dayMeals = meals.filter((m) => new Date(m.date).toDateString() === dayStr);
      cals.push(dayMeals.reduce((sum, m) => sum + (m.calories || 0), 0));
    }
    return {
      labels: days,
      datasets: [{
        label: 'Calories',
        data: cals,
        backgroundColor: 'rgba(255, 94, 0, 0.7)',
        borderRadius: 6,
        borderSkipped: false,
      }],
    };
  }, [meals]);

  // Macros doughnut
  const macroData = useMemo(() => ({
    labels: ['Protein', 'Carbs', 'Fat'],
    datasets: [{
      data: [todayStats.protein || 1, todayStats.carbs || 1, todayStats.fat || 1],
      backgroundColor: ['#FF3B5C', '#38BDF8', '#FFB020'],
      borderWidth: 0,
    }],
  }), [todayStats]);

  const chartOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#64748B' } },
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748B' } },
    },
  };

  const doughnutOpts = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: { legend: { position: 'bottom', labels: { color: '#94A3B8', padding: 16 } } },
  };

  return (
    <div className="dashboard-page page-enter">
      <div className="container">
        <h1 className="section-title">
          Welcome back, <span className="text-accent">{user?.name?.split(' ')[0] || 'Champ'}</span> 👋
        </h1>
        <p className="section-subtitle">Here's your fitness overview for today.</p>

        {/* Stats Cards */}
        <div className="dash-stats">
          <div className="dash-stat-card">
            <div className="stat-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span><FiDroplet style={{ marginRight: 6 }} />Water</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button onClick={() => removeWater()} className="btn" style={{ padding: '2px 8px', fontSize: '0.75rem', borderRadius: '4px', height: 'auto', minHeight: 'unset', background: 'var(--color-bg-secondary)', color: 'var(--color-text-primary)' }}>-</button>
                <button onClick={() => addWater(1)} className="btn btn-primary" style={{ padding: '2px 8px', fontSize: '0.75rem', borderRadius: '4px', height: 'auto', minHeight: 'unset' }}>+1 Glass</button>
              </div>
            </div>
            <div className="stat-value" style={{ color: '#38BDF8' }}>
              {todayStats.water} <span style={{ fontSize: '1rem', color: 'var(--color-text-muted)' }}>glasses</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginLeft: '8px', fontWeight: 'normal' }}>({todayStats.water * 250} ml)</span>
            </div>
          </div>
          <div className="dash-stat-card">
            <div className="stat-label"><FiActivity style={{ marginRight: 6 }} />Calories Today</div>
            <div className="stat-value" style={{ color: 'var(--color-accent)' }}>{todayStats.calories}</div>
          </div>
          <div className="dash-stat-card">
            <div className="stat-label"><FiTarget style={{ marginRight: 6 }} />Protein</div>
            <div className="stat-value" style={{ color: 'var(--color-danger)' }}>{todayStats.protein}g</div>
          </div>
          <div className="dash-stat-card">
            <div className="stat-label"><FiTrendingUp style={{ marginRight: 6 }} />Total Workouts</div>
            <div className="stat-value" style={{ color: 'var(--color-secondary)' }}>{todayStats.totalWorkouts}</div>
          </div>
          <div className="dash-stat-card">
            <div className="stat-label"><FiCalendar style={{ marginRight: 6 }} />Today's Workouts</div>
            <div className="stat-value" style={{ color: 'var(--color-info)' }}>{todayStats.workoutsToday}</div>
          </div>
        </div>

        {/* Charts */}
        <div className="dash-charts">
          <div className="chart-card">
            <h3>Weekly Calories</h3>
            <div style={{ height: 260 }}>
              <Bar data={weeklyData} options={chartOpts} />
            </div>
          </div>
          <div className="chart-card">
            <h3>Today's Macros</h3>
            <div style={{ height: 260 }}>
              <Doughnut data={macroData} options={doughnutOpts} />
            </div>
          </div>
        </div>

        {/* Recent Workout Logs */}
        <div className="chart-card">
          <h3>Recent Workout Logs</h3>
          {workoutLogs.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)', padding: 'var(--space-lg) 0' }}>No workouts logged yet. Start tracking!</p>
          ) : (
            <div className="log-list">
              {workoutLogs.slice(0, 8).map((log) => (
                <div key={log.id} className="log-item">
                  <span className="log-name">{log.name}</span>
                  <span className="log-date">{formatDate(log.date)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
