import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { IconEdit, IconChevron } from '../components/Icons';
import AchievementIcon from '../components/AchievementIcon';
import { compressImage } from '../compressImage';
import { enablePush, disablePush, getPushStatus } from '../push';

// How-to descriptions for each achievement
const HOW_TO = {
  first_workout:   'Log your very first workout in the Log tab.',
  five_workouts:   'Log 5 workouts total. Keep showing up!',
  ten_workouts:    'Log 10 workouts. You\'re building a real habit.',
  twenty_workouts: 'Log 20 workouts. Consistency is everything.',
  fifty_workouts:  'Log 50 workouts. You\'re fully dedicated.',
  hundred_workouts:'Log 100 workouts. The century club — elite status.',
  first_pr:        'Set a personal record on any exercise by logging a heavier weight than before.',
  five_prs:        'Set 5 personal records across any combination of exercises.',
  ten_prs:         'Set 10 personal records. You are breaking limits.',
  first_photo:     'Upload your first progress photo in the Photos tab.',
  five_photos:     'Upload 5 progress photos to track your transformation.',
  first_friend:    'Add your first friend in the Friends tab.',
  three_friends:   'Add 3 friends. The more the merrier.',
  five_friends:    'Add 5 friends and build your fitness squad.',
  first_message:   'Send a message to one of your friends.',
  first_meal:      'Generate your first meal plan in the Meals tab.',
  three_meals:     'Generate 3 meal plans. Healthy eating is a lifestyle.',
  has_avatar:      'Upload a profile photo by tapping your avatar at the top of this page.',
};

