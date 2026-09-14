import { Link } from 'react-router-dom';
import { IconUtensils, IconMeals, IconClock } from '../components/Icons';

const CARD_STYLE = {
  textDecoration:'none', color:'inherit', padding:'28px 16px', textAlign:'center',
  display:'flex', flexDirection:'column', alignItems:'center', gap:'10px',
};

export default function MealsHub() {
  return (
    <div className="page">
      <h2 className="page-title">Meals</h2>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginTop:'8px',marginBottom:'12px'}}>
        <Link to="/meals/log" className="glass-card" style={CARD_STYLE}>
          <IconUtensils style={{width:'34px',height:'34px',color:'var(--accent)'}}/>
          <span style={{fontWeight:'700',fontSize:'16px'}}>Log a Meal</span>
          <span className="muted" style={{fontSize:'13px'}}>Track what you ate and calories</span>
        </Link>
        <Link to="/meals/plans" className="glass-card" style={CARD_STYLE}>
          <IconMeals style={{width:'34px',height:'34px',color:'var(--accent)'}}/>
          <span style={{fontWeight:'700',fontSize:'16px'}}>Meal Plans</span>
          <span className="muted" style={{fontSize:'13px'}}>Templates, AI, or build your own</span>
        </Link>
      </div>

      <Link to="/meals/history" className="glass-card" style={{...CARD_STYLE, flexDirection:'row', justifyContent:'center', padding:'20px 16px'}}>
        <IconClock style={{width:'28px',height:'28px',color:'var(--accent)'}}/>
        <div style={{textAlign:'left'}}>
          <div style={{fontWeight:'700',fontSize:'16px'}}>Meal History</div>
          <div className="muted" style={{fontSize:'13px'}}>See everything you've logged</div>
        </div>
      </Link>
    </div>
  );
}
