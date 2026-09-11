import { useState, useRef } from 'react';
import { LIFTING_EXERCISES, CARDIO_ACTIVITIES, DISTANCE_UNITS } from '../data/exercises';
import { compressImage } from '../compressImage';
import { today } from '../dateUtils';

function blankLiftingExercise() {
  return {
    category: 'lifting', exerciseName: '', notes: '',
    sets: '', reps: '', weight: '', perSetWeights: false, setsData: [],
  };
}

function LiftingNameInput({ value, onChange }) {
  const [show, setShow]   = useState(false);
  const [query, setQuery] = useState(value);

  const filtered = query.length >= 1
    ? LIFTING_EXERCISES.filter(e => e.toLowerCase().includes(query.toLowerCase())).slice(0, 8)
    : [];

  function select(ex) { setQuery(ex); onChange(ex); setShow(false); }
  function handleChange(e) { setQuery(e.target.value); onChange(e.target.value); setShow(true); }

  return (
    <div style={{ position: 'relative' }}>
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
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100,
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--r-sm)', marginTop: '4px',
          boxShadow: 'var(--shadow)', overflow: 'hidden', maxHeight: '260px', overflowY: 'auto',
        }}>
          {filtered.map(ex => (
            <div key={ex} onMouseDown={() => select(ex)} style={{
              padding: '11px 14px', cursor: 'pointer', fontSize: '14px',
              borderBottom: '1px solid var(--border)',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {ex}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ExerciseCard({ ex, index, onChange, onRemove, canRemove }) {
  const update = (patch) => onChange(index, { ...ex, ...patch });

  function setCategory(category) {
    if (category === 'lifting') onChange(index, { ...blankLiftingExercise(), notes: ex.notes });
    else onChange(index, {
      category: 'cardio', exerciseName: '', customName: '', notes: ex.notes,
      durationMinutes: '', distance: '', distanceUnit: 'mi', calories: '', avgHeartRate: '', pace: '',
    });
  }

  function togglePerSet() {
    const turningOn = !ex.perSetWeights;
    if (turningOn) {
      const n = parseInt(ex.sets, 10);
      if (!n || n < 1) { update({ perSetWeights: true, setsData: [] }); return; }
      const setsData = Array.from({ length: n }, (_, i) => ex.setsData[i] || { reps: ex.reps || '', weight: ex.weight || '' });
      // Clear the uniform weight now that each set carries its own — avoids a stale
      // value lingering on a disabled field and causing confusion (or bugs) later.
      update({ perSetWeights: true, setsData, weight: '' });
    } else {
      update({ perSetWeights: false, setsData: [] });
    }
  }

  function updateSetsCount(val) {
    const n = parseInt(val, 10);
    let setsData = ex.setsData;
    if (ex.perSetWeights && n > 0) {
      setsData = Array.from({ length: n }, (_, i) => ex.setsData[i] || { reps: ex.reps || '', weight: '' });
    }
    update({ sets: val, setsData });
  }

  function updateSetRow(i, patch) {
    const setsData = ex.setsData.map((s, idx) => idx === i ? { ...s, ...patch } : s);
    update({ setsData });
  }

  return (
    <div className="exercise-card">
      <div className="exercise-card-head">
        <div className="category-toggle">
          <button type="button" className={ex.category === 'lifting' ? 'active' : ''} onClick={() => setCategory('lifting')}>Lifting</button>
          <button type="button" className={ex.category === 'cardio' ? 'active' : ''} onClick={() => setCategory('cardio')}>Cardio</button>
        </div>
        {canRemove && (
          <button type="button" className="btn-ghost-sm" onClick={() => onRemove(index)}>Remove</button>
        )}
      </div>

      {ex.category === 'lifting' ? (
        <>
          <div className="field">
            <label className="label">Exercise</label>
            <LiftingNameInput value={ex.exerciseName} onChange={v => update({ exerciseName: v })} />
          </div>
          <div className="input-row">
            <div className="input-group">
              <label className="label">Sets</label>
              <input className="input" type="number" min="1" placeholder="3" value={ex.sets}
                onChange={e => updateSetsCount(e.target.value)} required />
            </div>
            <div className="input-group">
              <label className="label">Reps</label>
              <input className="input" type="number" min="1" placeholder="8" value={ex.reps}
                onChange={e => update({ reps: e.target.value })} disabled={ex.perSetWeights} required={!ex.perSetWeights} />
            </div>
            <div className="input-group">
              <label className="label">Weight (lbs)</label>
              <input className="input" type="number" min="0" step="2.5" placeholder="135" value={ex.weight}
                onChange={e => update({ weight: e.target.value })} disabled={ex.perSetWeights} required={!ex.perSetWeights} />
            </div>
          </div>

          <label className="checkbox-row">
            <input type="checkbox" checked={ex.perSetWeights} onChange={togglePerSet} />
            <span>Split sets</span>
          </label>

          {ex.perSetWeights && (!ex.sets || parseInt(ex.sets, 10) < 1) && (
            <p className="form-error">Enter a number of sets first.</p>
          )}

          {ex.perSetWeights && ex.sets && parseInt(ex.sets, 10) >= 1 && (
            <div className="set-grid">
              {ex.setsData.map((s, i) => (
                <div className="set-row" key={i}>
                  <span className="set-row-label">Set {i + 1}</span>
                  <input className="input" type="number" min="1" placeholder="Reps" value={s.reps}
                    onChange={e => updateSetRow(i, { reps: e.target.value })} />
                  <input className="input" type="number" min="0" step="2.5" placeholder="Weight" value={s.weight}
                    onChange={e => updateSetRow(i, { weight: e.target.value })} />
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <div className="field">
            <label className="label">Activity</label>
            <select className="input" value={ex.exerciseName} onChange={e => update({ exerciseName: e.target.value })} required>
              <option value="" disabled>Select an activity</option>
              {CARDIO_ACTIVITIES.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          {ex.exerciseName === 'Other' && (
            <div className="field">
              <label className="label">Activity name</label>
              <input className="input" placeholder="e.g. Kickboxing" value={ex.customName || ''}
                onChange={e => update({ customName: e.target.value })} required />
            </div>
          )}
          <p className="muted" style={{ margin: '0 0 4px', fontSize: '12px' }}>All fields below are optional.</p>
          <div className="input-row">
            <div className="input-group">
              <label className="label">Duration (min)</label>
              <input className="input" type="number" min="0" placeholder="30" value={ex.durationMinutes}
                onChange={e => update({ durationMinutes: e.target.value })} />
            </div>
            <div className="input-group">
              <label className="label">Distance</label>
              <input className="input" type="number" min="0" step="0.01" placeholder="3.1" value={ex.distance}
                onChange={e => update({ distance: e.target.value })} />
            </div>
            <div className="input-group" style={{ maxWidth: '90px' }}>
              <label className="label">Unit</label>
              <select className="input" value={ex.distanceUnit} onChange={e => update({ distanceUnit: e.target.value })}>
                {DISTANCE_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
          <div className="input-row">
            <div className="input-group">
              <label className="label">Calories</label>
              <input className="input" type="number" min="0" placeholder="300" value={ex.calories}
                onChange={e => update({ calories: e.target.value })} />
            </div>
            <div className="input-group">
              <label className="label">Avg heart rate</label>
              <input className="input" type="number" min="0" placeholder="150" value={ex.avgHeartRate}
                onChange={e => update({ avgHeartRate: e.target.value })} />
            </div>
            <div className="input-group">
              <label className="label">Pace</label>
              <input className="input" placeholder="9:40/mi" value={ex.pace}
                onChange={e => update({ pace: e.target.value })} />
            </div>
          </div>
        </>
      )}

      <div className="field">
        <label className="label">Exercise notes (optional)</label>
        <textarea className="input" rows={2} placeholder="How did it feel?" value={ex.notes}
          onChange={e => update({ notes: e.target.value })} />
      </div>
    </div>
  );
}

export default function WorkoutForm({ mode = 'create', initial, onSubmit, onDelete, onRemovePhoto }) {
  const [name,         setName]         = useState(initial?.name || '');
  const [date,         setDate]         = useState(initial?.date || today());
  const [notesBefore,  setNotesBefore]  = useState(initial?.notesBefore || '');
  const [notesAfter,   setNotesAfter]   = useState(initial?.notesAfter || '');
  const [exercises,    setExercises]    = useState(initial?.exercises?.length ? initial.exercises : [blankLiftingExercise()]);
  const [photoFile,    setPhotoFile]    = useState(null);
  const [compressingPhoto, setCompressingPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(initial?.photoUrl || null);
  const [hasExistingPhoto, setHasExistingPhoto] = useState(!!initial?.photoUrl);
  const [showRemovePhotoPopup, setShowRemovePhotoPopup] = useState(false);
  const [error,        setError]        = useState('');
  const [result,       setResult]       = useState(null);
  const [loading,      setLoading]      = useState(false);
  const fileRef = useRef();

  async function confirmRemovePhoto(keep) {
    setShowRemovePhotoPopup(false);
    if (onRemovePhoto) {
      try { await onRemovePhoto(keep); } catch { /* surfaced by parent if needed */ }
    }
    setPhotoPreview(null);
    setHasExistingPhoto(false);
    setPhotoFile(null);
    if (fileRef.current) fileRef.current.value = '';
  }

  function updateExercise(i, next) {
    setExercises(prev => prev.map((e, idx) => idx === i ? next : e));
  }
  function removeExercise(i) {
    setExercises(prev => prev.filter((_, idx) => idx !== i));
  }
  function addExercise() {
    setExercises(prev => [...prev, blankLiftingExercise()]);
  }
  async function onPhoto(e) {
    const f = e.target.files[0];
    if (!f) return;
    setCompressingPhoto(true);
    const compressed = await compressImage(f);
    setPhotoFile(compressed);
    setPhotoPreview(URL.createObjectURL(compressed));
    setCompressingPhoto(false);
  }

  async function submit(e) {
    e.preventDefault();
    setError(''); setResult(null);

    for (const ex of exercises) {
      if (ex.perSetWeights && (!ex.sets || parseInt(ex.sets, 10) < 1)) {
        setError('Enter a number of sets before using per-set weights.');
        return;
      }
    }

    const payload = {
      name: name.trim() || null, date, notesBefore, notesAfter,
      exercises: exercises.map(ex => {
        if (ex.category === 'lifting') {
          return {
            category: 'lifting',
            exerciseName: ex.exerciseName,
            notes: ex.notes,
            sets: ex.sets || null,
            reps: ex.perSetWeights ? null : (ex.reps || null),
            weight: ex.perSetWeights ? null : (ex.weight || null),
            perSetWeights: !!ex.perSetWeights,
            setsData: ex.perSetWeights ? ex.setsData : [],
          };
        }
        return {
          category: 'cardio',
          exerciseName: ex.exerciseName === 'Other' ? (ex.customName || 'Other') : ex.exerciseName,
          notes: ex.notes,
          durationMinutes: ex.durationMinutes || null,
          distance: ex.distance || null,
          distanceUnit: ex.distanceUnit || null,
          calories: ex.calories || null,
          avgHeartRate: ex.avgHeartRate || null,
          pace: ex.pace || null,
        };
      }),
    };

    setLoading(true);
    try {
      const data = await onSubmit(payload, photoFile);
      setResult(data);
      if (mode === 'create') {
        setName('');
        setExercises([blankLiftingExercise()]);
        setNotesBefore(''); setNotesAfter('');
        setPhotoFile(null); setPhotoPreview(null); setHasExistingPhoto(false);
        if (fileRef.current) fileRef.current.value = '';
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const newPRs = (result?.prResults || []).filter(p => p.isNewPR);

  return (
    <form onSubmit={submit} className="form-stack">
      <div className="field">
        <label className="label">Workout Name (optional)</label>
        <input className="input" placeholder="e.g. Leg Day" value={name} onChange={e => setName(e.target.value)} />
      </div>

      <div className="field">
        <label className="label">Date</label>
        <input className="input" type="date" value={date} onChange={e => setDate(e.target.value)} required />
      </div>

      <div className="field">
        <label className="label">Notes before workout (optional)</label>
        <textarea className="input" rows={2} placeholder="How are you feeling going in?" value={notesBefore} onChange={e => setNotesBefore(e.target.value)} />
      </div>

      {exercises.map((ex, i) => (
        <ExerciseCard
          key={i} ex={ex} index={i}
          onChange={updateExercise} onRemove={removeExercise}
          canRemove={exercises.length > 1}
        />
      ))}

      <button type="button" className="btn-secondary" onClick={addExercise}>+ Add Exercise</button>

      <div className="field">
        <label className="label">Notes after workout (optional)</label>
        <textarea className="input" rows={2} placeholder="How'd it go?" value={notesAfter} onChange={e => setNotesAfter(e.target.value)} />
      </div>

      <div className="field">
        <label className="label">Progress photo (optional)</label>
        {!hasExistingPhoto && (
          <input className="input" type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif" ref={fileRef} onChange={onPhoto} />
        )}
      </div>
      {compressingPhoto && <p className="muted" style={{fontSize:'12px'}}>Optimizing photo…</p>}
      {photoPreview && !compressingPhoto && (
        <div>
          <img src={photoPreview} alt="preview" className="photo-preview" />
          {hasExistingPhoto && (
            <button type="button" className="btn-ghost-sm" style={{marginTop:'8px'}} onClick={()=>setShowRemovePhotoPopup(true)}>
              Remove Photo
            </button>
          )}
        </div>
      )}
      {showRemovePhotoPopup && (
        <div className="glass-card" style={{marginTop:'-8px'}}>
          <p style={{fontSize:'13px',fontWeight:'600',marginBottom:'10px'}}>Remove this photo from the workout?</p>
          <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
            <button type="button" className="btn-accent-sm" onClick={()=>confirmRemovePhoto(true)}>Keep in Progress Photos</button>
            <button type="button" className="btn-danger-sm" onClick={()=>confirmRemovePhoto(false)}>Delete Completely</button>
            <button type="button" className="btn-ghost-sm" onClick={()=>setShowRemovePhotoPopup(false)}>Cancel</button>
          </div>
        </div>
      )}

      {error && <p className="form-error">{error}</p>}
      {result && (
        <div className={`result-banner ${newPRs.length ? 'pr-banner' : ''}`}>
          {newPRs.length
            ? newPRs.map(p => (
              <div key={p.exercise}>🏆 New PR — {p.exercise}: {p.previousMax != null ? `${p.previousMax} → ` : ''}{p.newMax}{p.unit === 'lbs' ? ' lbs' : p.unit === 'reps' ? ' reps' : ''}</div>
            ))
            : `✅ Workout ${mode === 'edit' ? 'updated' : 'logged'}!`}
        </div>
      )}

      <button className="btn-primary" type="submit" disabled={loading || compressingPhoto}>
        {loading ? 'Saving…' : mode === 'edit' ? 'Save Changes' : 'Log Workout'}
      </button>

      {mode === 'edit' && (
        <button type="button" className="btn-danger" onClick={onDelete}>
          Delete Workout
        </button>
      )}
    </form>
  );
}
