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

  const ACCENT = '#E07A5F';
  const ON_BODY = '#E07A5F';
  const OFF_BODY = '#FFFFFF';
  const ON_PANEL = '#F2E1D7';
  const OFF_PANEL = '#EAB69F';
  const WALL = '#EFD3BE';
  const FLOOR = '#F4F1DE';
  const COUNTER = '#F2E1D7';
  const COUNTER_EDGE = '#EAB69F';
  const CABINET = '#E8D2BC';
  const CABINET_LINE = '#D8BFA0';

  function body(id)  { return isOn(id) ? ON_BODY  : OFF_BODY; }
  function panel(id) { return isOn(id) ? ON_PANEL : OFF_PANEL; }
  function ring(id)  { return isOn(id) ? '#8F5D5D' : '#D8BFA0'; }

  return (
    <div>
      <svg viewBox="0 0 620 500" xmlns="http://www.w3.org/2000/svg"
        style={{ width:'100%', maxWidth:'560px', display:'block', margin:'0 auto', borderRadius:'12px' }}>

        {/* ══ Back wall zone ══ */}
        <rect width="620" height="500" fill={FLOOR} rx="12"/>
        <rect x="0" y="0" width="620" height="160" fill={WALL}/>
        <rect x="0" y="160" width="620" height="18" fill={COUNTER}/>
        <rect x="0" y="176" width="620" height="4" fill={COUNTER_EDGE}/>
        <rect x="0" y="180" width="620" height="70" fill={CABINET}/>
        {[110,230,350,470,590].map((x,i) => (
          <line key={i} x1={x} y1="182" x2={x} y2="248" stroke={CABINET_LINE} strokeWidth="2"/>
        ))}

        {/* Upper cabinets (decorative) */}
        <rect x="190" y="35" width="410" height="52" fill={CABINET} rx="4" stroke={CABINET_LINE} strokeWidth="1.5"/>
        {[290,390,490].map((x,i) => <line key={i} x1={x} y1="35" x2={x} y2="87" stroke={CABINET_LINE} strokeWidth="1.5"/>)}
        {[240,340,440,540].map((x,i) => <circle key={i} cx={x} cy="61" r="2" fill={CABINET_LINE}/>)}

        {/* ── RANGE: stove + oven, back-wall unit (x 30-170, y 140-248) ── */}
        <g onClick={() => { toggle('stovetop'); toggle('oven'); }} style={{cursor:'pointer'}}>
          <rect x="30" y="140" width="140" height="108" fill={panel('oven')} rx="5" stroke={ring('oven')} strokeWidth="1.5"/>
          {/* control panel */}
          <rect x="38" y="146" width="124" height="12" fill={isOn('oven') ? ACCENT : '#D8BFA0'} rx="3"/>
          {[55,80,105,130,150].map((x,i) => <circle key={i} cx={x} cy="152" r="2.5" fill="#FFFFFF" opacity={isOn('oven')?1:.6}/>)}
          {/* stovetop */}
          <rect x="30" y="160" width="140" height="22" fill={body('stovetop')} />
          {[[62,171,8],[108,171,8]].map(([cx,cy,r],i) => (
            <g key={i}>
              <circle cx={cx} cy={cy} r={r} fill="none" stroke={isOn('stovetop') ? '#FFFFFF' : '#D8BFA0'} strokeWidth="2"/>
              <circle cx={cx} cy={cy} r={r/2.2} fill={isOn('stovetop') ? '#FFFFFF' : '#D8BFA0'}/>
            </g>
          ))}
          {/* oven body + door */}
          <rect x="38" y="192" width="124" height="50" fill={isOn('oven') ? '#F2E1D7' : '#F7EDE2'} rx="4"/>
          <rect x="48" y="198" width="104" height="38" fill={isOn('oven') ? 'rgba(224,122,95,.10)' : '#FFFFFF'} rx="3" stroke={ring('oven')} strokeWidth="1"/>
          <rect x="60" y="195" width="80" height="5" fill={isOn('oven') ? '#8F5D5D' : '#D8BFA0'} rx="2.5"/>
        </g>

        {/* ── MICROWAVE, mounted over range (x 30-170, y 40-135) ── */}
        <g onClick={() => toggle('microwave')} style={{cursor:'pointer'}}>
          <rect x="30" y="40" width="140" height="95" fill={body('microwave')} rx="5" stroke={ring('microwave')} strokeWidth="1.5"/>
          <rect x="38" y="48" width="92" height="79" fill={panel('microwave')} rx="3"/>
          <circle cx="84" cy="87" r={isOn('microwave')?16:14} fill="none" stroke={isOn('microwave')?ACCENT:'#D8BFA0'} strokeWidth="2"/>
          {isOn('microwave') && <circle cx="84" cy="87" r="4" fill={ACCENT}/>}
          <rect x="138" y="48" width="24" height="79" fill={isOn('microwave') ? '#F2E1D7' : '#EAB69F'} rx="3"/>
          <circle cx="150" cy="62" r="5" fill={isOn('microwave') ? ACCENT : '#FFFFFF'}/>
          <rect x="144" y="78" width="12" height="34" rx="3" fill={isOn('microwave') ? '#8F5D5D' : '#FFFFFF'}/>
        </g>

        {/* ── TOASTER OVEN (x 190-320, y 95-198) ── */}
        <g onClick={() => toggle('toasteroven')} style={{cursor:'pointer'}}>
          <rect x="190" y="95" width="130" height="103" fill={body('toasteroven')} rx="6" stroke={ring('toasteroven')} strokeWidth="1.5"/>
          <rect x="198" y="103" width="90" height="72" fill={panel('toasteroven')} rx="3"/>
          {isOn('toasteroven') && [116,131,146,161].map((y,i) => (
            <line key={i} x1="203" y1={y} x2="283" y2={y} stroke={ACCENT} strokeWidth="1" opacity=".4"/>
          ))}
          <rect x="294" y="103" width="18" height="72" fill={isOn('toasteroven') ? '#F2E1D7' : '#EAB69F'} rx="3"/>
          <circle cx="303" cy="118" r="5" fill={isOn('toasteroven') ? ACCENT : '#FFFFFF'}/>
          <circle cx="303" cy="134" r="4" fill={isOn('toasteroven') ? '#8F5D5D' : '#FFFFFF'}/>
          <rect x="210" y="182" width="90" height="7" rx="3.5" fill={isOn('toasteroven') ? '#EAB69F' : '#D8BFA0'}/>
        </g>

        {/* ── AIR FRYER (x 335-410, y 120-198) ── */}
        <g onClick={() => toggle('airfryer')} style={{cursor:'pointer'}}>
          <rect x="335" y="120" width="75" height="78" fill={body('airfryer')} rx="12" stroke={ring('airfryer')} strokeWidth="1.5"/>
          <rect x="344" y="130" width="57" height="34" fill={panel('airfryer')} rx="8"/>
          <circle cx="372" cy="147" r="12" fill="none" stroke={isOn('airfryer') ? ACCENT : '#D8BFA0'} strokeWidth="2" strokeDasharray="3 2"/>
          <circle cx="372" cy="176" r="7" fill={isOn('airfryer') ? ACCENT : '#FFFFFF'} stroke={ring('airfryer')} strokeWidth="1"/>
          <rect x="347" y="188" width="50" height="6" rx="3" fill={isOn('airfryer') ? '#EAB69F' : '#D8BFA0'}/>
        </g>

        {/* ══ Floor + island ══ */}
        <rect x="20" y="415" width="580" height="65" fill={CABINET} rx="8" stroke={CABINET_LINE} strokeWidth="1.5"/>
        <rect x="20" y="400" width="580" height="18" fill={COUNTER} rx="4"/>
        <rect x="20" y="414" width="580" height="4" fill={COUNTER_EDGE}/>
        {[130,250,370,480].map((x,i) => <line key={i} x1={x} y1="418" x2={x} y2="478" stroke={CABINET_LINE} strokeWidth="1.5"/>)}

        {/* ── INSTANT POT (x 50-140, y 305-400) ── */}
        <g onClick={() => toggle('instantpot')} style={{cursor:'pointer'}}>
          <rect x="55" y="330" width="80" height="70" fill={body('instantpot')} rx="6" stroke={ring('instantpot')} strokeWidth="1.5"/>
          <ellipse cx="95" cy="330" rx="40" ry="10" fill={isOn('instantpot') ? '#8F5D5D' : '#EAB69F'} stroke={ring('instantpot')} strokeWidth="1.5"/>
          <ellipse cx="95" cy="330" rx="24" ry="6" fill={FLOOR}/>
          <rect x="91" y="312" width="8" height="18" fill={isOn('instantpot') ? ACCENT : '#F2E1D7'} rx="3"/>
          <rect x="55" y="326" width="80" height="10" fill={isOn('instantpot') ? '#EAB69F' : '#D8BFA0'} rx="2"/>
          {[75,95,115].map((x,i) => <circle key={i} cx={x} cy="331" r="2.5" fill={isOn('instantpot') ? (i===1?ACCENT:'#8F5D5D') : '#FFFFFF'}/>)}
          <ellipse cx="95" cy="362" rx="20" ry="6" fill={FLOOR}/>
          <circle cx="95" cy="362" r="7" fill={isOn('instantpot') ? ACCENT : '#EAB69F'}/>
        </g>

        {/* ── BLENDER (x 160-220, y 300-400) ── */}
        <g onClick={() => toggle('blender')} style={{cursor:'pointer'}}>
          <rect x="165" y="386" width="40" height="14" rx="5" fill={isOn('blender') ? '#8F5D5D' : '#EAB69F'}/>
          <circle cx="178" cy="393" r="3" fill={isOn('blender') ? ACCENT : '#FFFFFF'}/>
          <circle cx="192" cy="393" r="3" fill={isOn('blender') ? '#8F5D5D' : '#FFFFFF'}/>
          <polygon points="168,386 162,312 208,312 202,386" fill={body('blender')} stroke={ring('blender')} strokeWidth="1.5"/>
          <rect x="162" y="308" width="46" height="8" rx="4" fill={isOn('blender') ? '#F2E1D7' : '#EAB69F'}/>
          <rect x="171" y="294" width="28" height="15" rx="3" fill={isOn('blender') ? '#FFFFFF' : '#EAB69F'}/>
          {isOn('blender') && <polygon points="170,382 166,316 204,316 200,382" fill="rgba(224,122,95,.10)"/>}
        </g>

        {/* ── RICE COOKER (x 240-325, y 320-400) ── */}
        <g onClick={() => toggle('ricecooker')} style={{cursor:'pointer'}}>
          <rect x="245" y="345" width="70" height="55" fill={body('ricecooker')} rx="6" stroke={ring('ricecooker')} strokeWidth="1.5"/>
          <ellipse cx="280" cy="345" rx="35" ry="9" fill={isOn('ricecooker') ? '#8F5D5D' : '#EAB69F'} stroke={ring('ricecooker')} strokeWidth="1.5"/>
          <ellipse cx="280" cy="343" rx="20" ry="5" fill={FLOOR}/>
          <rect x="276" y="330" width="8" height="15" fill={isOn('ricecooker') ? ACCENT : '#F2E1D7'} rx="3"/>
          <rect x="245" y="341" width="70" height="10" fill={isOn('ricecooker') ? '#EAB69F' : '#D8BFA0'} rx="2"/>
          <circle cx="280" cy="372" r="9" fill={FLOOR}/>
          <circle cx="280" cy="372" r="4" fill={isOn('ricecooker') ? ACCENT : '#EAB69F'}/>
        </g>

        {/* ── SLOW COOKER (x 345-445, y 325-400) ── */}
        <g onClick={() => toggle('slowcooker')} style={{cursor:'pointer'}}>
          <rect x="352" y="350" width="86" height="50" fill={body('slowcooker')} rx="7" stroke={ring('slowcooker')} strokeWidth="1.5"/>
          <ellipse cx="395" cy="350" rx="43" ry="11" fill={isOn('slowcooker') ? '#8F5D5D' : '#EAB69F'} stroke={ring('slowcooker')} strokeWidth="1.5"/>
          <ellipse cx="395" cy="347" rx="28" ry="6" fill={FLOOR}/>
          <rect x="352" y="341" width="86" height="11" fill={isOn('slowcooker') ? '#EAB69F' : '#D8BFA0'} rx="3"/>
          {[372,395,418].map((x,i) => <circle key={i} cx={x} cy="346" r="3" fill={isOn('slowcooker') ? (i===1?ACCENT:'#8F5D5D') : '#FFFFFF'}/>)}
          <rect x="343" y="365" width="9" height="18" rx="4" fill={isOn('slowcooker') ? '#F2E1D7' : '#EAB69F'}/>
          <rect x="438" y="365" width="9" height="18" rx="4" fill={isOn('slowcooker') ? '#F2E1D7' : '#EAB69F'}/>
        </g>

        {/* ── GRILL / GRIDDLE (x 465-605, y 365-400) ── */}
        <g onClick={() => toggle('grill')} style={{cursor:'pointer'}}>
          <rect x="465" y="365" width="140" height="35" fill={body('grill')} rx="6" stroke={ring('grill')} strokeWidth="1.5"/>
          <rect x="473" y="371" width="124" height="20" fill={panel('grill')} rx="3"/>
          {[485,505,525,545,565,585].map((x,i) => (
            <line key={i} x1={x} y1="374" x2={x} y2="388" stroke={isOn('grill') ? ACCENT : '#D8BFA0'} strokeWidth="2"/>
          ))}
          <rect x="470" y="398" width="18" height="8" rx="3" fill={isOn('grill') ? '#8F5D5D' : '#EAB69F'}/>
          <rect x="582" y="398" width="18" height="8" rx="3" fill={isOn('grill') ? '#8F5D5D' : '#EAB69F'}/>
        </g>

      </svg>

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
