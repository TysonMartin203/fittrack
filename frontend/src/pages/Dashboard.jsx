import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';

export default function Dashboard() {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [prs,      setPRs]      = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    Promise.all([api.getWorkouts(), api.getPRs()])
      .then(([w, p]) => { setWorkouts(w); setPRs(p); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page"><p className="muted">Loading…</p></div>;

  const recent = workouts.slice(0, 5);

  return (
    <div className="page">
      <h2 className="page-title">Hey, {user.username} 👋</h2>

      <div className="stat-row">
        <div className="stat-card">
          <span className="stat-num">{workouts.length}</span>
          <span className="stat-label">Workouts</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{prs.length}</span>
          <span className="stat-label">PRs</span>
        </div>
      </div>

      <section className="section">
        <div className="section-header">
          <h3>Recent Workouts</h3>
          <Link to="/log" className="link-small">+ Log workout</Link>
        </div>
        {recent.length === 0
          ? <p className="muted">No workouts yet. <Link to="/log">Log your first one!</Link></p>
          : recent.map(w => (
              <div key={w.id} className="list-item">
                <span className="item-main">{w.exercise}</span>
                <span className="item-meta">{w.sets}×{w.reps} @ {w.weight} lbs</span>
                <span className="item-date">{new Date(w.date).toLocaleDateString()}</span>
              </div>
            ))
        }
      </section>

      <section className="section">
        <div className="section-header">
          <h3>Top PRs</h3>
          <Link to="/prs" className="link-small">View all</Link>
        </div>
        {prs.slice(0, 3).map(pr => (
          <div key={pr.id} className="list-item">
            <span className="item-main">{pr.exercise}</span>
            <span className="item-accent">{pr.max_weight} lbs</span>
          </div>
        ))}
        {prs.length === 0 && <p className="muted">Log a workout to set your first PR.</p>}
      </section>
    </div>
  );
}
