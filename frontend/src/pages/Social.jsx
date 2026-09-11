import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { today, formatDateStr } from '../dateUtils';


// ── Friends sub-tab (add, accept, list, DM, buzz) ──
function FriendsTab() {
  const { user } = useAuth();
  const [friends,  setFriends]  = useState([]);
  const [username, setUsername] = useState('');
  const [convo,    setConvo]    = useState(null);
  const [msgText,  setMsgText]  = useState('');
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');
  const [buzzed,   setBuzzed]   = useState({});

  useEffect(() => {
    api.getFriends().then(setFriends).catch(console.error).finally(() => setLoading(false));
  }, []);

  async function addFriend(e) {
    e.preventDefault(); setError('');
    try {
      await api.addFriend({ username });
      setUsername('');
      setFriends(await api.getFriends());
    } catch (err) { setError(err.message); }
  }

  async function openConvo(friend) {
    const messages = await api.getConversation(friend.id);
    setConvo({ friend, messages });
  }

  async function sendMsg(e) {
    e.preventDefault();
    if (!msgText.trim() || !convo) return;
    await api.sendMessage({ receiverId: convo.friend.id, message: msgText });
    const msgs = await api.getConversation(convo.friend.id); setConvo(c => ({ ...c, messages: msgs }));
    setMsgText('');
  }

  async function buzz(friendId) {
    setBuzzed(b => ({ ...b, [friendId]: 'sending' }));
    try {
      await api.buzzFriend(friendId);
      setBuzzed(b => ({ ...b, [friendId]: 'sent' }));
      setTimeout(() => setBuzzed(b => ({ ...b, [friendId]: null })), 3000);
    } catch (err) {
      setBuzzed(b => ({ ...b, [friendId]: null }));
      setError(err.message);
    }
  }

  const accepted = friends.filter(f => f.status === 'accepted');
  const pending  = friends.filter(f => f.status === 'pending' && f.direction === 'received');
  const sent     = friends.filter(f => f.status === 'pending' && f.direction === 'sent');

  if (loading) return <div className="spinner"/>;

  if (convo) {
    return (
      <div className="convo-page">
        <button className="btn-ghost" onClick={() => setConvo(null)} style={{marginBottom:'12px'}}>← Back</button>
        <h3 style={{marginBottom:'12px'}}>{convo.friend.username}</h3>
        <div className="messages">
          {convo.messages.map(m => (
            <div key={m.id} className={`message ${m.sender_id === user.id ? 'mine' : 'theirs'}`}>
              <span className="msg-text">{m.message}</span>
              <span className="msg-time">{new Date(m.created_at).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</span>
            </div>
          ))}
          {convo.messages.length === 0 && <p className="muted">No messages yet. Say something!</p>}
        </div>
        <form onSubmit={sendMsg} className="msg-form">
          <input className="input" placeholder="Message…" value={msgText} onChange={e=>setMsgText(e.target.value)} />
          <button className="btn-primary" type="submit">Send</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <p className="muted" style={{fontSize:'12px',marginBottom:'16px'}}>
        Manage notifications (buzz, messages, push) in your <Link to="/settings" style={{color:'var(--accent)'}}>Profile settings</Link>.
      </p>

      <div className="card-form">
        <form onSubmit={addFriend} className="form-stack">
          <div className="field">
            <label className="label">Add a friend by username</label>
            <input className="input" value={username} onChange={e=>setUsername(e.target.value)} placeholder="username" required />
          </div>
          {error && <p className="form-error">{error}</p>}
          <button className="btn-primary" type="submit">Send Request</button>
        </form>
      </div>

      {pending.length > 0 && (
        <section className="section">
          <div className="section-header"><span className="section-title">Requests</span></div>
          {pending.map(f => (
            <div key={f.id} className="list-item">
              <span className="item-main" style={{flex:1}}>{f.username}</span>
              <button className="btn-accent-sm" onClick={async()=>{await api.acceptFriend(f.id);setFriends(await api.getFriends());}}>Accept</button>
            </div>
          ))}
        </section>
      )}

      {sent.length > 0 && (
        <section className="section">
          <div className="section-header"><span className="section-title">Sent</span></div>
          {sent.map(f => (
            <div key={f.id} className="list-item">
              <span className="item-main">{f.username}</span>
              <span className="item-meta" style={{marginLeft:'auto'}}>Pending</span>
            </div>
          ))}
        </section>
      )}

      <section className="section">
        <div className="section-header"><span className="section-title">Friends</span></div>
        {accepted.length === 0
          ? <p className="muted">No friends yet — add one above.</p>
          : accepted.map(f => (
            <div key={f.id} className="list-item">
              <Link to={`/profile/${f.id}`} className="item-main" style={{flex:1,color:'inherit',textDecoration:'none'}}>{f.username}</Link>
              <button className="btn-ghost-sm" style={{marginRight:'6px'}} onClick={()=>buzz(f.id)} disabled={buzzed[f.id]==='sending'}>
                {buzzed[f.id]==='sent' ? 'Buzzed! ⚡' : buzzed[f.id]==='sending' ? '…' : '⚡ Buzz'}
              </button>
              <button className="btn-ghost-sm" onClick={()=>openConvo(f)}>Message</button>
            </div>
          ))
        }
      </section>
    </div>
  );
}

// ── Compete sub-tab (leaderboard, streak, challenges) ──
function CompeteTab() {
  const [board,      setBoard]      = useState(null);
  const [challenges, setChallenges] = useState([]);
  const [metric,     setMetric]     = useState('byWorkouts');
  const [showNew,    setShowNew]    = useState(false);
  const [form, setForm] = useState({ title:'', type:'most_workouts', exercise:'', startDate: today(), endDate: today() });
  const [error, setError] = useState('');

  useEffect(() => { load(); }, []);
  function load() {
    api.getLeaderboard().then(setBoard).catch(console.error);
    api.getChallenges().then(setChallenges).catch(console.error);
  }

  async function createChallenge(e) {
    e.preventDefault(); setError('');
    try {
      await api.createChallenge(form);
      setShowNew(false);
      setForm({ title:'', type:'most_workouts', exercise:'', startDate: today(), endDate: today() });
      load();
    } catch (err) { setError(err.message); }
  }

  async function join(id) {
    await api.joinChallenge(id);
    load();
  }

  const rows = board?.[metric] || [];

  return (
    <div>
      <section className="section">
        <div className="section-header"><span className="section-title">Leaderboard</span></div>
        <div className="tab-row" style={{marginBottom:'12px'}}>
          {[['byWorkouts','Workouts'],['byVolume','Volume'],['byStreak','Streak']].map(([id,label]) => (
            <button key={id} className={metric===id?'tab active':'tab'} onClick={()=>setMetric(id)}>{label}</button>
          ))}
        </div>
        {!board ? <div className="spinner"/> : rows.map((r, i) => (
          <div key={r.id} className="list-item">
            <span style={{width:'22px',color:'var(--muted)',fontWeight:'700',fontSize:'13px'}}>{i+1}</span>
            <Link to={`/profile/${r.id}`} className="item-main" style={{flex:1,color:'inherit',textDecoration:'none'}}>{r.username}</Link>
            <span className="item-accent">
              {metric==='byWorkouts' ? `${r.workoutsThisWeek}` : metric==='byVolume' ? `${r.volumeThisWeek.toLocaleString()} lbs` : `${r.streak} 🔥`}
            </span>
          </div>
        ))}
      </section>

      <section className="section">
        <div className="section-header">
          <span className="section-title">Challenges</span>
          <button className="link-small" style={{background:'none',border:'none',cursor:'pointer'}} onClick={()=>setShowNew(s=>!s)}>{showNew ? 'Cancel' : '+ New'}</button>
        </div>

        {showNew && (
          <div className="card-form">
            <form onSubmit={createChallenge} className="form-stack">
              <div className="field">
                <label className="label">Title</label>
                <input className="input" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="Most workouts in March" required />
              </div>
              <div className="field">
                <label className="label">Type</label>
                <select className="input" value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}>
                  <option value="most_workouts">Most workouts</option>
                  <option value="pr_gain">Biggest PR gain on an exercise</option>
                </select>
              </div>
              {form.type === 'pr_gain' && (
                <div className="field">
                  <label className="label">Exercise</label>
                  <input className="input" value={form.exercise} onChange={e=>setForm(f=>({...f,exercise:e.target.value}))} placeholder="Squat" required />
                </div>
              )}
              <div className="input-row">
                <div className="input-group">
                  <label className="label">Start</label>
                  <input className="input" type="date" value={form.startDate} onChange={e=>setForm(f=>({...f,startDate:e.target.value}))} required/>
                </div>
                <div className="input-group">
                  <label className="label">End</label>
                  <input className="input" type="date" value={form.endDate} onChange={e=>setForm(f=>({...f,endDate:e.target.value}))} required/>
                </div>
              </div>
              {error && <p className="form-error">{error}</p>}
              <button className="btn-primary" type="submit">Create Challenge</button>
            </form>
          </div>
        )}

        {challenges.length === 0 && !showNew && <p className="muted">No challenges yet. Start one above.</p>}
        {challenges.map(c => (
          <div key={c.id} className="glass-card" style={{marginBottom:'10px'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <div style={{fontWeight:'700',fontSize:'14px'}}>{c.title}</div>
                <div style={{fontSize:'12px',color:'var(--muted)'}}>
                  by {c.creator_username} · {formatDateStr(c.start_date)} – {formatDateStr(c.end_date)}
                </div>
              </div>
              {!c.joined && <button className="btn-accent-sm" onClick={()=>join(c.id)}>Join</button>}
              {c.joined && <span style={{fontSize:'11px',color:'var(--teal)',fontWeight:'700'}}>Joined</span>}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

// ── Crews sub-tab ──
function CrewsTab() {
  const { user } = useAuth();
  const [crews,   setCrews]   = useState([]);
  const [active,  setActive]  = useState(null);
  const [name,    setName]    = useState('');
  const [msgText, setMsgText] = useState('');
  const [friends, setFriends] = useState([]);
  const [error,   setError]   = useState('');

  useEffect(() => {
    api.getCrews().then(setCrews).catch(console.error);
    api.getFriends().then(f => setFriends(f.filter(x=>x.status==='accepted'))).catch(console.error);
  }, []);

  async function createCrew(e) {
    e.preventDefault(); setError('');
    try {
      await api.createCrew({ name });
      setName('');
      setCrews(await api.getCrews());
    } catch (err) { setError(err.message); }
  }

  async function openCrew(id) {
    const crew = await api.getCrew(id);
    const messages = await api.getCrewMessages(id);
    setActive({ crew, messages });
  }

  async function sendMsg(e) {
    e.preventDefault();
    if (!msgText.trim() || !active) return;
    await api.sendCrewMessage(active.crew.id, { message: msgText });
    const messages = await api.getCrewMessages(active.crew.id);
    setActive(a => ({ ...a, messages }));
    setMsgText('');
  }

  async function addMember(friendId) {
    await api.addCrewMember(active.crew.id, { friendId });
    const crew = await api.getCrew(active.crew.id);
    setActive(a => ({ ...a, crew }));
  }

  if (active) {
    const memberIds = new Set(active.crew.members.map(m=>m.id));
    const addable = friends.filter(f => !memberIds.has(f.id));
    return (
      <div>
        <button className="btn-ghost" onClick={()=>setActive(null)} style={{marginBottom:'12px'}}>← Back</button>
        <h3 style={{marginBottom:'6px'}}>{active.crew.name}</h3>
        <p className="muted" style={{marginBottom:'12px'}}>{active.crew.members.map(m=>m.username).join(', ')}</p>

        {addable.length > 0 && (
          <div style={{display:'flex',flexWrap:'wrap',gap:'6px',marginBottom:'14px'}}>
            {addable.map(f => (
              <button key={f.id} className="btn-ghost-sm" onClick={()=>addMember(f.id)}>+ {f.username}</button>
            ))}
          </div>
        )}

        <div className="messages">
          {active.messages.map(m => (
            <div key={m.id} className={`message ${m.user_id === user.id ? 'mine' : 'theirs'}`}>
              {m.user_id !== user.id && <Link to={`/profile/${m.user_id}`} style={{fontSize:'11px',color:'var(--muted)',marginBottom:'2px',display:'block'}}>{m.username}</Link>}
              <span className="msg-text">{m.message}</span>
              <span className="msg-time">{new Date(m.created_at).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</span>
            </div>
          ))}
          {active.messages.length === 0 && <p className="muted">No messages yet. Say hi to the crew!</p>}
        </div>
        <form onSubmit={sendMsg} className="msg-form">
          <input className="input" placeholder="Message the crew…" value={msgText} onChange={e=>setMsgText(e.target.value)} />
          <button className="btn-primary" type="submit">Send</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="card-form">
        <form onSubmit={createCrew} className="form-stack">
          <div className="field">
            <label className="label">New crew name</label>
            <input className="input" value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Leg Day Legends" required />
          </div>
          {error && <p className="form-error">{error}</p>}
          <button className="btn-primary" type="submit">Create Crew</button>
        </form>
      </div>
      {crews.length === 0
        ? <p className="muted">No crews yet — start one above.</p>
        : crews.map(c => (
          <div key={c.id} className="list-item clickable" onClick={()=>openCrew(c.id)}>
            <div style={{flex:1}}>
              <div className="item-main">{c.name}</div>
              <div className="item-meta">{c.member_count} member{c.member_count===1?'':'s'}</div>
            </div>
          </div>
        ))
      }
    </div>
  );
}

// ── Invites sub-tab (train-together) ──
function InvitesTab() {
  const { user } = useAuth();
  const [invites, setInvites] = useState([]);
  const [friends, setFriends] = useState([]);
  const [form, setForm] = useState({ receiverId:'', proposedAt:'', message:'' });
  const [showNew, setShowNew] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getInvites().then(setInvites).catch(console.error);
    api.getFriends().then(f => setFriends(f.filter(x=>x.status==='accepted'))).catch(console.error);
  }, []);

  async function send(e) {
    e.preventDefault(); setError('');
    try {
      await api.sendInvite(form);
      setShowNew(false);
      setForm({ receiverId:'', proposedAt:'', message:'' });
      setInvites(await api.getInvites());
    } catch (err) { setError(err.message); }
  }

  async function respond(id, accept) {
    if (accept) await api.acceptInvite(id); else await api.declineInvite(id);
    setInvites(await api.getInvites());
  }

  const upcoming = invites.filter(i => i.status !== 'declined').sort((a,b)=>new Date(a.proposed_at)-new Date(b.proposed_at));

  return (
    <div>
      <div className="section-header" style={{marginBottom:'12px'}}>
        <span className="section-title">Train Together</span>
        <button className="link-small" style={{background:'none',border:'none',cursor:'pointer'}} onClick={()=>setShowNew(s=>!s)}>{showNew ? 'Cancel' : '+ New'}</button>
      </div>

      {showNew && (
        <div className="card-form">
          <form onSubmit={send} className="form-stack">
            <div className="field">
              <label className="label">Friend</label>
              <select className="input" value={form.receiverId} onChange={e=>setForm(f=>({...f,receiverId:e.target.value}))} required>
                <option value="" disabled>Select a friend</option>
                {friends.map(f => <option key={f.id} value={f.id}>{f.username}</option>)}
              </select>
            </div>
            <div className="field">
              <label className="label">When</label>
              <input className="input" type="datetime-local" value={form.proposedAt} onChange={e=>setForm(f=>({...f,proposedAt:e.target.value}))} required />
            </div>
            <div className="field">
              <label className="label">Message (optional)</label>
              <input className="input" value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))} placeholder="Leg day?" />
            </div>
            {error && <p className="form-error">{error}</p>}
            <button className="btn-primary" type="submit">Send Invite</button>
          </form>
        </div>
      )}

      {upcoming.length === 0 && !showNew && <p className="muted">No invites yet.</p>}
      {upcoming.map(i => {
        const mine = i.sender_id === user.id;
        const other = mine ? i.receiver_username : i.sender_username;
        return (
          <div key={i.id} className="glass-card" style={{marginBottom:'10px'}}>
            <div style={{fontWeight:'700',fontSize:'14px'}}>{mine ? `You invited ${other}` : `${other} wants to train`}</div>
            <div style={{fontSize:'12px',color:'var(--muted)',margin:'4px 0'}}>
              {new Date(i.proposed_at).toLocaleString('en-US',{weekday:'short',month:'short',day:'numeric',hour:'numeric',minute:'2-digit'})}
              {i.message ? ` — ${i.message}` : ''}
            </div>
            {i.status === 'pending' && !mine && (
              <div style={{display:'flex',gap:'8px',marginTop:'6px'}}>
                <button className="btn-accent-sm" onClick={()=>respond(i.id,true)}>Accept</button>
                <button className="btn-ghost-sm" onClick={()=>respond(i.id,false)}>Decline</button>
              </div>
            )}
            {i.status !== 'pending' && (
              <span style={{fontSize:'11px',fontWeight:'700',color:i.status==='accepted'?'var(--teal)':'var(--muted)'}}>
                {i.status === 'accepted' ? 'Accepted' : 'Declined'}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function Social() {
  const [tab, setTab] = useState('friends');

  return (
    <div className="page">
      <h2 className="page-title">Social</h2>
      <div className="tab-row" style={{marginBottom:'16px'}}>
        {[['friends','Friends'],['compete','Compete'],['crews','Crews'],['invites','Invites']].map(([id,label]) => (
          <button key={id} className={tab===id?'tab active':'tab'} onClick={()=>setTab(id)}>{label}</button>
        ))}
      </div>
      {tab === 'friends' && <FriendsTab />}
      {tab === 'compete' && <CompeteTab />}
      {tab === 'crews' && <CrewsTab />}
      {tab === 'invites' && <InvitesTab />}
    </div>
  );
}
