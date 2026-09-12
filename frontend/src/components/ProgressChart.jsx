import { formatDateStr } from '../dateUtils';

export default function ProgressChart({ points, unit = 'lbs' }) {
  if (!points || points.length === 0) {
    return <p className="muted" style={{fontSize:'13px',textAlign:'center',padding:'30px 0'}}>No logged history for this exercise yet.</p>;
  }
  if (points.length === 1) {
    return (
      <div style={{textAlign:'center',padding:'30px 0'}}>
        <div style={{fontSize:'28px',fontWeight:'700',color:'var(--accent)'}}>{points[0].weight} {unit}</div>
        <div className="muted" style={{fontSize:'12px',marginTop:'4px'}}>Only one session logged so far — {formatDateStr(points[0].date)}</div>
      </div>
    );
  }

  const W = 600, H = 220, PAD_L = 40, PAD_R = 16, PAD_T = 16, PAD_B = 28;
  const weights = points.map(p => Number(p.weight));
  const minW = Math.min(...weights), maxW = Math.max(...weights);
  const range = maxW - minW || 1;
  const yFor = w => PAD_T + (1 - (w - minW) / range) * (H - PAD_T - PAD_B);
  const xFor = i => PAD_L + (i / (points.length - 1)) * (W - PAD_L - PAD_R);

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xFor(i)} ${yFor(Number(p.weight))}`).join(' ');
  const areaD = `${pathD} L ${xFor(points.length-1)} ${H-PAD_B} L ${xFor(0)} ${H-PAD_B} Z`;

  const firstIdx = 0, lastIdx = points.length - 1, midIdx = Math.floor(points.length / 2);
  const xLabels = points.length > 4 ? [firstIdx, midIdx, lastIdx] : points.map((_, i) => i);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:'100%',height:'auto',display:'block'}}>
      {/* gridlines */}
      {[minW, (minW+maxW)/2, maxW].map((w, i) => (
        <g key={i}>
          <line x1={PAD_L} y1={yFor(w)} x2={W-PAD_R} y2={yFor(w)} stroke="var(--border)" strokeWidth="1"/>
          <text x={PAD_L - 8} y={yFor(w)+4} textAnchor="end" fontSize="11" fill="var(--muted)">{Math.round(w)}</text>
        </g>
      ))}
      {/* area fill + line */}
      <path d={areaD} fill="rgba(224,122,95,.12)" stroke="none"/>
      <path d={pathD} fill="none" stroke="#E07A5F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      {/* points */}
      {points.map((p, i) => (
        <circle key={i} cx={xFor(i)} cy={yFor(Number(p.weight))} r={i===lastIdx?5:3.5} fill="#E07A5F" stroke="var(--surface)" strokeWidth="1.5"/>
      ))}
      {/* x labels */}
      {xLabels.map(i => (
        <text key={i} x={xFor(i)} y={H-8} textAnchor="middle" fontSize="10" fill="var(--muted)">{formatDateStr(points[i].date)}</text>
      ))}
    </svg>
  );
}
