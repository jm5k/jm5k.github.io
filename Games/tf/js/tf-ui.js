import {
  computeBaseOrePerSec,
  computeEffectiveOrePerSec,
  computeEffectiveAutoRate,
  updateMachineUnlocks,
  TIER1_PER_TIER2,
  TIER2_PER_TIER3,
  TIER3_PER_TIER4,
  SURGE_MULTIPLIER,
} from "./tf-state.js";
import { upgradeDefs, computeUpgradeCost } from "./tf-upgrades.js";

export function bindElements() {
  return {
    // Resource UI
    t1El: document.getElementById("t1-count"),
    t2El: document.getElementById("t2-count"),
    t3El: document.getElementById("t3-count"),
    t4El: document.getElementById("t4-count"),
    t1RateEl: document.getElementById("t1-rate"),
    t1RateBoostEl: document.getElementById("t1-rate-boost"),
    t2RateEl: document.getElementById("t2-rate"),
    t3MultEl: document.getElementById("t3-mult"),
    logEl: document.getElementById("log"),
    saveStatusEl: document.getElementById("save-status"),

    // Buttons
    btnPress: document.getElementById("btn-press"),
    btnForge: document.getElementById("btn-forge"),
    btnEpoch: document.getElementById("btn-epoch"),
    btnTimeSurge: document.getElementById("btn-time-surge"),
    btnToggleAuto: document.getElementById("btn-toggle-auto"),
    resetBtn: document.getElementById("reset-save"),

    // Forge / Epoch stats
    forgeReadyEl: document.getElementById("forge-ready-count"),
    epochReadyEl: document.getElementById("epoch-ready-count"),
    timeSurgeStatusEl: document.getElementById("time-surge-status"),

    // Rail
    railFill: document.getElementById("rail-fill"),
    railMarker: document.getElementById("rail-marker"),
    railTimeLabel: document.getElementById("rail-time-label"),
    railDayPercent: document.getElementById("rail-day-percent"),
    railRemaining: document.getElementById("rail-remaining"),

    // Upgrades
    upgradesListEl: document.getElementById("upgrades-list"),

    // Resource pills
    pillT1: document.getElementById("pill-t1"),
    pillT2: document.getElementById("pill-t2"),
    pillT3: document.getElementById("pill-t3"),
    pillT4: document.getElementById("pill-t4"),

    // Machines (tags only; pills are found via closest())
    machinePressTag: document.getElementById("machine-press-tag"),
    machineForgeTag: document.getElementById("machine-forge-tag"),
    machineArrayTag: document.getElementById("machine-array-tag"),

    // Tier mystery hints
    tier2Hint: document.getElementById("tier2-hint"),
    tier3Hint: document.getElementById("tier3-hint"),
    tier4Hint: document.getElementById("tier4-hint"),
  };
}

export function appendLog(el, html) {
  if (!el) return;
  const line = document.createElement("div");
  line.className = "smelt-log-line";
  line.innerHTML = html;
  el.insertBefore(line, el.firstChild);
  while (el.children.length > 20) {
    el.removeChild(el.lastChild);
  }
}

function flashPill(el) {
  if (!el) return;
  el.classList.add("celebrate");
  setTimeout(() => el.classList.remove("celebrate"), 350);
}

function formatNumber(value) {
  const v = Math.floor(value + 1e-9);
  if (v < 1000) return v.toString();
  if (v < 1000000) return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return v.toExponential(2);
}

/**
 * Give the three core action buttons (Press / Forge / Epoch)
 * a consistent cyan "core action" look, including dimming when disabled.
 */
