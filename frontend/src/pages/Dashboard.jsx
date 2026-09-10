import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';

function Skeleton() {
  return (
    <div>
      <div className="skeleton skeleton-card" style={{animationDelay:'.05s'}}/>
      <div className="skeleton skeleton-card" style={{animationDelay:'.1s'}}/>
      <div className="skeleton skeleton-card" style={{animationDelay:'.15s'}}/>
    </div>
  );
}

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

  const recent = workouts.slice(0, 5);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="page">
      <p className="page-subtitle" style={{color:'var(--muted)',fontSize:'13px',marginBottom:'4px',marginTop:'0'}}>{greeting}</p>
      <h2 className="page-title" style={{marginBottom:'20px'}}>{user.username} 👋</h2>

      <div className="stat-row">
        <div className="stat-card" style={{animationDelay:'.05s'}}>
          <span className="stat-num">{workouts.length}</span>
          <span className="stat-label">Workouts</span>
        </div>
        <div className="stat-card" style={{animationDelay:'.1s'}}>
          <span className="stat-num">{prs.length}</span>
          <span className="stat-label">PRs Set</span>
        </div>
      </div>

      <section className="section">
        <div className="section-header">
          <span className="section-title">Recent Workouts</span>
          <Link to="/log" className="link-small">+ Log one</Link>
        </div>
        {loading ? <Skeleton /> : recent.length === 0
          ? <p className="muted">No workouts yet. <Link to="/log">Log your first!</Link></p>
          : recent.map((w, i) => (
            <div key={w.id} className="list-item" style={{animationDelay:`${i*.05}s`,animation:'fadeInUp .3s ease both'}}>
              <div style={{flex:1}}>
                <div className="item-main">{w.exercise}</div>
                <div className="item-meta">{w.sets}×{w.reps} @ {w.weight} lbs</div>
              </div>
              <span className="item-date">{new Date(w.date).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</span>
            </div>
          ))
        }
      </section>

      <section className="section">
        <div className="section-header">
          <span className="section-title">Top PRs</span>
          <Link to="/prs" className="link-small">View all</Link>
        </div>
        {loading ? <Skeleton /> : prs.slice(0, 3).map((pr, i) => (
          <div key={pr.id} className="list-item" style={{animationDelay:`${i*.05}s`,animation:'fadeInUp .3s ease both'}}>
            <span className="item-main">{pr.exercise}</span>
            <span className="item-accent">{pr.max_weight} lbs</span>
          </div>
        ))}
        {!loading && prs.length === 0 && <p className="muted">Log a workout to set your first PR.</p>}
      </section>
    </div>
  );
}
