export function createTimer(onTick, onFinish) {
  let total = 25 * 60;
  let remaining = total;
  let ref = null;

  const stop = () => {
    if (ref) clearInterval(ref);
    ref = null;
  };

  const tick = () => {
    remaining -= 1;
    onTick(remaining, total);
    if (remaining <= 0) {
      stop();
      onFinish();
    }
  };

  return {
    setMinutes(minutes) {
      total = minutes * 60;
      remaining = total;
      onTick(remaining, total);
    },
    start() {
      if (ref) return;
      ref = setInterval(tick, 1000);
    },
    pause() {
      stop();
    },
    reset() {
      stop();
      remaining = total;
      onTick(remaining, total);
    }
  };
}

export function formatClock(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}
