import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { formatDateStr } from '../dateUtils';

export default function ViewWorkout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getWorkoutView(id)
      .then(w => {
        if (w.is_owner) { navigate(`/workouts/${id}`, { replace: true }); return; }
        setWorkout(w);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page"><div className="spinner" /></div>;
  if (error) return <div className="page"><p className="form-error">{error}</p></div>;
  if (!workout) return null;

  return (
    <div className="page">
      <button className="btn-ghost" onClick={() => navigate(-1)} style={{marginBottom:'12px'}}>← Back</button>
      <h2 className="page-title">{workout.name || `${workout.username}'s workout`}</h2>
      <p className="muted" style={{fontSize:'13px',marginBottom:'20px'}}>
        {workout.username} · {formatDateStr(workout.date, {month:'long',day:'numeric',year:'numeric'})}
      </p>

      {workout.notes_before && (
        <div className="glass-card" style={{marginBottom:'16px'}}>
          <div style={{fontSize:'12px',fontWeight:'700',marginBottom:'4px'}}>Before</div>
          <p style={{fontSize:'14px'}}>{workout.notes_before}</p>
        </div>
      )}

      {(workout.exercises || []).map((ex, i) => (
        <div key={i} className="list-item">
          <div style={{flex:1}}>
            <div className="item-main">{ex.exercise_name}</div>
            <div className="item-meta">
              {ex.category === 'cardio'
                ? (ex.duration_minutes ? `${ex.duration_minutes} min` : 'Cardio') + (ex.distance ? ` · ${ex.distance} ${ex.distance_unit || ''}` : '')
                : `${ex.sets} sets × ${ex.reps || (ex.sets_data?.length ? 'varied' : '')}${ex.weight ? ` @ ${ex.weight} lbs` : ''}`}
              {ex.notes ? ` · ${ex.notes}` : ''}
            </div>
          </div>
        </div>
      ))}

      {workout.notes_after && (
        <div className="glass-card" style={{marginTop:'16px'}}>
          <div style={{fontSize:'12px',fontWeight:'700',marginBottom:'4px'}}>After</div>
          <p style={{fontSize:'14px'}}>{workout.notes_after}</p>
        </div>
      )}
    </div>
  );
}
