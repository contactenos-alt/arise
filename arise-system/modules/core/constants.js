export const DAILY_DEFAULTS = [
  { title: '100 push-ups', xp: 70, stat: 'strength' },
  { title: '100 squats', xp: 70, stat: 'endurance' },
  { title: '100 sit-ups', xp: 70, stat: 'discipline' },
  { title: 'Run 10km', xp: 120, stat: 'agility' }
];

export const BASE_XP = 100;
export const XP_GROWTH = 1.2;

export const RANKS = [
  { name: 'E Rank', min: 1 },
  { name: 'D Rank', min: 3 },
  { name: 'C Rank', min: 6 },
  { name: 'B Rank', min: 10 },
  { name: 'A Rank', min: 15 },
  { name: 'S Rank', min: 25 },
  { name: 'MONARCH', min: 40 }
];

export const ACHIEVEMENT_DEFS = [
  { id: 'first_mission', title: 'First mission completed', check: (s) => s.totalCompleted >= 1 },
  { id: 'streak_7', title: '7-day streak', check: (s) => s.streak >= 7 },
  { id: 'level_10', title: 'Level 10 reached', check: (s) => s.player.level >= 10 },
  { id: 'mission_50', title: '50 missions cleared', check: (s) => s.totalCompleted >= 50 },
  { id: 'discipline_25', title: 'Discipline 25', check: (s) => s.player.stats.discipline >= 25 }
];
