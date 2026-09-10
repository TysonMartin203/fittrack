import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Home       from './pages/Home';
import Dashboard  from './pages/Dashboard';
import LogWorkout from './pages/LogWorkout';
import PRTracker  from './pages/PRTracker';
import Photos     from './pages/ProgressPhotos';
import Friends    from './pages/Friends';
import Nav        from './components/Nav';

function Private({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" replace />;
}

export default function App() {
  const { user } = useAuth();
  return (
    <>
      {user && <Nav />}
      <Routes>
        <Route path="/"         element={user ? <Navigate to="/dashboard" replace /> : <Home />} />
        <Route path="/dashboard" element={<Private><Dashboard /></Private>} />
        <Route path="/log"       element={<Private><LogWorkout /></Private>} />
        <Route path="/prs"       element={<Private><PRTracker /></Private>} />
        <Route path="/photos"    element={<Private><Photos /></Private>} />
        <Route path="/friends"   element={<Private><Friends /></Private>} />
      </Routes>
    </>
  );
}
