import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { IconEdit, IconChevron } from '../components/Icons';

export default function Settings() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const fileRef  = useRef();
  const [uploading,     setUploading]     = useState(false);
  const [success,       setSuccess]       = useState('');
  const [error,         setError]         = useState('');
  const [achievements,  setAchievements]  = useState([]);
  const [loadingAch,    setLoadingAch]    = useState(true);
  const [showAllAch,    setShowAllAch]    = useState(false);

  const initials  = user?.username?.slice(0,2).toUpperCase() || 'FT';
  const avatarUrl = user?.avatarUrl ? api.fileUrl(user.avatarUrl) : null;

  useEffect(() => {
    api.getAchievements()
      .then(d => setAchievements(d.achievements || []))
      .catch(() => {})
      .finally(() => setLoadingAch(false));
  }, []);

  async function onAvatarChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true); setError(''); setSuccess('');
    try {
      const fd = new FormData();
      fd.append('avatar', file);
      const data = await api.uploadAvatar(fd);
      updateUser({ avatarUrl: data.avatarUrl });
      setSuccess('Profile photo updated!');
    } catch (err) { setError(err.message); }
    finally { setUploading(false); }
  }

  const unlocked = achievements.filter(a => a.unlocked);
  const locked   = achievements.filter(a => !a.unlocked);
  const displayed = showAllAch ? achievements : achievements.slice(0, 8);

  return (
    <div className="page">
      <h2 className="page-title">Profile</h2>

      {/* Avatar */}
      <div className="profile-section">
        <div className="profile-avatar-large" onClick={() => fileRef.current?.click()}>
          {avatarUrl
            ? <img src={avatarUrl} alt="avatar" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
            : <span className="profile-avatar-initials-lg">{initials}</span>
          }
          <div className="avatar-edit-badge">
            <IconEdit style={{width:'11px',height:'11px',color:'#fff'}}/>
          </div>
        </div>
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" style={{display:'none'}} onChange={onAvatarChange}/>
        <div className="profile-name">{user?.username}</div>
        <div className="profile-email">{user?.email}</div>
        {uploading && <p className="muted" style={{fontSize:'12px'}}>Uploading…</p>}
        {success   && <p className="form-success">{success}</p>}
        {error     && <p className="form-error">{error}</p>}
        <p className="muted" style={{fontSize:'12px',marginTop:'4px'}}>Tap photo to change</p>
      </div>

      {/* Achievements */}
      <div className="section">
        <div className="section-header">
          <span className="section-title">Achievements</span>
          <span style={{fontSize:'13px',color:'var(--teal)',fontWeight:'600'}}>{unlocked.length}/{achievements.length}</span>
        </div>

        {loadingAch ? <div className="spinner" style={{margin:'20px auto'}}/> : (
          <>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(80px,1fr))',gap:'10px',marginBottom:'12px'}}>
              {(showAllAch ? achievements : achievements.slice(0,8)).map(a => (
                <div key={a.id} style={{
                  display:'flex',flexDirection:'column',alignItems:'center',gap:'4px',
                  padding:'12px 8px',borderRadius:'var(--r)',textAlign:'center',
                  background: a.unlocked ? 'rgba(126,176,155,0.12)' : 'rgba(46,74,78,.3)',
                  border: `1px solid ${a.unlocked ? 'rgba(126,176,155,0.3)' : 'var(--border)'}`,
                  opacity: a.unlocked ? 1 : 0.4,
                  transition:'all .2s',
                }}>
                  <span style={{fontSize:'24px'}}>{a.icon}</span>
                  <span style={{fontSize:'10px',fontWeight:'600',color: a.unlocked ? 'var(--text)' : 'var(--muted)',lineHeight:'1.2'}}>{a.title}</span>
                  {a.unlocked && <span style={{fontSize:'9px',color:'var(--teal)',fontWeight:'700'}}>✓ Done</span>}
                </div>
              ))}
            </div>
            {achievements.length > 8 && (
              <button className="btn-ghost" style={{width:'100%',fontSize:'13px'}} onClick={() => setShowAllAch(!showAllAch)}>
                {showAllAch ? 'Show Less' : `Show All ${achievements.length}`}
              </button>
            )}
          </>
        )}
      </div>

      {/* Nav shortcuts */}
      <div className="settings-group" style={{marginBottom:'16px'}}>
        {[
          { label:'Dashboard',  path:'/dashboard', color:'var(--teal)' },
          { label:'My PRs',     path:'/prs',       color:'var(--rose)' },
          { label:'Meal Plans', path:'/meals',     color:'var(--sage)' },
          { label:'Friends',    path:'/friends',   color:'var(--teal)' },
        ].map(({label,path,color}) => (
          <div key={path} className="settings-item" onClick={() => navigate(path)}>
            <div className="settings-icon">
              <div style={{width:'10px',height:'10px',borderRadius:'50%',background:color}}/>
            </div>
            <span className="settings-label">{label}</span>
            <IconChevron style={{width:'18px',height:'18px',color:'var(--muted)'}}/>
          </div>
        ))}
      </div>

      <div className="settings-group">
        <div className="settings-item" onClick={() => { logout(); navigate('/'); }}>
          <div className="settings-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:'18px',height:'18px'}}>
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </div>
          <span className="settings-label" style={{color:'var(--danger)'}}>Log Out</span>
        </div>
      </div>
    </div>
  );
}
