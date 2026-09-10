import { useState, useEffect, useRef } from 'react';
import { api } from '../api/client';
import { IconSparkle, IconRefresh } from '../components/Icons';
import KitchenIllustration from '../components/KitchenIllustration';

// ── Dietary restriction suggestions ──
const RESTRICTION_SUGGESTIONS = [
  'Vegan','Vegetarian','Gluten-Free','Dairy-Free','Pescatarian',
  'Nut-Free','Halal','Kosher','Keto','Paleo','Low-FODMAP',
  'Low-Sodium','Low-Carb','Low-Fat','Diabetic-Friendly','High-Protein',
  'Mediterranean','Whole30','Anti-Inflammatory','DASH Diet',
  'Egg-Free','Soy-Free','Shellfish-Free','Pork-Free','Red Meat-Free',
  'Raw Food','Macrobiotic','Intermittent Fasting Friendly',
];

const GOALS = ['Cut (Lose Fat)','Bulk (Gain Muscle)','Maintain','Recomp'];

// ── Store sections for shopping list ──
const SECTIONS = ['Produce','Meat & Seafood','Dairy & Eggs','Bread & Grains','Canned & Dry Goods','Frozen','Condiments & Oils','Snacks & Nuts','Other'];

function categorize(ingredient) {
  const i = ingredient.toLowerCase();
  if (/chicken|beef|pork|turkey|salmon|tuna|shrimp|fish|steak|ground|sausage|bacon/.test(i)) return 'Meat & Seafood';
  if (/milk|yogurt|cheese|egg|butter|cream|whey/.test(i)) return 'Dairy & Eggs';
  if (/bread|oat|rice|pasta|flour|tortilla|cereal|grain|quinoa|barley/.test(i)) return 'Bread & Grains';
  if (/frozen|edamame/.test(i)) return 'Frozen';
  if (/oil|sauce|vinegar|ketchup|mustard|mayo|soy|honey|syrup|spice|salt|pepper|seasoning|herb/.test(i)) return 'Condiments & Oils';
  if (/nut|almond|cashew|peanut|seed|granola|protein bar|chip|cracker/.test(i)) return 'Snacks & Nuts';
  if (/can|bean|lentil|chickpea|broth|stock|tomato paste|coconut/.test(i)) return 'Canned & Dry Goods';
  if (/apple|banana|berry|orange|lemon|lime|grape|mango|spinach|kale|lettuce|broccoli|carrot|onion|garlic|pepper|cucumber|tomato|celery|avocado|sweet potato|potato|zucchini|mushroom|fruit|vegetable|produce/.test(i)) return 'Produce';
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
        // deduplicate loosely
        const base = ing.replace(/^\d+[\s\/\w]*\s/, '').toLowerCase();
        const existing = map[section].find(x => x.base === base);
        if (!existing) map[section].push({ text: ing, base, checked: false });
      });
    });
  });
  return map;
}

