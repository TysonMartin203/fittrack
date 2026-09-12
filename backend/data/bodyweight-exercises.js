// Exercises where the meaningful PR is "most reps", not "heaviest weight" —
// used when a lifting exercise is logged with no weight (pure bodyweight).
const BODYWEIGHT_EXERCISES = new Set([
  'Push-Up', 'Diamond Push-Up', 'Pull-Up', 'Chin-Up', 'Dip',
  'Sit-Up', 'Crunch', 'Hanging Leg Raise', 'Leg Raise', 'Bicycle Crunch', 'V-Up',
  'Burpee', 'Bodyweight Squat', 'Jump Squat', 'Pistol Squat',
]);

module.exports = { BODYWEIGHT_EXERCISES };
