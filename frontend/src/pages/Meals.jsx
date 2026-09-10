import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { IconSparkle, IconRefresh } from '../components/Icons';

const GOALS = ['Cut (Lose Fat)', 'Bulk (Gain Muscle)', 'Maintain', 'Recomp'];
const RESTRICTIONS = ['Vegan','Vegetarian','Gluten-Free','Dairy-Free','Pescatarian','Nut-Free','Halal','Kosher'];

export default function Meals() {
  const [tab,          setTab]         = useState('plan');    // 'plan' | 'profile'
  const [profile,      setProfile]     = useState({ weight:'', goalWeight:'', goal: GOALS[2], timeline:'', restrictions:[], dislikes:'' });
  const [plan,         setPlan]        = useState(null);
  const [loading,      setLoading]     = useState(true);
  const [generating,   setGenerating]  = useState(false);
  const [error,        setError]       = useState('');
  const [swapping,     setSwapping]    = useState(null);   // {dayIdx, mealIdx}

  useEffect(() => {
    api.getMealPlan()
      .then(data => { if (data?.plan) setPlan(data.plan); if (data?.profile) setProfile(p => ({...p,...data.profile})); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function toggleRestriction(r) {
    setProfile(p => ({
      ...p,
      restrictions: p.restrictions.includes(r)
        ? p.restrictions.filter(x => x !== r)
        : [...p.restrictions, r]
    }));
  }

  async function saveProfile(e) {
    e.preventDefault();
    setError('');
    try {
      await api.saveMealProfile(profile);
      setTab('plan');
    } catch (err) { setError(err.message); }
  }

  async function generate() {
    setGenerating(true); setError('');
    try {
      const data = await api.generateMealPlan(profile);
      setPlan(data.plan);
      setTab('plan');
    } catch (err) {
      setError(err.message || 'Failed to generate plan. Make sure your profile is filled out.');
    } finally {
      setGenerating(false);
    }
  }

  async function swapMeal(dayIdx, mealIdx, mealName) {
    setSwapping({ dayIdx, mealIdx });
    try {
      const data = await api.swapMeal({ mealName, restrictions: profile.restrictions, macroTarget: plan.days[dayIdx].meals[mealIdx] });
      setPlan(p => {
        const days = p.days.map((d, di) => di !== dayIdx ? d : {
          ...d,
          meals: d.meals.map((m, mi) => mi !== mealIdx ? m : { ...m, ...data.meal })
        });
        return { ...p, days };
      });
    } catch (err) { setError('Swap failed — try again'); }
    finally { setSwapping(null); }
  }

  if (loading) return <div className="page"><div className="spinner"/></div>;

  return (
    <div className="page">
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'24px'}}>
        <h2 className="page-title" style={{marginBottom:0}}>Meals</h2>
        <div style={{display:'flex',gap:'8px'}}>
          <button className={tab==='plan' ? 'tab active' : 'tab'} style={{padding:'8px 14px',fontSize:'13px'}} onClick={() => setTab('plan')}>Plan</button>
          <button className={tab==='profile' ? 'tab active' : 'tab'} style={{padding:'8px 14px',fontSize:'13px'}} onClick={() => setTab('profile')}>Profile</button>
        </div>
      </div>

      {error && <p className="form-error" style={{marginBottom:'16px'}}>{error}</p>}

      {/* ── PROFILE TAB ── */}
      {tab === 'profile' && (
        <form onSubmit={saveProfile} className="form-stack">
          <div className="card-form">
            <div className="form-stack">
              <div className="field"><label className="label">Current Weight (lbs)</label>
                <input className="input" type="number" placeholder="185" value={profile.weight} onChange={e=>setProfile(p=>({...p,weight:e.target.value}))} /></div>
              <div className="field"><label className="label">Goal Weight (lbs)</label>
                <input className="input" type="number" placeholder="175" value={profile.goalWeight} onChange={e=>setProfile(p=>({...p,goalWeight:e.target.value}))} /></div>
              <div className="field"><label className="label">Goal</label>
                <select className="input" value={profile.goal} onChange={e=>setProfile(p=>({...p,goal:e.target.value}))}>
                  {GOALS.map(g => <option key={g}>{g}</option>)}
                </select></div>
              <div className="field"><label className="label">Timeline (weeks)</label>
                <input className="input" type="number" placeholder="12" value={profile.timeline} onChange={e=>setProfile(p=>({...p,timeline:e.target.value}))} /></div>
            </div>
          </div>

          <div className="card-form">
            <p className="label" style={{marginBottom:'12px'}}>Dietary Restrictions</p>
            <div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>
              {RESTRICTIONS.map(r => (
                <button key={r} type="button"
                  onClick={() => toggleRestriction(r)}
                  style={{
                    padding:'6px 14px',fontSize:'13px',fontWeight:'500',borderRadius:'999px',border:'1px solid',
                    borderColor: profile.restrictions.includes(r) ? 'var(--teal)' : 'var(--border)',
                    background:  profile.restrictions.includes(r) ? 'rgba(126,176,155,0.15)' : 'none',
                    color:       profile.restrictions.includes(r) ? 'var(--teal)' : 'var(--muted)',
                    transition: 'all .15s',
                  }}>
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="card-form">
            <div className="field">
              <label className="label">Foods You Dislike</label>
              <input className="input" placeholder="e.g. shellfish, mushrooms, cilantro" value={profile.dislikes} onChange={e=>setProfile(p=>({...p,dislikes:e.target.value}))} />
            </div>
          </div>

          <button className="btn-secondary" type="submit">Save Profile</button>
          <button className="btn-primary" type="button" onClick={generate} disabled={generating}>
            <span style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'8px'}}>
              <IconSparkle style={{width:'16px',height:'16px'}}/> {generating ? 'Generating…' : 'Generate AI Meal Plan'}
            </span>
          </button>
        </form>
      )}

      {/* ── PLAN TAB ── */}
      {tab === 'plan' && (
        <>
          {!plan ? (
            <div className="empty-state">
              <IconMealsLarge />
              <p style={{marginBottom:'20px'}}>No meal plan yet.<br/>Set up your profile and let AI build one for you.</p>
              <button className="btn-primary" style={{maxWidth:'280px',margin:'0 auto'}} onClick={() => setTab('profile')}>
                Set Up Profile
              </button>
            </div>
          ) : (
            <>
              <div className="glass-card" style={{marginBottom:'20px'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'12px'}}>
                  <div>
                    <div style={{fontWeight:'700',fontSize:'15px'}}>Daily Target</div>
                    <div style={{fontSize:'13px',color:'var(--muted)'}}>Based on your {profile.goal} goal</div>
                  </div>
                  <button className="btn-ghost" style={{padding:'7px 12px',fontSize:'13px',display:'flex',alignItems:'center',gap:'6px'}} onClick={generate} disabled={generating}>
                    <IconRefresh style={{width:'14px',height:'14px'}}/> {generating ? '…' : 'Refresh'}
                  </button>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'8px',textAlign:'center'}}>
                  {[
                    {label:'Calories',val:plan.daily_calories},
                    {label:'Protein',val:`${plan.macros?.protein}g`},
                    {label:'Carbs',val:`${plan.macros?.carbs}g`},
                    {label:'Fat',val:`${plan.macros?.fat}g`},
                  ].map(({label,val}) => (
                    <div key={label} style={{background:'rgba(28,46,48,.5)',borderRadius:'10px',padding:'10px 4px'}}>
                      <div style={{fontWeight:'700',fontSize:'16px',color:'var(--text)'}}>{val}</div>
                      <div style={{fontSize:'11px',color:'var(--muted)'}}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {plan.days?.map((day, di) => (
                <div key={di} className="section">
                  <div className="section-header">
                    <span className="section-title">{day.day}</span>
                    <span style={{fontSize:'12px',color:'var(--muted)'}}>{day.meals?.reduce((s,m)=>s+(m.calories||0),0)} cal</span>
                  </div>
                  {day.meals?.map((meal, mi) => (
                    <div key={mi} className="glass-card" style={{marginBottom:'10px'}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'6px'}}>
                        <div>
                          <div style={{fontSize:'11px',color:'var(--teal)',fontWeight:'600',textTransform:'uppercase',letterSpacing:'.05em',marginBottom:'2px'}}>{meal.type}</div>
                          <div style={{fontWeight:'700',fontSize:'15px'}}>{meal.name}</div>
                        </div>
                        <div style={{textAlign:'right',flexShrink:0,marginLeft:'12px'}}>
                          <div style={{fontWeight:'700',color:'var(--rose)',fontSize:'14px'}}>{meal.calories} cal</div>
                          {meal.can_substitute && (
                            <button
                              className="btn-ghost-sm"
                              style={{marginTop:'4px',fontSize:'11px'}}
                              disabled={swapping?.dayIdx===di && swapping?.mealIdx===mi}
                              onClick={() => swapMeal(di, mi, meal.name)}>
                              {swapping?.dayIdx===di && swapping?.mealIdx===mi ? '…' : '↔ Swap'}
                            </button>
                          )}
                        </div>
                      </div>
                      <div style={{display:'flex',gap:'12px',fontSize:'12px',color:'var(--muted)',marginBottom:'8px'}}>
                        <span>P: {meal.protein}g</span>
                        <span>C: {meal.carbs}g</span>
                        <span>F: {meal.fat}g</span>
                      </div>
                      {meal.ingredients?.length > 0 && (
                        <div style={{display:'flex',flexWrap:'wrap',gap:'5px'}}>
                          {meal.ingredients.map(ing => (
                            <span key={ing} style={{fontSize:'11px',background:'rgba(28,46,48,.6)',border:'1px solid var(--border)',borderRadius:'6px',padding:'2px 8px',color:'var(--muted)'}}>{ing}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </>
          )}
        </>
      )}
    </div>
  );
}

function IconMealsLarge() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{margin:'0 auto 12px',opacity:.4}}>
      <path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/>
      <line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
    </svg>
  );
}