function styleCoreActionButtons(els) {
  const buttons = [els.btnPress, els.btnForge, els.btnEpoch];

  buttons.forEach((btn) => {
    if (!btn) return;

    btn.style.borderRadius = "999px";
    btn.style.boxSizing = "border-box";
    btn.style.transition =
      "box-shadow 0.18s ease, transform 0.12s ease, opacity 0.12s ease";

    if (btn.disabled) {
      btn.style.opacity = "0.45";
      btn.style.boxShadow =
        "0 0 0 1px rgba(0,255,255,0.18), 0 0 6px rgba(0,255,255,0.25)";
      btn.style.transform = "none";
    } else {
      btn.style.opacity = "1";
      btn.style.boxShadow =
        "0 0 0 1px rgba(0,255,255,0.25), 0 0 12px rgba(0,255,255,0.45)";
      // We leave hover to CSS, but this gives a solid base glow.
    }
  });
}

export function updateAutoSmelterToggleUI(state, els) {
  const level = state.upgrades.tier2automation || 0;
  if (!els.btnToggleAuto) return;
  if (level <= 0) {
    els.btnToggleAuto.disabled = true;
    els.btnToggleAuto.textContent = "Auto Press: Locked";
  } else {
    els.btnToggleAuto.disabled = false;
    els.btnToggleAuto.textContent = state.tier2AutomationEnabled
      ? "Auto Press: ON"
      : "Auto Press: OFF";
  }
}

export function updateUpgradesUI(state, els) {
  const listEl = els.upgradesListEl;
  if (!listEl) return;

  const machines = state.machines || {};

  const upgradeEls = listEl.querySelectorAll(".upgrade");
  upgradeEls.forEach((el) => {
    const id = el.getAttribute("data-upgrade-id");
    const def = upgradeDefs[id];
    if (!def) return;
    const level = state.upgrades[id] || 0;

    const cost = computeUpgradeCost(id, level);
    const costLabel = el.querySelector("[data-cost-label]");
    const levelLabel = el.querySelector("[data-level-label]");
    const button = el.querySelector("[data-upgrade-button]");

    if (costLabel) costLabel.textContent = `${cost} ${def.label}`;
    if (levelLabel) levelLabel.textContent = level;

    let affordable = false;
    if (def.currency === "tier1") {
      affordable = state.tier1resource >= cost;
    } else if (def.currency === "tier2") {
      affordable = state.tier2resource >= cost;
    }

    if (button) {
      // Core enable/disable logic
      button.disabled = !affordable;

      // Make all upgrade buttons visually consistent:
      // dim and soft when disabled, bright and glowy when affordable.
      button.style.transition =
        "opacity 0.16s ease, box-shadow 0.16s ease, transform 0.12s ease";

      if (button.disabled) {
        button.style.opacity = "0.45";
        button.style.boxShadow = "none";
        button.style.cursor = "default";
      } else {
        button.style.opacity = "1";
        button.style.cursor = "pointer";
        button.style.boxShadow =
          "0 0 0 1px rgba(0,255,255,0.25), 0 0 10px rgba(0,255,255,0.45)";
      }
    }

    // Tier gating on upgrades themselves
    if (id === "tier2automation") {
      // Only visible/usable once Flux Press is unlocked
      el.classList.toggle("tier-locked", !machines.fluxPressUnlocked);
    } else if (id === "tier3efficiency") {
      // Only visible/usable once Chrono Forge is unlocked
      el.classList.toggle("tier-locked", !machines.chronoForgeUnlocked);
    }
  });

  const baseOrePerSec = computeBaseOrePerSec(state);
  const boostedOrePerSec = computeEffectiveOrePerSec(state);

  if (els.t1RateEl) {
    els.t1RateEl.textContent = baseOrePerSec.toFixed(2) + " /s";
  }
  if (els.t1RateBoostEl) {
    if (state.boosts.timeSurge.active) {
      els.t1RateBoostEl.textContent = ` (BOOSTED → ${boostedOrePerSec.toFixed(
        2
      )} /s)`;
      els.t1RateBoostEl.style.color = "#00ffff";
    } else {
      els.t1RateBoostEl.textContent = "";
    }
  }

  const autoRate = computeEffectiveAutoRate(state);
  if (els.t2RateEl) {
    els.t2RateEl.textContent = autoRate.toFixed(2) + " /s";
  }
  if (els.t3MultEl) {
    els.t3MultEl.textContent = "x" + state.tier3Multiplier.toFixed(1);
  }

  updateAutoSmelterToggleUI(state, els);
}

