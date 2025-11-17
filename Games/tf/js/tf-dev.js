import { DEV_MODE } from "./tf-constants.js";
import { TIER1_PER_TIER2, TIER2_PER_TIER3, TIER3_PER_TIER4 } from "./tf-state.js";
import { appendLog as appendLogHelper } from "./tf-ui.js";

export function attachDevHotkeys(state, els, api) {
  document.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

    const key = e.key.toLowerCase();
    const code = e.code;

    if (DEV_MODE) {
      let cheated = false;
      const is1 = key === "1" || code === "Digit1" || code === "Numpad1";
      const is2 = key === "2" || code === "Digit2" || code === "Numpad2";
      const is3 = key === "3" || code === "Digit3" || code === "Numpad3";
      const is4 = key === "4" || code === "Digit4" || code === "Numpad4";

      if (is1) {
        state.tier1resource += 1000;
        state.totals.tier1Generated += 1000;
        appendLogHelper(els.logEl, `<span class="success">DEV:</span> Added <span class="highlight">1,000</span> Aeon Dust.`);
        cheated = true;
      } else if (is2) {
        state.tier2resource += 100;
        state.totals.tier2Generated += 100;
        appendLogHelper(els.logEl, `<span class="success">DEV:</span> Added <span class="highlight">100</span> Pressed Flux.`);
        cheated = true;
      } else if (is3) {
        state.tier3resource += 10;
        state.totals.tier3Generated += 10;
        appendLogHelper(els.logEl, `<span class="success">DEV:</span> Added <span class="highlight">10</span> Chrono Bars.`);
        cheated = true;
      } else if (is4) {
        state.tier4resource += 1;
        state.totals.tier4Generated += 1;
        appendLogHelper(els.logEl, `<span class="success">DEV:</span> Added <span class="highlight">1</span> Epoch Core.`);
        cheated = true;
      } else if (key === "b") {
        const surge = state.boosts.timeSurge;
        if (!surge.active) {
          surge.active = true;
          surge.remaining = api.SURGE_DURATION;
          surge.cooldown = 0;
          appendLogHelper(
            els.logEl,
            `<span class="highlight">DEV:</span> Time Surge <span class="success">forced ON</span>.`
          );
        } else {
          surge.active = false;
          surge.remaining = 0;
          surge.cooldown = 0;
          appendLogHelper(
            els.logEl,
            `<span class="highlight">DEV:</span> Time Surge <span class="danger">forced OFF</span>.`
          );
        }
        cheated = true;
      }

      if (cheated) {
        e.preventDefault();
        api.checkMilestones(state);
        api.updateAllUI(state);
        api.save();
        return;
      }
    }

    if (key === "s") {
      e.preventDefault();
      api.pressManual();
    } else if (key === "f") {
      e.preventDefault();
      api.forgeManual();
    }
  });
}
