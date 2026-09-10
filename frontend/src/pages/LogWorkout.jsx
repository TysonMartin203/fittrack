import { useState, useRef } from 'react';
import { api } from '../api/client';

const today = () => new Date().toISOString().split('T')[0];

const EXERCISES = [
  // Chest
  'Bench Press','Incline Bench Press','Decline Bench Press',
  'Dumbbell Fly','Cable Fly','Push-Up','Chest Press Machine','Pec Deck',
  // Back
  'Deadlift','Pull-Up','Chin-Up','Lat Pulldown','Barbell Row','Dumbbell Row',
  'Seated Cable Row','T-Bar Row','Face Pull','Hyperextension',
  // Shoulders
  'Overhead Press','Dumbbell Shoulder Press','Arnold Press',
  'Lateral Raise','Front Raise','Rear Delt Fly','Shrug','Upright Row',
  // Legs
  'Squat','Front Squat','Hack Squat','Leg Press','Lunge','Bulgarian Split Squat',
  'Romanian Deadlift','Leg Curl','Leg Extension','Hip Thrust','Calf Raise',
  'Sumo Deadlift','Step Up','Glute Bridge',
  // Arms - Biceps
  'Barbell Curl','Dumbbell Curl','Hammer Curl','Preacher Curl',
  'Concentration Curl','Cable Curl','Incline Dumbbell Curl',
  // Arms - Triceps
  'Tricep Pushdown','Skull Crusher','Close Grip Bench Press',
  'Overhead Tricep Extension','Dip','Kickback','Diamond Push-Up',
  // Core
  'Plank','Crunch','Sit-Up','Leg Raise','Russian Twist',
  'Cable Crunch','Ab Wheel','Mountain Climber','Hanging Leg Raise',
  // Olympic / Power
  'Clean and Jerk','Snatch','Power Clean','Power Snatch','Box Jump',
  // Cardio
  'Running','Treadmill','Cycling','Stationary Bike','Rowing Machine',
  'Jump Rope','Stair Climber','Elliptical','Sled Push','Battle Ropes',
  // Machines
  'Smith Machine Squat','Smith Machine Bench','Cable Crossover',
  'Assisted Pull-Up','Leg Press Machine','Hack Squat Machine',
].sort();

function ExerciseInput({ value, onChange }) {
  const [show, setShow]   = useState(false);
  const [query, setQuery] = useState(value);
  const ref = useRef();

  const filtered = query.length >= 1
    ? EXERCISES.filter(e => e.toLowerCase().includes(query.toLowerCase())).slice(0, 8)
    : [];

  function select(ex) {
    setQuery(ex);
    onChange(ex);
    setShow(false);
  }

  function handleChange(e) {
    setQuery(e.target.value);
    onChange(e.target.value);
    setShow(true);
  }

  return (
    <div style={{position:'relative'}} ref={ref}>
      <input
        className="input"
        placeholder="e.g. Bench Press"
        value={query}
        onChange={handleChange}
        onFocus={() => setShow(true)}
        onBlur={() => setTimeout(() => setShow(false), 150)}
        required
      />
      {show && filtered.length > 0 && (
        <div style={{
          position:'absolute',top:'100%',left:0,right:0,zIndex:100,
          background:'var(--surface)',border:'1px solid var(--border)',
          borderRadius:'var(--r-sm)',marginTop:'4px',
          boxShadow:'var(--shadow)',overflow:'hidden',
        }}>
          {filtered.map(ex => (
            <div key={ex} onMouseDown={() => select(ex)} style={{
              padding:'11px 14px',cursor:'pointer',fontSize:'14px',
              borderBottom:'1px solid var(--border)',
              transition:'background .1s',
            }}
            onMouseEnter={e => e.currentTarget.style.background='var(--surface-2)'}
            onMouseLeave={e => e.currentTarget.style.background='transparent'}
            >
              {ex}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function LogWorkout() {
  const [form,    setForm]    = useState({ exercise:'', sets:'', reps:'', weight:'', date: today() });
  const [result,  setResult]  = useState(null);
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setError(''); setResult(null); setLoading(true);
    try {
      const data = await api.logWorkout(form);
      setResult(data);
      setForm(p => ({ ...p, exercise:'', sets:'', reps:'', weight:'' }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <h2 className="page-title">Log Workout</h2>
      <div className="card-form">
        <form onSubmit={submit} className="form-stack">
          <div className="field">
            <label className="label">Exercise</label>
            <ExerciseInput value={form.exercise} onChange={v => setForm(p => ({...p, exercise: v}))} />
          </div>
          <div className="input-row">
            <div className="input-group">
              <label className="label">Sets</label>
              <input className="input" type="number" min="1" placeholder="3" value={form.sets} onChange={set('sets')} required />
            </div>
            <div className="input-group">
              <label className="label">Reps</label>
              <input className="input" type="number" min="1" placeholder="8" value={form.reps} onChange={set('reps')} required />
            </div>
            <div className="input-group">
              <label className="label">Weight (lbs)</label>
              <input className="input" type="number" min="0" step="2.5" placeholder="135" value={form.weight} onChange={set('weight')} required />
            </div>
          </div>
          <div className="field">
            <label className="label">Date</label>
            <input className="input" type="date" value={form.date} onChange={set('date')} required />
          </div>
          {error  && <p className="form-error">{error}</p>}
          {result && (
            <div className={`result-banner ${result.isNewPR ? 'pr-banner' : ''}`}>
              {result.isNewPR
                ? `🏆 New PR! ${result.previousMax != null ? `${result.previousMax} → ` : ''}${result.newMax} lbs`
                : '✅ Workout logged!'}
            </div>
          )}
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? 'Saving…' : 'Log Workout'}
          </button>
        </form>
      </div>
    </div>
  );
}
