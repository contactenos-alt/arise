import { DAILY_DEFAULTS } from './constants.js';

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function ensureDailyMissions(state) {
  if (state.lastMissionDate === todayISO()) return false;
  const defaultMissions = DAILY_DEFAULTS.map((t, idx) => ({
    id: `daily-${todayISO()}-${idx}`,
    title: t.title,
    xp: t.xp,
    stat: t.stat,
    completed: false,
    daily: true,
    date: todayISO(),
    repeatedCount: (state.habitHistory[t.title]?.count || 0)
  }));

  state.missions = [
    ...defaultMissions,
    ...state.missions.filter((m) => !m.daily)
  ];
  state.lastMissionDate = todayISO();
  return true;
}

export function addMission(state, title, xp = 50) {
  state.missions.push({
    id: crypto.randomUUID(),
    title,
    xp,
    stat: 'discipline',
    completed: false,
    daily: false,
    date: todayISO(),
    repeatedCount: (state.habitHistory[title]?.count || 0)
  });
}

export function deleteMission(state, id) {
  state.missions = state.missions.filter((m) => m.id !== id);
}

export function editMission(state, id, title, xp) {
  const mission = state.missions.find((m) => m.id === id);
  if (!mission) return;
  mission.title = title;
  mission.xp = xp;
}

export function calculateDailyProgress(state) {
  const today = todayISO();
  const todayMissions = state.missions.filter((m) => m.date === today);
  if (!todayMissions.length) return 0;
  const completed = todayMissions.filter((m) => m.completed).length;
  return Math.round((completed / todayMissions.length) * 100);
}

export function streakMultiplier(streak) {
  if (streak >= 14) return 1.75;
  if (streak >= 7) return 1.35;
  if (streak >= 3) return 1.15;
  return 1;
}

export function updateStreak(state) {
  const today = todayISO();
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  if (!state.lastActiveDate) {
    state.streak = 1;
  } else if (state.lastActiveDate === today) {
    return;
  } else if (state.lastActiveDate === yesterday) {
    state.streak += 1;
  } else {
    state.streak = 1;
  }

  state.lastActiveDate = today;
}
