import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { api } from '../api/client';
import { today, formatDateStr } from '../dateUtils';
import { IconTrash, IconCamera, IconWave, IconPlus } from '../components/Icons';
import { compressImage } from '../compressImage';
import VoiceNoteButton from '../components/VoiceNoteButton';

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

function blankIngredient() {
  return { key: Math.random().toString(36).slice(2), name: '', calories: '', protein: '', carbs: '', fat: '' };
}

export default function LogMeal() {
  const location = useLocation();
  const prefill = location.state; // { mealType, name, calories, protein, carbs, fat } when arriving from a meal plan

  const [date, setDate] = useState(today());
  const [mealType, setMealType] = useState(prefill?.mealType && MEAL_TYPES.includes(prefill.mealType) ? prefill.mealType : 'Breakfast');
  const [ingredients, setIngredients] = useState(() => {
    if (prefill?.name) {
      return [{ key: 'prefill', name: prefill.name, calories: prefill.calories ?? '', protein: prefill.protein ?? '', carbs: prefill.carbs ?? '', fat: prefill.fat ?? '' }];
    }
    return [blankIngredient()];
  });
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [scanError, setScanError] = useState('');
  const [voiceLoading, setVoiceLoading] = useState(false);
  const [voiceError, setVoiceError] = useState('');
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

  function updateIngredient(i, patch) {
    setIngredients(prev => prev.map((ing, idx) => idx === i ? { ...ing, ...patch } : ing));
  }
  function addIngredient() {
    setIngredients(prev => [...prev, blankIngredient()]);
  }
  function removeIngredient(i) {
    setIngredients(prev => prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev);
  }

  // Live running total as ingredient rows are edited — this is the number that actually gets logged.
  const liveTotals = ingredients.reduce((sum, ing) => ({
    calories: sum.calories + (Number(ing.calories) || 0),
    protein: sum.protein + (Number(ing.protein) || 0),
    carbs: sum.carbs + (Number(ing.carbs) || 0),
    fat: sum.fat + (Number(ing.fat) || 0),
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  function applyAiResult(result) {
    if (result.items?.length > 0) {
      setIngredients(result.items.map(it => ({
        key: Math.random().toString(36).slice(2),
        name: it.portion ? `${it.item} (${it.portion})` : (it.item || ''),
        calories: it.calories ?? '', protein: it.protein ?? '', carbs: it.carbs ?? '', fat: it.fat ?? '',
      })));
    } else {
      setIngredients([{
        key: Math.random().toString(36).slice(2),
        name: result.name || '', calories: result.calories ?? '', protein: result.protein ?? '', carbs: result.carbs ?? '', fat: result.fat ?? '',
      }]);
    }
  }

  async function scanPhoto(e) {
    const file = e.target.files[0];
    if (!file) return;
    setScanning(true); setScanError('');
    try {
      const compressed = await compressImage(file, { maxDimension: 1536, quality: 0.85 });
      const fd = new FormData();
      fd.append('photo', compressed);
      const result = await api.recognizeFood(fd);
      applyAiResult(result);
      setScanResult(result);
    } catch (err) {
      setScanError(err.message || 'Could not read that photo — try a clearer shot or enter it manually.');
      setScanResult(null);
    } finally {
      setScanning(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  async function handleVoiceTranscript(text) {
    setVoiceLoading(true); setVoiceError('');
    try {
      const result = await api.parseMealVoice({ transcript: text });
      if (result.mealType && MEAL_TYPES.includes(result.mealType)) setMealType(result.mealType);
      applyAiResult(result);
    } catch (err) {
      console.error(err);
      setVoiceError('Sorry, I couldn\'t catch that — please try again.');
    } finally {
      setVoiceLoading(false);
    }
  }

  async function submit(e) {
    e.preventDefault();
    const cleanIngredients = ingredients.filter(ing => ing.name.trim());
    if (cleanIngredients.length === 0) { setError('Add at least one item'); return; }
    setSaving(true); setError('');
    try {
      const name = cleanIngredients.map(i => i.name).join(', ');
      await api.logMeal({
        date, mealType, name, notes,
        calories: liveTotals.calories || null, protein: liveTotals.protein || null, carbs: liveTotals.carbs || null, fat: liveTotals.fat || null,
        ingredients: cleanIngredients.map(({ key, ...rest }) => rest),
      });
      setIngredients([blankIngredient()]); setNotes('');
      setScanResult(null);
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
        <p className="muted" style={{marginTop:'-12px',marginBottom:'16px',fontSize:'13px'}}>From plan: {prefill.planLabel}</p>
      )}

      <form onSubmit={submit} className="form-stack">
        {/* When & what meal */}
        <div className="card-form">
          <div className="input-row">
            <div className="input-group">
              <label className="label">Date</label>
              <input className="input" type="date" value={date} onChange={e=>setDate(e.target.value)} required/>
            </div>
          </div>
          <div className="field" style={{marginTop:'10px',marginBottom:0}}>
            <label className="label">Meal</label>
            <div className="tab-row">
              {MEAL_TYPES.map(t => (
                <button type="button" key={t} className={mealType===t?'tab active':'tab'} onClick={()=>setMealType(t)}>{t}</button>
              ))}
            </div>
          </div>
        </div>

        {/* AI quick-add helpers */}
        <div className="card-form">
          <div className="glass-card" style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'12px',border:'1px solid var(--accent)'}}>
            <IconWave style={{width:'22px',height:'22px',color:'var(--accent)',flexShrink:0}}/>
            <p style={{fontSize:'13px',fontWeight:'600',margin:0}}>Place your open hand flat next to the food before you snap the photo — it's the key to a more accurate size estimate.</p>
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={scanPhoto} style={{display:'none'}} id="food-photo-input"/>
          <label htmlFor="food-photo-input" className="btn-secondary" style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',cursor:'pointer',marginBottom:'10px'}}>
            <IconCamera style={{width:'16px',height:'16px'}}/> {scanning ? 'Reading photo…' : 'Take or Choose a Photo'}
          </label>
          {scanError && <p className="form-error" style={{marginBottom:'8px'}}>{scanError}</p>}
          {scanResult && (
            <div className="glass-card" style={{marginBottom:'10px',padding:'12px'}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                <span style={{fontSize:'12px',fontWeight:'700'}}>AI estimate — edit the rows below if needed</span>
                <span style={{
                  fontSize:'11px',fontWeight:'700',padding:'2px 8px',borderRadius:'999px',flexShrink:0,marginLeft:'8px',
                  background: scanResult.confidence==='high' ? 'var(--sage)' : scanResult.confidence==='low' ? 'var(--danger)' : 'var(--accent)',
                  color:'#fff',
                }}>
                  {scanResult.confidence==='high' ? 'High confidence' : scanResult.confidence==='low' ? 'Low confidence' : 'Medium confidence'}
                </span>
              </div>
              {scanResult.notes && <p className="muted" style={{fontSize:'12px',marginTop:'6px',fontStyle:'italic'}}>{scanResult.notes}</p>}
            </div>
          )}
          <VoiceNoteButton label="Or Describe What You Ate" onTranscript={handleVoiceTranscript}/>
          {voiceLoading && <p className="muted" style={{fontSize:'12px',marginTop:'6px'}}>Working it out…</p>}
          {voiceError && <p className="form-error" style={{marginTop:'6px'}}>{voiceError}</p>}
        </div>

        {/* Running total — the number that actually gets logged */}
        <div className="glass-card" style={{textAlign:'center'}}>
          <div style={{fontSize:'32px',fontWeight:'700',color:'var(--accent)',lineHeight:1.1}}>{Math.round(liveTotals.calories)}</div>
          <div className="muted" style={{fontSize:'12px',marginBottom:'6px'}}>calories</div>
          <div style={{display:'flex',gap:'16px',justifyContent:'center',fontSize:'13px'}}>
            <span><strong>{Math.round(liveTotals.protein)}g</strong> <span className="muted">protein</span></span>
            <span><strong>{Math.round(liveTotals.carbs)}g</strong> <span className="muted">carbs</span></span>
            <span><strong>{Math.round(liveTotals.fat)}g</strong> <span className="muted">fat</span></span>
          </div>
        </div>

        {/* Ingredient rows — each one separately editable */}
        <div className="card-form">
          <label className="label" style={{display:'block',marginBottom:'10px'}}>What did you eat?</label>
          {ingredients.map((ing, i) => (
            <div key={ing.key} style={{border:'1px solid var(--border)',borderRadius:'var(--r-sm)',padding:'10px',marginBottom:'8px'}}>
              <div style={{display:'flex',gap:'8px',alignItems:'center',marginBottom:'8px'}}>
                <input className="input" placeholder="e.g. Grilled chicken breast" value={ing.name}
                  onChange={e=>updateIngredient(i, { name: e.target.value })} style={{flex:1}}/>
                {ingredients.length > 1 && (
                  <button type="button" className="btn-ghost-sm" onClick={()=>removeIngredient(i)} style={{flexShrink:0}}>
                    <IconTrash style={{width:'14px',height:'14px'}}/>
                  </button>
                )}
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(4, 1fr)',gap:'6px'}}>
                <input className="input" type="number" min="0" placeholder="Cal" value={ing.calories} onChange={e=>updateIngredient(i, { calories: e.target.value })} style={{fontSize:'13px',padding:'8px 10px'}}/>
                <input className="input" type="number" min="0" placeholder="Protein" value={ing.protein} onChange={e=>updateIngredient(i, { protein: e.target.value })} style={{fontSize:'13px',padding:'8px 10px'}}/>
                <input className="input" type="number" min="0" placeholder="Carbs" value={ing.carbs} onChange={e=>updateIngredient(i, { carbs: e.target.value })} style={{fontSize:'13px',padding:'8px 10px'}}/>
                <input className="input" type="number" min="0" placeholder="Fat" value={ing.fat} onChange={e=>updateIngredient(i, { fat: e.target.value })} style={{fontSize:'13px',padding:'8px 10px'}}/>
              </div>
            </div>
          ))}
          <button type="button" className="btn-ghost-sm" onClick={addIngredient} style={{display:'flex',alignItems:'center',gap:'6px'}}>
            <IconPlus style={{width:'14px',height:'14px'}}/> Add Another Item
          </button>
        </div>

        <div className="card-form">
          <div className="field" style={{marginBottom:0}}>
            <label className="label">Notes (optional)</label>
            <input className="input" placeholder="e.g. ate out, homemade, etc." value={notes} onChange={e=>setNotes(e.target.value)}/>
          </div>
        </div>

        {error && <p className="form-error">{error}</p>}
        <button className="btn-primary" type="submit" disabled={saving}>{saving ? 'Logging…' : 'Log Meal'}</button>
      </form>

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
