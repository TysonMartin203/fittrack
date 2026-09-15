// Standard split: 30% protein, 40% carbs, 30% fat. Protein/carbs = 4 cal/g, fat = 9 cal/g.
export function getMacroGoals(profile, calorieGoal) {
  const cg = Number(calorieGoal) || 0;
  return {
    protein: profile?.proteinGoal ? Number(profile.proteinGoal) : (cg ? Math.round((cg * 0.30) / 4) : null),
    carbs: profile?.carbsGoal ? Number(profile.carbsGoal) : (cg ? Math.round((cg * 0.40) / 4) : null),
    fat: profile?.fatGoal ? Number(profile.fatGoal) : (cg ? Math.round((cg * 0.30) / 9) : null),
  };
}
