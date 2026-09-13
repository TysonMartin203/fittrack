import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { today, formatDateStr } from '../dateUtils';
import { IconTrash } from '../components/Icons';

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

export default function LogMeal() {
  const [date, setDate] = useState(today());
  const [mealType, setMealType] = useState('Breakfast');
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

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
