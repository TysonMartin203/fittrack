export function displayWeight(lbs, unit) {
  if (lbs == null || lbs === '') return '';
  const n = Number(lbs);
  if (isNaN(n)) return '';
  return unit === 'kg' ? Math.round(n * 0.453592 * 10) / 10 : n;
}
export function weightUnitLabel(unit) { return unit === 'kg' ? 'kg' : 'lbs'; }

// Convert a value the user typed (in their preferred unit) back to lbs for storage.
export function toStorageWeight(value, unit) {
  if (value == null || value === '') return '';
  const n = Number(value);
  if (isNaN(n)) return '';
  return unit === 'kg' ? Math.round((n / 0.453592) * 10) / 10 : n;
}
