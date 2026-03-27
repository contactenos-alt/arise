import { resolveRank, xpRequired } from '../core/player.js';
import { calculateDailyProgress } from '../core/missions.js';
import { getShadowHabits } from '../core/shadows.js';
import { drawRadarLikeChart } from '../../components/chart.js';

export function renderAll(state, dom) {
  renderProfile(state, dom);
  renderDashboard(state, dom);
  renderMissions(state, dom);
  renderStats(state, dom);
  renderAchievements(state, dom);
  renderShadows(state, dom);
}

function renderProfile(state, dom) {
  dom.playerName.value = state.player.name;
  dom.levelText.textContent = `LV ${state.player.level}`;
  const needed = xpRequired(state.player.level);
  dom.xpText.textContent = `${state.player.currentXp} / ${needed} XP`;
  dom.xpBar.style.width = `${Math.min(100, (state.player.currentXp / needed) * 100)}%`;
  dom.rankBadge.textContent = `Rank: ${resolveRank(state.player.level)}`;
  dom.streakText.textContent = `Streak multiplier: x${state.streakMultiplier.toFixed(2)} (${state.streak} day streak)`;
}

function renderDashboard(state, dom) {
  dom.dailyProgress.textContent = `${calculateDailyProgress(state)}%`;
  dom.activeMissions.textContent = String(state.missions.filter((m) => !m.completed).length);
  dom.completedToday.textContent = String(state.missions.filter((m) => m.completed).length);
  dom.totalXp.textContent = String(state.player.totalXp);
  drawRadarLikeChart(dom.statsChart, state.player.stats);
}

function renderMissions(state, dom) {
  dom.missionList.innerHTML = '';
  state.missions.forEach((mission) => {
    const node = dom.missionTemplate.content.firstElementChild.cloneNode(true);
    node.dataset.id = mission.id;
    const toggle = node.querySelector('.mission-toggle');
    const title = node.querySelector('.mission-title');
    const xp = node.querySelector('.xp-pill');

    toggle.checked = mission.completed;
    title.textContent = mission.title;
    if (mission.completed) title.classList.add('done');
    xp.textContent = `+${mission.xp} XP`;

    dom.missionList.appendChild(node);
  });
}

function renderStats(state, dom) {
  dom.statsList.innerHTML = '';
  Object.entries(state.player.stats).forEach(([key, val]) => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${key[0].toUpperCase() + key.slice(1)}</span><strong>${val}</strong>`;
    dom.statsList.appendChild(li);
  });
}

function renderAchievements(state, dom) {
  dom.achievementList.innerHTML = '';
  state.achievements.forEach((a) => {
    const li = document.createElement('li');
    li.className = a.unlocked ? 'unlocked' : '';
    li.innerHTML = `<strong>${a.title}</strong><br><small>${a.unlocked ? 'Unlocked' : 'Locked'}</small>`;
    dom.achievementList.appendChild(li);
  });
}

function renderShadows(state, dom) {
  dom.shadowList.innerHTML = '';
  const shadows = getShadowHabits(state);
  if (!shadows.length) {
    dom.shadowList.innerHTML = '<li>No shadow habits yet.</li>';
    return;
  }

  shadows.forEach((shadow) => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${shadow.name}</strong><br><small>Level ${shadow.level} • Consistency ${shadow.consistency}% • Clears ${shadow.count}</small>`;
    dom.shadowList.appendChild(li);
  });
}
