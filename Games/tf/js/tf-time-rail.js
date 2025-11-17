function formatTime(h, m, s) {
  const pad = (n) => String(n).padStart(2, "0");
  return pad(h) + ":" + pad(m) + ":" + pad(s);
}

export function computeDayRail(railFill, railMarker, railTimeLabel, railDayPercent, railRemaining) {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();
  const s = now.getSeconds();

  const secondsToday = h * 3600 + m * 60 + s;
  const total = 24 * 3600;
  const ratio = secondsToday / total;
  const percent = ratio * 100;

  if (railFill) {
    railFill.style.transform = `scaleX(${ratio})`;
  }
  if (railMarker) {
    railMarker.style.left = `${percent}%`;
  }

  if (railTimeLabel) {
    railTimeLabel.textContent = formatTime(h, m, s);
  }
  if (railDayPercent) {
    railDayPercent.textContent = "Day progress: " + percent.toFixed(1) + "%";
  }

  const remaining = total - secondsToday;
  const rh = Math.floor(remaining / 3600);
  const rm = Math.floor((remaining % 3600) / 60);
  const rs = remaining % 60;

  if (railRemaining) {
    railRemaining.textContent = "Remaining: " + formatTime(rh, rm, rs);
  }
}
