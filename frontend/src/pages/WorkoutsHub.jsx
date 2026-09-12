import { Link } from 'react-router-dom';
import { IconBarbell, IconClipboard, IconClock, IconChevron } from '../components/Icons';

export default function WorkoutsHub() {
  return (
    <div className="page">
      <h2 className="page-title">Workouts</h2>
      <div style={{display:'flex',gap:'12px',marginTop:'8px',marginBottom:'12px'}}>
        <Link to="/log/new" className="glass-card" style={{flex:1,textDecoration:'none',color:'inherit',padding:'28px 16px',textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center',gap:'10px'}}>
          <IconBarbell style={{width:'34px',height:'34px',color:'var(--accent)'}}/>
          <span style={{fontWeight:'700',fontSize:'16px'}}>Log a Workout</span>
          <span className="muted" style={{fontSize:'13px'}}>Record what you just did</span>
        </Link>
        <Link to="/workout-plans" className="glass-card" style={{flex:1,textDecoration:'none',color:'inherit',padding:'28px 16px',textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center',gap:'10px'}}>
          <IconClipboard style={{width:'34px',height:'34px',color:'var(--accent)'}}/>
          <span style={{fontWeight:'700',fontSize:'16px'}}>Workout Plans</span>
          <span className="muted" style={{fontSize:'13px'}}>Templates, AI, or build your own</span>
        </Link>
      </div>

      <Link to="/log/history" className="list-item clickable" style={{textDecoration:'none',color:'inherit'}}>
        <IconClock style={{width:'20px',height:'20px',color:'var(--accent)',flexShrink:0}}/>
        <div style={{flex:1}}>
          <div className="item-main">Past Workouts</div>
          <div className="item-meta">See everything you've logged</div>
        </div>
        <IconChevron style={{width:'16px',height:'16px',color:'var(--muted)'}}/>
      </Link>
    </div>
  );
}
