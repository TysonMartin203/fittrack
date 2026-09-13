import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { formatDateStr } from '../dateUtils';

export default function MealHistory() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getMealLogHistory()
      .then(setMeals)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function remove(id) {
    setMeals(m => m.filter(x => x.id !== id));
    try { await api.deleteLoggedMeal(id); } catch {}
  }

  // Group by date for a cleaner read
  const byDate = meals.reduce((acc, m) => {
    (acc[m.date] = acc[m.date] || []).push(m);
    return acc;
  }, {});

  return (
    <div className="page">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}}>
        <h2 className="page-title" style={{marginBottom:0}}>Meal History</h2>
        <Link to="/meals" className="link-small">← Meals</Link>
      </div>

      {loading ? <div className="spinner"/> : error ? <p className="form-error">{error}</p> : meals.length === 0 ? (
        <p className="muted">No meals logged yet. <Link to="/meals/log">Log your first!</Link></p>
      ) : (
        Object.entries(byDate).map(([date, dayMeals]) => (
          <div key={date} style={{marginBottom:'18px'}}>
            <div className="muted" style={{fontSize:'12px',fontWeight:'700',marginBottom:'6px'}}>{formatDateStr(date, {month:'long',day:'numeric',year:'numeric'})}</div>
            {dayMeals.map(m => (
              <div key={m.id} className="list-item" style={{marginBottom:'6px'}}>
                <div style={{flex:1}}>
                  <div className="item-main">{m.name}</div>
                  <div className="item-meta">{m.meal_type}{m.calories ? ` · ${m.calories} cal` : ''}</div>
                </div>
                <button className="btn-ghost-sm" onClick={()=>remove(m.id)}>Delete</button>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}
