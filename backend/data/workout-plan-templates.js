function lift(name, sets, reps, notes) { return { category: 'lifting', exerciseName: name, sets, reps, notes: notes || '' }; }
function cardio(name, duration, notes) { return { category: 'cardio', exerciseName: name, durationMinutes: duration, notes: notes || '' }; }
function workoutDay(day, focus, exercises) { return { day, type: 'workout', focus, exercises }; }
function rest(day) { return { day, type: 'rest' }; }

const TEMPLATES = [
  // ── Full-week programs (7 days, rest days included) ──
  {
    id: 'ppl-6day',
    name: 'Push Pull Legs (6-Day)',
    description: 'Classic 6-day PPL split, run twice through the week with one rest day',
    category: 'Push Pull Legs',
    icon: 'ppl',
    format: 'week',
    plan: {
      split_type: 'Push Pull Legs', days_per_week: 6,
      days: [
        workoutDay('Monday', 'Push', [
          lift('Bench Press', 4, '6-8'), lift('Overhead Press', 3, '8-10'),
          lift('Incline Dumbbell Press', 3, '10-12'), lift('Lateral Raise', 3, '12-15'),
          lift('Tricep Pushdown', 3, '12-15'), lift('Dip', 3, '10-12'),
        ]),
        workoutDay('Tuesday', 'Pull', [
          lift('Deadlift', 3, '5-6'), lift('Pull-Up', 4, '6-10'),
          lift('Barbell Row', 3, '8-10'), lift('Face Pull', 3, '12-15'),
          lift('Barbell Curl', 3, '10-12'), lift('Hammer Curl', 3, '10-12'),
        ]),
        workoutDay('Wednesday', 'Legs', [
          lift('Squat', 4, '6-8'), lift('Romanian Deadlift', 3, '8-10'),
          lift('Leg Press', 3, '10-12'), lift('Leg Curl', 3, '12-15'),
          lift('Calf Raise', 4, '12-15'),
        ]),
        workoutDay('Thursday', 'Push', [
          lift('Overhead Press', 4, '6-8'), lift('Incline Bench Press', 3, '8-10'),
          lift('Cable Fly', 3, '12-15'), lift('Lateral Raise', 3, '12-15'),
          lift('Overhead Tricep Extension', 3, '10-12'), lift('Push-Up', 3, '15-20'),
        ]),
        workoutDay('Friday', 'Pull', [
          lift('Barbell Row', 4, '6-8'), lift('Lat Pulldown', 3, '8-10'),
          lift('Seated Cable Row', 3, '10-12'), lift('Rear Delt Fly', 3, '12-15'),
          lift('Preacher Curl', 3, '10-12'), lift('Cable Curl', 3, '12-15'),
        ]),
        workoutDay('Saturday', 'Legs', [
          lift('Front Squat', 4, '6-8'), lift('Bulgarian Split Squat', 3, '10-12'),
          lift('Leg Extension', 3, '12-15'), lift('Seated Leg Curl Machine', 3, '12-15'),
          lift('Standing Calf Raise Machine', 4, '12-15'),
        ]),
        rest('Sunday'),
      ],
    },
  },
  {
    id: 'upper-lower-4day',
    name: 'Upper/Lower (4-Day)',
    description: 'Four training days split between upper and lower body, three rest days',
    category: 'Upper/Lower',
    icon: 'upper-lower',
    format: 'week',
    plan: {
      split_type: 'Upper/Lower', days_per_week: 4,
      days: [
        workoutDay('Monday', 'Upper', [
          lift('Bench Press', 4, '6-8'), lift('Barbell Row', 4, '6-8'),
          lift('Overhead Press', 3, '8-10'), lift('Lat Pulldown', 3, '8-10'),
          lift('Barbell Curl', 3, '10-12'), lift('Tricep Pushdown', 3, '10-12'),
        ]),
        workoutDay('Tuesday', 'Lower', [
          lift('Squat', 4, '6-8'), lift('Romanian Deadlift', 3, '8-10'),
          lift('Leg Press', 3, '10-12'), lift('Leg Curl', 3, '12-15'),
          lift('Calf Raise', 4, '12-15'),
        ]),
        rest('Wednesday'),
        workoutDay('Thursday', 'Upper', [
          lift('Incline Bench Press', 4, '6-8'), lift('Pull-Up', 4, '6-10'),
          lift('Dumbbell Shoulder Press', 3, '8-10'), lift('Seated Cable Row', 3, '10-12'),
          lift('Hammer Curl', 3, '10-12'), lift('Dip', 3, '10-12'),
        ]),
        workoutDay('Friday', 'Lower', [
          lift('Deadlift', 3, '5-6'), lift('Front Squat', 3, '8-10'),
          lift('Bulgarian Split Squat', 3, '10-12'), lift('Leg Extension', 3, '12-15'),
          lift('Standing Calf Raise Machine', 4, '12-15'),
        ]),
        rest('Saturday'),
        rest('Sunday'),
      ],
    },
  },
  {
    id: 'full-body-3day',
    name: 'Full Body (3-Day, Beginner)',
    description: 'Three full-body sessions a week — the classic starting point for beginners',
    category: 'Full Body',
    icon: 'full-body',
    format: 'week',
    plan: {
      split_type: 'Full Body', days_per_week: 3,
      days: [
        workoutDay('Monday', 'Full Body A', [
          lift('Squat', 3, '8-10'), lift('Bench Press', 3, '8-10'),
          lift('Barbell Row', 3, '8-10'), lift('Overhead Press', 2, '10-12'),
          lift('Plank', 3, '30-45 sec'),
        ]),
        rest('Tuesday'),
        workoutDay('Wednesday', 'Full Body B', [
          lift('Deadlift', 3, '6-8'), lift('Incline Dumbbell Press', 3, '10-12'),
          lift('Lat Pulldown', 3, '10-12'), lift('Leg Press', 3, '10-12'),
          lift('Crunch', 3, '15-20'),
        ]),
        rest('Thursday'),
        workoutDay('Friday', 'Full Body C', [
          lift('Front Squat', 3, '8-10'), lift('Push-Up', 3, '12-15'),
          lift('Seated Cable Row', 3, '10-12'), lift('Dumbbell Shoulder Press', 2, '10-12'),
          lift('Russian Twist', 3, '15-20'),
        ]),
        rest('Saturday'), rest('Sunday'),
      ],
    },
  },
  {
    id: 'bro-split-5day',
    name: 'Bro Split (5-Day)',
    description: 'One muscle group per day — chest, back, legs, shoulders, arms',
    category: 'Bro Split',
    icon: 'bro-split',
    format: 'week',
    plan: {
      split_type: 'Bro Split', days_per_week: 5,
      days: [
        workoutDay('Monday', 'Chest', [
          lift('Bench Press', 4, '6-8'), lift('Incline Bench Press', 3, '8-10'),
          lift('Cable Fly', 3, '12-15'), lift('Dumbbell Fly', 3, '12-15'), lift('Push-Up', 3, '15-20'),
        ]),
        workoutDay('Tuesday', 'Back', [
          lift('Deadlift', 3, '5-6'), lift('Pull-Up', 4, '6-10'), lift('Barbell Row', 3, '8-10'),
          lift('Lat Pulldown', 3, '10-12'), lift('Face Pull', 3, '12-15'),
        ]),
        workoutDay('Wednesday', 'Legs', [
          lift('Squat', 4, '6-8'), lift('Leg Press', 3, '10-12'), lift('Leg Curl', 3, '12-15'),
          lift('Leg Extension', 3, '12-15'), lift('Calf Raise', 4, '12-15'),
        ]),
        workoutDay('Thursday', 'Shoulders', [
          lift('Overhead Press', 4, '6-8'), lift('Lateral Raise', 4, '12-15'),
          lift('Rear Delt Fly', 3, '12-15'), lift('Front Raise', 3, '12-15'), lift('Shrug', 3, '12-15'),
        ]),
        workoutDay('Friday', 'Arms', [
          lift('Barbell Curl', 4, '10-12'), lift('Hammer Curl', 3, '10-12'),
          lift('Tricep Pushdown', 4, '10-12'), lift('Skull Crusher', 3, '10-12'), lift('Cable Curl', 3, '12-15'),
        ]),
        rest('Saturday'), rest('Sunday'),
      ],
    },
  },

  {
    id: 'bodyweight-week',
    name: 'Bodyweight Only',
    description: 'A full week of strength training using nothing but your own bodyweight — no gym required',
    category: 'Bodyweight',
    icon: 'full-body',
    format: 'week',
    plan: {
      split_type: 'Bodyweight Push/Pull/Legs', days_per_week: 5,
      days: [
        workoutDay('Monday', 'Push', [
          lift('Push-Up', 4, 'AMRAP'), lift('Diamond Push-Up', 3, 'AMRAP'),
          lift('Dip', 3, 'AMRAP'), lift('Plank', 3, '30-45 sec'),
        ]),
        workoutDay('Tuesday', 'Pull', [
          lift('Pull-Up', 4, 'AMRAP'), lift('Chin-Up', 3, 'AMRAP'),
          lift('Hanging Leg Raise', 3, 'AMRAP'), lift('Superman Hold', 3, '20-30 sec'),
        ]),
        workoutDay('Wednesday', 'Legs', [
          lift('Bodyweight Squat', 4, '15-20'), lift('Jump Squat', 3, '10-12'),
          lift('Walking Lunge', 3, '12 each leg'), lift('Calf Raise', 4, '20-25'),
        ]),
        rest('Thursday'),
        workoutDay('Friday', 'Full Body', [
          lift('Burpee', 4, '10-15'), lift('Push-Up', 3, 'AMRAP'),
          lift('Pistol Squat', 3, '5-8 each leg'), lift('Mountain Climber', 3, '20-30 sec'),
        ]),
        workoutDay('Saturday', 'Core & Conditioning', [
          lift('Plank', 3, '45-60 sec'), lift('Sit-Up', 3, '15-20'),
          lift('Russian Twist', 3, '15-20 each side'), cardio('Jump Rope', 10, 'steady pace'),
        ]),
        rest('Sunday'),
      ],
    },
  },

  // ── Individual standalone workouts (single session, no rest days) ──
  { id: 'push-day', name: 'Push Day', description: 'Chest, shoulders, and triceps in one session', category: 'Push', icon: 'push', format: 'single',
    plan: { focus: 'Push', exercises: [
      lift('Bench Press', 4, '6-8'), lift('Overhead Press', 3, '8-10'), lift('Incline Dumbbell Press', 3, '10-12'),
      lift('Lateral Raise', 3, '12-15'), lift('Tricep Pushdown', 3, '12-15'), lift('Dip', 3, '10-12'),
    ] } },
  { id: 'pull-day', name: 'Pull Day', description: 'Back and biceps in one session', category: 'Pull', icon: 'pull', format: 'single',
    plan: { focus: 'Pull', exercises: [
      lift('Deadlift', 3, '5-6'), lift('Pull-Up', 4, '6-10'), lift('Barbell Row', 3, '8-10'),
      lift('Face Pull', 3, '12-15'), lift('Barbell Curl', 3, '10-12'), lift('Hammer Curl', 3, '10-12'),
    ] } },
  { id: 'leg-day', name: 'Leg Day', description: 'Quads, hamstrings, glutes, and calves in one session', category: 'Legs', icon: 'legs', format: 'single',
    plan: { focus: 'Legs', exercises: [
      lift('Squat', 4, '6-8'), lift('Romanian Deadlift', 3, '8-10'), lift('Leg Press', 3, '10-12'),
      lift('Leg Curl', 3, '12-15'), lift('Leg Extension', 3, '12-15'), lift('Calf Raise', 4, '12-15'),
    ] } },
  { id: 'full-body-beginner', name: 'Full Body Beginner', description: 'A gentle, complete introduction to lifting', category: 'Full Body', icon: 'full-body', format: 'single',
    plan: { focus: 'Full Body', exercises: [
      lift('Squat', 3, '10-12'), lift('Push-Up', 3, '10-15'), lift('Barbell Row', 3, '10-12'),
      lift('Dumbbell Shoulder Press', 2, '10-12'), lift('Plank', 3, '20-30 sec'),
    ] } },
  { id: 'upper-blast', name: 'Upper Body Blast', description: 'A hard upper-body-only session for a busy leg day off', category: 'Upper', icon: 'upper-lower', format: 'single',
    plan: { focus: 'Upper Body', exercises: [
      lift('Bench Press', 4, '8-10'), lift('Pull-Up', 4, '6-10'), lift('Overhead Press', 3, '8-10'),
      lift('Seated Cable Row', 3, '10-12'), lift('Barbell Curl', 3, '10-12'), lift('Tricep Pushdown', 3, '10-12'),
    ] } },
  { id: 'lower-blast', name: 'Lower Body Blast', description: 'A hard lower-body-only session', category: 'Lower', icon: 'upper-lower', format: 'single',
    plan: { focus: 'Lower Body', exercises: [
      lift('Squat', 4, '6-8'), lift('Deadlift', 3, '5-6'), lift('Leg Press', 3, '10-12'),
      lift('Walking Lunge', 3, '12 each leg'), lift('Calf Raise', 4, '12-15'),
    ] } },
  { id: 'core-conditioning', name: 'Core & Conditioning', description: 'Core strength plus a cardio finisher', category: 'Core', icon: 'core', format: 'single',
    plan: { focus: 'Core & Conditioning', exercises: [
      lift('Plank', 3, '30-45 sec'), lift('Hanging Leg Raise', 3, '10-15'), lift('Russian Twist', 3, '15-20'),
      lift('Cable Crunch', 3, '15-20'), cardio('Jump Rope', 10, 'steady pace'),
    ] } },
  { id: 'quick-20min', name: 'Quick 20-Minute Full Body', description: 'A short, efficient session for a time-crunched day', category: 'Quick', icon: 'quick', format: 'single',
    plan: { focus: 'Quick Full Body', exercises: [
      lift('Squat', 3, '12-15'), lift('Push-Up', 3, '12-15'), lift('Barbell Row', 3, '12-15'), lift('Plank', 2, '30 sec'),
    ] } },
  { id: 'cardio-core-finisher', name: 'Cardio & Core Finisher', description: 'A cardio-forward session to close out a training week', category: 'Cardio', icon: 'cardio', format: 'single',
    plan: { focus: 'Cardio & Core', exercises: [
      cardio('Running', 20, 'steady pace'), lift('Plank', 3, '30-45 sec'),
      lift('Russian Twist', 3, '15-20'), lift('Mountain Climber', 3, '20-30 sec'),
    ] } },
];

module.exports = TEMPLATES;
