import { DEV_MODE, SURGE_DURATION } from "./tf-constants.js";
import { createInitialState, tickResources, updateBoostTimers } from "./tf-state.js";
import { loadState, saveState } from "./tf-storage.js";
import { computeDayRail } from "./tf-time-rail.js";
import {
  bindElements,
  appendLog,
  updateAllUI,
  checkMilestones,
  updateForgeUI,
  updateEpochUI,
  updateTimeSurgeUI,
} from "./tf-ui.js";
import { purchaseUpgrade } from "./tf-upgrades.js";
import { attachDevHotkeys } from "./tf-dev.js";
import {
  TIER1_PER_TIER2,
  TIER2_PER_TIER3,
  TIER3_PER_TIER4,
} from "./tf-state.js";

const els = bindElements();

function appendLogBound(html) {
  appendLog(els.logEl, html);
}

let state = loadState(appendLogBound);

function resetState() {
  localStorage.removeItem("TemporalForgeSave_v4");
  state = createInitialState();
  appendLogBound(
    `<span class="danger">Forge reset.</span> All resources, milestones, and upgrades cleared.`
  );
  updateAllUI(state, els);
  saveState(state, els.saveStatusEl);
}

function pressFlux(manual = true) {
  if (state.tier1resource < TIER1_PER_TIER2) {
    if (manual) {
      appendLogBound(
        `<span class="danger">Not enough Aeon Dust</span> — need ${TIER1_PER_TIER2} to press.`
      );
    }
    return false;
  }
  state.tier1resource -= TIER1_PER_TIER2;
  state.tier2resource += 1;
  state.totals.tier2Generated += 1;

  appendLogBound(
    `Manual press: <span class="highlight">${TIER1_PER_TIER2}</span> Aeon Dust → <span class="success">1 Pressed Flux</span>.`
  );

  checkMilestones(state, els, appendLogBound);
  updateAllUI(state, els);
  saveState(state, els.saveStatusEl);
  return true;
}

function forgeBars(manual = true) {
  if (state.tier2resource < TIER2_PER_TIER3) {
    if (manual) {
      appendLogBound(
        `<span class="danger">Not enough Pressed Flux</span> — need ${TIER2_PER_TIER3} Flux to forge.`
      );
    }
    updateForgeUI(state, els);
    return false;
  }

  state.tier2resource -= TIER2_PER_TIER3;

  const baseBars = 1 * state.tier3Multiplier;
  let gained = baseBars;

  state.tier3resource += gained;
  state.totals.tier3Generated += gained;

  appendLogBound(
    `Forge action: <span class="highlight">${TIER2_PER_TIER3}</span> Flux → <span class="success">${gained.toFixed(
      1
    )} Chrono Bars</span>.`
  );

  checkMilestones(state, els, appendLogBound);
  updateAllUI(state, els);
  saveState(state, els.saveStatusEl);
  return true;
}

function forgeEpochCore(manual = true) {
  if (state.tier3resource < TIER3_PER_TIER4) {
    if (manual) {
      appendLogBound(
        `<span class="danger">Not enough Chrono Bars</span> — need ${TIER3_PER_TIER4} Bars to cast an Epoch Core.`
      );
    }
    updateEpochUI(state, els);
    return false;
  }

  state.tier3resource -= TIER3_PER_TIER4;
  state.tier4resource += 1;
  state.totals.tier4Generated += 1;

  appendLogBound(
    `Epoch Crucible: <span class="highlight">${TIER3_PER_TIER4}</span> Chrono Bars → <span class="success">1 Epoch Core</span>.`
  );

  checkMilestones(state, els, appendLogBound);
  updateAllUI(state, els);
  saveState(state, els.saveStatusEl);
  return true;
}

function activateTimeSurge() {
  const surge = state.boosts.timeSurge;
  if (surge.active || surge.cooldown > 0) return;

  surge.active = true;
  surge.remaining = SURGE_DURATION;
  surge.cooldown = 0;

  appendLogBound(
    `<span class="highlight">Time Surge activated.</span> Dust flow increased by <span class="success">+300%</span> for ${SURGE_DURATION} seconds.`
  );
  updateTimeSurgeUI(state, els);
  saveState(state, els.saveStatusEl);
}

function toggleAutoPress() {
  const level = state.upgrades.tier2automation || 0;
  if (level <= 0) return;
  state.tier2AutomationEnabled = !state.tier2AutomationEnabled;
  appendLogBound(
    `Flux Automation ${
      state.tier2AutomationEnabled
        ? '<span class="success">enabled</span>.'
        : '<span class="danger">disabled</span>.'
    }`
  );
  updateAllUI(state, els);
  saveState(state, els.saveStatusEl);
}

function setupEvents() {
  if (els.btnPress) {
    els.btnPress.addEventListener("click", () => pressFlux(true));
  }
  if (els.btnForge) {
    els.btnForge.addEventListener("click", () => forgeBars(true));
  }
  if (els.btnEpoch) {
    els.btnEpoch.addEventListener("click", () => forgeEpochCore(true));
  }
  if (els.btnTimeSurge) {
    els.btnTimeSurge.addEventListener("click", () => activateTimeSurge());
  }
  if (els.btnToggleAuto) {
    els.btnToggleAuto.addEventListener("click", () => toggleAutoPress());
  }
  if (els.resetBtn) {
    els.resetBtn.addEventListener("click", () => {
      if (
        confirm(
          "Reset Temporal Forge? This clears all resources, milestones, and upgrades."
        )
      ) {
        resetState();
      }
    });
  }

  if (els.upgradesListEl) {
    els.upgradesListEl.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-upgrade-button]");
      if (!btn) return;
      const upgradeEl = btn.closest(".upgrade");
      if (!upgradeEl) return;
      const id = upgradeEl.getAttribute("data-upgrade-id");
      purchaseUpgrade(id, state, appendLogBound);
      updateAllUI(state, els);
      saveState(state, els.saveStatusEl);
    });
  }

  attachDevHotkeys(state, els, {
    SURGE_DURATION,
    updateAllUI: (s) => updateAllUI(s, els),
    checkMilestones: (s) => checkMilestones(s, els, appendLogBound),
    save: () => saveState(state, els.saveStatusEl),
    pressManual: () => pressFlux(true),
    forgeManual: () => forgeBars(true),
  });

  window.addEventListener("beforeunload", () =>
    saveState(state, els.saveStatusEl)
  );
}

function gameLoop() {
  const now = Date.now();
  const deltaMs = now - state.lastUpdate;
  state.lastUpdate = now;

  const deltaSeconds = Math.max(0, deltaMs / 1000);
  if (deltaSeconds > 0) {
    tickResources(state, deltaSeconds);
    updateBoostTimers(state, deltaSeconds, appendLogBound);
    checkMilestones(state, els, appendLogBound);
    updateAllUI(state, els);
    saveState(state, els.saveStatusEl);
  }

  computeDayRail(
    els.railFill,
    els.railMarker,
    els.railTimeLabel,
    els.railDayPercent,
    els.railRemaining
  );

  requestAnimationFrame(gameLoop);
}

function init() {
  setupEvents();
  updateAllUI(state, els);
  computeDayRail(
    els.railFill,
    els.railMarker,
    els.railTimeLabel,
    els.railDayPercent,
    els.railRemaining
  );
  if (els.saveStatusEl) {
    els.saveStatusEl.innerHTML = "Save: <span>Ready</span>";
  }
  appendLogBound(
    `Temporal Forge initialized. Aeon Dust → Pressed Flux → Chrono Bars → Epoch Cores.`
  );
  requestAnimationFrame(gameLoop);
}

init();
