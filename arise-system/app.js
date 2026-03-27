import { loadState, saveState } from './modules/data/storage.js';
import { applyXp, increaseStat } from './modules/core/player.js';
import { addMission, deleteMission, editMission, ensureDailyMissions, streakMultiplier, updateStreak } from './modules/core/missions.js';
import { evaluateAchievements, seedAchievements } from './modules/core/achievements.js';
import { trackHabitCompletion } from './modules/core/shadows.js';
import { createTimer, formatClock } from './modules/core/timer.js';
import { createSystemVoice } from './modules/ai/systemVoice.js';
import { renderAll } from './modules/ui/render.js';

const defaultState = {
  player: {
    name: 'Cazador Arrows',
    level: 1,
    currentXp: 0,
    totalXp: 0,
    stats: {
      strength: 1,
      endurance: 1,
      agility: 1,
      intelligence: 1,
      discipline: 1
    }
  },
  missions: [],
  achievements: seedAchievements(),
  habitHistory: {},
  streak: 0,
  streakMultiplier: 1,
  totalCompleted: 0,
  lastMissionDate: null,
  lastActiveDate: null,
  events: []
};

const state = loadState(defaultState);
const dom = {
  playerName: document.getElementById('playerName'),
  rankBadge: document.getElementById('rankBadge'),
  levelText: document.getElementById('levelText'),
  xpText: document.getElementById('xpText'),
  xpBar: document.getElementById('xpBar'),
  streakText: document.getElementById('streakText'),
  dailyProgress: document.getElementById('dailyProgress'),
  activeMissions: document.getElementById('activeMissions'),
  completedToday: document.getElementById('completedToday'),
  totalXp: document.getElementById('totalXp'),
  statsChart: document.getElementById('statsChart'),
  missionList: document.getElementById('missionList'),
  missionTemplate: document.getElementById('missionTemplate'),
  statsList: document.getElementById('statsList'),
  achievementList: document.getElementById('achievementList'),
  shadowList: document.getElementById('shadowList'),
  taskForm: document.getElementById('taskForm'),
  taskInput: document.getElementById('taskInput'),
  taskXpInput: document.getElementById('taskXpInput'),
  regenerateBtn: document.getElementById('regenerateBtn'),
  timerDisplay: document.getElementById('timerDisplay'),
  timerMinutes: document.getElementById('timerMinutes'),
  timerStart: document.getElementById('timerStart'),
  timerPause: document.getElementById('timerPause'),
  timerReset: document.getElementById('timerReset'),
  systemFeed: document.getElementById('systemFeed'),
  installBtn: document.getElementById('installBtn')
};

const systemVoice = createSystemVoice(dom.systemFeed);

function beep() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.value = 800;
  osc.start();
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
  osc.stop(ctx.currentTime + 0.4);
}

const timer = createTimer(
  (remaining) => {
    dom.timerDisplay.textContent = formatClock(Math.max(0, remaining));
  },
  () => {
    systemVoice.emit('Timer finished. Mission window closed.', 'warn');
    dom.timerDisplay.classList.add('complete-flash');
    setTimeout(() => dom.timerDisplay.classList.remove('complete-flash'), 600);
    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
    beep();
  }
);

function flushEvents() {
  while (state.events.length) {
    const ev = state.events.shift();
    if (ev.type === 'levelUp') {
      document.getElementById('profilePanel').classList.add('level-up');
      setTimeout(() => document.getElementById('profilePanel').classList.remove('level-up'), 700);
      systemVoice.emit(`Level up achieved. You reached level ${ev.level}.`, 'success');
    }
    if (ev.type === 'achievement') {
      document.getElementById('achievementsPanel').classList.add('complete-flash');
      setTimeout(() => document.getElementById('achievementsPanel').classList.remove('complete-flash'), 700);
      systemVoice.emit(`Achievement unlocked: ${ev.title}.`, 'success');
    }
  }
}

function persistAndRender() {
  saveState(state);
  renderAll(state, dom);
  flushEvents();
}

function completeMission(id, done) {
  const mission = state.missions.find((m) => m.id === id);
  if (!mission) return;

  if (done && !mission.completed) {
    const awarded = Math.round(mission.xp * state.streakMultiplier);
    mission.completed = true;
    applyXp(state, awarded);
    increaseStat(state, mission.stat, 1);
    trackHabitCompletion(state, mission.title);
    state.totalCompleted += 1;
    systemVoice.emit(`Mission complete: ${mission.title}. +${awarded} XP.`);
  }

  if (!done && mission.completed) {
    mission.completed = false;
    systemVoice.emit(`Mission rolled back: ${mission.title}.`, 'warn');
  }

  evaluateAchievements(state);
  persistAndRender();
}

function initDaily() {
  updateStreak(state);
  state.streakMultiplier = streakMultiplier(state.streak);
  const regenerated = ensureDailyMissions(state);
  if (regenerated) systemVoice.emit('Daily missions generated.');
}

function bindEvents() {
  dom.playerName.addEventListener('change', () => {
    state.player.name = dom.playerName.value.trim() || 'Cazador Arrows';
    persistAndRender();
  });

  dom.taskForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const title = dom.taskInput.value.trim();
    const xp = Number(dom.taskXpInput.value || 50);
    if (!title) return;
    addMission(state, title, xp);
    dom.taskInput.value = '';
    systemVoice.emit('Custom mission added.');
    persistAndRender();
  });

  dom.regenerateBtn.addEventListener('click', () => {
    state.lastMissionDate = null;
    initDaily();
    persistAndRender();
  });

  dom.missionList.addEventListener('click', (event) => {
    const item = event.target.closest('.mission-item');
    if (!item) return;
    const id = item.dataset.id;

    if (event.target.classList.contains('delete')) {
      deleteMission(state, id);
      systemVoice.emit('Mission deleted.', 'warn');
      persistAndRender();
    }

    if (event.target.classList.contains('edit')) {
      const mission = state.missions.find((m) => m.id === id);
      if (!mission) return;
      const title = prompt('Edit mission title:', mission.title);
      if (!title) return;
      const xp = Number(prompt('Edit XP reward:', String(mission.xp)) || mission.xp);
      editMission(state, id, title, xp);
      systemVoice.emit('Mission updated.');
      persistAndRender();
    }
  });

  dom.missionList.addEventListener('change', (event) => {
    if (!event.target.classList.contains('mission-toggle')) return;
    const item = event.target.closest('.mission-item');
    completeMission(item.dataset.id, event.target.checked);
  });

  dom.timerStart.addEventListener('click', () => {
    timer.setMinutes(Number(dom.timerMinutes.value || 25));
    timer.start();
    systemVoice.emit('Timer started.');
  });
  dom.timerPause.addEventListener('click', () => {
    timer.pause();
    systemVoice.emit('Timer paused.', 'warn');
  });
  dom.timerReset.addEventListener('click', () => {
    timer.setMinutes(Number(dom.timerMinutes.value || 25));
    timer.reset();
    systemVoice.emit('Timer reset.');
  });
}

let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  dom.installBtn.classList.remove('hidden');
});

dom.installBtn.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  dom.installBtn.classList.add('hidden');
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      await navigator.serviceWorker.register('./service-worker.js');
      systemVoice.emit('Offline core initialized.');
    } catch {
      systemVoice.emit('Service worker unavailable in this mode.', 'warn');
    }
  });
}

initDaily();
evaluateAchievements(state);
bindEvents();
persistAndRender();
systemVoice.emit('System synchronized. Welcome, Hunter.');
