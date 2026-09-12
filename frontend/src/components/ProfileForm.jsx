const GOALS = ['Cut (Lose Fat)', 'Bulk (Gain Muscle)', 'Maintain', 'Recomp'];

function toCsv(arr) { return Array.isArray(arr) ? arr.join(', ') : (arr || ''); }
function fromCsv(str) { return str.split(',').map(s => s.trim()).filter(Boolean); }

export { GOALS };

export default function ProfileForm({ profile, setProfile }) {
  return (
    <div className="form-stack">
      <div className="input-row">
        <div className="input-group">
          <label className="label">Current Weight (lbs)</label>
          <input className="input" type="number" placeholder="185" value={profile.weight || ''} onChange={e=>setProfile(p=>({...p,weight:e.target.value}))}/>
        </div>
        <div className="input-group">
          <label className="label">Goal Weight (lbs)</label>
          <input className="input" type="number" placeholder="175" value={profile.goalWeight || ''} onChange={e=>setProfile(p=>({...p,goalWeight:e.target.value}))}/>
        </div>
      </div>
      <div className="input-row">
        <div className="input-group">
          <label className="label">Goal</label>
          <select className="input" value={profile.goal || GOALS[2]} onChange={e=>setProfile(p=>({...p,goal:e.target.value}))}>
            {GOALS.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div className="input-group">
          <label className="label">Timeline (weeks)</label>
          <input className="input" type="number" placeholder="12" value={profile.timeline || ''} onChange={e=>setProfile(p=>({...p,timeline:e.target.value}))}/>
        </div>
      </div>
      <div className="field">
        <label className="label">Dietary Restrictions (comma separated)</label>
        <input className="input" placeholder="e.g. vegetarian, gluten-free" value={toCsv(profile.restrictions)} onChange={e=>setProfile(p=>({...p,restrictions:fromCsv(e.target.value)}))}/>
      </div>
      <div className="field">
        <label className="label">Foods You Dislike</label>
        <input className="input" placeholder="e.g. mushrooms, cilantro" value={profile.dislikes || ''} onChange={e=>setProfile(p=>({...p,dislikes:e.target.value}))}/>
      </div>
      <div className="field">
        <label className="label">Foods You Really Want</label>
        <input className="input" placeholder="e.g. salmon, sweet potatoes" value={profile.wantedFoods || ''} onChange={e=>setProfile(p=>({...p,wantedFoods:e.target.value}))}/>
      </div>
      <div className="field">
        <label className="label">Kitchen Appliances (comma separated)</label>
        <input className="input" placeholder="e.g. oven, air fryer, instant pot" value={toCsv(profile.appliances)} onChange={e=>setProfile(p=>({...p,appliances:fromCsv(e.target.value)}))}/>
      </div>
      <div className="field">
        <label className="label">Notes for the AI (goals, injuries, preferences)</label>
        <textarea className="input" rows={3} placeholder="e.g. bad left knee, training for a 5K, cooking for one" value={profile.notes || ''} onChange={e=>setProfile(p=>({...p,notes:e.target.value}))} />
      </div>
    </div>
  );
}
