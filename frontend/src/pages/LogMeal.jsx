import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { api } from '../api/client';
import { today, formatDateStr } from '../dateUtils';
import { IconTrash, IconCamera } from '../components/Icons';
import { compressImage } from '../compressImage';

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

export default function LogMeal() {
  const location = useLocation();
  const prefill = location.state; // { mealType, name, calories, protein, carbs, fat } when arriving from a meal plan

  const [date, setDate] = useState(today());
  const [mealType, setMealType] = useState(prefill?.mealType && MEAL_TYPES.includes(prefill.mealType) ? prefill.mealType : 'Breakfast');
  const [name, setName] = useState(prefill?.name || '');
  const [calories, setCalories] = useState(prefill?.calories != null ? String(prefill.calories) : '');
  const [protein, setProtein] = useState(prefill?.protein != null ? String(prefill.protein) : '');
  const [carbs, setCarbs] = useState(prefill?.carbs != null ? String(prefill.carbs) : '');
  const [fat, setFat] = useState(prefill?.fat != null ? String(prefill.fat) : '');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState('');
  const fileRef = useRef();

  const [meals, setMeals] = useState([]);
  const [totals, setTotals] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 });
  const [loadingDay, setLoadingDay] = useState(true);
  const [calorieGoal, setCalorieGoal] = useState(null);

  useEffect(() => {
    loadDay();
    api.getProfile().then(d => { if (d.profile?.calorieGoal) setCalorieGoal(Number(d.profile.calorieGoal)); }).catch(()=>{});
  }, [date]);

  function loadDay() {
    setLoadingDay(true);
    api.getMealsForDate(date)
      .then(d => { setMeals(d.meals); setTotals(d.totals); })
      .catch(console.error)
      .finally(() => setLoadingDay(false));
  }

  async function scanPhoto(e) {
    const file = e.target.files[0];
    if (!file) return;
    setScanning(true); setScanError('');
    try {
      const compressed = await compressImage(file, { maxDimension: 1024, quality: 0.8 });
      const fd = new FormData();
      fd.append('photo', compressed);
      const result = await api.recognizeFood(fd);
      setName(result.name || '');
      setCalories(result.calories != null ? String(result.calories) : '');
      setProtein(result.protein != null ? String(result.protein) : '');
      setCarbs(result.carbs != null ? String(result.carbs) : '');
      setFat(result.fat != null ? String(result.fat) : '');
    } catch (err) {
      setScanError(err.message || 'Could not read that photo — try a clearer shot or enter it manually.');
    } finally {
      setScanning(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  async function submit(e) {
    e.preventDefault();
    if (!name.trim()) { setError('Enter a meal name'); return; }
    setSaving(true); setError('');
    try {
      await api.logMeal({ date, mealType, name: name.trim(), calories, protein, carbs, fat, notes });
      setName(''); setCalories(''); setProtein(''); setCarbs(''); setFat(''); setNotes('');
      loadDay();
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  }

  async function removeMeal(id) {
    setMeals(m => m.filter(x => x.id !== id));
    try { await api.deleteLoggedMeal(id); loadDay(); }
    catch { loadDay(); }
  }

  const pct = calorieGoal ? Math.min(100, Math.round((totals.calories / calorieGoal) * 100)) : null;
  const overGoal = calorieGoal && totals.calories > calorieGoal;

  return (
    <div className="page">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}}>
        <h2 className="page-title" style={{marginBottom:0}}>Log a Meal</h2>
        <Link to="/meals" className="link-small">← Meals</Link>
      </div>
      {prefill?.planLabel && (
        <p className="muted" style={{fontSize:'13px',marginTop:'-12px',marginBottom:'16px'}}>From plan: {prefill.planLabel}</p>
      )}

      <div className="card-form">
        <form onSubmit={submit} className="form-stack">
          <div className="field">
            <label className="label">Date</label>
            <input className="input" type="date" value={date} onChange={e=>setDate(e.target.value)} required/>
          </div>
          <div className="field">
            <label className="label">Meal</label>
            <div className="tab-row">
              {MEAL_TYPES.map(t => (
                <button type="button" key={t} className={mealType===t?'tab active':'tab'} onClick={()=>setMealType(t)}>{t}</button>
              ))}
            </div>
          </div>
          <div className="field">
            <label className="label">Scan a Photo (optional)</label>
            <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={scanPhoto} style={{display:'none'}} id="food-photo-input"/>
            <label htmlFor="food-photo-input" className="btn-secondary" style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',cursor:'pointer'}}>
              <IconCamera style={{width:'16px',height:'16px'}}/> {scanning ? 'Reading photo…' : 'Take or Choose a Photo'}
            </label>
            {scanError && <p className="form-error" style={{marginTop:'8px'}}>{scanError}</p>}
            <p className="muted" style={{fontSize:'12px',marginTop:'6px'}}>Fills in the fields below automatically — double check them before logging, since it's an estimate.</p>
          </div>
          <div className="field">
            <label className="label">What did you eat?</label>
            <input className="input" placeholder="e.g. Grilled chicken with rice and broccoli" value={name} onChange={e=>setName(e.target.value)} required/>
          </div>
          <div className="input-row">
            <div className="input-group">
              <label className="label">Calories</label>
              <input className="input" type="number" min="0" placeholder="450" value={calories} onChange={e=>setCalories(e.target.value)}/>
            </div>
            <div className="input-group">
              <label className="label">Protein (g)</label>
              <input className="input" type="number" min="0" placeholder="35" value={protein} onChange={e=>setProtein(e.target.value)}/>
            </div>
          </div>
          <div className="input-row">
            <div className="input-group">
              <label className="label">Carbs (g)</label>
              <input className="input" type="number" min="0" placeholder="40" value={carbs} onChange={e=>setCarbs(e.target.value)}/>
            </div>
            <div className="input-group">
              <label className="label">Fat (g)</label>
              <input className="input" type="number" min="0" placeholder="12" value={fat} onChange={e=>setFat(e.target.value)}/>
            </div>
          </div>
          <div className="field">
            <label className="label">Notes (optional)</label>
            <input className="input" placeholder="e.g. ate out, homemade, etc." value={notes} onChange={e=>setNotes(e.target.value)}/>
          </div>
          {error && <p className="form-error">{error}</p>}
          <button className="btn-primary" type="submit" disabled={saving}>{saving ? 'Logging…' : 'Log Meal'}</button>
        </form>
      </div>

      {/* Calorie tracker for the selected day */}
      <section className="section">
        <div className="section-header">
          <span className="section-title">{date === today() ? "Today" : formatDateStr(date, {month:'long',day:'numeric'})}</span>
        </div>
        <div className="glass-card" style={{marginBottom:'16px'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',marginBottom:'8px'}}>
            <span style={{fontSize:'24px',fontWeight:'700',color: overGoal ? 'var(--danger)' : 'var(--accent)'}}>{totals.calories}</span>
            <span className="muted" style={{fontSize:'13px'}}>{calorieGoal ? `of ${calorieGoal} cal goal` : 'calories logged'}</span>
          </div>
          {calorieGoal != null && (
            <div style={{width:'100%',height:'8px',background:'var(--surface-tint)',borderRadius:'999px',overflow:'hidden',marginBottom:'12px'}}>
              <div style={{width:`${pct}%`,height:'100%',background: overGoal ? 'var(--danger)' : 'var(--accent)',borderRadius:'999px',transition:'width .3s'}}/>
            </div>
          )}
          <div style={{display:'flex',gap:'16px',fontSize:'13px'}}>
            <span><strong>{Math.round(totals.protein)}g</strong> <span className="muted">protein</span></span>
            <span><strong>{Math.round(totals.carbs)}g</strong> <span className="muted">carbs</span></span>
            <span><strong>{Math.round(totals.fat)}g</strong> <span className="muted">fat</span></span>
          </div>
        </div>

        {loadingDay ? <div className="spinner"/> : meals.length === 0 ? (
          <p className="muted" style={{fontSize:'13px'}}>Nothing logged for this day yet.</p>
        ) : (
          MEAL_TYPES.map(type => {
            const forType = meals.filter(m => m.meal_type === type);
            if (forType.length === 0) return null;
            return (
              <div key={type} style={{marginBottom:'12px'}}>
                <div className="muted" style={{fontSize:'11px',fontWeight:'700',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:'6px'}}>{type}</div>
                {forType.map(m => (
                  <div key={m.id} className="list-item" style={{marginBottom:'6px'}}>
                    <div style={{flex:1}}>
                      <div className="item-main">{m.name}</div>
                      <div className="item-meta">{m.calories ? `${m.calories} cal` : ''}{m.protein ? ` · ${m.protein}g protein` : ''}</div>
                    </div>
                    <button className="btn-ghost-sm" onClick={()=>removeMeal(m.id)}><IconTrash style={{width:'14px',height:'14px'}}/></button>
                  </div>
                ))}
              </div>
            );
          })
        )}
      </section>
    </div>
  );
}
