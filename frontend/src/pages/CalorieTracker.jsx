import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { today, formatDateStr } from '../dateUtils';
import { getMacroGoals } from '../macroGoals';
import MacroProgressBar from '../components/MacroProgressBar';

export default function CalorieTracker() {
  const [date, setDate] = useState(today());
  const [totals, setTotals] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0, mealCount: 0 });
  const [loading, setLoading] = useState(true);
  const [calorieGoal, setCalorieGoal] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    setLoading(true);
    api.getMealsForDate(date)
      .then(d => setTotals(d.totals))
      .catch(console.error)
      .finally(() => setLoading(false));
    api.getProfile().then(d => {
      setProfile(d.profile);
      if (d.profile?.calorieGoal) setCalorieGoal(Number(d.profile.calorieGoal));
    }).catch(()=>{});
  }, [date]);

  const overGoal = calorieGoal && totals.calories > calorieGoal;
  const remaining = calorieGoal ? Math.max(0, calorieGoal - totals.calories) : null;
  const macroGoals = getMacroGoals(profile, calorieGoal);

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
          <div style={{textAlign:'center',marginBottom:'10px'}}>
            <div style={{fontSize:'40px',fontWeight:'700',color: overGoal ? 'var(--danger)' : 'var(--accent)'}}>{totals.calories}</div>
            <div className="muted" style={{fontSize:'13px'}}>
              {calorieGoal ? `of ${calorieGoal} calorie goal` : 'calories logged'}
              {calorieGoal && !overGoal && ` · ${remaining} remaining`}
              {overGoal && ` · ${totals.calories - calorieGoal} over`}
            </div>
          </div>
          {calorieGoal != null && (
            <div style={{marginBottom:'18px'}}>
              <MacroProgressBar value={totals.calories} max={calorieGoal} height="10px"/>
            </div>
          )}
          {!calorieGoal && (
            <p className="muted" style={{fontSize:'12px',textAlign:'center',marginBottom:'14px'}}>
              Set a daily calorie goal in your <Link to="/settings">Meal & Workout Profile</Link> to track progress against it.
            </p>
          )}

          {[
            { label: 'Protein', value: totals.protein, goal: macroGoals.protein, color: 'var(--teal)' },
            { label: 'Carbs',   value: totals.carbs,   goal: macroGoals.carbs,   color: 'var(--rose)' },
            { label: 'Fat',     value: totals.fat,     goal: macroGoals.fat,     color: 'var(--accent)' },
          ].map(m => (
            <div key={m.label} style={{marginBottom:'12px'}}>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:'12px',marginBottom:'4px'}}>
                <span style={{fontWeight:'700'}}>{m.label}</span>
                <span className="muted">{Math.round(m.value)}g{m.goal ? ` / ${m.goal}g` : ''}</span>
              </div>
              {m.goal ? <MacroProgressBar value={m.value} max={m.goal} color={m.color}/> : (
                <p className="muted" style={{fontSize:'11px',margin:0}}>Set a calorie goal to see a target here.</p>
              )}
            </div>
          ))}
        </div>
      )}

      <p className="muted" style={{fontSize:'12px',textAlign:'center'}}>
        {totals.mealCount} meal{totals.mealCount===1?'':'s'} logged {date===today() ? 'today' : `on ${formatDateStr(date,{month:'long',day:'numeric'})}`}.{' '}
        <Link to="/meals/log">Log one</Link>
      </p>
    </div>
  );
}
