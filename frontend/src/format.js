// Duration is stored as decimal minutes (e.g. 24.75 = 24 min 45 sec) for precision.
// This renders it as a human "mm:ss" or "h:mm:ss" string instead of a decimal.
export function formatDuration(decimalMinutes) {
  if (decimalMinutes == null || decimalMinutes === '') return '';
  const totalSeconds = Math.round(Number(decimalMinutes) * 60);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return h > 0
    ? `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
    : `${m}:${String(s).padStart(2,'0')}`;
}

// Compact display for large numbers (e.g. total volume lifted): 45231 -> "45.2K"
export function formatCompact(n) {
  const num = Number(n) || 0;
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(num >= 10_000_000_000 ? 0 : 1)}B`;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(num >= 10_000_000 ? 0 : 1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(num >= 10_000 ? 0 : 1)}K`;
  return String(Math.round(num));
}
