import { useState, useEffect } from 'react';
import { api } from '../api/client';

export default function PRTracker() {
  const [prs,     setPRs]    = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getPRs()
      .then(setPRs)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page"><p className="muted">Loading…</p></div>;

  return (
    <div className="page">
      <h2 className="page-title">Personal Records 🏆</h2>
      {prs.length === 0
        ? <p className="muted">No PRs yet. Log a workout to start tracking!</p>
        : (
          <div className="pr-list">
            {prs.map(pr => (
              <div key={pr.id} className="pr-card">
                <div className="pr-exercise">{pr.exercise}</div>
                <div className="pr-weight">{pr.max_weight} <span className="pr-unit">lbs</span></div>
                <div className="pr-date">{new Date(pr.achieved_on).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        )
      }
    </div>
  );
}