export function updateForgeUI(state, els) {
  const possibleForges = Math.floor(state.tier2resource / TIER2_PER_TIER3);
  if (els.forgeReadyEl) {
    els.forgeReadyEl.textContent = possibleForges;
  }
  if (els.btnForge) {
    els.btnForge.disabled = possibleForges <= 0;
    els.btnForge.title = possibleForges
      ? `Forge Chrono Bars using ${TIER2_PER_TIER3} Pressed Flux. You can forge ${possibleForges} time(s) now.`
      : `Not enough Pressed Flux. Requires ${TIER2_PER_TIER3} Flux per Forge.`;
  }
}

export function updateEpochUI(state, els) {
  const possibleEpochs = Math.floor(state.tier3resource / TIER3_PER_TIER4);
  if (els.epochReadyEl) {
    els.epochReadyEl.textContent = possibleEpochs;
  }
  if (els.btnEpoch) {
    els.btnEpoch.disabled = possibleEpochs <= 0;
    els.btnEpoch.title = possibleEpochs
      ? `Cast an Epoch Core using ${TIER3_PER_TIER4} Chrono Bars. You can cast ${possibleEpochs} time(s) now.`
      : `Not enough Chrono Bars. Requires ${TIER3_PER_TIER4} Bars per Epoch Core.`;
  }
}

export function updateTimeSurgeUI(state, els) {
  const surge = state.boosts.timeSurge;
  if (!els.timeSurgeStatusEl || !els.btnTimeSurge) return;

  if (surge.active) {
    els.timeSurgeStatusEl.textContent =
      "Active (" + Math.ceil(surge.remaining) + "s)";
    els.btnTimeSurge.disabled = true;
  } else if (surge.cooldown > 0) {
    els.timeSurgeStatusEl.textContent =
      "Cooldown (" + Math.ceil(surge.cooldown) + "s)";
    els.btnTimeSurge.disabled = true;
  } else {
    els.timeSurgeStatusEl.textContent = "Ready";
    els.btnTimeSurge.disabled = false;
  }
}

export function updateMachineUI(state, els) {
  // Recompute machine unlocks based on lifetime totals
  updateMachineUnlocks(state);

  function wireMachine(unlocked, tagEl) {
    if (!tagEl) return;

    const pill = tagEl.closest(".machine-pill");

    // Tag text + classes
    tagEl.textContent = unlocked ? "Unlocked" : "Locked";
    tagEl.classList.toggle("unlocked", unlocked);
    tagEl.classList.toggle("locked", !unlocked);

    // Pill blur/lock classes (aligned with CSS `.machine-pill.locked`)
    if (pill) {
      pill.classList.toggle("locked", !unlocked);
      pill.classList.toggle("unlocked", unlocked);
    }
  }

  wireMachine(state.machines.fluxPressUnlocked, els.machinePressTag);
  wireMachine(state.machines.chronoForgeUnlocked, els.machineForgeTag);
  wireMachine(state.machines.arrayUnlocked, els.machineArrayTag);
}

/**
 * Tier-gate everything that isn't pure Dust:
 *  - Resource pills (T2/T3/T4)
 *  - Forge Core action rows + meta lines
 *  - Tier mystery hint lines
 */
