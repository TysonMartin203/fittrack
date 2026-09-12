import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { api } from '../api/client';
import ProfileForm from './ProfileForm';

export default function ProfileGateModal({ onProceed, onClose }) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({});
  const [hadProfile, setHadProfile] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let cancelled = false;
    api.getProfile()
      .then(d => {
        if (cancelled) return;
        if (d.profile) { setProfile(d.profile); setHadProfile(true); }
        else { setEditing(true); } // no profile yet — go straight to filling it out
      })
      .catch(err => {
        if (cancelled) return;
        setLoadError(err?.message || 'Could not load your profile.');
        setEditing(true); // still let them fill it out fresh
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  async function saveAndContinue() {
    setSaving(true); setError('');
    try {
      await api.saveProfile(profile);
      onProceed(profile);
    } catch (err) { setError(err?.message || 'Could not save. Try again.'); }
    finally { setSaving(false); }
  }

  const summaryLines = [
    profile.weight && `Weight: ${profile.weight} lbs`,
    profile.goalWeight && `Goal weight: ${profile.goalWeight} lbs`,
    profile.goal && `Goal: ${profile.goal}`,
    profile.activityLevel && `Activity: ${profile.activityLevel}`,
    profile.timeline && `Timeline: ${profile.timeline} weeks`,
    Array.isArray(profile.restrictions) && profile.restrictions.length > 0 && `Restrictions: ${profile.restrictions.join(', ')}`,
    profile.appliances?.length > 0 && `Appliances: ${Array.isArray(profile.appliances) ? profile.appliances.join(', ') : profile.appliances}`,
    profile.notes && `Notes: ${profile.notes}`,
  ].filter(Boolean);

  const modal = (
    <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,.55)',zIndex:9999,display:'flex',alignItems:'flex-end',justifyContent:'center'}} onClick={onClose}>
      <div style={{width:'100%',maxWidth:'480px',maxHeight:'85vh',overflowY:'auto',borderRadius:'20px 20px 0 0',background:'var(--surface)',padding:'20px',boxShadow:'var(--shadow-lg)'}} onClick={e=>e.stopPropagation()}>
        <h3 style={{marginBottom:'4px'}}>Your Profile</h3>
        <p className="muted" style={{fontSize:'13px',marginBottom:'16px'}}>Used to build a plan that actually fits you.</p>

        {loadError && <p className="form-error" style={{marginBottom:'12px'}}>{loadError}</p>}

        {loading ? (
          <div style={{display:'flex',justifyContent:'center',padding:'30px 0'}}><div className="spinner"/></div>
        ) : editing ? (
          <>
            <ProfileForm profile={profile} setProfile={setProfile}/>
            {error && <p className="form-error" style={{marginTop:'10px'}}>{error}</p>}
            <div style={{display:'flex',gap:'8px',marginTop:'16px'}}>
              {hadProfile && <button className="btn-ghost-sm" onClick={()=>setEditing(false)}>Cancel</button>}
              <button className="btn-primary" style={{flex:1}} onClick={saveAndContinue} disabled={saving}>
                {saving ? 'Saving…' : 'Save & Continue'}
              </button>
            </div>
          </>
        ) : (
          <>
            {summaryLines.length > 0
              ? <div className="glass-card" style={{marginBottom:'16px'}}>
                  {summaryLines.map((l,i) => <p key={i} style={{fontSize:'13px',marginBottom:i<summaryLines.length-1?'4px':0}}>{l}</p>)}
                </div>
              : <p className="muted" style={{marginBottom:'16px'}}>No details saved yet — you can still continue, or add some for a more tailored plan.</p>
            }
            <div style={{display:'flex',gap:'8px'}}>
              <button className="btn-ghost-sm" onClick={()=>setEditing(true)}>Edit</button>
              <button className="btn-primary" style={{flex:1}} onClick={()=>onProceed(profile)}>Use This & Continue</button>
            </div>
          </>
        )}
        <button className="btn-ghost" style={{width:'100%',marginTop:'10px'}} onClick={onClose}>Cancel</button>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
