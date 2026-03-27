import { BASE_XP, XP_GROWTH, RANKS } from './constants.js';

export function xpRequired(level) {
  return Math.floor(BASE_XP * Math.pow(XP_GROWTH, level - 1));
}

export function resolveRank(level) {
  const best = [...RANKS].reverse().find((rank) => level >= rank.min);
  return best ? best.name : RANKS[0].name;
}

export function applyXp(state, gainedXp) {
  state.player.totalXp += gainedXp;
  state.player.currentXp += gainedXp;
  let needed = xpRequired(state.player.level);

  while (state.player.currentXp >= needed) {
    state.player.currentXp -= needed;
    state.player.level += 1;
    state.events.push({ type: 'levelUp', level: state.player.level });
    needed = xpRequired(state.player.level);
  }
}

export function increaseStat(state, statName, amount = 1) {
  if (!(statName in state.player.stats)) statName = 'discipline';
  state.player.stats[statName] += amount;
}
