export function drawRadarLikeChart(canvas, stats) {
  const ctx = canvas.getContext('2d');
  const values = Object.values(stats);
  const labels = Object.keys(stats);
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  const max = Math.max(10, ...values);
  const step = w / labels.length;

  ctx.strokeStyle = 'rgba(148,163,184,0.35)';
  ctx.fillStyle = 'rgba(56,189,248,0.22)';
  ctx.beginPath();
  values.forEach((v, i) => {
    const x = i * step + step / 2;
    const y = h - (v / max) * (h - 32) - 16;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  ctx.beginPath();
  values.forEach((v, i) => {
    const x = i * step + step / 2;
    const y = h - (v / max) * (h - 32) - 16;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.lineTo(w - step / 2, h - 12);
  ctx.lineTo(step / 2, h - 12);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#94a3b8';
  ctx.font = '11px sans-serif';
  labels.forEach((label, i) => {
    const x = i * step + 8;
    ctx.fillText(label.slice(0, 4).toUpperCase(), x, h - 2);
  });
}
