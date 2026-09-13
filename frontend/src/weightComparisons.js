// Approximate weights in lbs, roughest-but-defensible figures for a fun comparison —
// not meant as precise engineering claims.
const REFERENCES = [
  { name: 'an adult elephant', lbs: 13000 },
  { name: 'a school bus', lbs: 24000 },
  { name: 'a humpback whale', lbs: 80000 },
  { name: 'an empty Boeing 747', lbs: 400000 },
  { name: 'the Statue of Liberty', lbs: 54_400_000 },
  { name: 'the Eiffel Tower', lbs: 20_000_000 },
  { name: 'the Empire State Building', lbs: 730_000_000 },
  { name: 'the Golden Gate Bridge', lbs: 1_774_000_000 },
  { name: 'the Great Pyramid of Giza', lbs: 12_000_000_000 },
];

// Finds the reference object closest in magnitude (by ratio, not raw difference —
// so a small total compares to a small object, not gets lost next to a pyramid).
export function closestComparison(totalLbs) {
  if (!totalLbs || totalLbs <= 0) return null;
  let best = null, bestDist = Infinity;
  for (const ref of REFERENCES) {
    const dist = Math.abs(Math.log(totalLbs / ref.lbs));
    if (dist < bestDist) { bestDist = dist; best = ref; }
  }
  return best;
}
