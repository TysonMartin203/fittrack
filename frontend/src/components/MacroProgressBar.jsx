export default function MacroProgressBar({ value, max, color = 'var(--accent)', height = '8px' }) {
  if (!max) return null;
  const pct = Math.min(100, Math.round((value / max) * 100));
  const isOver = value > max;
  return (
    <div style={{ width: '100%', height, borderRadius: '999px', position: 'relative', overflow: 'hidden', background: 'var(--border-hi)' }}>
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: `${pct}%`,
        background: isOver ? 'var(--danger)' : color,
        borderRadius: '999px', transition: 'width .3s, background .3s',
      }} />
    </div>
  );
}
