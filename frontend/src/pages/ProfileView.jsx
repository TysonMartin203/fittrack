import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { formatDateStr } from '../dateUtils';

export default function ProfileView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getUserProfile(id)
      .then(setProfile)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page"><div className="spinner" /></div>;
  if (error) return <div className="page"><p className="form-error">{error}</p></div>;
  if (!profile) return null;

  const initials = profile.username?.slice(0, 2).toUpperCase() || '?';
  const avatarUrl = profile.avatarUrl ? api.fileUrl(profile.avatarUrl) : null;

  return (
    <div className="page">
      <button className="btn-ghost" onClick={() => navigate(-1)} style={{marginBottom:'16px'}}>← Back</button>

      <div className="profile-section">
        <div className="profile-avatar-large">
          {avatarUrl
            ? <img src={avatarUrl} alt="avatar" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
            : <span className="profile-avatar-initials-lg">{initials}</span>
          }
        </div>
        <div className="profile-name">{profile.username}</div>
        {profile.joinedAt && <p className="muted" style={{fontSize:'12px'}}>Joined {formatDateStr(profile.joinedAt, {month:'long', year:'numeric'})}</p>}
        {profile.bio && <p style={{fontSize:'14px',marginTop:'10px',maxWidth:'320px'}}>{profile.bio}</p>}
      </div>

      <div className="stat-row">
        <div className="stat-card">
          <span className="stat-num">{profile.workoutCount}</span>
          <span className="stat-label">Workouts</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{profile.prCount}</span>
          <span className="stat-label">PRs Set</span>
        </div>
        <div className="stat-card">
          <span className="stat-num" style={{display:'flex',alignItems:'center',gap:'4px',justifyContent:'center'}}>
            {profile.streak}
            {profile.streak > 0 && <span style={{fontSize: Math.min(22, 14 + profile.streak)}}>🔥</span>}
          </span>
          <span className="stat-label">Day Streak</span>
        </div>
      </div>
    </div>
  );
}
