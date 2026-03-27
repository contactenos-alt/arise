import { ACHIEVEMENT_DEFS } from './constants.js';

export function evaluateAchievements(state) {
  for (const def of ACHIEVEMENT_DEFS) {
    const already = state.achievements.find((a) => a.id === def.id && a.unlocked);
    if (already) continue;
    if (def.check(state)) {
      state.achievements = state.achievements.map((a) =>
        a.id === def.id ? { ...a, unlocked: true, unlockedAt: new Date().toISOString() } : a
      );
      state.events.push({ type: 'achievement', title: def.title });
    }
  }
}

export function seedAchievements() {
  return ACHIEVEMENT_DEFS.map((def) => ({
    id: def.id,
    title: def.title,
    unlocked: false,
    unlockedAt: null
  }));
}
