import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Header     from './components/Header';
import Nav        from './components/Nav';
import Home       from './pages/Home';
import Dashboard  from './pages/Dashboard';
import LogWorkout from './pages/LogWorkout';
import EditWorkout from './pages/EditWorkout';
import ViewWorkout from './pages/ViewWorkout';
import WorkoutPlans from './pages/WorkoutPlans';
import Photos     from './pages/ProgressPhotos';
import Feed       from './pages/Feed';
import Social     from './pages/Social';
import Settings   from './pages/Settings';
import Meals      from './pages/Meals';

function Private({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/"          element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Private><Dashboard /></Private>} />
      <Route path="/log"       element={<Private><LogWorkout /></Private>} />
      <Route path="/workout-plans" element={<Private><WorkoutPlans /></Private>} />
      <Route path="/workouts/:id" element={<Private><EditWorkout /></Private>} />
      <Route path="/workouts/:id/view" element={<Private><ViewWorkout /></Private>} />
      <Route path="/photos"    element={<Private><Photos /></Private>} />
      <Route path="/feed"      element={<Private><Feed /></Private>} />
      <Route path="/social"    element={<Private><Social /></Private>} />
      <Route path="/settings"  element={<Private><Settings /></Private>} />
      <Route path="/meals"     element={<Private><Meals /></Private>} />
    </Routes>
  );
}

export default function App() {
  const { user } = useAuth();

  useEffect(() => {
    const dark = user?.theme === 'dark';
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', dark ? '#241416' : '#CC8B86');
  }, [user?.theme]);

  if (!user) {
    return (
      <Routes>
        <Route path="*" element={<Home />} />
      </Routes>
    );
  }

  return (
    <div className="app-shell">
      <Nav />
      <div className="desktop-main">
        <Header />
        <div className="app-content">
          <AppRoutes />
        </div>
      </div>
    </div>
  );
}