// ── Search-as-you-type restriction input ──
function RestrictionInput({ value, onChange }) {
  const [query, setQuery]     = useState('');
  const [show,  setShow]      = useState(false);
  const ref = useRef();

  const filtered = query.length > 0
    ? RESTRICTION_SUGGESTIONS.filter(s => s.toLowerCase().includes(query.toLowerCase()) && !value.includes(s))
    : [];

  function add(r) {
    onChange([...value, r]);
    setQuery('');
    setShow(false);
  }

  function remove(r) { onChange(value.filter(x => x !== r)); }

  return (
    <div>
      <div style={{display:'flex',flexWrap:'wrap',gap:'6px',marginBottom:'8px'}}>
        {value.map(r => (
          <span key={r} onClick={() => remove(r)} style={{
            padding:'4px 12px',fontSize:'13px',fontWeight:'500',cursor:'pointer',
            background:'rgba(126,176,155,0.15)',border:'1px solid var(--teal)',
            borderRadius:'999px',color:'var(--teal)',
          }}>{r} ✕</span>
        ))}
      </div>
      <div style={{position:'relative'}} ref={ref}>
        <input
          className="input"
          placeholder="Type to search restrictions…"
          value={query}
          onChange={e => { setQuery(e.target.value); setShow(true); }}
          onFocus={() => setShow(true)}
          onBlur={() => setTimeout(() => setShow(false), 150)}
        />
        {show && filtered.length > 0 && (
          <div style={{
            position:'absolute',top:'100%',left:0,right:0,zIndex:50,
            background:'var(--surface)',border:'1px solid var(--border)',
            borderRadius:'var(--r-sm)',marginTop:'4px',maxHeight:'180px',overflowY:'auto',
            boxShadow:'var(--shadow)',
          }}>
            {filtered.map(r => (
              <div key={r} onMouseDown={() => add(r)} style={{
                padding:'10px 14px',cursor:'pointer',fontSize:'14px',
                borderBottom:'1px solid var(--border)',
              }}
              onMouseEnter={e => e.currentTarget.style.background='var(--surface-2)'}
              onMouseLeave={e => e.currentTarget.style.background='transparent'}
              >{r}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Shopping list ──
function ShoppingList({ plan }) {
  const [list, setList] = useState({});

  useEffect(() => {
    setList(buildShoppingList(plan));
  }, [plan]);

  function toggle(section, idx) {
    setList(l => ({
      ...l,
      [section]: l[section].map((item, i) => i === idx ? { ...item, checked: !item.checked } : item)
    }));
  }

  const sections = SECTIONS.filter(s => list[s]?.length > 0);

  return (
    <div>
      {sections.length === 0
        ? <p className="muted">Generate a meal plan to see your shopping list.</p>
        : sections.map(section => (
          <div key={section} style={{marginBottom:'20px'}}>
            <div className="section-header"><span className="section-title">{section}</span>
              <span style={{fontSize:'12px',color:'var(--muted)'}}>{list[section].filter(x=>x.checked).length}/{list[section].length}</span>
            </div>
            {list[section].map((item, idx) => (
              <div key={idx} onClick={() => toggle(section, idx)} style={{
                display:'flex',alignItems:'center',gap:'12px',padding:'12px 14px',
                background:'rgba(46,74,78,.4)',border:'1px solid var(--border)',
                borderRadius:'var(--r)',marginBottom:'6px',cursor:'pointer',
                opacity: item.checked ? 0.5 : 1, transition:'opacity .15s',
              }}>
                <div style={{
                  width:'20px',height:'20px',borderRadius:'50%',flexShrink:0,
                  border: item.checked ? 'none' : '2px solid var(--border)',
                  background: item.checked ? 'var(--teal)' : 'transparent',
                  display:'flex',alignItems:'center',justifyContent:'center',
                }}>
                  {item.checked && <span style={{color:'#fff',fontSize:'12px',fontWeight:'700'}}>✓</span>}
                </div>
                <span style={{
                  fontSize:'14px',fontWeight:'500',
                  textDecoration: item.checked ? 'line-through' : 'none',
                  color: item.checked ? 'var(--muted)' : 'var(--text)',
                }}>{item.text}</span>
              </div>
            ))}
          </div>
        ))
      }
    </div>
  );
}

// ── Main Meals page ──
export default function Meals() {
  const [tab,        setTab]       = useState('plan');
  const [profile,    setProfile]   = useState({
    weight:'', goalWeight:'', goal: GOALS[2], timeline:'',
    restrictions:[], dislikes:'', wantedFoods:'', appliances:[],
  });
  const [plan,       setPlan]      = useState(null);
  const [loading,    setLoading]   = useState(true);
  const [generating, setGenerating]= useState(false);
  const [error,      setError]     = useState('');
  const [swapping,   setSwapping]  = useState(null);

  useEffect(() => {
    api.getMealPlan()
      .then(data => {
        if (data?.plan)    setPlan(data.plan);
        if (data?.profile) setProfile(p => ({ ...p, ...data.profile }));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function saveAndGenerate(e) {
    e.preventDefault();
    setError(''); setGenerating(true);
    try {
      await api.saveMealProfile(profile);
      const data = await api.generateMealPlan(profile);
      setPlan(data.plan);
      setTab('plan');
    } catch (err) {
      setError(err.message || 'Failed to generate plan.');
    } finally {
      setGenerating(false);
    }
  }

  async function swapMeal(dayIdx, mealIdx, meal) {
    setSwapping({ dayIdx, mealIdx });
    try {
      const data = await api.swapMeal({ mealName: meal.name, restrictions: profile.restrictions, macroTarget: meal, appliances: profile.appliances });
      setPlan(p => ({
        ...p,
        days: p.days.map((d, di) => di !== dayIdx ? d : {
          ...d, meals: d.meals.map((m, mi) => mi !== mealIdx ? m : { ...m, ...data.meal })
        })
      }));
    } catch { setError('Swap failed — try again'); }
    finally { setSwapping(null); }
  }

  if (loading) return <div className="page"><div className="spinner"/></div>;

  const TABS = ['plan','shop','profile'];

  return (
    <div className="page">
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'20px'}}>
        <h2 className="page-title" style={{marginBottom:0}}>Meals</h2>
      </div>

      {/* Tab row */}
      <div className="tab-row" style={{marginBottom:'20px'}}>
        {[['plan','Plan'],['shop','Shop'],['profile','Profile']].map(([id,label]) => (
          <button key={id} className={tab===id ? 'tab active' : 'tab'} onClick={() => setTab(id)}>{label}</button>
        ))}
      </div>

      {error && <p className="form-error" style={{marginBottom:'16px'}}>{error}</p>}

      {/* ── PLAN TAB ── */}
      {tab === 'plan' && (
        !plan ? (
          <div className="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{margin:'0 auto 12px',opacity:.4}}><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
            <p style={{marginBottom:'20px'}}>No meal plan yet.<br/>Set up your profile and generate one.</p>
            <button className="btn-primary" style={{maxWidth:'260px',margin:'0 auto'}} onClick={() => setTab('profile')}>Set Up Profile</button>
          </div>
        ) : (
          <>
            {/* Summary card */}
            <div className="glass-card" style={{marginBottom:'20px'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'12px'}}>
                <div>
                  <div style={{fontWeight:'700',fontSize:'15px'}}>Weekly Plan</div>
                  {plan.budget_tip && <div style={{fontSize:'12px',color:'var(--teal)',marginTop:'3px'}}>💰 {plan.budget_tip}</div>}
                </div>
                <button className="btn-ghost" style={{padding:'7px 12px',fontSize:'13px',display:'flex',alignItems:'center',gap:'6px'}}
                  onClick={() => setTab('profile')} disabled={generating}>
                  <IconRefresh style={{width:'13px',height:'13px'}}/> Refresh
                </button>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'8px',textAlign:'center'}}>
                {[['Calories',plan.daily_calories],['Protein',`${plan.macros?.protein}g`],['Carbs',`${plan.macros?.carbs}g`],['Fat',`${plan.macros?.fat}g`]].map(([l,v]) => (
                  <div key={l} style={{background:'rgba(28,46,48,.5)',borderRadius:'10px',padding:'10px 4px'}}>
                    <div style={{fontWeight:'700',fontSize:'15px',color:'var(--text)'}}>{v}</div>
                    <div style={{fontSize:'11px',color:'var(--muted)'}}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Days */}
            {plan.days?.map((day, di) => (
              <div key={di} className="section">
                <div className="section-header">
                  <span className="section-title">{day.day}</span>
                  <span style={{fontSize:'12px',color:'var(--muted)'}}>{day.meals?.reduce((s,m)=>s+(m.calories||0),0)} cal</span>
                </div>
                {day.meals?.map((meal, mi) => (
                  <div key={mi} className="glass-card" style={{marginBottom:'10px'}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'6px'}}>
                      <div style={{flex:1}}>
                        <div style={{fontSize:'11px',color:'var(--teal)',fontWeight:'600',textTransform:'uppercase',letterSpacing:'.05em',marginBottom:'2px'}}>{meal.type}</div>
                        <div style={{fontWeight:'700',fontSize:'15px'}}>{meal.name}</div>
                      </div>
                      <div style={{textAlign:'right',flexShrink:0,marginLeft:'12px'}}>
                        <div style={{fontWeight:'700',color:'var(--rose)',fontSize:'14px'}}>{meal.calories} cal</div>
                        {meal.can_substitute && (
                          <button className="btn-ghost-sm" style={{marginTop:'4px',fontSize:'11px'}}
                            disabled={swapping?.dayIdx===di && swapping?.mealIdx===mi}
                            onClick={() => swapMeal(di, mi, meal)}>
                            {swapping?.dayIdx===di && swapping?.mealIdx===mi ? '…' : '↔ Swap'}
                          </button>
                        )}
                      </div>
                    </div>
                    <div style={{display:'flex',gap:'12px',fontSize:'12px',color:'var(--muted)',marginBottom:'8px'}}>
                      <span>P: {meal.protein}g</span><span>C: {meal.carbs}g</span><span>F: {meal.fat}g</span>
                    </div>
                    {meal.ingredients?.length > 0 && (
                      <div style={{display:'flex',flexWrap:'wrap',gap:'5px'}}>
                        {meal.ingredients.map((ing,ii) => (
                          <span key={ii} style={{fontSize:'11px',background:'rgba(28,46,48,.6)',border:'1px solid var(--border)',borderRadius:'6px',padding:'2px 8px',color:'var(--muted)'}}>{ing}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </>
        )
      )}

      {/* ── SHOP TAB ── */}
      {tab === 'shop' && <ShoppingList plan={plan} />}

      {/* ── PROFILE TAB ── */}
      {tab === 'profile' && (
        <form onSubmit={saveAndGenerate} className="form-stack">
          <div className="card-form">
            <div className="form-stack">
              <div className="input-row">
                <div className="input-group">
                  <label className="label">Current Weight (lbs)</label>
                  <input className="input" type="number" placeholder="185" value={profile.weight} onChange={e=>setProfile(p=>({...p,weight:e.target.value}))} />
                </div>
                <div className="input-group">
                  <label className="label">Goal Weight (lbs)</label>
                  <input className="input" type="number" placeholder="175" value={profile.goalWeight} onChange={e=>setProfile(p=>({...p,goalWeight:e.target.value}))} />
                </div>
              </div>
              <div className="input-row">
                <div className="input-group">
                  <label className="label">Goal</label>
                  <select className="input" value={profile.goal} onChange={e=>setProfile(p=>({...p,goal:e.target.value}))}>
                    {GOALS.map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
                <div className="input-group">
                  <label className="label">Timeline (weeks)</label>
                  <input className="input" type="number" placeholder="12" value={profile.timeline} onChange={e=>setProfile(p=>({...p,timeline:e.target.value}))} />
                </div>
              </div>
            </div>
          </div>

          <div className="card-form">
            <label className="label" style={{display:'block',marginBottom:'10px'}}>Dietary Restrictions</label>
            <RestrictionInput value={profile.restrictions} onChange={v => setProfile(p=>({...p,restrictions:v}))} />
          </div>

          <div className="card-form">
            <div className="form-stack">
              <div className="field">
                <label className="label">Foods You Dislike</label>
                <input className="input" placeholder="e.g. mushrooms, cilantro, shellfish" value={profile.dislikes} onChange={e=>setProfile(p=>({...p,dislikes:e.target.value}))} />
              </div>
              <div className="field">
                <label className="label">Foods You Really Want</label>
                <input className="input" placeholder="e.g. salmon, sweet potatoes, berries" value={profile.wantedFoods} onChange={e=>setProfile(p=>({...p,wantedFoods:e.target.value}))} />
              </div>
            </div>
          </div>

          <div className="card-form">
            <label className="label" style={{display:'block',marginBottom:'12px'}}>Kitchen Appliances</label>
            <KitchenIllustration selected={profile.appliances} onChange={v => setProfile(p=>({...p,appliances:v}))} />
          </div>

          <button className="btn-primary" type="submit" disabled={generating}>
            <span style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'8px'}}>
              <IconSparkle style={{width:'16px',height:'16px'}}/>{generating ? 'Generating 7-Day Plan…' : 'Generate AI Meal Plan'}
            </span>
          </button>
          {generating && <p className="muted" style={{textAlign:'center',fontSize:'12px'}}>This takes about 15-20 seconds…</p>}
        </form>
      )}
    </div>
  );
}
