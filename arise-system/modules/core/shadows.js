export function trackHabitCompletion(state, missionTitle) {
  if (!state.habitHistory[missionTitle]) {
    state.habitHistory[missionTitle] = { count: 0, consistency: 0 };
  }
  const habit = state.habitHistory[missionTitle];
  habit.count += 1;
  habit.consistency = Math.min(100, habit.consistency + 4);
}

export function getShadowHabits(state) {
  return Object.entries(state.habitHistory)
    .map(([name, data]) => ({
      name,
      level: Math.max(1, Math.floor(data.count / 5) + 1),
      consistency: data.consistency,
      count: data.count
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
}
