import { useState, useEffect } from 'react';
import { api } from '../api/client';

export default function PRTracker() {
  const [prs,     setPRs]    = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getPRs().then(setPRs).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page"><div className="spinner"/></div>;

  return (
    <div className="page">
      <h2 className="page-title">Personal Records</h2>
      {prs.length === 0
        ? <p className="muted">No PRs yet. Log a workout to start tracking.</p>
        : (
          <div className="pr-grid">
            {prs.map((pr, i) => (
              <div key={pr.id} className="pr-card" style={{animationDelay:`${i*.04}s`}}>
                <div className="pr-exercise">{pr.exercise}</div>
                <div className="pr-weight">{pr.max_weight}<span className="pr-unit"> lbs</span></div>
                <div className="pr-date">{new Date(pr.achieved_on).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</div>
              </div>
            ))}
          </div>
        )
      }
    </div>
  );
}
