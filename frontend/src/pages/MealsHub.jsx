import { Link } from 'react-router-dom';
import { IconUtensils, IconMeals, IconClock, IconTrendingUp } from '../components/Icons';

const CARD_STYLE = {
  textDecoration:'none', color:'inherit', padding:'28px 16px', textAlign:'center',
  display:'flex', flexDirection:'column', alignItems:'center', gap:'10px',
};

export default function MealsHub() {
  return (
    <div className="page">
      <h2 className="page-title">Meals</h2>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginTop:'8px'}}>
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
        <Link to="/meals/calories" className="glass-card" style={CARD_STYLE}>
          <IconTrendingUp style={{width:'34px',height:'34px',color:'var(--accent)'}}/>
          <span style={{fontWeight:'700',fontSize:'16px'}}>Calorie Tracker</span>
          <span className="muted" style={{fontSize:'13px'}}>Daily calories, protein, carbs, fat</span>
        </Link>
        <Link to="/meals/history" className="glass-card" style={CARD_STYLE}>
          <IconClock style={{width:'34px',height:'34px',color:'var(--accent)'}}/>
          <span style={{fontWeight:'700',fontSize:'16px'}}>Meal History</span>
          <span className="muted" style={{fontSize:'13px'}}>See everything you've logged</span>
        </Link>
      </div>
    </div>
  );
}
