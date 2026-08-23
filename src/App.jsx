// App.jsx — Root Component with React Router (Lectures 37-42, 73-78: Lazy loading)
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { FitnessProvider } from './context/FitnessContext';
import { useToast } from './hooks/useToast';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import Loader from './components/common/Loader';
import Toast from './components/common/Toast';
import './App.css';

// Lazy-loaded pages (Code Splitting — Lectures 73-78)
const Home = lazy(() => import('./pages/Home'));
const Workouts = lazy(() => import('./pages/Workouts'));
const WorkoutDetail = lazy(() => import('./pages/WorkoutDetail'));
const Calculators = lazy(() => import('./pages/Calculators'));
const Nutrition = lazy(() => import('./pages/Nutrition'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const NotFound = lazy(() => import('./pages/NotFound'));

const AppContent = () => {
  const { toasts, addToast, removeToast } = useToast();

  return (
    <>
      <Toast toasts={toasts} removeToast={removeToast} />
      <Suspense fallback={<Loader fullPage />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Public Routes */}
            <Route index element={<Home />} />
            <Route path="workouts" element={<Workouts />} />
            <Route path="workouts/:id" element={<WorkoutDetail />} />
            <Route path="calculators" element={<Calculators />} />
            <Route path="nutrition" element={<Nutrition />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />

            {/* Protected Routes (Lectures 37-42) */}
            <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

            {/* 404 Catch-all (Lectures 37-42) */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <FitnessProvider>
            <AppContent />
          </FitnessProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
