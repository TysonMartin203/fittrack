import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import ReactionIcon, { REACTIONS } from '../components/ReactionIcons';
import { IconTrophy, IconFlag, IconBarbell } from '../components/Icons';

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function FeedItem({ item, onReact, currentUserId }) {
  const [open, setOpen] = useState(false);
  const FeedIcon = item.type === 'pr' ? IconTrophy : item.type === 'challenge' ? IconFlag : IconBarbell;
  const isMine = item.user_id === currentUserId;
  const linkTo = (item.type === 'pr' || item.type === 'workout') && item.ref_id
    ? (isMine ? `/workouts/${item.ref_id}` : `/workouts/${item.ref_id}/view`)
    : null;

  const body = (
    <>
      <div style={{display:'flex',alignItems:'flex-start',gap:'10px'}}>
        <span style={{flexShrink:0,color:'var(--accent)'}}><FeedIcon style={{width:'20px',height:'20px'}}/></span>
        <div style={{flex:1}}>
          <div style={{fontSize:'14px'}}><strong>{item.username}</strong> {item.headline}</div>
          {item.detail && <div style={{fontSize:'12px',color:'var(--muted)',marginTop:'2px'}}>{item.detail}</div>}
          <div style={{fontSize:'11px',color:'var(--muted)',marginTop:'4px'}}>{timeAgo(item.created_at)}</div>
        </div>
      </div>
    </>
  );

  return (
    <div className="glass-card" style={{marginBottom:'10px'}}>
      {linkTo ? <Link to={linkTo} style={{color:'inherit',textDecoration:'none',display:'block'}}>{body}</Link> : body}

      <div style={{display:'flex',alignItems:'center',gap:'6px',marginTop:'10px',position:'relative'}}>
        {Object.entries(item.reactionCounts || {}).map(([rid, count]) => (
          <button key={rid} className="reaction-pill" data-mine={item.myReaction === rid} onClick={() => onReact(item.id, item.myReaction === rid ? null : rid)}>
            <ReactionIcon id={rid} size={14} /> <span>{count}</span>
          </button>
        ))}
        <button className="reaction-add" onClick={() => setOpen(o => !o)} aria-label="Add reaction">+</button>
        {open && (
          <div className="reaction-picker">
            {REACTIONS.map(r => (
              <button key={r.id} onClick={() => { onReact(item.id, item.myReaction === r.id ? null : r.id); setOpen(false); }} title={r.label}>
                <ReactionIcon id={r.id} size={20} />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Feed() {
  const { user } = useAuth();
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  function load() {
    api.getFeed().then(setItems).catch(console.error).finally(() => setLoading(false));
  }

  async function handleReact(id, reaction) {
    setItems(prev => prev.map(it => {
      if (it.id !== id) return it;
      const counts = { ...it.reactionCounts };
      if (it.myReaction) counts[it.myReaction] = Math.max(0, (counts[it.myReaction] || 1) - 1);
      if (reaction) counts[reaction] = (counts[reaction] || 0) + 1;
      return { ...it, reactionCounts: counts, myReaction: reaction };
    }));
    try {
      if (reaction) await api.react(id, reaction);
      else await api.unreact(id);
    } catch { load(); }
  }

  if (loading) return <div className="page"><div className="spinner"/></div>;

  return (
    <div className="page">
      <h2 className="page-title">Feed</h2>
      {items.length === 0
        ? <p className="muted">No activity yet. Log a workout or add some friends to see their progress here.</p>
        : items.map(item => <FeedItem key={item.id} item={item} onReact={handleReact} currentUserId={user.id} />)
      }
    </div>
  );
}
