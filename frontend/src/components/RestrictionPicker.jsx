import { useState } from 'react';
import { RESTRICTION_SUGGESTIONS } from '../data/restrictions';
import { IconX } from './Icons';

export default function RestrictionPicker({ value = [], onChange }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const filtered = RESTRICTION_SUGGESTIONS.filter(s =>
    !value.includes(s) && s.toLowerCase().includes(query.toLowerCase())
  );

  function add(r) {
    const clean = r.trim();
    if (!clean || value.includes(clean)) return;
    onChange([...value, clean]);
    setQuery('');
  }
  function remove(r) { onChange(value.filter(x => x !== r)); }

  function onKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (query.trim()) add(query); // add whatever they typed, even if not in the suggestion list
    }
  }

  return (
    <div>
      {value.length > 0 && (
        <div style={{display:'flex',flexWrap:'wrap',gap:'6px',marginBottom:'8px'}}>
          {value.map(r => (
            <span key={r} onClick={() => remove(r)} style={{padding:'4px 12px',fontSize:'13px',fontWeight:'500',cursor:'pointer',background:'rgba(224,122,95,0.15)',border:'1px solid var(--teal)',borderRadius:'999px',color:'var(--teal)',display:'inline-flex',alignItems:'center',gap:'4px'}}>
              {r} <IconX style={{width:'11px',height:'11px'}}/>
            </span>
          ))}
        </div>
      )}
      <div style={{position:'relative'}}>
        <input
          className="input"
          placeholder="Select or type a restriction…"
          value={query}
          onChange={e=>{setQuery(e.target.value); setOpen(true);}}
          onFocus={()=>setOpen(true)}
          onBlur={()=>setTimeout(()=>setOpen(false),150)}
          onKeyDown={onKeyDown}
        />
        {open && (
          <div style={{position:'absolute',top:'100%',left:0,right:0,zIndex:50,background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--r-sm)',marginTop:'4px',maxHeight:'220px',overflowY:'auto',boxShadow:'var(--shadow)'}}>
            {filtered.length > 0 ? filtered.map(r => (
              <div key={r} onMouseDown={()=>add(r)} style={{padding:'10px 14px',cursor:'pointer',fontSize:'14px',borderBottom:'1px solid var(--border)'}}
                onMouseEnter={e=>e.currentTarget.style.background='var(--surface-2)'}
                onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                {r}
              </div>
            )) : query.trim() ? (
              <div onMouseDown={()=>add(query)} style={{padding:'10px 14px',cursor:'pointer',fontSize:'14px',color:'var(--teal)'}}>
                + Add "{query.trim()}"
              </div>
            ) : (
              <div style={{padding:'10px 14px',fontSize:'13px',color:'var(--muted)'}}>No more suggestions — keep typing to add your own.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