export default function Settings() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const fileRef  = useRef();
  const [uploading,    setUploading]    = useState(false);
  const [success,      setSuccess]      = useState('');
  const [error,        setError]        = useState('');
  const [achievements, setAchievements] = useState([]);
  const [loadingAch,   setLoadingAch]   = useState(true);
  const [showAll,      setShowAll]      = useState(false);
  const [expanded,     setExpanded]     = useState(null); // which achievement is expanded
  const [bio,          setBio]          = useState(user?.bio || '');
  const [savingBio,    setSavingBio]    = useState(false);
  const [pushStatus,   setPushStatus]   = useState('unknown');

  const initials  = user?.username?.slice(0,2).toUpperCase() || 'FT';
  const avatarUrl = user?.avatarUrl ? api.fileUrl(user.avatarUrl) : null;

  useEffect(() => {
    api.getAchievements()
      .then(d => setAchievements(d.achievements || []))
      .catch(() => {})
      .finally(() => setLoadingAch(false));
    getPushStatus().then(setPushStatus).catch(() => setPushStatus('unsupported'));
  }, []);

  async function onAvatarChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true); setError(''); setSuccess('');
    try {
      const compressed = await compressImage(file, { maxDimension: 800, quality: 0.85 });
      const fd = new FormData();
      fd.append('avatar', compressed);
      const data = await api.uploadAvatar(fd);
      updateUser({ avatarUrl: data.avatarUrl });
      setSuccess('Profile photo updated!');
    } catch (err) { setError(err.message); }
    finally { setUploading(false); }
  }

  async function setTheme(theme) {
    updateUser({ theme }); // apply instantly
    try { await api.updateTheme(theme); } catch {} // persisted best-effort
  }

  async function saveBio() {
    setSavingBio(true);
    try {
      await api.updateAccountSettings({ bio });
      updateUser({ bio });
      setSuccess('Bio updated!');
    } catch (err) { setError(err.message); }
    finally { setSavingBio(false); }
  }

  async function toggleNotifyBuzz() {
    const next = !user.notifyBuzz;
    updateUser({ notifyBuzz: next });
    try { await api.updateAccountSettings({ notifyBuzz: next }); } catch {}
  }
  async function toggleNotifyMessages() {
    const next = !user.notifyMessages;
    updateUser({ notifyMessages: next });
    try { await api.updateAccountSettings({ notifyMessages: next }); } catch {}
  }
  async function togglePush() {
    try {
      if (pushStatus === 'subscribed') { await disablePush(); setPushStatus('not-subscribed'); }
      else { await enablePush(); setPushStatus('subscribed'); }
    } catch (err) { setError(err.message); }
  }

  const unlocked = achievements.filter(a => a.unlocked);
  const displayed = showAll ? achievements : achievements.slice(0, 9);

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
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif" style={{display:'none'}} onChange={onAvatarChange}/>
        <div className="profile-name">{user?.username}</div>
        <div className="profile-email">{user?.email}</div>
        {uploading && <p className="muted" style={{fontSize:'12px'}}>Uploading…</p>}
        {success   && <p className="form-success">{success}</p>}
        {error     && <p className="form-error">{error}</p>}
        <p className="muted" style={{fontSize:'12px',marginTop:'4px'}}>Tap photo to change</p>
      </div>

      {/* Bio */}
      <div className="section">
        <div className="section-header">
          <span className="section-title">About You</span>
        </div>
        <textarea className="input" rows={3} placeholder="Tell friends a bit about yourself…" maxLength={280}
          value={bio} onChange={e => setBio(e.target.value)} />
        <button className="btn-ghost-sm" style={{marginTop:'8px'}} onClick={saveBio} disabled={savingBio}>
          {savingBio ? 'Saving…' : 'Save Bio'}
        </button>
      </div>

      {/* Notifications */}
      <div className="section">
        <div className="section-header">
          <span className="section-title">Notifications</span>
        </div>
        {pushStatus !== 'unsupported' && pushStatus !== 'denied' && (
          <div className="list-item">
            <div style={{flex:1}}>
              <div className="item-main">Push notifications</div>
              <div className="item-meta">{pushStatus === 'subscribed' ? 'Enabled on this device' : 'Off on this device'}</div>
            </div>
            <button className="btn-ghost-sm" onClick={togglePush}>{pushStatus === 'subscribed' ? 'Turn off' : 'Enable'}</button>
          </div>
        )}
        {pushStatus === 'denied' && (
          <p className="muted" style={{fontSize:'12px',marginBottom:'10px'}}>Notifications are blocked in your browser settings — enable them there first.</p>
        )}
        <label className="list-item" style={{cursor:'pointer'}}>
          <div style={{flex:1}}>
            <div className="item-main">Buzz from friends</div>
            <div className="item-meta">A friend nudging you to work out</div>
          </div>
          <input type="checkbox" checked={user?.notifyBuzz !== false} onChange={toggleNotifyBuzz} style={{width:'18px',height:'18px',accentColor:'var(--accent)'}} />
        </label>
        <label className="list-item" style={{cursor:'pointer'}}>
          <div style={{flex:1}}>
            <div className="item-main">Messages</div>
            <div className="item-meta">New direct messages from friends</div>
          </div>
          <input type="checkbox" checked={user?.notifyMessages !== false} onChange={toggleNotifyMessages} style={{width:'18px',height:'18px',accentColor:'var(--accent)'}} />
        </label>
      </div>

      {/* Appearance */}
      <div className="section">
        <div className="section-header">
          <span className="section-title">Appearance</span>
        </div>
        <div className="tab-row">
          <button className={user?.theme !== 'dark' ? 'tab active' : 'tab'} onClick={() => setTheme('light')}>☀️ Light</button>
          <button className={user?.theme === 'dark' ? 'tab active' : 'tab'} onClick={() => setTheme('dark')}>🌙 Dark</button>
        </div>
      </div>

      {/* Achievements */}
      <div className="section">
        <div className="section-header">
          <span className="section-title">Achievements</span>
          <span style={{fontSize:'13px',color:'var(--teal)',fontWeight:'600'}}>
            {unlocked.length}/{achievements.length} unlocked
          </span>
        </div>

        {loadingAch ? <div className="spinner" style={{margin:'20px auto'}}/> : (
          <>
            <div style={{display:'flex',flexDirection:'column',gap:'8px',marginBottom:'12px'}}>
              {displayed.map(a => (
                <div key={a.id}
                  onClick={() => setExpanded(expanded === a.id ? null : a.id)}
                  style={{
                    display:'flex', alignItems:'center', gap:'14px',
                    padding:'14px 16px',
                    borderRadius:'var(--r)',
                    border: `1px solid ${a.unlocked ? 'rgba(204,139,134,0.3)' : 'var(--border)'}`,
                    background: a.unlocked ? 'rgba(204,139,134,0.08)' : 'var(--surface-tint)',
                    cursor:'pointer',
                    transition:'all .15s',
                    WebkitTapHighlightColor:'transparent',
                  }}>
                  {/* Icon */}
                  <div style={{
                    width:'48px', height:'48px', borderRadius:'12px', flexShrink:0,
                    background: a.unlocked ? 'var(--surface-tint)' : 'var(--surface-tint)',
                    border: `1px solid ${a.unlocked ? 'rgba(204,139,134,0.25)' : 'var(--border)'}`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                  }}>
                    <AchievementIcon id={a.id} active={a.unlocked} size={32}/>
                  </div>

                  {/* Text */}
                  <div style={{flex:1, minWidth:0}}>
                    <div style={{
                      fontWeight:'700', fontSize:'14px',
                      color: a.unlocked ? 'var(--text)' : 'var(--muted)',
                      marginBottom:'2px',
                    }}>
                      {a.title}
                      {a.unlocked && <span style={{marginLeft:'8px',fontSize:'11px',color:'var(--teal)',fontWeight:'700'}}>✓ UNLOCKED</span>}
                    </div>
                    <div style={{fontSize:'12px',color:'var(--muted)',lineHeight:'1.4'}}>
                      {a.unlocked ? a.desc : HOW_TO[a.id] || a.desc}
                    </div>
                    {/* Expanded how-to when locked */}
                    {!a.unlocked && expanded === a.id && (
                      <div style={{
                        marginTop:'8px', padding:'8px 10px',
                        background:'var(--surface-tint)', borderRadius:'8px',
                        fontSize:'12px', color:'var(--text)', lineHeight:'1.5',
                        border:'1px solid var(--border)',
                      }}>
                        <span style={{color:'var(--teal)',fontWeight:'700'}}>How to unlock: </span>
                        {HOW_TO[a.id] || a.desc}
                      </div>
                    )}
                  </div>

                  {/* Chevron */}
                  {!a.unlocked && (
                    <div style={{color:'var(--muted)',fontSize:'14px',flexShrink:0,transition:'transform .2s',transform: expanded===a.id ? 'rotate(90deg)' : 'none'}}>›</div>
                  )}
                </div>
              ))}
            </div>

            {achievements.length > 9 && (
              <button className="btn-ghost" style={{width:'100%',fontSize:'13px'}} onClick={() => setShowAll(!showAll)}>
                {showAll ? 'Show Less' : `Show All ${achievements.length} Achievements`}
              </button>
            )}
          </>
        )}
      </div>

      {/* Nav shortcuts */}
      <div className="settings-group" style={{marginBottom:'16px'}}>
        {[
          { label:'Dashboard',  path:'/dashboard' },
          { label:'Feed',       path:'/feed'       },
          { label:'Meal Plans', path:'/meals'      },
          { label:'Social',     path:'/social'     },
        ].map(({label,path}) => (
          <div key={path} className="settings-item" onClick={() => navigate(path)}>
            <span className="settings-label">{label}</span>
            <IconChevron style={{width:'18px',height:'18px',color:'var(--muted)'}}/>
          </div>
        ))}
      </div>

      <div className="settings-group">
        <div className="settings-item" onClick={() => { logout(); navigate('/'); }}>
          <span className="settings-label" style={{color:'var(--danger)'}}>Log Out</span>
        </div>
      </div>
    </div>
  );
}