function updateTierVisibility(state, els) {
  const machines = state.machines || {};

  // Resource pills: only Dust is always visible
  if (els.pillT2) {
    els.pillT2.classList.toggle("tier-locked", !machines.fluxPressUnlocked);
  }
  if (els.pillT3) {
    els.pillT3.classList.toggle("tier-locked", !machines.chronoForgeUnlocked);
  }
  if (els.pillT4) {
    els.pillT4.classList.toggle("tier-locked", !machines.arrayUnlocked);
  }

  // Forge Core action rows
  const fluxRow = els.btnPress ? els.btnPress.closest(".action-row") : null;
  const forgeRow = els.btnForge ? els.btnForge.closest(".action-row") : null;
  const epochRow = els.btnEpoch ? els.btnEpoch.closest(".action-row") : null;
  const autoRow = els.btnToggleAuto
    ? els.btnToggleAuto.closest(".action-row")
    : null;

  const forgeMeta = document.querySelector(".forge-meta");
  const epochMeta = document.querySelector(".epoch-meta");
  const autoMeta = document.querySelector(".auto-meta");

  // Tier II: Flux Press + Flux Automation
  const tier2Locked = !machines.fluxPressUnlocked;
  if (fluxRow) fluxRow.classList.toggle("tier-locked", tier2Locked);
  if (autoRow) autoRow.classList.toggle("tier-locked", tier2Locked);

  // Press button is hard-locked by the tier gate
  if (els.btnPress) {
    els.btnPress.disabled = tier2Locked;
  }

  // For Auto Press, still hard-lock while the tier is locked.
  // Once unlocked, updateAutoSmelterToggleUI() (called from updateUpgradesUI)
  // will manage its enabled/disabled state based on upgrade level.
  if (els.btnToggleAuto && tier2Locked) {
    els.btnToggleAuto.disabled = true;
  }

  // Tier III: Chrono Forge
  const tier3Locked = !machines.chronoForgeUnlocked;
  if (forgeRow) forgeRow.classList.toggle("tier-locked", tier3Locked);
  if (forgeMeta) forgeMeta.style.display = tier3Locked ? "none" : "block";
  if (tier3Locked && els.btnForge) els.btnForge.disabled = true;

  // Tier IV: Temporal Fabrication Array
  const tier4Locked = !machines.arrayUnlocked;
  if (epochRow) epochRow.classList.toggle("tier-locked", tier4Locked);
  if (epochMeta) epochMeta.style.display = tier4Locked ? "none" : "block";
  if (tier4Locked && els.btnEpoch) els.btnEpoch.disabled = true;

  // Auto-meta text only makes sense once Flux is a thing
  if (autoMeta) autoMeta.style.display = tier2Locked ? "none" : "block";

  // --- Tier mystery hints: hide once that tier is unlocked ---
  if (els.tier2Hint) {
    els.tier2Hint.style.display = machines.fluxPressUnlocked ? "none" : "block";
  }
  if (els.tier3Hint) {
    els.tier3Hint.style.display = machines.chronoForgeUnlocked
      ? "none"
      : "block";
  }
  if (els.tier4Hint) {
    els.tier4Hint.style.display = machines.arrayUnlocked ? "none" : "block";
  }
}

export function updateAllUI(state, els) {
  if (els.t1El) els.t1El.textContent = formatNumber(state.tier1resource);
  if (els.t2El) els.t2El.textContent = formatNumber(state.tier2resource);
  if (els.t3El) els.t3El.textContent = formatNumber(state.tier3resource);
  if (els.t4El) els.t4El.textContent = formatNumber(state.tier4resource);

  updateUpgradesUI(state, els);
  updateForgeUI(state, els);
  updateEpochUI(state, els);
  updateTimeSurgeUI(state, els);
  updateMachineUI(state, els);
  updateTierVisibility(state, els);

  // Ensure core action buttons share the same visual treatment
  styleCoreActionButtons(els);
}

