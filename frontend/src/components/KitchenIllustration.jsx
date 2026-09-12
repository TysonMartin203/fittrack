import { IconX } from './Icons';

const APPLIANCES = [
  { id: 'stovetop',    label: 'Stovetop'     },
  { id: 'oven',        label: 'Oven'         },
  { id: 'microwave',   label: 'Microwave'    },
  { id: 'airfryer',    label: 'Air Fryer'    },
  { id: 'instantpot',  label: 'Instant Pot'  },
  { id: 'blender',     label: 'Blender'      },
  { id: 'slowcooker',  label: 'Slow Cooker'  },
  { id: 'grill',       label: 'Grill'        },
  { id: 'toasteroven', label: 'Toaster Oven' },
  { id: 'ricecooker',  label: 'Rice Cooker'  },
];

export default function KitchenIllustration({ selected = [], onChange }) {
  function toggle(id) {
    onChange(selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id]);
  }
  function isOn(id) { return selected.includes(id); }

  // Color helpers
  const T  = '#E07A5F'; // teal (active)
  const TH = '#E07A5F'; // teal dark
  const D  = '#FFFFFF'; // surface (inactive)
  const BG = '#F4F1DE'; // dark bg
  const R  = '#E07A5F'; // rose accent
  const MU = '#F2E1D7'; // muted surface
  const MI = '#EAB69F'; // muted inactive

  function S(id)  { return isOn(id) ? T  : D;  }
  function SH(id) { return isOn(id) ? TH : MI; }
  function SB(id) { return isOn(id) ? MU : MI; }

  return (
    <div>
      <svg viewBox="0 0 500 310" xmlns="http://www.w3.org/2000/svg"
        style={{ width:'100%', maxWidth:'500px', display:'block', margin:'0 auto', borderRadius:'12px' }}>

        {/* ── Backgrounds ── */}
        <rect width="500" height="310" fill={BG} rx="12"/>
        {/* Wall */}
        <rect x="0" y="0" width="500" height="195" fill="#EFD3BE"/>
        {/* Floor */}
        <rect x="0" y="195" width="500" height="115" fill={BG}/>
        {/* Counter surface */}
        <rect x="8" y="182" width="484" height="16" fill="#F2E1D7" rx="3"/>
        <rect x="8" y="182" width="484" height="4"  fill="#EAB69F" rx="2"/>

        {/* ── MICROWAVE  (x=12..107, y=10..58) ── */}
        <g onClick={() => toggle('microwave')} style={{cursor:'pointer'}}>
          <rect x="12" y="10" width="95" height="48" fill={S('microwave')} rx="5" stroke={SH('microwave')} strokeWidth="1.5"/>
          <rect x="16" y="14" width="64" height="40" fill={SB('microwave')} rx="3"/>
          {isOn('microwave')
            ? <text x="48" y="38" textAnchor="middle" fontSize="16" fill={T}>▶</text>
            : <rect x="24" y="32" width="48" height="3" rx="1.5" fill="#FFFFFF"/>}
          <rect x="82" y="14" width="21" height="40" fill={isOn('microwave') ? MU : MI} rx="2"/>
          <circle cx="92" cy="24" r="5" fill={isOn('microwave') ? T : '#EFD3BE'}/>
          <circle cx="92" cy="36" r="4" fill={isOn('microwave') ? R : '#EFD3BE'}/>
          <circle cx="92" cy="47" r="3" fill={isOn('microwave') ? T : '#EFD3BE'}/>
        </g>

        {/* ── STOVE / OVEN  (x=12..107, y=62..180) ── */}
        <g onClick={() => { toggle('stovetop'); toggle('oven'); }} style={{cursor:'pointer'}}>
          {/* Oven body */}
          <rect x="12" y="62" width="95" height="120" fill={isOn('oven') ? MU : '#EFD3BE'} rx="5" stroke={SH('oven')} strokeWidth="1.5"/>
          {/* Stovetop strip */}
          <rect x="12" y="62" width="95" height="26" fill={isOn('stovetop') ? D : '#EFD3BE'} rx="5"/>
          {/* Burners */}
          {[[34,75,9],[64,75,9],[88,75,7]].map(([cx,cy,r],i) => (
            <g key={i}>
              <circle cx={cx} cy={cy} r={r} fill={BG} stroke={isOn('stovetop') ? T : MU} strokeWidth="1.5"/>
              <circle cx={cx} cy={cy} r={r/2} fill={isOn('stovetop') ? T : '#EFD3BE'}/>
            </g>
          ))}
          {/* Oven window */}
          <rect x="20" y="96" width="79" height="72" fill={BG} rx="3"/>
          {isOn('oven') && <rect x="20" y="96" width="79" height="72" fill="rgba(224,122,95,.06)" rx="3"/>}
          {/* Oven handle */}
          <rect x="30" y="91" width="57" height="5" fill={isOn('oven') ? R : '#EAB69F'} rx="2.5"/>
          {/* Control knobs */}
          <rect x="12" y="174" width="95" height="8" fill={isOn('oven') ? D : MI} rx="2"/>
          {[28,47,66,85].map((x,i) => (
            <circle key={i} cx={x} cy="178" r="3" fill={isOn('oven') ? (i%2===0 ? T : R) : '#EFD3BE'}/>
          ))}
        </g>

        {/* ── TOASTER OVEN  (x=135..260, y=10..72) ── */}
        <g onClick={() => toggle('toasteroven')} style={{cursor:'pointer'}}>
          <rect x="135" y="10" width="125" height="62" fill={S('toasteroven')} rx="5" stroke={SH('toasteroven')} strokeWidth="1.5"/>
          <rect x="140" y="15" width="90" height="52" fill={SB('toasteroven')} rx="3"/>
          {isOn('toasteroven') && <rect x="140" y="15" width="90" height="52" fill="rgba(224,122,95,.05)" rx="3"/>}
          {isOn('toasteroven') && [25,35,45,55].map((y,i) => (
            <line key={i} x1="142" y1={y} x2="228" y2={y} stroke={R} strokeWidth=".8" opacity=".35"/>
          ))}
          <rect x="232" y="15" width="24" height="52" fill={isOn('toasteroven') ? MU : MI} rx="2"/>
          <circle cx="244" cy="28" r="6" fill={isOn('toasteroven') ? T : '#EFD3BE'}/>
          <circle cx="244" cy="42" r="4" fill={isOn('toasteroven') ? R : '#EFD3BE'}/>
          <circle cx="244" cy="54" r="4" fill={isOn('toasteroven') ? R : '#EFD3BE'}/>
          {/* Tray handle */}
          <rect x="155" y="65" width="60" height="6" fill={isOn('toasteroven') ? '#EAB69F' : MI} rx="2"/>
        </g>

        {/* ── AIR FRYER  (x=140..200, y=108..182) ── */}
        <g onClick={() => toggle('airfryer')} style={{cursor:'pointer'}}>
          <rect x="140" y="108" width="60" height="74" fill={S('airfryer')} rx="10" stroke={SH('airfryer')} strokeWidth="1.5"/>
          <rect x="148" y="116" width="44" height="30" fill={SB('airfryer')} rx="6"/>
          {isOn('airfryer') && <circle cx="170" cy="131" r="11" fill="none" stroke={T} strokeWidth="1.5" strokeDasharray="3 2"/>}
          <circle cx="170" cy="155" r="6" fill={isOn('airfryer') ? T : '#EFD3BE'}/>
          <rect x="150" y="164" width="40" height="5" rx="2.5" fill={isOn('airfryer') ? '#EAB69F' : MI}/>
        </g>

        {/* ── INSTANT POT  (x=220..295, y=90..182) ── */}
        <g onClick={() => toggle('instantpot')} style={{cursor:'pointer'}}>
          <ellipse cx="257" cy="178" rx="36" ry="9" fill={S('instantpot')} stroke={SH('instantpot')} strokeWidth="1.2"/>
          <rect x="221" y="108" width="72" height="70" fill={S('instantpot')} rx="5" stroke={SH('instantpot')} strokeWidth="1.5"/>
          <ellipse cx="257" cy="108" rx="36" ry="10" fill={isOn('instantpot') ? TH : MI} stroke={SH('instantpot')} strokeWidth="1.5"/>
          <ellipse cx="257" cy="108" rx="22" ry="6"  fill={BG}/>
          <rect x="253" y="95" width="8" height="14" fill={isOn('instantpot') ? R : MU} rx="3"/>
          <rect x="221" y="104" width="72" height="10" fill={isOn('instantpot') ? '#EAB69F' : MI} rx="2"/>
          {[236,257,278].map((x,i) => (
            <circle key={i} cx={x} cy="109" r="2.5" fill={isOn('instantpot') ? (i===1?T:R) : '#EFD3BE'}/>
          ))}
          <ellipse cx="257" cy="143" rx="18" ry="6" fill={BG}/>
          <circle cx="257" cy="143" r="6" fill={isOn('instantpot') ? T : MU}/>
        </g>

        {/* ── BLENDER  (x=315..365, y=80..182) ── */}
        <g onClick={() => toggle('blender')} style={{cursor:'pointer'}}>
          <rect x="320" y="168" width="36" height="14" rx="5" fill={isOn('blender') ? TH : MI}/>
          <circle cx="332" cy="175" r="3" fill={isOn('blender') ? T : '#EFD3BE'}/>
          <circle cx="344" cy="175" r="3" fill={isOn('blender') ? R : '#EFD3BE'}/>
          <polygon points="323,168 318,100 360,100 355,168" fill={S('blender')} stroke={SH('blender')} strokeWidth="1.5"/>
          <rect x="318" y="97"  width="42" height="7" rx="3.5" fill={isOn('blender') ? MU : MI}/>
          <rect x="326" y="84"  width="26" height="14" rx="3"  fill={isOn('blender') ? D : MI}/>
          {isOn('blender') && <polygon points="325,164 322,104 356,104 353,164" fill="rgba(224,122,95,.08)"/>}
          <ellipse cx="338" cy="130" rx="10" ry="4" fill="none" stroke={isOn('blender') ? T : MU} strokeWidth="1" opacity=".5"/>
        </g>

        {/* ── RICE COOKER  (x=385..455, y=110..182) ── */}
        <g onClick={() => toggle('ricecooker')} style={{cursor:'pointer'}}>
          <ellipse cx="420" cy="178" rx="32" ry="8" fill={S('ricecooker')} stroke={SH('ricecooker')} strokeWidth="1.2"/>
          <rect x="388" y="128" width="64" height="50" fill={S('ricecooker')} rx="6" stroke={SH('ricecooker')} strokeWidth="1.5"/>
          <ellipse cx="420" cy="128" rx="32" ry="9" fill={isOn('ricecooker') ? TH : MI} stroke={SH('ricecooker')} strokeWidth="1.5"/>
          <ellipse cx="420" cy="126" rx="18" ry="5" fill={BG}/>
          <rect x="416" y="112" width="8"  height="17" fill={isOn('ricecooker') ? R : MU} rx="3"/>
          <rect x="388" y="124" width="64" height="10" fill={isOn('ricecooker') ? '#EAB69F' : MI} rx="2"/>
          <circle cx="420" cy="153" r="9" fill={BG}/>
          <circle cx="420" cy="153" r="4" fill={isOn('ricecooker') ? T : MU}/>
        </g>

        {/* ── SLOW COOKER  (x=12..165, y=206..295) ── */}
        <g onClick={() => toggle('slowcooker')} style={{cursor:'pointer'}}>
          <ellipse cx="88" cy="290" rx="68" ry="12" fill={S('slowcooker')} stroke={SH('slowcooker')} strokeWidth="1.2"/>
          <rect x="20" y="230" width="136" height="60" fill={S('slowcooker')} rx="7" stroke={SH('slowcooker')} strokeWidth="1.5"/>
          <ellipse cx="88" cy="230" rx="68" ry="14" fill={isOn('slowcooker') ? TH : MI} stroke={SH('slowcooker')} strokeWidth="1.5"/>
          <ellipse cx="88" cy="228" rx="46" ry="9"  fill={BG}/>
          <rect x="20" y="222" width="136" height="14" fill={isOn('slowcooker') ? '#EAB69F' : MI} rx="4"/>
          {[45,88,131].map((x,i) => (
            <circle key={i} cx={x} cy="229" r="3.5" fill={isOn('slowcooker') ? (i===1?T:R) : '#EFD3BE'}/>
          ))}
          {/* Handles */}
          <rect x="10" y="245" width="10" height="22" rx="4" fill={isOn('slowcooker') ? MU : MI}/>
          <rect x="156" y="245" width="10" height="22" rx="4" fill={isOn('slowcooker') ? MU : MI}/>
        </g>

        {/* ── GRILL  (x=200..490, y=205..305) ── */}
        <g onClick={() => toggle('grill')} style={{cursor:'pointer'}}>
          {/* Bowl */}
          <ellipse cx="345" cy="240" rx="130" ry="28" fill={S('grill')} stroke={SH('grill')} strokeWidth="1.5"/>
          <ellipse cx="345" cy="232" rx="122" ry="20" fill={BG}/>
          {/* Grill grates */}
          {[225,245,265,285,305,325,345,365,385,405,425,445,465].map((x,i) => (
            <line key={i} x1={x} y1="214" x2={x} y2="252" stroke={isOn('grill') ? T : MU} strokeWidth="2.2"/>
          ))}
          {/* Rim overlay */}
          <ellipse cx="345" cy="240" rx="130" ry="28" fill="none" stroke={SH('grill')} strokeWidth="1.5"/>
          {/* Base/pedestal */}
          <rect x="315" y="265" width="60" height="10" rx="4" fill={isOn('grill') ? '#EAB69F' : MI}/>
          {/* Legs */}
          <line x1="325" y1="275" x2="310" y2="302" stroke={isOn('grill') ? MU : MI} strokeWidth="3.5" strokeLinecap="round"/>
          <line x1="345" y1="275" x2="345" y2="304" stroke={isOn('grill') ? MU : MI} strokeWidth="3.5" strokeLinecap="round"/>
          <line x1="365" y1="275" x2="380" y2="302" stroke={isOn('grill') ? MU : MI} strokeWidth="3.5" strokeLinecap="round"/>
        </g>

      </svg>

      {/* Chips below — text only shows here */}
      <div style={{ marginTop: '12px', minHeight: '32px' }}>
        {selected.length === 0
          ? <p style={{ fontSize:'12px', color:'var(--muted)', textAlign:'center' }}>
              Tap appliances above to select what you have
            </p>
          : (
            <div style={{ display:'flex', flexWrap:'wrap', gap:'6px', justifyContent:'center' }}>
              {selected.map(id => {
                const a = APPLIANCES.find(x => x.id === id);
                return a ? (
                  <span key={id} onClick={() => toggle(id)} style={{
                    padding:'4px 12px', fontSize:'12px', fontWeight:'500', cursor:'pointer',
                    background:'rgba(224,122,95,0.15)', border:'1px solid var(--teal)',
                    borderRadius:'999px', color:'var(--teal)',
                    transition: 'all .15s',
                  }}>
                    {a.label} <IconX style={{width:'10px',height:'10px',display:'inline',verticalAlign:'middle'}}/>
                  </span>
                ) : null;
              })}
            </div>
          )
        }
      </div>
    </div>
  );
}

export { APPLIANCES };
