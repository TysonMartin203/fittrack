import { useState } from 'react';
import { api } from '../api/client';

const today = () => new Date().toISOString().split('T')[0];

export default function LogWorkout() {
  const [form, setForm] = useState({ exercise: '', sets: '', reps: '', weight: '', date: today() });
  const [result,  setResult]  = useState(null);
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  function set(field) {
    return e => setForm(f => ({ ...f, [field]: e.target.value }));
  }

  async function submit(e) {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);
    try {
      const data = await api.logWorkout(form);
      setResult(data);
      setForm(f => ({ ...f, exercise: '', sets: '', reps: '', weight: '' }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <h2 className="page-title">Log Workout</h2>

      <form onSubmit={submit} className="card-form">
        <label className="label">Exercise</label>
        <input className="input" placeholder="e.g. Bench Press" value={form.exercise} onChange={set('exercise')} required />

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

        <label className="label">Date</label>
        <input className="input" type="date" value={form.date} onChange={set('date')} required />

        {error  && <p className="form-error">{error}</p>}
        {result && (
          <div className={`result-banner ${result.isNewPR ? 'pr-banner' : ''}`}>
            {result.isNewPR
              ? `🏆 New PR! ${result.previousMax != null ? `Previous: ${result.previousMax} lbs → ` : ''}${result.newMax} lbs`
              : '✅ Workout logged!'}
          </div>
        )}

        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? 'Saving…' : 'Log Workout'}
        </button>
      </form>
    </div>
  );
}
