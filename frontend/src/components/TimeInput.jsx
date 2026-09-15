export default function TimeInput({ minutesDecimal, onChange }) {
  const totalSeconds = minutesDecimal === '' || minutesDecimal == null ? null : Math.round(Number(minutesDecimal) * 60);
  const mins = totalSeconds != null ? Math.floor(totalSeconds / 60) : '';
  const secs = totalSeconds != null ? totalSeconds % 60 : '';

  function updateFromParts(newMins, newSecs) {
    if (newMins === '' && newSecs === '') { onChange(''); return; }
    const m = newMins === '' ? 0 : Math.max(0, parseInt(newMins, 10) || 0);
    const s = newSecs === '' ? 0 : Math.min(59, Math.max(0, parseInt(newSecs, 10) || 0));
    onChange(+(m + s / 60).toFixed(3));
  }

  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <input className="input" type="number" min="0" inputMode="numeric" placeholder="20"
        value={mins} onChange={e => updateFromParts(e.target.value, secs)} style={{ flex: 1 }} />
      <span className="muted" style={{ fontSize: '13px', flexShrink: 0 }}>min</span>
      <input className="input" type="number" min="0" max="59" inputMode="numeric" placeholder="00"
        value={secs} onChange={e => updateFromParts(mins, e.target.value)} style={{ flex: 1 }} />
      <span className="muted" style={{ fontSize: '13px', flexShrink: 0 }}>sec</span>
    </div>
  );
}
