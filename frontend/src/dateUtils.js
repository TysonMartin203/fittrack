// Date-only strings (YYYY-MM-DD) are dangerous to run through the Date
// constructor: `new Date('2026-09-11')` is parsed as UTC midnight, and
// .toLocaleDateString() then renders it in the browser's local timezone —
// which shows the *previous* day for anyone west of UTC. These helpers work
// entirely in local time so the calendar date never shifts.

// Today's date as YYYY-MM-DD, in the browser's local timezone (not UTC).
export function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// Format a YYYY-MM-DD (or YYYY-MM-DDTHH:mm:ss...) date-only string for display,
// without ever parsing it as UTC. Options match Intl.DateTimeFormat's.
export function formatDateStr(dateStr, options = { month: 'short', day: 'numeric' }) {
  if (!dateStr) return '';
  const [y, m, d] = String(dateStr).slice(0, 10).split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', options);
}
