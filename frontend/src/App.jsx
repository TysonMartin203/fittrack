import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Header     from './components/Header';
import Nav        from './components/Nav';
import Home       from './pages/Home';
import Dashboard  from './pages/Dashboard';
import LogWorkout from './pages/LogWorkout';
import EditWorkout from './pages/EditWorkout';
import PRTracker  from './pages/PRTracker';
import Photos     from './pages/ProgressPhotos';
import Friends    from './pages/Friends';
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
      <Route path="/workouts/:id" element={<Private><EditWorkout /></Private>} />
      <Route path="/prs"       element={<Private><PRTracker /></Private>} />
      <Route path="/photos"    element={<Private><Photos /></Private>} />
      <Route path="/friends"   element={<Private><Friends /></Private>} />
      <Route path="/settings"  element={<Private><Settings /></Private>} />
      <Route path="/meals"     element={<Private><Meals /></Private>} />
    </Routes>
  );
}

export default function App() {
  const { user } = useAuth();

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
