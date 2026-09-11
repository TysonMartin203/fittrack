import { useState, useEffect, useRef } from 'react';
import { api } from '../api/client';
import MealPlanIcon from '../components/MealPlanIcons';
import { IconSparkle, IconRefresh } from '../components/Icons';
import KitchenIllustration from '../components/KitchenIllustration';

const RESTRICTION_SUGGESTIONS = [
  'Vegan','Vegetarian','Gluten-Free','Dairy-Free','Pescatarian','Nut-Free','Halal','Kosher',
  'Keto','Paleo','Low-FODMAP','Low-Sodium','Low-Carb','Low-Fat','Diabetic-Friendly',
  'High-Protein','Mediterranean','Whole30','Anti-Inflammatory','DASH Diet','Egg-Free',
  'Soy-Free','Shellfish-Free','Pork-Free','Red Meat-Free','Raw Food','Macrobiotic',
  'Intermittent Fasting Friendly','Low-Calorie','Low-Sugar','Low-Cholesterol',
];
const GOALS = ['Cut (Lose Fat)','Bulk (Gain Muscle)','Maintain','Recomp'];
const SECTIONS = ['Produce','Meat & Seafood','Dairy & Eggs','Bread & Grains','Canned & Dry Goods','Frozen','Condiments & Oils','Snacks & Nuts','Other'];

function categorize(ingredient) {
  const i = ingredient.toLowerCase();
  if (/chicken|beef|pork|turkey|salmon|tuna|shrimp|fish|steak|ground|sausage|bacon/.test(i)) return 'Meat & Seafood';
  if (/milk|yogurt|cheese|egg|butter|cream|whey/.test(i)) return 'Dairy & Eggs';
  if (/bread|oat|rice|pasta|flour|tortilla|cereal|grain|quinoa|barley/.test(i)) return 'Bread & Grains';
  if (/frozen/.test(i)) return 'Frozen';
  if (/oil|sauce|vinegar|ketchup|mustard|mayo|soy|honey|syrup|spice|salt|pepper|seasoning|herb/.test(i)) return 'Condiments & Oils';
  if (/nut|almond|cashew|peanut|seed|granola|bar|chip|cracker/.test(i)) return 'Snacks & Nuts';
  if (/can|bean|lentil|chickpea|broth|stock|paste|coconut/.test(i)) return 'Canned & Dry Goods';
  if (/apple|banana|berry|orange|lemon|lime|grape|mango|spinach|kale|lettuce|broccoli|carrot|onion|garlic|pepper|cucumber|tomato|celery|avocado|sweet potato|potato|zucchini|mushroom|fruit|vegetable/.test(i)) return 'Produce';
  return 'Other';
}

function buildShoppingList(plan) {
  if (!plan?.days) return {};
  const map = {};
  plan.days.forEach(day => {
    day.meals?.forEach(meal => {
      meal.ingredients?.forEach(ing => {
        const section = categorize(ing);
        if (!map[section]) map[section] = [];
        const base = ing.replace(/^\d+[\s\/\w]*\s/,'').toLowerCase();
        if (!map[section].find(x => x.base === base)) map[section].push({ text: ing, base, checked: false });
      });
    });
  });
  return map;
}

