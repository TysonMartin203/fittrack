import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import {
  IconBarbell, IconTrendingUp, IconPeople, IconUtensils, IconTrophy,
} from '../components/Icons';

const STEPS = [
  {
    Icon: IconBarbell,
    title: 'Log Workouts Your Way',
    body: 'Type it in, pick from a plan, or just describe it out loud with the voice note button — sets, reps, weight, or a run/walk/bike session with GPS tracking.',
  },
  {
    Icon: IconUtensils,
    title: 'Track Meals & Calories',
    body: 'Log meals manually, snap a photo for an AI estimate, or describe what you ate by voice. A daily calorie tracker keeps a running total against your goal.',
  },
  {
    Icon: IconTrendingUp,
    title: 'Watch Your Progress',
    body: 'Progress photos, a real strength chart built from your actual lifts, and your all-time volume — all in one place.',
  },
  {
    Icon: IconTrophy,
    title: 'Unlock Achievements',
    body: 'Hit milestones — your first PR, a five-day streak, a marathon\'s worth of miles — and earn custom badges for each one.',
  },
  {
    Icon: IconPeople,
    title: 'Train With Friends',
    body: 'Add friends, compete on a leaderboard, join challenges, and share workout or meal plans right in a chat.',
  },
];

export default function Tutorial() {
  const [step, setStep] = useState(0);
  const [finishing, setFinishing] = useState(false);
  const navigate = useNavigate();
  const { updateUser } = useAuth();

  async function finish() {
    setFinishing(true);
    try { await api.completeTutorial(); } catch { /* not critical if this fails */ }
    updateUser({ tutorialDone: true });
    navigate('/dashboard');
  }

  const { Icon, title, body } = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div className="page" style={{display:'flex',flexDirection:'column',minHeight:'100dvh',justifyContent:'center'}}>
      <div style={{textAlign:'center',maxWidth:'360px',margin:'0 auto'}}>
        <div style={{
          width:'84px',height:'84px',borderRadius:'50%',background:'var(--surface-tint)',
          display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 24px',
        }}>
          <Icon style={{width:'38px',height:'38px',color:'var(--accent)'}}/>
        </div>
        <h2 style={{marginBottom:'10px'}}>{title}</h2>
        <p className="muted" style={{fontSize:'14px',lineHeight:'1.5',marginBottom:'28px'}}>{body}</p>

        <div style={{display:'flex',justifyContent:'center',gap:'6px',marginBottom:'28px'}}>
          {STEPS.map((_, i) => (
            <div key={i} style={{
              width: i===step ? '20px' : '6px', height:'6px', borderRadius:'999px',
              background: i===step ? 'var(--accent)' : 'var(--border)', transition:'all .2s',
            }}/>
          ))}
        </div>

        <div style={{display:'flex',gap:'10px'}}>
          {step > 0 && <button className="btn-secondary" style={{flex:1}} onClick={()=>setStep(s=>s-1)}>Back</button>}
          <button className="btn-primary" style={{flex:1}} disabled={finishing} onClick={()=> isLast ? finish() : setStep(s=>s+1)}>
            {isLast ? (finishing ? 'Finishing…' : "Let's Go") : 'Next'}
          </button>
        </div>
        {!isLast && (
          <button className="link-small" style={{marginTop:'18px',background:'none',border:'none',cursor:'pointer'}} onClick={finish} disabled={finishing}>
            Skip for now
          </button>
        )}
      </div>
    </div>
  );
}
