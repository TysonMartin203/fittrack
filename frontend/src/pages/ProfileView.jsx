import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { formatDateStr } from '../dateUtils';
import FireIcon from '../components/StreakFire';
import AchievementIcon from '../components/AchievementIcon';

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
            {profile.streak > 0 && <FireIcon size={Math.min(24, 14 + profile.streak)} />}
          </span>
          <span className="stat-label">Day Streak</span>
        </div>
      </div>

      {profile.achievements?.length > 0 && (
        <section className="section">
          <div className="section-header"><span className="section-title">Achievements</span></div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(80px,1fr))',gap:'12px'}}>
            {profile.achievements.map(a => (
              <div key={a.id} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'6px',textAlign:'center'}} title={a.desc}>
                <AchievementIcon id={a.id} active size={36}/>
                <span style={{fontSize:'11px',fontWeight:'600'}}>{a.title}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
