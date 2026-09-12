import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { api } from '../api/client';
import ProfileForm from './ProfileForm';

export default function ProfileEditModal({ onClose, onSaved }) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({});
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    api.getProfile()
      .then(d => { if (!cancelled && d.profile) setProfile(d.profile); })
      .catch(err => { if (!cancelled) setError(err?.message || 'Could not load your profile.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  async function save() {
    setSaving(true); setError('');
    try {
      await api.saveProfile(profile);
      onSaved?.(profile);
      setEditing(false);
    } catch (err) { setError(err?.message || 'Could not save. Try again.'); }
    finally { setSaving(false); }
  }

  async function reset() {
    setSaving(true); setError('');
    try {
      const empty = {};
      await api.saveProfile(empty);
      setProfile(empty);
      onSaved?.(empty);
      setConfirmReset(false);
      setEditing(false);
    } catch (err) { setError(err?.message || 'Could not reset. Try again.'); }
    finally { setSaving(false); }
  }

  const summaryLines = [
    profile.weight && `Weight: ${profile.weight} lbs`,
    profile.goalWeight && `Goal weight: ${profile.goalWeight} lbs`,
    profile.goal && `Goal: ${profile.goal}`,
    profile.activityLevel && `Activity: ${profile.activityLevel}`,
    profile.timeline && `Timeline: ${profile.timeline} weeks`,
    Array.isArray(profile.restrictions) && profile.restrictions.length > 0 && `Restrictions: ${profile.restrictions.join(', ')}`,
    profile.dislikes && `Dislikes: ${profile.dislikes}`,
    profile.wantedFoods && `Wants: ${profile.wantedFoods}`,
    Array.isArray(profile.appliances) && profile.appliances.length > 0 && `Appliances: ${profile.appliances.length} selected`,
    profile.notes && `Notes: ${profile.notes}`,
  ].filter(Boolean);

  const modal = (
    <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,.55)',zIndex:9999,display:'flex',alignItems:'flex-end',justifyContent:'center'}} onClick={onClose}>
      <div style={{width:'100%',maxWidth:'480px',maxHeight:'85vh',overflowY:'auto',borderRadius:'20px 20px 0 0',background:'var(--surface)',padding:'20px',boxShadow:'var(--shadow-lg)'}} onClick={e=>e.stopPropagation()}>
        <h3 style={{marginBottom:'16px'}}>Meal & Workout Profile</h3>

        {error && <p className="form-error" style={{marginBottom:'12px'}}>{error}</p>}

        {loading ? (
          <div style={{display:'flex',justifyContent:'center',padding:'30px 0'}}><div className="spinner"/></div>
        ) : editing ? (
          <>
            <ProfileForm profile={profile} setProfile={setProfile}/>
            <div style={{display:'flex',gap:'8px',marginTop:'16px'}}>
              <button className="btn-ghost-sm" onClick={()=>setEditing(false)}>Cancel</button>
              <button className="btn-primary" style={{flex:1}} onClick={save} disabled={saving}>
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </>
        ) : confirmReset ? (
          <>
            <p style={{fontSize:'14px',marginBottom:'16px'}}>Reset your whole profile? This clears everything — weight, goals, restrictions, appliances, all of it.</p>
            <div style={{display:'flex',gap:'8px'}}>
              <button className="btn-ghost-sm" onClick={()=>setConfirmReset(false)}>Cancel</button>
              <button className="btn-danger" style={{flex:1}} onClick={reset} disabled={saving}>
                {saving ? 'Resetting…' : 'Reset Everything'}
              </button>
            </div>
          </>
        ) : (
          <>
            {summaryLines.length > 0
              ? <div className="glass-card" style={{marginBottom:'16px'}}>
                  {summaryLines.map((l,i) => <p key={i} style={{fontSize:'13px',marginBottom:i<summaryLines.length-1?'4px':0}}>{l}</p>)}
                </div>
              : <p className="muted" style={{marginBottom:'16px'}}>Nothing saved yet — tap Edit to set up your profile.</p>
            }
            <div style={{display:'flex',gap:'8px'}}>
              {summaryLines.length > 0 && <button className="btn-ghost-sm" onClick={()=>setConfirmReset(true)}>Reset</button>}
              <button className="btn-primary" style={{flex:1}} onClick={()=>setEditing(true)}>Edit</button>
            </div>
          </>
        )}
        <button className="btn-ghost" style={{width:'100%',marginTop:'10px'}} onClick={onClose}>Close</button>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
