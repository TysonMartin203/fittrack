import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { formatDateStr } from '../dateUtils';
import ProgressChart from '../components/ProgressChart';
import FireIcon from '../components/StreakFire';
import { IconChevron, IconCamera } from '../components/Icons';

export default function ProgressPhotos() {
  const [photos, setPhotos] = useState([]);
  const [loadingPhotos, setLoadingPhotos] = useState(true);

  const [exerciseList, setExerciseList] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState('');
  const [history, setHistory] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const [stats, setStats] = useState({ workouts: 0, prs: 0, streak: 0 });
  const [showCompare, setShowCompare] = useState(false);

  useEffect(() => {
    api.getPhotos().then(setPhotos).catch(console.error).finally(() => setLoadingPhotos(false));
    api.getLoggedExercises().then(list => {
      setExerciseList(list);
      if (list.length > 0) setSelectedExercise(list[0]);
    }).catch(console.error);
    Promise.all([
      api.getWorkouts().catch(() => []),
      api.getPRs().catch(() => []),
      api.getStreak().catch(() => ({ streak: 0 })),
    ]).then(([w, p, s]) => setStats({ workouts: w.length, prs: p.length, streak: s.streak || 0 }));
  }, []);

  useEffect(() => {
    if (!selectedExercise) return;
    setLoadingHistory(true);
    api.getExerciseHistory(selectedExercise)
      .then(setHistory)
      .catch(() => setHistory([]))
      .finally(() => setLoadingHistory(false));
  }, [selectedExercise]);

  const recentPhotos = photos.slice(0, 6);
  const oldest = photos[photos.length - 1];
  const newest = photos[0];

  return (
    <div className="page">
      <h2 className="page-title">Progress</h2>

      {/* Quick stats */}
      <div className="stat-row" style={{marginBottom:'24px'}}>
        <div className="stat-card">
          <span className="stat-num">{stats.workouts}</span>
          <span className="stat-label">Workouts</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{stats.prs}</span>
          <span className="stat-label">PRs Set</span>
        </div>
        <div className="stat-card">
          <span className="stat-num" style={{display:'flex',alignItems:'center',gap:'4px',justifyContent:'center'}}>
            {stats.streak}{stats.streak > 0 && <FireIcon size={18}/>}
          </span>
          <span className="stat-label">Day Streak</span>
        </div>
      </div>

      {/* Strength progress chart */}
      <section className="section">
        <div className="section-header">
          <span className="section-title">Strength Progress</span>
        </div>
        {exerciseList.length === 0 ? (
          <p className="muted" style={{fontSize:'13px'}}>Log a few lifting workouts to see your progress here.</p>
        ) : (
          <div className="card-form">
            <select className="input" value={selectedExercise} onChange={e=>setSelectedExercise(e.target.value)} style={{marginBottom:'14px'}}>
              {exerciseList.map(ex => <option key={ex} value={ex}>{ex}</option>)}
            </select>
            {loadingHistory ? <div className="spinner"/> : <ProgressChart points={history || []} />}
          </div>
        )}
      </section>

      {/* Photos preview */}
      <section className="section">
        <div className="section-header">
          <span className="section-title">Progress Photos</span>
          <Link to="/photos/all" className="link-small">See All →</Link>
        </div>
        {loadingPhotos ? <div className="spinner"/> : photos.length === 0 ? (
          <p className="muted" style={{fontSize:'13px'}}>No photos yet. <Link to="/photos/all">Upload your first!</Link></p>
        ) : (
          <div style={{display:'flex',gap:'8px',overflowX:'auto',paddingBottom:'4px'}}>
            {recentPhotos.map(ph => (
              <Link to="/photos/all" key={ph.id} style={{flexShrink:0}}>
                <img src={api.fileUrl(ph.file_path)} alt={ph.photo_date} style={{width:'88px',height:'88px',objectFit:'cover',borderRadius:'var(--r)',border:'1px solid var(--border)'}}/>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Before & After comparison */}
      {photos.length >= 2 && (
        <section className="section">
          <div className="list-item clickable" onClick={()=>setShowCompare(s=>!s)} style={{marginBottom: showCompare ? '12px' : 0}}>
            <IconCamera style={{width:'20px',height:'20px',color:'var(--accent)',flexShrink:0}}/>
            <div style={{flex:1}}>
              <div className="item-main">Before & After</div>
              <div className="item-meta">Compare your first and most recent photo</div>
            </div>
            <IconChevron style={{width:'16px',height:'16px',color:'var(--muted)',transform: showCompare ? 'rotate(90deg)' : 'none'}}/>
          </div>
          {showCompare && (
            <div style={{display:'flex',gap:'10px'}}>
              <div style={{flex:1,textAlign:'center'}}>
                <img src={api.fileUrl(oldest.file_path)} alt="before" style={{width:'100%',aspectRatio:'3/4',objectFit:'cover',borderRadius:'var(--r)',border:'1px solid var(--border)'}}/>
                <p className="muted" style={{fontSize:'12px',marginTop:'6px'}}>{formatDateStr(oldest.photo_date)}</p>
              </div>
              <div style={{flex:1,textAlign:'center'}}>
                <img src={api.fileUrl(newest.file_path)} alt="after" style={{width:'100%',aspectRatio:'3/4',objectFit:'cover',borderRadius:'var(--r)',border:'1px solid var(--border)'}}/>
                <p className="muted" style={{fontSize:'12px',marginTop:'6px'}}>{formatDateStr(newest.photo_date)}</p>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
