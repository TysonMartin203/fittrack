import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { today, formatDateStr } from '../dateUtils';

export default function CalorieTracker() {
  const [date, setDate] = useState(today());
  const [totals, setTotals] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0, mealCount: 0 });
  const [loading, setLoading] = useState(true);
  const [calorieGoal, setCalorieGoal] = useState(null);

  useEffect(() => {
    setLoading(true);
    api.getMealsForDate(date)
      .then(d => setTotals(d.totals))
      .catch(console.error)
      .finally(() => setLoading(false));
    api.getProfile().then(d => { if (d.profile?.calorieGoal) setCalorieGoal(Number(d.profile.calorieGoal)); }).catch(()=>{});
  }, [date]);

  const pct = calorieGoal ? Math.min(100, Math.round((totals.calories / calorieGoal) * 100)) : null;
  const overGoal = calorieGoal && totals.calories > calorieGoal;
  const remaining = calorieGoal ? Math.max(0, calorieGoal - totals.calories) : null;

  return (
    <div className="page">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}}>
        <h2 className="page-title" style={{marginBottom:0}}>Calorie Tracker</h2>
        <Link to="/meals" className="link-small">← Meals</Link>
      </div>

      <div className="field" style={{marginBottom:'16px'}}>
        <label className="label">Date</label>
        <input className="input" type="date" value={date} onChange={e=>setDate(e.target.value)} max={today()}/>
      </div>

      {loading ? <div className="spinner"/> : (
        <div className="glass-card" style={{marginBottom:'16px'}}>
          <div style={{textAlign:'center',marginBottom:'14px'}}>
            <div style={{fontSize:'40px',fontWeight:'700',color: overGoal ? 'var(--danger)' : 'var(--accent)'}}>{totals.calories}</div>
            <div className="muted" style={{fontSize:'13px'}}>
              {calorieGoal ? `of ${calorieGoal} calorie goal` : 'calories logged'}
              {calorieGoal && !overGoal && ` · ${remaining} remaining`}
              {overGoal && ` · ${totals.calories - calorieGoal} over`}
            </div>
          </div>
          {calorieGoal != null && (
            <div style={{width:'100%',height:'10px',background:'var(--surface-tint)',borderRadius:'999px',overflow:'hidden',marginBottom:'18px'}}>
              <div style={{width:`${pct}%`,height:'100%',background: overGoal ? 'var(--danger)' : 'var(--accent)',borderRadius:'999px',transition:'width .3s'}}/>
            </div>
          )}
          {!calorieGoal && (
            <p className="muted" style={{fontSize:'12px',textAlign:'center',marginBottom:'14px'}}>
              Set a daily calorie goal in your <Link to="/settings">Meal & Workout Profile</Link> to track progress against it.
            </p>
          )}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'10px',textAlign:'center'}}>
            <div>
              <div style={{fontSize:'20px',fontWeight:'700'}}>{Math.round(totals.protein)}g</div>
              <div className="muted" style={{fontSize:'12px'}}>Protein</div>
            </div>
            <div>
              <div style={{fontSize:'20px',fontWeight:'700'}}>{Math.round(totals.carbs)}g</div>
              <div className="muted" style={{fontSize:'12px'}}>Carbs</div>
            </div>
            <div>
              <div style={{fontSize:'20px',fontWeight:'700'}}>{Math.round(totals.fat)}g</div>
              <div className="muted" style={{fontSize:'12px'}}>Fat</div>
            </div>
          </div>
        </div>
      )}

      <p className="muted" style={{fontSize:'12px',textAlign:'center'}}>
        {totals.mealCount} meal{totals.mealCount===1?'':'s'} logged {date===today() ? 'today' : `on ${formatDateStr(date,{month:'long',day:'numeric'})}`}.{' '}
        <Link to="/meals/log">Log one</Link>
      </p>
    </div>
  );
}