function RestrictionInput({ value, onChange }) {
  const [query, setQuery] = useState('');
  const [show,  setShow]  = useState(false);
  const filtered = query.length > 0 ? RESTRICTION_SUGGESTIONS.filter(s => s.toLowerCase().includes(query.toLowerCase()) && !value.includes(s)) : [];
  function add(r) { onChange([...value, r]); setQuery(''); setShow(false); }
  function remove(r) { onChange(value.filter(x => x !== r)); }
  return (
    <div>
      <div style={{display:'flex',flexWrap:'wrap',gap:'6px',marginBottom:'8px'}}>
        {value.map(r => <span key={r} onClick={() => remove(r)} style={{padding:'4px 12px',fontSize:'13px',fontWeight:'500',cursor:'pointer',background:'rgba(224,122,95,0.15)',border:'1px solid var(--teal)',borderRadius:'999px',color:'var(--teal)'}}>{r} ✕</span>)}
      </div>
      <div style={{position:'relative'}}>
        <input className="input" placeholder="Type to search restrictions…" value={query} onChange={e=>{setQuery(e.target.value);setShow(true);}} onFocus={()=>setShow(true)} onBlur={()=>setTimeout(()=>setShow(false),150)}/>
        {show && filtered.length > 0 && (
          <div style={{position:'absolute',top:'100%',left:0,right:0,zIndex:50,background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--r-sm)',marginTop:'4px',maxHeight:'180px',overflowY:'auto',boxShadow:'var(--shadow)'}}>
            {filtered.map(r => <div key={r} onMouseDown={()=>add(r)} style={{padding:'10px 14px',cursor:'pointer',fontSize:'14px',borderBottom:'1px solid var(--border)'}} onMouseEnter={e=>e.currentTarget.style.background='var(--surface-2)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>{r}</div>)}
          </div>
        )}
      </div>
    </div>
  );
}

function ShoppingList({ plan }) {
  const [list, setList] = useState({});
  useEffect(() => { setList(buildShoppingList(plan)); }, [plan]);
  function toggle(section, idx) { setList(l => ({...l,[section]:l[section].map((item,i)=>i!==idx?item:{...item,checked:!item.checked})})); }
  const sections = SECTIONS.filter(s => list[s]?.length > 0);
  if (sections.length === 0) return <p className="muted">Shopping list will appear after generating a plan.</p>;
  return (
    <div>
      {sections.map(section => (
        <div key={section} style={{marginBottom:'20px'}}>
          <div className="section-header">
            <span className="section-title">{section}</span>
            <span style={{fontSize:'12px',color:'var(--muted)'}}>{list[section].filter(x=>x.checked).length}/{list[section].length}</span>
          </div>
          {list[section].map((item,idx) => (
            <div key={idx} onClick={()=>toggle(section,idx)} style={{display:'flex',alignItems:'center',gap:'12px',padding:'12px 14px',background:'var(--surface-tint)',border:'1px solid var(--border)',borderRadius:'var(--r)',marginBottom:'6px',cursor:'pointer',opacity:item.checked?.5:1,transition:'opacity .15s'}}>
              <div style={{width:'20px',height:'20px',borderRadius:'50%',flexShrink:0,border:item.checked?'none':'2px solid var(--border)',background:item.checked?'var(--teal)':'transparent',display:'flex',alignItems:'center',justifyContent:'center'}}>
                {item.checked&&<span style={{color:'#fff',fontSize:'12px',fontWeight:'700'}}>✓</span>}
              </div>
              <span style={{fontSize:'14px',fontWeight:'500',textDecoration:item.checked?'line-through':'none',color:item.checked?'var(--muted)':'var(--text)'}}>{item.text}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ── Plan detail view ──
function PlanDetail({ planId, profile, onBack, onUpdate }) {
  const [data,       setData]       = useState(null);
  const [tab,        setTab]        = useState('plan');
  const [editing,    setEditing]    = useState(false);
  const [nameVal,    setNameVal]    = useState('');
  const [swapping,   setSwapping]   = useState(null);
  const [swapPanel,  setSwapPanel]  = useState(null); // { dayIdx, mealIdx }
  const [swapDetail, setSwapDetail] = useState('');
  const [loading,    setLoading]    = useState(true);
  const [recipe,     setRecipe]     = useState({});   // keyed by "dayIdx-mealIdx"
  const [loadingRec, setLoadingRec] = useState({});
  const [showShare,  setShowShare]  = useState(false);
  const [friends,    setFriends]    = useState([]);
  const [shareMsg,   setShareMsg]   = useState('');
  const [showRegen,  setShowRegen]  = useState(false);
  const [regenProfile, setRegenProfile] = useState({ weight:'', goalWeight:'', goal:GOALS[2], timeline:'', notes:'' });
  const [regenerating, setRegenerating] = useState(false);
  const [regenError, setRegenError] = useState('');

  useEffect(() => {
    if (typeof planId === 'string' && planId.startsWith('tmpl:')) {
      // Load from template endpoint
      const templateId = planId.replace('tmpl:', '');
      api.getMealTemplates().then(d => {
        const t = (d.templates || []).find(x => x.id === templateId);
        // We need full plan data — call the full template endpoint
        fetch(`${window.__FITTRACK_BASE__ || import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/meals/templates`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('fittrack_token')}` }
        })
          .then(r => r.json())
          .catch(() => ({ templates: [] }));
        // Simplest: use the useTemplate route to get full plan
        api.getMealTemplates().then(() => {
          // fetch the full template inline
          fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/meals/templates/${templateId}`,{
            method:'GET',
            headers:{ Authorization:`Bearer ${localStorage.getItem('fittrack_token')}` }
          })
            .then(r => r.json())
            .then(d => { setData({ plan: d.plan, name: d.name || t?.name || 'Plan', is_favorite: 0, source: 'template' }); setNameVal(d.name||t?.name||'Plan'); })
            .catch(() => setData(null))
            .finally(() => setLoading(false));
        });
      });
    } else {
      api.getMealPlan(planId).then(d => { setData(d); setNameVal(d.name); }).finally(() => setLoading(false));
    }
  }, [planId]);

  async function saveName() {
    await api.renameMealPlan(planId, { name: nameVal });
    setData(d => ({...d, name: nameVal}));
    onUpdate();
    setEditing(false);
  }

  async function fetchRecipe(dayIdx, mealIdx, meal) {
    const key = `${dayIdx}-${mealIdx}`;
    if (recipe[key]) return; // already loaded
    setLoadingRec(l => ({...l, [key]: true}));
    const useCache = data?.source === 'template' && !meal.swapped;
    try {
      const data2 = await api.getMealRecipe({ mealName: meal.name, ingredients: meal.ingredients || [], useCache });
      setRecipe(r => ({...r, [key]: data2.recipe}));
    } catch { setRecipe(r => ({...r, [key]: { steps: ['Could not load recipe. Try again.'], prep_time:'', cook_time:'' }})); }
    finally { setLoadingRec(l => ({...l, [key]: false})); }
  }

  async function swapMeal(dayIdx, mealIdx, meal, reason, detail) {
    setSwapping({dayIdx, mealIdx});
    setSwapPanel(null);
    setSwapDetail('');
    try {
      const res = await api.swapMeal({ mealName: meal.name, restrictions: profile?.restrictions||[], macroTarget: meal, appliances: profile?.appliances||[], planId, dayIdx, mealIdx, reason, detail });
      setData(d => ({...d, plan: {...d.plan, days: d.plan.days.map((day,di) => di!==dayIdx ? day : {...day, meals: day.meals.map((m,mi) => mi!==mealIdx ? m : {...m,...res.meal})})}}));
    } catch {}
    finally { setSwapping(null); }
  }

  if (loading) return <div className="page"><div className="spinner"/></div>;
  if (!data) return null;
  const plan = data.plan;
  const isOwnPlan = !(typeof planId === 'string' && planId.startsWith('tmpl:'));

  async function openShare() {
    if (friends.length === 0) {
      try { setFriends((await api.getFriends()).filter(f => f.status === 'accepted')); } catch {}
    }
    setShowShare(s => !s);
  }

  async function shareWith(friendId) {
    setShareMsg('');
    try {
      await api.shareMealPlan(planId, { friendId });
      setShareMsg('Shared!');
      setTimeout(() => { setShowShare(false); setShareMsg(''); }, 1200);
    } catch (err) { setShareMsg(err.message); }
  }

  async function openRegenerate() {
    if (!showRegen) {
      try {
        const d = await api.getProfile();
        if (d.profile) setRegenProfile(p => ({ ...p, ...d.profile }));
      } catch {}
    }
    setShowRegen(s => !s);
  }

  async function doRegenerate(e) {
    e.preventDefault();
    setRegenerating(true); setRegenError('');
    try {
      await api.regenerateMealPlan(planId, regenProfile);
      api.saveProfile(regenProfile).catch(()=>{});
      setShowRegen(false);
      const refreshed = await api.getMealPlan(planId);
      setData(refreshed);
    } catch (err) { setRegenError(err.message); }
    finally { setRegenerating(false); }
  }

  return (
    <div className="page">
      <button className="btn-ghost" onClick={onBack} style={{marginBottom:'12px'}}>← All Plans</button>

      {/* Name + favorite */}
      <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:isOwnPlan && showShare ? '10px' : '20px'}}>
        {editing ? (
          <>
            <input className="input" value={nameVal} onChange={e=>setNameVal(e.target.value)} style={{flex:1,fontSize:'20px'}} autoFocus/>
            <button className="btn-accent-sm" onClick={saveName}>Save</button>
            <button className="btn-ghost-sm" onClick={()=>setEditing(false)}>Cancel</button>
          </>
        ) : (
          <>
            <h2 className="page-title" style={{marginBottom:0,flex:1}}>{data.name}</h2>
            {isOwnPlan && <button className="btn-ghost-sm" onClick={openRegenerate}>Regenerate</button>}
            {isOwnPlan && <button className="btn-ghost-sm" onClick={openShare}>Share</button>}
            <button onClick={()=>setEditing(true)} style={{color:'var(--muted)',fontSize:'14px',background:'none',border:'none',cursor:'pointer'}}>✏️</button>
          </>
        )}
      </div>

      {isOwnPlan && data.shared_from_username && (
        <p className="muted" style={{fontSize:'12px',marginTop:'-14px',marginBottom:'16px'}}>Shared by {data.shared_from_username}</p>
      )}

      {isOwnPlan && showRegen && (
        <form onSubmit={doRegenerate} className="card-form" style={{marginBottom:'20px'}}>
          <div style={{fontSize:'13px',fontWeight:'600',marginBottom:'10px'}}>Rebuild this plan with updated info</div>
          <div className="form-stack">
            <div className="input-row">
              <div className="input-group"><label className="label">Current Weight</label><input className="input" type="number" value={regenProfile.weight} onChange={e=>setRegenProfile(p=>({...p,weight:e.target.value}))}/></div>
              <div className="input-group"><label className="label">Goal Weight</label><input className="input" type="number" value={regenProfile.goalWeight} onChange={e=>setRegenProfile(p=>({...p,goalWeight:e.target.value}))}/></div>
            </div>
            <div className="input-row">
              <div className="input-group">
                <label className="label">Goal</label>
                <select className="input" value={regenProfile.goal} onChange={e=>setRegenProfile(p=>({...p,goal:e.target.value}))}>
                  {GOALS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div className="input-group"><label className="label">Timeline (weeks)</label><input className="input" type="number" value={regenProfile.timeline} onChange={e=>setRegenProfile(p=>({...p,timeline:e.target.value}))}/></div>
            </div>
            <div className="field">
              <label className="label">Notes for the AI</label>
              <textarea className="input" rows={2} value={regenProfile.notes} onChange={e=>setRegenProfile(p=>({...p,notes:e.target.value}))} />
            </div>
            {regenError && <p className="form-error">{regenError}</p>}
            <button className="btn-primary" type="submit" disabled={regenerating}>{regenerating ? 'Rebuilding…' : 'Rebuild Plan'}</button>
          </div>
        </form>
      )}

      {isOwnPlan && showShare && (
        <div className="glass-card" style={{marginBottom:'20px'}}>
          <div style={{fontSize:'13px',fontWeight:'600',marginBottom:'8px'}}>Send this plan to a friend</div>
          {friends.length === 0
            ? <p className="muted" style={{fontSize:'13px'}}>Add a friend first to share plans.</p>
            : (
              <div style={{display:'flex',flexWrap:'wrap',gap:'6px'}}>
                {friends.map(f => <button key={f.id} className="btn-ghost-sm" onClick={()=>shareWith(f.id)}>{f.username}</button>)}
              </div>
            )
          }
          {shareMsg && <p style={{fontSize:'12px',color:'var(--teal)',marginTop:'8px'}}>{shareMsg}</p>}
        </div>
      )}

      <div className="tab-row" style={{marginBottom:'16px'}}>
        {[['plan','Plan'],['shop','Shop']].map(([id,label]) => (
          <button key={id} className={tab===id?'tab active':'tab'} onClick={()=>setTab(id)}>{label}</button>
        ))}
      </div>

      {tab === 'plan' && plan && (
        <>
          <div className="glass-card" style={{marginBottom:'16px'}}>
            <div style={{fontWeight:'600',fontSize:'14px',marginBottom:'8px'}}>Daily Targets</div>
            {plan.budget_tip && <div style={{fontSize:'12px',color:'var(--teal)',marginBottom:'10px'}}>💰 {plan.budget_tip}</div>}
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'8px',textAlign:'center'}}>
              {[['Cal',plan.daily_calories],['Protein',`${plan.macros?.protein}g`],['Carbs',`${plan.macros?.carbs}g`],['Fat',`${plan.macros?.fat}g`]].map(([l,v])=>(
                <div key={l} style={{background:'var(--surface-tint)',borderRadius:'10px',padding:'8px 4px'}}>
                  <div style={{fontWeight:'700',fontSize:'14px',color:'var(--text)'}}>{v}</div>
                  <div style={{fontSize:'10px',color:'var(--muted)'}}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          {plan.days?.map((day,di) => (
            <div key={di} className="section">
              <div className="section-header">
                <span className="section-title">{day.day}</span>
                <span style={{fontSize:'12px',color:'var(--muted)'}}>{day.meals?.reduce((s,m)=>s+(m.calories||0),0)} cal</span>
              </div>
              {day.meals?.map((meal,mi) => (
                <div key={mi} className="glass-card" style={{marginBottom:'10px'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'6px'}}>
                    <div style={{flex:1}}>
                      <div style={{fontSize:'10px',color:'var(--teal)',fontWeight:'700',textTransform:'uppercase',letterSpacing:'.05em',marginBottom:'2px'}}>{meal.type}</div>
                      <div style={{fontWeight:'700',fontSize:'15px'}}>{meal.name}</div>
                    </div>
                    <div style={{textAlign:'right',flexShrink:0,marginLeft:'12px'}}>
                      <div style={{fontWeight:'700',color:'var(--rose)',fontSize:'14px'}}>{meal.calories} cal</div>
                      {meal.can_substitute && <button className="btn-ghost-sm" style={{marginTop:'4px',fontSize:'11px'}} disabled={swapping?.dayIdx===di&&swapping?.mealIdx===mi} onClick={()=>setSwapPanel(swapPanel?.dayIdx===di&&swapPanel?.mealIdx===mi ? null : {dayIdx:di, mealIdx:mi})}>{swapping?.dayIdx===di&&swapping?.mealIdx===mi?'…':'↔ Swap'}</button>}
                    </div>
                  </div>
                  <div style={{display:'flex',gap:'12px',fontSize:'12px',color:'var(--muted)',marginBottom:'8px'}}>
                    <span>P:{meal.protein}g</span><span>C:{meal.carbs}g</span><span>F:{meal.fat}g</span>
                  </div>
                  {meal.ingredients?.length>0 && (
                    <div style={{display:'flex',flexWrap:'wrap',gap:'4px',marginBottom:'10px'}}>
                      {meal.ingredients.map((ing,ii)=><span key={ii} style={{fontSize:'11px',background:'var(--surface-tint)',border:'1px solid var(--border)',borderRadius:'6px',padding:'2px 8px',color:'var(--muted)'}}>{ing}</span>)}
                    </div>
                  )}
                  {swapPanel?.dayIdx===di && swapPanel?.mealIdx===mi && (
                    <div style={{background:'var(--surface-tint)',border:'1px solid var(--border)',borderRadius:'10px',padding:'12px',marginBottom:'10px'}}>
                      <div style={{fontSize:'12px',fontWeight:'600',marginBottom:'8px'}}>Why swap this meal?</div>
                      <div style={{display:'flex',gap:'8px',marginBottom:'8px'}}>
                        <button className="btn-ghost-sm" style={{flex:1}} onClick={()=>swapMeal(di,mi,meal,'dislike',null)}>Don't want it</button>
                        <button className="btn-ghost-sm" style={{flex:1}} onClick={()=>document.getElementById(`swap-detail-${di}-${mi}`)?.focus()}>Can't have something</button>
                      </div>
                      <input
                        id={`swap-detail-${di}-${mi}`}
                        className="input"
                        placeholder="e.g. shellfish, dairy, mushrooms"
                        value={swapDetail}
                        onChange={e=>setSwapDetail(e.target.value)}
                        style={{marginBottom:'8px',fontSize:'13px',padding:'9px 12px'}}
                      />
                      <div style={{display:'flex',gap:'8px'}}>
                        <button className="btn-accent-sm" style={{flex:1}} disabled={!swapDetail.trim()} onClick={()=>swapMeal(di,mi,meal,'restriction',swapDetail.trim())}>Swap without it</button>
                        <button className="btn-ghost-sm" onClick={()=>{setSwapPanel(null);setSwapDetail('');}}>Cancel</button>
                      </div>
                    </div>
                  )}
                  {/* Recipe section */}
                  {(() => {
                    const key = `${di}-${mi}`;
                    const r = recipe[key];
                    const loading = loadingRec[key];
                    return (
                      <div style={{borderTop:'1px solid var(--border)',paddingTop:'10px'}}>
                        {!r && !loading && (
                          <button className="btn-ghost-sm" style={{fontSize:'12px',display:'flex',alignItems:'center',gap:'5px'}} onClick={()=>fetchRecipe(di,mi,meal)}>
                            👨‍🍳 How to Cook
                          </button>
                        )}
                        {loading && <p style={{fontSize:'12px',color:'var(--muted)'}}>Loading recipe…</p>}
                        {r && (
                          <div>
                            <div style={{display:'flex',gap:'12px',fontSize:'11px',color:'var(--teal)',fontWeight:'600',marginBottom:'8px'}}>
                              {r.prep_time && <span>⏱ Prep: {r.prep_time}</span>}
                              {r.cook_time && <span>🔥 Cook: {r.cook_time}</span>}
                            </div>
                            {r.steps?.map((step, si) => (
                              <div key={si} style={{display:'flex',gap:'10px',marginBottom:'6px',fontSize:'13px'}}>
                                <span style={{color:'var(--teal)',fontWeight:'700',flexShrink:0,minWidth:'18px'}}>{si+1}.</span>
                                <span style={{color:'var(--text)',lineHeight:'1.5'}}>{step.replace(/^Step \d+:\s*/i,'')}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              ))}
            </div>
          ))}
        </>
      )}
      {tab === 'shop' && <ShoppingList plan={plan}/>}
    </div>
  );
}

// ── Main Meals page ──
const DAY_NAMES = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const MEAL_TYPES = ['Breakfast','Lunch','Dinner','Snack'];

function CustomPlanBuilder({ onBack, onCreated }) {
  const [planName, setPlanName] = useState('My Custom Plan');
  const [dayIdx, setDayIdx] = useState(0);
  const [days, setDays] = useState(DAY_NAMES.map(d => ({ day: d, meals: [] })));
  const [form, setForm] = useState({ type:'Breakfast', name:'', calories:'', protein:'', carbs:'', fat:'', ingredients:'' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  function addMeal() {
    if (!form.name.trim()) { setError('Meal name required'); return; }
    setError('');
    const meal = {
      type: form.type, name: form.name.trim(),
      calories: Number(form.calories)||0, protein: Number(form.protein)||0, carbs: Number(form.carbs)||0, fat: Number(form.fat)||0,
      ingredients: form.ingredients.split(',').map(s=>s.trim()).filter(Boolean),
      can_substitute: true,
    };
    setDays(ds => ds.map((d,i) => i!==dayIdx ? d : {...d, meals:[...d.meals, meal]}));
    setForm({ type:'Breakfast', name:'', calories:'', protein:'', carbs:'', fat:'', ingredients:'' });
  }
  function removeMeal(mi) {
    setDays(ds => ds.map((d,i) => i!==dayIdx ? d : {...d, meals: d.meals.filter((_,j)=>j!==mi)}));
  }

  async function save() {
    const daysWithMeals = days.filter(d => d.meals.length > 0);
    if (!planName.trim()) { setError('Plan name required'); return; }
    if (daysWithMeals.length === 0) { setError('Add at least one meal first'); return; }
    setSaving(true); setError('');
    const totals = daysWithMeals.map(d => d.meals.reduce((s,m)=>({
      calories: s.calories+m.calories, protein: s.protein+m.protein, carbs: s.carbs+m.carbs, fat: s.fat+m.fat,
    }), {calories:0,protein:0,carbs:0,fat:0}));
    const avg = (key) => Math.round(totals.reduce((s,t)=>s+t[key],0) / totals.length);
    try {
      const data = await api.createCustomMealPlan({
        name: planName.trim(),
        plan: {
          daily_calories: avg('calories'), macros: { protein: avg('protein'), carbs: avg('carbs'), fat: avg('fat') },
          budget_tip: '', days: daysWithMeals,
        },
      });
      onCreated(data.planId);
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  }

  return (
    <div className="page">
      <button className="btn-ghost" onClick={onBack} style={{marginBottom:'16px'}}>← Back</button>
      <h2 className="page-title">Build Your Own Plan</h2>
      <div className="card-form" style={{marginBottom:'16px'}}>
        <div className="field">
          <label className="label">Plan Name</label>
          <input className="input" value={planName} onChange={e=>setPlanName(e.target.value)} />
        </div>
      </div>

      <div className="tab-row" style={{marginBottom:'16px',flexWrap:'wrap'}}>
        {days.map((d,i) => (
          <button key={i} className={dayIdx===i?'tab active':'tab'} onClick={()=>setDayIdx(i)}>
            {d.day.slice(0,3)}{d.meals.length>0 ? ` (${d.meals.length})` : ''}
          </button>
        ))}
      </div>

      {days[dayIdx].meals.map((m,mi) => (
        <div key={mi} className="list-item">
          <div style={{flex:1}}>
            <div className="item-main">{m.type}: {m.name}</div>
            <div className="item-meta">{m.calories} cal · {m.protein}p {m.carbs}c {m.fat}f</div>
          </div>
          <button className="btn-ghost-sm" onClick={()=>removeMeal(mi)}>Remove</button>
        </div>
      ))}
      {days[dayIdx].meals.length === 0 && <p className="muted" style={{marginBottom:'12px'}}>No meals added to {days[dayIdx].day} yet.</p>}

      <div className="card-form" style={{marginTop:'12px'}}>
        <div className="form-stack">
          <div className="input-row">
            <div className="input-group">
              <label className="label">Meal Type</label>
              <select className="input" value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}>
                {MEAL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="input-group">
              <label className="label">Meal Name</label>
              <input className="input" placeholder="e.g. Chicken & Rice" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} />
            </div>
          </div>
          <div className="input-row">
            <div className="input-group"><label className="label">Calories</label><input className="input" type="number" value={form.calories} onChange={e=>setForm(f=>({...f,calories:e.target.value}))} /></div>
            <div className="input-group"><label className="label">Protein (g)</label><input className="input" type="number" value={form.protein} onChange={e=>setForm(f=>({...f,protein:e.target.value}))} /></div>
          </div>
          <div className="input-row">
            <div className="input-group"><label className="label">Carbs (g)</label><input className="input" type="number" value={form.carbs} onChange={e=>setForm(f=>({...f,carbs:e.target.value}))} /></div>
            <div className="input-group"><label className="label">Fat (g)</label><input className="input" type="number" value={form.fat} onChange={e=>setForm(f=>({...f,fat:e.target.value}))} /></div>
          </div>
          <div className="field">
            <label className="label">Ingredients (comma separated)</label>
            <input className="input" placeholder="e.g. 6oz chicken breast, 1 cup rice, broccoli" value={form.ingredients} onChange={e=>setForm(f=>({...f,ingredients:e.target.value}))} />
          </div>
          <button type="button" className="btn-secondary" onClick={addMeal}>+ Add Meal to {days[dayIdx].day}</button>
        </div>
      </div>

      {error && <p className="form-error" style={{marginTop:'12px'}}>{error}</p>}
      <button className="btn-primary" style={{marginTop:'16px'}} onClick={save} disabled={saving}>
        {saving ? 'Saving…' : 'Save Plan'}
      </button>
    </div>
  );
}

export default function Meals() {
  const [view,       setView]       = useState('list');
  const [plans,      setPlans]      = useState([]);
  const [templates,  setTemplates]  = useState([]);
  const [activePlan, setActivePlan] = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error,      setError]      = useState('');
  const [profile,    setProfile]    = useState({ weight:'',goalWeight:'',goal:GOALS[2],timeline:'',restrictions:[],dislikes:'',wantedFoods:'',appliances:[],notes:'',planName:'My Meal Plan' });

  useEffect(() => {
    loadPlans();
    api.getMealTemplates().then(d => setTemplates(d.templates||[])).catch(()=>{});
    api.getProfile().then(d => { if (d.profile) setProfile(p => ({...p, ...d.profile})); }).catch(()=>{});
  }, []);

  function loadPlans() {
    api.listMealPlans().then(d => setPlans(d.plans||[])).catch(()=>{}).finally(()=>setLoading(false));
  }

  async function generate(e) {
    e.preventDefault();
    setError(''); setGenerating(true);
    try {
      const data = await api.generateMealPlan(profile);
      const { planName, ...profileToSave } = profile;
      api.saveProfile(profileToSave).catch(()=>{});
      loadPlans();
      setActivePlan(data.planId);
      setView('detail');
    } catch (err) { setError(err.message||'Failed to generate plan.'); }
    finally { setGenerating(false); }
  }

  async function toggleFav(e, id) {
    e.stopPropagation();
    const data = await api.toggleFavorite(id);
    setPlans(ps => ps.map(p => p.id===id ? {...p, is_favorite: data.is_favorite?1:0} : p).sort((a,b)=>b.is_favorite-a.is_favorite||(new Date(b.created_at)-new Date(a.created_at))));
  }

  async function useTemplate(id, name) {
    try {
      const data = await api.useMealTemplate(id, { name });
      setPlans(ps => [{ id: data.planId, name: data.planName, daily_calories: data.plan.daily_calories, created_at: new Date().toISOString(), is_favorite: 0 }, ...ps]);
      setActivePlan(data.planId);
      setView('detail');
    } catch (err) { setError('Could not load template'); }
  }

  async function deletePlan(e, id) {
    e.stopPropagation();
    if (!confirm('Delete this plan?')) return;
    await api.deleteMealPlan(id);
    setPlans(ps => ps.filter(p => p.id !== id));
  }

  if (loading) return <div className="page"><div className="spinner"/></div>;

  // Plan detail
  if (view === 'detail' && activePlan) {
    return <PlanDetail planId={activePlan} profile={profile} onBack={()=>{loadPlans();setView('list');}} onUpdate={loadPlans}/>;
  }

  if (view === 'custom') {
    return <CustomPlanBuilder onBack={()=>setView('list')} onCreated={(id)=>{loadPlans();setActivePlan(id);setView('detail');}} />;
  }

  // New plan form
  if (view === 'new') {
    return (
      <div className="page">
        <button className="btn-ghost" onClick={()=>setView('list')} style={{marginBottom:'16px'}}>← Back</button>
        <h2 className="page-title">New Meal Plan</h2>
        {error && <p className="form-error" style={{marginBottom:'16px'}}>{error}</p>}

        <form onSubmit={generate} className="form-stack">
          <div className="card-form">
            <div className="field" style={{marginBottom:'12px'}}>
              <label className="label">Plan Name</label>
              <input className="input" placeholder="e.g. Summer Cut Plan" value={profile.planName} onChange={e=>setProfile(p=>({...p,planName:e.target.value}))} required/>
            </div>
            <div className="input-row">
              <div className="input-group"><label className="label">Current Weight (lbs)</label><input className="input" type="number" placeholder="185" value={profile.weight} onChange={e=>setProfile(p=>({...p,weight:e.target.value}))}/></div>
              <div className="input-group"><label className="label">Goal Weight (lbs)</label><input className="input" type="number" placeholder="175" value={profile.goalWeight} onChange={e=>setProfile(p=>({...p,goalWeight:e.target.value}))}/></div>
            </div>
            <div className="input-row" style={{marginTop:'12px'}}>
              <div className="input-group"><label className="label">Goal</label>
                <select className="input" value={profile.goal} onChange={e=>setProfile(p=>({...p,goal:e.target.value}))}>
                  {GOALS.map(g=><option key={g}>{g}</option>)}
                </select>
              </div>
              <div className="input-group"><label className="label">Timeline (weeks)</label><input className="input" type="number" placeholder="12" value={profile.timeline} onChange={e=>setProfile(p=>({...p,timeline:e.target.value}))}/></div>
            </div>
          </div>

          <div className="card-form">
            <label className="label" style={{display:'block',marginBottom:'10px'}}>Dietary Restrictions</label>
            <RestrictionInput value={profile.restrictions} onChange={v=>setProfile(p=>({...p,restrictions:v}))}/>
          </div>

          <div className="card-form">
            <div className="form-stack">
              <div className="field"><label className="label">Foods You Dislike</label><input className="input" placeholder="e.g. mushrooms, cilantro" value={profile.dislikes} onChange={e=>setProfile(p=>({...p,dislikes:e.target.value}))}/></div>
              <div className="field"><label className="label">Foods You Really Want</label><input className="input" placeholder="e.g. salmon, sweet potatoes" value={profile.wantedFoods} onChange={e=>setProfile(p=>({...p,wantedFoods:e.target.value}))}/></div>
              <div className="field">
                <label className="label">Notes for the AI (goals, injuries, preferences)</label>
                <textarea className="input" rows={3} placeholder="e.g. trying to hit 150g protein a day, recovering from a wrist injury, cooking for one"
                  value={profile.notes} onChange={e=>setProfile(p=>({...p,notes:e.target.value}))} />
              </div>
            </div>
          </div>

          <div className="card-form">
            <label className="label" style={{display:'block',marginBottom:'14px'}}>Kitchen Appliances</label>
            <KitchenIllustration selected={profile.appliances} onChange={v=>setProfile(p=>({...p,appliances:v}))}/>
          </div>

          <button className="btn-primary" type="submit" disabled={generating}>
            <span style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'8px'}}>
              <IconSparkle style={{width:'16px',height:'16px'}}/>{generating?'Generating 7-Day Plan…':'Generate AI Meal Plan'}
            </span>
          </button>
          {generating && <p className="muted" style={{textAlign:'center',fontSize:'12px'}}>This takes about 15-20 seconds…</p>}
        </form>
      </div>
    );
  }

  // Plan list
  // Plate+dome SVG for empty states
  const PlateDome = () => (
    <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{margin:'0 auto 12px',opacity:.4}}>
      <ellipse cx="12" cy="19" rx="9" ry="3"/>
      <path d="M3 16 C3 10 21 10 21 16"/>
      <line x1="12" y1="10" x2="12" y2="7"/>
      <circle cx="12" cy="6" r="1.5" fill="var(--muted)"/>
    </svg>
  );

  return (
    <div className="page">
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'24px'}}>
        <h2 className="page-title" style={{marginBottom:0}}>Meal Plans</h2>
        <div style={{display:'flex',gap:'8px'}}>
          <button className="btn-ghost-sm" onClick={()=>setView('custom')}>
            + Build Your Own
          </button>
          <button className="btn-primary" style={{width:'auto',padding:'10px 16px',fontSize:'14px'}} onClick={()=>setView('new')}>
            + AI Plan
          </button>
        </div>
      </div>

      {/* AI-created plans (deletable, shown first) */}
      {plans.length > 0 && (
        <div className="section">
          <div className="section-header"><span className="section-title">My Plans</span></div>
          <div className="form-stack" style={{marginBottom:'24px'}}>
            {plans.map(plan => (
              <div key={plan.id} className="glass-card" style={{cursor:'pointer'}}
                onClick={()=>{setActivePlan(plan.id);setView('detail');}}>
                <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:'700',fontSize:'15px',marginBottom:'3px'}}>{plan.name}</div>
                    <div style={{fontSize:'12px',color:'var(--muted)'}}>
                      {plan.daily_calories ? `${plan.daily_calories} cal/day · ` : ''}
                      {new Date(plan.created_at).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}
                    </div>
                  </div>
                  <button onClick={e=>toggleFav(e,plan.id)}
                    style={{fontSize:'18px',background:'none',border:'none',cursor:'pointer',flexShrink:0,lineHeight:1,padding:'4px'}}>
                    {plan.is_favorite ? '⭐' : '☆'}
                  </button>
                  <button onClick={e=>deletePlan(e,plan.id)}
                    style={{background:'none',border:'none',cursor:'pointer',color:'var(--muted)',flexShrink:0,padding:'4px',fontSize:'16px'}}>
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Template plans — always visible, no delete */}
      {templates.length > 0 && (
        <div className="section">
          <div className="section-header">
            <span className="section-title">Starter Plans</span>
            <span style={{fontSize:'12px',color:'var(--muted)'}}>Ready to use</span>
          </div>
          <div className="form-stack">
            {templates.map(t => (
              <div key={t.id} className="glass-card" style={{cursor:'pointer'}}
                onClick={()=>{setActivePlan('tmpl:'+t.id);setView('detail');}}>
                <div style={{display:'flex',alignItems:'center',gap:'14px'}}>
                  <div style={{
                    width:'44px',height:'44px',borderRadius:'12px',flexShrink:0,
                    background:'var(--surface-tint)',border:'1px solid var(--border)',
                    display:'flex',alignItems:'center',justifyContent:'center',color:'var(--teal)',
                  }}><MealPlanIcon id={t.icon} size={22} /></div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:'700',fontSize:'15px',marginBottom:'2px'}}>{t.name}</div>
                    <div style={{fontSize:'12px',color:'var(--muted)'}}>
                      {t.daily_calories} cal/day
                      <span style={{marginLeft:'8px',color:'var(--teal)',fontWeight:'600',fontSize:'11px',textTransform:'uppercase',letterSpacing:'.04em'}}>{t.category}</span>
                    </div>
                  </div>
                  <span style={{color:'var(--muted)',fontSize:'16px'}}>›</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {plans.length === 0 && templates.length === 0 && (
        <div className="empty-state">
          <PlateDome/>
          <p style={{marginBottom:'20px'}}>No meal plans yet.<br/>Create an AI plan or pick a starter above.</p>
          <button className="btn-primary" style={{maxWidth:'240px',margin:'0 auto'}} onClick={()=>setView('new')}>Create AI Plan</button>
        </div>
      )}
    </div>
  );
}
