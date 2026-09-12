import { useState } from 'react';
import { api } from '../api/client';
import { IconMeals, IconBarbell, IconX } from './Icons';

export default function SharePlanPanel({ friendId, onShared, onClose }) {
  const [type, setType] = useState(null); // 'meal' | 'workout'
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(null); // id currently sending
  const [error, setError] = useState('');

  async function pickType(t) {
    setType(t);
    setLoading(true); setError('');
    try {
      if (t === 'meal') {
        const list = await api.listMealPlans();
        setPlans(list.plans || list || []);
      } else {
        const list = await api.getWorkoutPlans();
        setPlans(list || []);
      }
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }

  async function send(plan) {
    setSending(plan.id); setError('');
    try {
      if (type === 'meal') await api.shareMealPlan(plan.id, { friendId });
      else await api.shareWorkoutPlan(plan.id, { friendId });
      await api.sendMessage({ receiverId: friendId, message: `Sent you a ${type} plan: "${plan.name}" — check your ${type === 'meal' ? 'Meal' : 'Workout'} Plans!` });
      onShared();
    } catch (err) { setError(err.message); }
    finally { setSending(null); }
  }

  return (
    <div className="card-form" style={{marginBottom:'10px'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'10px'}}>
        <span style={{fontWeight:'700',fontSize:'14px'}}>Share a plan</span>
        <button onClick={onClose} style={{background:'none',border:'none',cursor:'pointer',color:'var(--muted)'}}><IconX style={{width:'16px',height:'16px'}}/></button>
      </div>

      {!type ? (
        <div style={{display:'flex',gap:'8px'}}>
          <button className="btn-secondary" style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:'6px'}} onClick={()=>pickType('meal')}>
            <IconMeals style={{width:'16px',height:'16px'}}/> Meal Plan
          </button>
          <button className="btn-secondary" style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:'6px'}} onClick={()=>pickType('workout')}>
            <IconBarbell style={{width:'16px',height:'16px'}}/> Workout Plan
          </button>
        </div>
      ) : loading ? (
        <div className="spinner"/>
      ) : (
        <>
          <button className="btn-ghost-sm" style={{marginBottom:'8px'}} onClick={()=>setType(null)}>← Choose different type</button>
          {plans.length === 0 ? (
            <p className="muted" style={{fontSize:'13px'}}>You don't have any {type} plans saved yet.</p>
          ) : (
            <div style={{maxHeight:'220px',overflowY:'auto'}}>
              {plans.map(p => (
                <div key={p.id} className="list-item" style={{marginBottom:'6px'}}>
                  <div style={{flex:1}}>
                    <div className="item-main">{p.name}</div>
                  </div>
                  <button className="btn-ghost-sm" onClick={()=>send(p)} disabled={sending===p.id}>
                    {sending===p.id ? 'Sending…' : 'Send'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {error && <p className="form-error" style={{marginTop:'8px'}}>{error}</p>}
    </div>
  );
}
