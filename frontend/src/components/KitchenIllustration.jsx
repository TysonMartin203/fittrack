import { useState } from 'react';

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

export default function KitchenIllustration({ selected = [], onChange }) {
  function toggle(id) {
    if (selected.includes(id)) onChange(selected.filter(x => x !== id));
    else onChange([...selected, id]);
  }

  const on  = '#7EB09B';
  const off = '#2E4A4E';
  const onB = '#519E8A';
  const offB = '#1C2E30';
  const rose = '#ECBEB4';

  function isOn(id) { return selected.includes(id); }
  function fill(id)  { return isOn(id) ? on  : off; }
  function stroke(id){ return isOn(id) ? onB : offB; }

  return (
    <div>
      <svg viewBox="0 0 360 220" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',maxWidth:'380px',display:'block',margin:'0 auto'}}>
        {/* Kitchen background */}
        <rect width="360" height="220" fill="#1C2E30" rx="12"/>
        {/* Wall */}
        <rect x="0" y="0" width="360" height="140" fill="#243A3D"/>
        {/* Floor */}
        <rect x="0" y="140" width="360" height="80" fill="#1C2E30"/>
        {/* Counter */}
        <rect x="10" y="128" width="340" height="18" fill="#385759" rx="3"/>
        {/* Counter top highlight */}
        <rect x="10" y="128" width="340" height="3" fill="#476A6F" rx="2"/>

        {/* ── STOVE/OVEN (left wall unit) ── */}
        <g onClick={() => { toggle('stovetop'); toggle('oven'); }} style={{cursor:'pointer'}}>
          {/* Oven body */}
          <rect x="15" y="60" width="80" height="68" fill={isOn('oven') ? '#385759' : '#243A3D'} rx="4" stroke={stroke('oven')} strokeWidth="1.5"/>
          {/* Oven window */}
          <rect x="22" y="75" width="66" height="40" fill={isOn('oven') ? '#1C2E30' : '#1A2A2C'} rx="3"/>
          {isOn('oven') && <rect x="22" y="75" width="66" height="40" fill="rgba(126,176,155,0.08)" rx="3"/>}
          {/* Oven handle */}
          <rect x="30" y="71" width="50" height="4" fill={isOn('oven') ? rose : '#476A6F'} rx="2"/>
          {/* Stovetop burners */}
          <circle cx="32" cy="57" r="8" fill={isOn('stovetop') ? '#1C2E30' : '#1A2A2C'} stroke={isOn('stovetop') ? on : '#385759'} strokeWidth="1.5"/>
          <circle cx="32" cy="57" r="4" fill={isOn('stovetop') ? on : '#243A3D'}/>
          <circle cx="58" cy="57" r="8" fill={isOn('stovetop') ? '#1C2E30' : '#1A2A2C'} stroke={isOn('stovetop') ? on : '#385759'} strokeWidth="1.5"/>
          <circle cx="58" cy="57" r="4" fill={isOn('stovetop') ? on : '#243A3D'}/>
          <circle cx="78" cy="57" r="6" fill={isOn('stovetop') ? '#1C2E30' : '#1A2A2C'} stroke={isOn('stovetop') ? on : '#385759'} strokeWidth="1.5"/>
          <circle cx="78" cy="57" r="3" fill={isOn('stovetop') ? on : '#243A3D'}/>
          {/* Label */}
          <text x="55" y="136" textAnchor="middle" fontSize="8" fill={isOn('oven') ? on : '#476A6F'} fontFamily="DM Sans,sans-serif">Stove/Oven</text>
        </g>

        {/* ── MICROWAVE (above stove) ── */}
        <g onClick={() => toggle('microwave')} style={{cursor:'pointer'}}>
          <rect x="15" y="18" width="80" height="38" fill={fill('microwave')} rx="4" stroke={stroke('microwave')} strokeWidth="1.5"/>
          <rect x="18" y="21" width="55" height="32" fill={isOn('microwave') ? '#1C2E30' : '#1A2A2C'} rx="2"/>
          {isOn('microwave') && <text x="45" y="41" textAnchor="middle" fontSize="14" fill={on}>▶</text>}
          {!isOn('microwave') && <text x="45" y="41" textAnchor="middle" fontSize="10" fill="#385759">- - -</text>}
          <rect x="75" y="21" width="17" height="32" fill={isOn('microwave') ? '#385759' : '#1A2A2C'} rx="2"/>
          <circle cx="83" cy="30" r="4" fill={isOn('microwave') ? on : '#243A3D'}/>
          <circle cx="83" cy="43" r="3" fill={isOn('microwave') ? rose : '#243A3D'}/>
          <text x="55" y="62" textAnchor="middle" fontSize="8" fill={isOn('microwave') ? on : '#476A6F'} fontFamily="DM Sans,sans-serif">Microwave</text>
        </g>

        {/* ── AIR FRYER ── */}
        <g onClick={() => toggle('airfryer')} style={{cursor:'pointer'}}>
          <rect x="105" y="88" width="44" height="40" fill={fill('airfryer')} rx="6" stroke={stroke('airfryer')} strokeWidth="1.5"/>
          <rect x="110" y="93" width="34" height="22" fill={isOn('airfryer') ? '#1C2E30' : '#1A2A2C'} rx="4"/>
          {isOn('airfryer') && <circle cx="127" cy="104" r="8" fill="none" stroke={on} strokeWidth="1.5" strokeDasharray="3 2"/>}
          <circle cx="127" cy="122" r="4" fill={isOn('airfryer') ? on : '#243A3D'}/>
          <text x="127" y="137" textAnchor="middle" fontSize="8" fill={isOn('airfryer') ? on : '#476A6F'} fontFamily="DM Sans,sans-serif">Air Fryer</text>
        </g>

        {/* ── INSTANT POT ── */}
        <g onClick={() => toggle('instantpot')} style={{cursor:'pointer'}}>
          <ellipse cx="185" cy="120" rx="24" ry="8" fill={fill('instantpot')} stroke={stroke('instantpot')} strokeWidth="1.5"/>
          <rect x="161" y="92" width="48" height="28" fill={fill('instantpot')} rx="3" stroke={stroke('instantpot')} strokeWidth="1.5"/>
          <ellipse cx="185" cy="92" rx="24" ry="8" fill={isOn('instantpot') ? onB : '#1A2A2C'} stroke={stroke('instantpot')} strokeWidth="1.5"/>
          <rect x="182" y="82" width="6" height="10" fill={isOn('instantpot') ? rose : '#385759'} rx="2"/>
          <ellipse cx="185" cy="106" rx="14" ry="5" fill={isOn('instantpot') ? '#1C2E30' : '#1A2A2C'}/>
          <circle cx="185" cy="106" r="4" fill={isOn('instantpot') ? on : '#243A3D'}/>
          <text x="185" y="137" textAnchor="middle" fontSize="8" fill={isOn('instantpot') ? on : '#476A6F'} fontFamily="DM Sans,sans-serif">Instant Pot</text>
        </g>

        {/* ── BLENDER ── */}
        <g onClick={() => toggle('blender')} style={{cursor:'pointer'}}>
          <polygon points="228,128 234,90 248,90 254,128" fill={fill('blender')} stroke={stroke('blender')} strokeWidth="1.5"/>
          <rect x="230" y="88" width="22" height="6" fill={isOn('blender') ? onB : '#1A2A2C'} rx="2"/>
          <polygon points="232,128 230,138 252,138 250,128" fill={isOn('blender') ? onB : '#1A2A2C'} stroke={stroke('blender')} strokeWidth="1.5"/>
          {isOn('blender') && <polygon points="234,95 248,95 244,125 238,125" fill="rgba(126,176,155,0.15)"/>}
          <text x="241" y="148" textAnchor="middle" fontSize="8" fill={isOn('blender') ? on : '#476A6F'} fontFamily="DM Sans,sans-serif">Blender</text>
        </g>

        {/* ── SLOW COOKER ── */}
        <g onClick={() => toggle('slowcooker')} style={{cursor:'pointer'}}>
          <ellipse cx="295" cy="120" rx="28" ry="9" fill={fill('slowcooker')} stroke={stroke('slowcooker')} strokeWidth="1.5"/>
          <rect x="267" y="95" width="56" height="25" fill={fill('slowcooker')} rx="4" stroke={stroke('slowcooker')} strokeWidth="1.5"/>
          <ellipse cx="295" cy="95" rx="28" ry="9" fill={isOn('slowcooker') ? onB : '#1A2A2C'} stroke={stroke('slowcooker')} strokeWidth="1.5"/>
          <ellipse cx="295" cy="95" rx="18" ry="5" fill={isOn('slowcooker') ? '#1C2E30' : '#243A3D'}/>
          <rect x="272" y="88" width="46" height="7" fill={isOn('slowcooker') ? '#476A6F' : '#1A2A2C'} rx="2"/>
          <circle cx="282" cy="91" r="2" fill={isOn('slowcooker') ? rose : '#385759'}/>
          <circle cx="295" cy="91" r="2" fill={isOn('slowcooker') ? on : '#385759'}/>
          <circle cx="308" cy="91" r="2" fill={isOn('slowcooker') ? rose : '#385759'}/>
          <text x="295" y="137" textAnchor="middle" fontSize="8" fill={isOn('slowcooker') ? on : '#476A6F'} fontFamily="DM Sans,sans-serif">Slow Cooker</text>
        </g>

        {/* ── TOASTER OVEN (right wall) ── */}
        <g onClick={() => toggle('toasteroven')} style={{cursor:'pointer'}}>
          <rect x="265" y="22" width="80" height="46" fill={fill('toasteroven')} rx="4" stroke={stroke('toasteroven')} strokeWidth="1.5"/>
          <rect x="268" y="25" width="58" height="34" fill={isOn('toasteroven') ? '#1C2E30' : '#1A2A2C'} rx="2"/>
          {isOn('toasteroven') && <rect x="268" y="25" width="58" height="34" fill="rgba(236,190,180,0.08)" rx="2"/>}
          <rect x="280" y="38" width="34" height="8" fill={isOn('toasteroven') ? '#476A6F' : '#243A3D'} rx="1"/>
          {isOn('toasteroven') && <rect x="280" y="38" width="34" height="8" fill="rgba(236,190,180,0.3)" rx="1"/>}
          <rect x="326" y="25" width="16" height="34" fill={isOn('toasteroven') ? '#385759' : '#1A2A2C'} rx="2"/>
          <circle cx="334" cy="35" r="5" fill={isOn('toasteroven') ? on : '#243A3D'}/>
          <circle cx="334" cy="50" r="4" fill={isOn('toasteroven') ? rose : '#243A3D'}/>
          <text x="305" y="74" textAnchor="middle" fontSize="8" fill={isOn('toasteroven') ? on : '#476A6F'} fontFamily="DM Sans,sans-serif">Toaster Oven</text>
        </g>

        {/* ── RICE COOKER ── */}
        <g onClick={() => toggle('ricecooker')} style={{cursor:'pointer'}}>
          <rect x="268" y="95" width="0" height="0"/>
          {/* Reposition to far right counter */}
          <ellipse cx="335" cy="120" rx="18" ry="6" fill={fill('ricecooker')} stroke={stroke('ricecooker')} strokeWidth="1.5"/>
          <rect x="317" y="100" width="36" height="20" fill={fill('ricecooker')} rx="4" stroke={stroke('ricecooker')} strokeWidth="1.5"/>
          <ellipse cx="335" cy="100" rx="18" ry="6" fill={isOn('ricecooker') ? onB : '#1A2A2C'} stroke={stroke('ricecooker')} strokeWidth="1.5"/>
          <rect x="332" y="93" width="6" height="8" fill={isOn('ricecooker') ? rose : '#385759'} rx="2"/>
          <circle cx="335" cy="112" r="5" fill={isOn('ricecooker') ? '#1C2E30' : '#243A3D'}/>
          <circle cx="335" cy="112" r="2" fill={isOn('ricecooker') ? on : '#385759'}/>
          <text x="335" y="137" textAnchor="middle" fontSize="8" fill={isOn('ricecooker') ? on : '#476A6F'} fontFamily="DM Sans,sans-serif">Rice Cooker</text>
        </g>

        {/* ── GRILL (bottom right, outdoor indicator) ── */}
        <g onClick={() => toggle('grill')} style={{cursor:'pointer'}}>
          <rect x="155" y="155" width="50" height="28" fill={fill('grill')} rx="4" stroke={stroke('grill')} strokeWidth="1.5"/>
          <rect x="158" y="158" width="44" height="14" fill={isOn('grill') ? '#1C2E30' : '#1A2A2C'} rx="2"/>
          {isOn('grill') && [0,1,2,3,4].map(i => <line key={i} x1={161+i*9} y1="158" x2={161+i*9} y2="172" stroke={on} strokeWidth="1.5"/>)}
          <rect x="162" y="173" width="36" height="4" fill={isOn('grill') ? '#476A6F' : '#243A3D'} rx="1"/>
          <line x1="168" y1="183" x2="165" y2="195" stroke={isOn('grill') ? '#476A6F' : '#385759'} strokeWidth="2"/>
          <line x1="192" y1="183" x2="195" y2="195" stroke={isOn('grill') ? '#476A6F' : '#385759'} strokeWidth="2"/>
          <text x="180" y="207" textAnchor="middle" fontSize="8" fill={isOn('grill') ? on : '#476A6F'} fontFamily="DM Sans,sans-serif">Grill</text>
        </g>

        {/* Selection count */}
        <text x="180" y="215" textAnchor="middle" fontSize="9" fill="#476A6F" fontFamily="DM Sans,sans-serif">
          {selected.length === 0 ? 'Tap appliances to select what you have' : `${selected.length} selected`}
        </text>
      </svg>

      {/* Selected chips */}
      {selected.length > 0 && (
        <div style={{display:'flex',flexWrap:'wrap',gap:'6px',marginTop:'10px',justifyContent:'center'}}>
          {selected.map(id => {
            const a = APPLIANCES.find(x => x.id === id);
            return a ? (
              <span key={id} onClick={() => toggle(id)} style={{
                padding:'4px 12px',fontSize:'12px',fontWeight:'500',
                background:'rgba(126,176,155,0.15)',border:'1px solid var(--teal)',
                borderRadius:'999px',color:'var(--teal)',cursor:'pointer'
              }}>{a.label} ✕</span>
            ) : null;
          })}
        </div>
      )}
    </div>
  );
}

export { APPLIANCES };
