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
