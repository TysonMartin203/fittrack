// Clean grid-based kitchen appliance selector — no text in art
const APPLIANCES = [
  { id: 'stovetop',    label: 'Stovetop' },
  { id: 'oven',        label: 'Oven' },
  { id: 'microwave',   label: 'Microwave' },
  { id: 'airfryer',    label: 'Air Fryer' },
  { id: 'instantpot',  label: 'Instant Pot' },
  { id: 'blender',     label: 'Blender' },
  { id: 'slowcooker',  label: 'Slow Cooker' },
  { id: 'grill',       label: 'Grill' },
  { id: 'toasteroven', label: 'Toaster Oven' },
  { id: 'ricecooker',  label: 'Rice Cooker' },
];

// One small SVG icon per appliance — pure shapes, no text
function ApplianceIcon({ id, active }) {
  const s = active ? '#7EB09B' : '#476A6F';
  const d = active ? '#1C2E30' : '#2E4A4E';
  const h = active ? '#ECBEB4' : '#385759';
  const w = 56; const c = w / 2;

  switch (id) {
    case 'stovetop': return (
      <svg viewBox="0 0 56 56" width={w} height={w}>
        <rect x="4" y="4" width="48" height="48" rx="6" fill={d}/>
        <circle cx="18" cy="18" r="9" fill="none" stroke={s} strokeWidth="2"/>
        <circle cx="18" cy="18" r="4" fill={s}/>
        <circle cx="38" cy="18" r="9" fill="none" stroke={s} strokeWidth="2"/>
        <circle cx="38" cy="18" r="4" fill={s}/>
        <circle cx="18" cy="38" r="7" fill="none" stroke={s} strokeWidth="2"/>
        <circle cx="18" cy="38" r="3" fill={s}/>
        <circle cx="38" cy="38" r="11" fill="none" stroke={s} strokeWidth="2"/>
        <circle cx="38" cy="38" r="5" fill={s}/>
      </svg>
    );
    case 'oven': return (
      <svg viewBox="0 0 56 56" width={w} height={w}>
        <rect x="4" y="4" width="48" height="48" rx="6" fill={d}/>
        <rect x="10" y="10" width="36" height="26" rx="3" fill={d} stroke={s} strokeWidth="1.5"/>
        <rect x="13" y="13" width="30" height="20" rx="2" fill={active ? '#0D1E1F' : '#1C2E30'}/>
        {active && <rect x="13" y="13" width="30" height="20" rx="2" fill="rgba(236,190,180,0.06)"/>}
        <rect x="16" y="8" width="24" height="3" rx="1.5" fill={h}/>
        <rect x="10" y="39" width="36" height="13" rx="3" fill={active ? '#385759' : '#243A3D'}/>
        <circle cx="20" cy="45" r="3" fill={s}/>
        <circle cx="36" cy="45" r="3" fill={s}/>
        <rect x="23" y="43" width="10" height="4" rx="2" fill={h}/>
      </svg>
    );
    case 'microwave': return (
      <svg viewBox="0 0 56 56" width={w} height={w}>
        <rect x="4" y="10" width="48" height="36" rx="6" fill={d}/>
        <rect x="8" y="14" width="32" height="28" rx="3" fill={active ? '#0D1E1F' : '#1C2E30'}/>
        {active && <text x="24" y="32" textAnchor="middle" fontSize="14" fill={s}>▶</text>}
        {!active && <rect x="14" y="26" width="20" height="2" rx="1" fill="#385759"/>}
        <rect x="42" y="14" width="6" height="28" rx="2" fill={active ? '#385759' : '#243A3D'}/>
        <circle cx="45" cy="22" r="3" fill={active ? s : '#243A3D'}/>
        <circle cx="45" cy="32" r="2" fill={active ? h : '#243A3D'}/>
        <circle cx="45" cy="39" r="2" fill={active ? h : '#243A3D'}/>
      </svg>
    );
    case 'airfryer': return (
      <svg viewBox="0 0 56 56" width={w} height={w}>
        <rect x="10" y="6" width="36" height="44" rx="8" fill={d} stroke={s} strokeWidth="1.5"/>
        <rect x="14" y="10" width="28" height="18" rx="4" fill={active ? '#0D1E1F' : '#1C2E30'}/>
        {active && <circle cx="28" cy="19" r="7" fill="none" stroke={s} strokeWidth="1.5" strokeDasharray="3 2"/>}
        <rect x="12" y="30" width="32" height="14" rx="4" fill={active ? '#385759' : '#243A3D'}/>
        <circle cx="28" cy="37" r="5" fill={d}/>
        <circle cx="28" cy="37" r="2" fill={active ? s : '#476A6F'}/>
        <rect x="22" y="48" width="12" height="4" rx="2" fill={active ? '#476A6F' : '#243A3D'}/>
      </svg>
    );
    case 'instantpot': return (
      <svg viewBox="0 0 56 56" width={w} height={w}>
        <ellipse cx="28" cy="48" rx="22" ry="5" fill={active ? '#385759' : '#243A3D'}/>
        <rect x="8" y="18" width="40" height="30" rx="4" fill={d} stroke={s} strokeWidth="1.5"/>
        <ellipse cx="28" cy="18" rx="20" ry="6" fill={active ? '#385759' : '#243A3D'} stroke={s} strokeWidth="1.5"/>
        <rect x="25" y="8" width="6" height="10" rx="2" fill={h}/>
        <ellipse cx="28" cy="33" rx="12" ry="4" fill={active ? '#0D1E1F' : '#1C2E30'}/>
        <circle cx="28" cy="33" r="3" fill={active ? s : '#385759'}/>
        <rect x="8" y="14" width="40" height="8" rx="2" fill={active ? '#476A6F' : '#1C2E30'}/>
        <circle cx="18" cy="18" r="2" fill={active ? h : '#385759'}/>
        <circle cx="38" cy="18" r="2" fill={active ? s : '#385759'}/>
      </svg>
    );
    case 'blender': return (
      <svg viewBox="0 0 56 56" width={w} height={w}>
        <rect x="18" y="42" width="20" height="10" rx="3" fill={active ? '#385759' : '#243A3D'}/>
        <circle cx="24" cy="47" r="2" fill={active ? s : '#476A6F'}/>
        <circle cx="32" cy="47" r="2" fill={active ? h : '#476A6F'}/>
        <polygon points="20,42 16,8 40,8 36,42" fill={d} stroke={s} strokeWidth="1.5"/>
        <rect x="16" y="6" width="24" height="5" rx="2" fill={active ? '#385759' : '#243A3D'}/>
        {active && <polygon points="22,38 20,12 36,12 34,38" fill="rgba(126,176,155,0.1)"/>}
        <circle cx="28" cy="26" r="5" fill="none" stroke={s} strokeWidth="1" opacity="0.5"/>
      </svg>
    );
    case 'slowcooker': return (
      <svg viewBox="0 0 56 56" width={w} height={w}>
        <ellipse cx="28" cy="48" rx="24" ry="6" fill={active ? '#385759' : '#243A3D'}/>
        <rect x="6" y="20" width="44" height="28" rx="6" fill={d} stroke={s} strokeWidth="1.5"/>
        <ellipse cx="28" cy="20" rx="22" ry="7" fill={active ? '#385759' : '#243A3D'} stroke={s} strokeWidth="1.5"/>
        <ellipse cx="28" cy="20" rx="14" ry="4" fill={active ? '#0D1E1F' : '#1C2E30'}/>
        <rect x="6" y="14" width="44" height="8" rx="3" fill={active ? '#476A6F' : '#1C2E30'}/>
        <circle cx="18" cy="18" r="2" fill={active ? h : '#385759'}/>
        <circle cx="28" cy="18" r="2" fill={active ? s : '#385759'}/>
        <circle cx="38" cy="18" r="2" fill={active ? h : '#385759'}/>
        <rect x="4" y="28" width="4" height="12" rx="2" fill={active ? '#385759' : '#243A3D'}/>
        <rect x="48" y="28" width="4" height="12" rx="2" fill={active ? '#385759' : '#243A3D'}/>
      </svg>
    );
    case 'grill': return (
      <svg viewBox="0 0 56 56" width={w} height={w}>
        <ellipse cx="28" cy="22" rx="22" ry="14" fill={d} stroke={s} strokeWidth="1.5"/>
        <ellipse cx="28" cy="20" rx="20" ry="12" fill={active ? '#0D1E1F' : '#1C2E30'}/>
        {[14,20,26,32,38,44].map((x,i) => (
          <line key={i} x1={x} y1="12" x2={x} y2="28" stroke={active ? s : '#385759'} strokeWidth="1.5"/>
        ))}
        {active && [14,20,26,32,38,44].map((x,i) => (
          <line key={`h${i}`} x1={x} y1="12" x2={x} y2="28" stroke={h} strokeWidth="0.5" opacity="0.4"/>
        ))}
        <rect x="22" y="34" width="12" height="4" rx="2" fill={active ? '#476A6F' : '#243A3D'}/>
        <line x1="18" y1="38" x2="14" y2="52" stroke={active ? '#476A6F' : '#385759'} strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="38" y1="38" x2="42" y2="52" stroke={active ? '#476A6F' : '#385759'} strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="28" y1="36" x2="28" y2="50" stroke={active ? '#476A6F' : '#385759'} strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    );
    case 'toasteroven': return (
      <svg viewBox="0 0 56 56" width={w} height={w}>
        <rect x="4" y="12" width="48" height="34" rx="5" fill={d} stroke={s} strokeWidth="1.5"/>
        <rect x="8" y="16" width="34" height="22" rx="3" fill={active ? '#0D1E1F' : '#1C2E30'}/>
        {active && <rect x="8" y="16" width="34" height="22" rx="3" fill="rgba(236,190,180,0.06)"/>}
        {active && [20,26,32].map((y,i) => <line key={i} x1="10" y1={y} x2="40" y2={y} stroke={h} strokeWidth="0.8" opacity="0.5"/>)}
        <rect x="44" y="16" width="4" height="22" rx="2" fill={active ? '#385759' : '#243A3D'}/>
        <circle cx="46" cy="22" r="3" fill={active ? s : '#243A3D'}/>
        <circle cx="46" cy="30" r="2" fill={active ? h : '#243A3D'}/>
        <circle cx="46" cy="37" r="2" fill={active ? h : '#243A3D'}/>
        <rect x="4" y="44" width="48" height="4" rx="2" fill={active ? '#385759' : '#243A3D'}/>
        <rect x="12" y="44" width="32" height="2" rx="1" fill={active ? '#476A6F' : '#1C2E30'}/>
      </svg>
    );
    case 'ricecooker': return (
      <svg viewBox="0 0 56 56" width={w} height={w}>
        <ellipse cx="28" cy="48" rx="20" ry="5" fill={active ? '#385759' : '#243A3D'}/>
        <rect x="10" y="24" width="36" height="24" rx="5" fill={d} stroke={s} strokeWidth="1.5"/>
        <ellipse cx="28" cy="24" rx="18" ry="8" fill={active ? '#385759' : '#243A3D'} stroke={s} strokeWidth="1.5"/>
        <ellipse cx="28" cy="22" rx="12" ry="5" fill={active ? '#0D1E1F' : '#1C2E30'}/>
        <rect x="25" y="12" width="6" height="10" rx="2" fill={h}/>
        <circle cx="28" cy="36" r="6" fill={active ? '#0D1E1F' : '#1C2E30'}/>
        <circle cx="28" cy="36" r="3" fill={active ? s : '#385759'}/>
        <rect x="10" y="20" width="36" height="7" rx="3" fill={active ? '#476A6F' : '#1C2E30'}/>
      </svg>
    );
    default: return null;
  }
}

