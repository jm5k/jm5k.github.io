import { DEV_MODE, SURGE_DURATION } from "./tf-constants.js";
import {
  createInitialState,
  tickResources,
  updateBoostTimers,
  TIER1_PER_TIER2,
  TIER2_PER_TIER3,
  TIER3_PER_TIER4,
} from "./tf-state.js";
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
  // ✅ NEW: Respect machine unlock state
  if (!state.machines || !state.machines.fluxPressUnlocked) {
    if (manual) {
      appendLogBound(
        `<span class="danger">Flux Press is still locked.</span> Tier II systems are not online yet.`
      );
    }
    return false;
  }

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
  const gained = baseBars;

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

function updateMachineUI() {
  const dustPill = document.getElementById("machine-dust");
  const dustTag = document.getElementById("machine-dust-tag");
  const pressPill = document.getElementById("machine-press");
  const pressTag = document.getElementById("machine-press-tag");
  const forgePill = document.getElementById("machine-forge");
  const forgeTag = document.getElementById("machine-forge-tag");
  const arrayPill = document.getElementById("machine-array");
  const arrayTag = document.getElementById("machine-array-tag");

  const machines = state.machines || {
    dustUnlocked: true,
    pressUnlocked: false,
    forgeUnlocked: false,
    arrayUnlocked: false,
  };

  function applyMachineState(unlocked, pillEl, tagEl) {
    if (!pillEl || !tagEl) return;

    pillEl.classList.toggle("locked", !unlocked);
    pillEl.classList.toggle("unlocked", unlocked);

    tagEl.classList.toggle("locked", !unlocked);
    tagEl.classList.toggle("unlocked", unlocked);
    tagEl.textContent = unlocked ? "Unlocked" : "Locked";
  }

  applyMachineState(machines.dustUnlocked, dustPill, dustTag);
  applyMachineState(machines.pressUnlocked, pressPill, pressTag);
  applyMachineState(machines.forgeUnlocked, forgePill, forgeTag);
  applyMachineState(machines.arrayUnlocked, arrayPill, arrayTag);

  const orePill = document.getElementById("pill-ore");
  const fluxPill = document.getElementById("pill-alloy");
  const barPill = document.getElementById("pill-bar");
  const epochPill = document.getElementById("pill-epoch");

  if (orePill) orePill.classList.remove("tier-locked");

  if (fluxPill) {
    fluxPill.classList.toggle("tier-locked", !machines.pressUnlocked);
  }
  if (barPill) {
    barPill.classList.toggle("tier-locked", !machines.forgeUnlocked);
  }
  if (epochPill) {
    epochPill.classList.toggle("tier-locked", !machines.arrayUnlocked);
  }
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
    updateMachineUI();
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
  updateMachineUI();
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

// =========================
// DEV CHEATS (keyboard)
// =========================
document.addEventListener("keydown", (e) => {
  if (!DEV_MODE) return;

  const tag = e.target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA") return;

  const key = e.key.toLowerCase();
  const code = e.code;

  const is1 = key === "1" || code === "Digit1" || code === "Numpad1";
  const is2 = key === "2" || code === "Digit2" || code === "Numpad2";
  const is3 = key === "3" || code === "Digit3" || code === "Numpad3";
  const is4 = key === "4" || code === "Digit4" || code === "Numpad4";

  let cheated = false;

  if (is1) {
    state.tier1resource += 1000;
    state.totals.tier1Generated += 1000;
    appendLog(
      els.logEl,
      `<span class="success">DEV:</span> Added <span class="highlight">1,000</span> Aeon Dust.`
    );
    cheated = true;
  } else if (is2) {
    state.tier2resource += 100;
    state.totals.tier2Generated += 100;
    appendLog(
      els.logEl,
      `<span class="success">DEV:</span> Added <span class="highlight">100</span> Pressed Flux.`
    );
    cheated = true;
  } else if (is3) {
    state.tier3resource += 10;
    state.totals.tier3Generated += 10;
    appendLog(
      els.logEl,
      `<span class="success">DEV:</span> Added <span class="highlight">10</span> Chrono Bars.`
    );
    cheated = true;
  } else if (is4) {
    state.tier4resource += 1;
    state.totals.tier4Generated += 1;
    appendLog(
      els.logEl,
      `<span class="success">DEV:</span> Added <span class="highlight">1</span> Epoch Core.`
    );
    cheated = true;
  }

  if (cheated) {
    e.preventDefault();
    checkMilestones(state, els, (msg) => appendLog(els.logEl, msg));
    updateAllUI(state, els);
    updateMachineUI();
    saveState(state, els.saveStatusEl);
  }
});

init();
