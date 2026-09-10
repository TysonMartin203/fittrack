import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { IconEdit, IconChevron } from '../components/Icons';

export default function Settings() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const fileRef  = useRef();
  const [uploading, setUploading] = useState(false);
  const [success,   setSuccess]   = useState('');
  const [error,     setError]     = useState('');

  const initials   = user?.username?.slice(0,2).toUpperCase() || 'FT';
  const avatarUrl  = user?.avatarUrl ? api.fileUrl(user.avatarUrl) : null;

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
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <div className="page">
      <h2 className="page-title">Profile</h2>

      {/* Avatar section */}
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

      {/* Settings options */}
      <div className="settings-group">
        <div className="settings-item" onClick={() => navigate('/dashboard')}>
          <div className="settings-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
              <path d="M9 21V12h6v9"/>
            </svg>
          </div>
          <span className="settings-label">Dashboard</span>
          <IconChevron className="settings-chevron" style={{width:'18px',height:'18px'}}/>
        </div>
        <div className="settings-item" onClick={() => navigate('/prs')}>
          <div className="settings-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9H4a2 2 0 000 4l.5.5C5.5 15 7 16 9 16.5"/>
              <path d="M18 9h2a2 2 0 010 4l-.5.5C18.5 15 17 16 15 16.5"/>
              <path d="M6 3h12v8a6 6 0 01-12 0V3z"/>
              <path d="M9.5 21h5M12 17v4"/>
            </svg>
          </div>
          <span className="settings-label">My PRs</span>
          <IconChevron className="settings-chevron" style={{width:'18px',height:'18px'}}/>
        </div>
        <div className="settings-item" onClick={() => navigate('/friends')}>
          <div className="settings-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--sage)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
            </svg>
          </div>
          <span className="settings-label">Friends</span>
          <IconChevron className="settings-chevron" style={{width:'18px',height:'18px'}}/>
        </div>
      </div>

      <div className="settings-group">
        <div className="settings-item" onClick={handleLogout}>
          <div className="settings-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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
