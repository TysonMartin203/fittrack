import { Link } from 'react-router-dom';

export default function WorkoutsHub() {
  return (
    <div className="page">
      <h2 className="page-title">Workouts</h2>
      <div style={{display:'flex',gap:'12px',marginTop:'8px'}}>
        <Link to="/log/new" className="glass-card" style={{flex:1,textDecoration:'none',color:'inherit',padding:'28px 16px',textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center',gap:'10px'}}>
          <span style={{fontSize:'34px'}}>🏋️</span>
          <span style={{fontWeight:'700',fontSize:'16px'}}>Log a Workout</span>
          <span className="muted" style={{fontSize:'13px'}}>Record what you just did</span>
        </Link>
        <Link to="/workout-plans" className="glass-card" style={{flex:1,textDecoration:'none',color:'inherit',padding:'28px 16px',textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center',gap:'10px'}}>
          <span style={{fontSize:'34px'}}>📋</span>
          <span style={{fontWeight:'700',fontSize:'16px'}}>Workout Plans</span>
          <span className="muted" style={{fontSize:'13px'}}>Templates, AI, or build your own</span>
        </Link>
      </div>
    </div>
  );
}