export function checkMilestones(state, els, appendLogFn) {
  const t = state.totals;
  const m = state.milestones;

  if (!m.tier1_10k && t.tier1Generated >= 10000) {
    m.tier1_10k = true;
    state.tier1BonusRate += 0.5;
    flashPill(els.pillT1);
    appendLogFn(
      `<span class="success">Milestone unlocked:</span> Generated 10,000 Aeon Dust. Permanent Dust rate +<span class="highlight">0.5/s</span>.`
    );
  }
  if (!m.tier1_100k && t.tier1Generated >= 100000) {
    m.tier1_100k = true;
    state.tier1BonusRate += 1.0;
    flashPill(els.pillT1);
    appendLogFn(
      `<span class="success">Milestone unlocked:</span> Generated 100,000 Aeon Dust. Permanent Dust rate +<span class="highlight">1.0/s</span>.`
    );
  }
  if (!m.tier1_1m && t.tier1Generated >= 1000000) {
    m.tier1_1m = true;
    state.tier1BonusRate += 2.0;
    flashPill(els.pillT1);
    appendLogFn(
      `<span class="success">Milestone unlocked:</span> Generated 1,000,000 Aeon Dust. Permanent Dust rate +<span class="highlight">2.0/s</span>.`
    );
  }

  if (!m.tier2_100 && t.tier2Generated >= 100) {
    m.tier2_100 = true;
    state.tier2AutomationRate += 0.1;
    flashPill(els.pillT2);
    appendLogFn(
      `<span class="success">Milestone unlocked:</span> Pressed 100 Flux. Auto Press +<span class="highlight">0.10/s</span>.`
    );
  }
  if (!m.tier2_500 && t.tier2Generated >= 500) {
    m.tier2_500 = true;
    state.tier2AutomationRate += 0.2;
    flashPill(els.pillT2);
    appendLogFn(
      `<span class="success">Milestone unlocked:</span> Pressed 500 Flux. Auto Press +<span class="highlight">0.20/s</span>.`
    );
  }
  if (!m.tier2_2k && t.tier2Generated >= 2000) {
    m.tier2_2k = true;
    state.tier2AutomationRate += 0.4;
    flashPill(els.pillT2);
    appendLogFn(
      `<span class="success">Milestone unlocked:</span> Pressed 2,000 Flux. Auto Press +<span class="highlight">0.40/s</span>.`
    );
  }

  if (!m.tier3_10 && t.tier3Generated >= 10) {
    m.tier3_10 = true;
    state.tier3Multiplier += 0.3;
    flashPill(els.pillT3);
    appendLogFn(
      `<span class="success">Milestone unlocked:</span> Forged 10 Chrono Bars. Forge multiplier +<span class="highlight">0.3x</span>.`
    );
  }
  if (!m.tier3_50 && t.tier3Generated >= 50) {
    m.tier3_50 = true;
    state.tier3Multiplier += 0.5;
    flashPill(els.pillT3);
    appendLogFn(
      `<span class="success">Milestone unlocked:</span> Forged 50 Chrono Bars. Forge multiplier +<span class="highlight">0.5x</span>.`
    );
  }
  if (!m.tier3_200 && t.tier3Generated >= 200) {
    m.tier3_200 = true;
    state.tier3Multiplier += 1.0;
    flashPill(els.pillT3);
    appendLogFn(
      `<span class="success">Milestone unlocked:</span> Forged 200 Chrono Bars. Forge multiplier +<span class="highlight">1.0x</span>.`
    );
  }

  if (!m.tier4_1 && t.tier4Generated >= 1) {
    m.tier4_1 = true;
    state.tier1BaseRate += 0.5;
    flashPill(els.pillT4);
    appendLogFn(
      `<span class="success">Epoch Milestone:</span> 1 Epoch Core forged. Base Dust rate +<span class="highlight">0.5/s</span>.`
    );
  }
  if (!m.tier4_3 && t.tier4Generated >= 3) {
    m.tier4_3 = true;
    state.tier1BaseRate += 1.0;
    state.tier2AutomationRate += 0.2;
    flashPill(els.pillT4);
    appendLogFn(
      `<span class="success">Epoch Milestone:</span> 3 Epoch Cores forged. Base Dust rate +<span class="highlight">1.0/s</span>, Auto Press +<span class="highlight">0.2/s</span>.`
    );
  }
  if (!m.tier4_10 && t.tier4Generated >= 10) {
    m.tier4_10 = true;
    state.tier3Multiplier += 1.5;
    flashPill(els.pillT4);
    appendLogFn(
      `<span class="success">Epoch Milestone:</span> 10 Epoch Cores forged. Forge multiplier +<span class="highlight">1.5x</span>.`
    );
  }
}