export default function KitchenIllustration({ selected = [], onChange }) {
  function toggle(id) {
    if (selected.includes(id)) onChange(selected.filter(x => x !== id));
    else onChange([...selected, id]);
  }

  return (
    <div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '10px',
      }}>
        {APPLIANCES.map(({ id, label }) => {
          const active = selected.includes(id);
          return (
            <div key={id} onClick={() => toggle(id)} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
              padding: '10px 4px 8px',
              borderRadius: 'var(--r)',
              border: `1px solid ${active ? 'var(--teal)' : 'var(--border)'}`,
              background: active ? 'rgba(126,176,155,0.1)' : 'rgba(28,46,48,0.5)',
              cursor: 'pointer',
              transition: 'all .15s',
              WebkitTapHighlightColor: 'transparent',
            }}>
              <ApplianceIcon id={id} active={active} />
              <span style={{
                fontSize: '10px', fontWeight: '600', textAlign: 'center', lineHeight: '1.2',
                color: active ? 'var(--teal)' : 'var(--muted)',
              }}>{label}</span>
            </div>
          );
        })}
      </div>
      {selected.length === 0 && (
        <p style={{fontSize:'12px',color:'var(--muted)',textAlign:'center',marginTop:'10px'}}>
          Tap to select what you have
        </p>
      )}
    </div>
  );
}

export { APPLIANCES };
