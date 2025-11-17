import {
  computeBaseOrePerSec,
} from "./tf-state.js";

// Upgrade definitions
export const upgradeDefs = {
  tier1generation: {
    baseCost: 120,
    costScale: 1.65,
    currency: "tier1", // Aeon Dust
    bonusPerLevel: 0.4, // +0.4 tier1/s
    label: "Aeon Dust",
  },
  tier2automation: {
    baseCost: 5,
    costScale: 2,
    currency: "tier2", // Pressed Flux
    bonusPerLevel: 0.2, // +0.2 Flux presses/s
    label: "Pressed Flux",
  },
  tier3efficiency: {
    baseCost: 10,
    costScale: 2.1,
    currency: "tier2", // Pressed Flux
    bonusPerLevel: 0.3, // +0.3x forge multiplier
    label: "Pressed Flux",
  },
};

export function computeUpgradeCost(id, level) {
  const def = upgradeDefs[id];
  if (!def) return 0;
  return Math.round(def.baseCost * Math.pow(def.costScale, level));
}

export function purchaseUpgrade(id, state, appendLog) {
  const def = upgradeDefs[id];
  if (!def) return;

  const level = state.upgrades[id] || 0;
  const cost = computeUpgradeCost(id, level);

  if (def.currency === "tier1") {
    if (state.tier1resource < cost) {
      appendLog(
        `<span class="danger">Not enough Aeon Dust</span> for Dust Collector upgrade.`
      );
      return;
    }
    state.tier1resource -= cost;
  } else if (def.currency === "tier2") {
    if (state.tier2resource < cost) {
      const label = id === "tier2automation" ? "Flux Automation" : "Forge Tuning";
      appendLog(
        `<span class="danger">Not enough Pressed Flux</span> for ${label}.`
      );
      return;
    }
    state.tier2resource -= cost;
  }

  state.upgrades[id] = level + 1;

  if (id === "tier1generation") {
    state.tier1BonusRate += def.bonusPerLevel;
    appendLog(
      `Upgrade: <span class="success">Dust Collector Overclock</span> → Dust rate boosted by <span class="highlight">${def.bonusPerLevel.toFixed(
        2
      )}/s</span>.`
    );
  } else if (id === "tier2automation") {
    state.tier2AutomationRate += def.bonusPerLevel;
    if (state.upgrades.tier2automation === 1 && state.tier2AutomationRate > 0) {
      state.tier2AutomationEnabled = true;
      appendLog(
        `Upgrade: <span class="success">Flux Press Automation</span> unlocked and <span class="highlight">enabled</span>. It now auto-presses Aeon Dust into Flux.`
      );
    } else {
      appendLog(
        `Upgrade: <span class="success">Flux Press Automation</span> → Auto press boosted by <span class="highlight">${def.bonusPerLevel.toFixed(
          2
        )} Flux/s</span>.`
      );
    }
  } else if (id === "tier3efficiency") {
    state.tier3Multiplier += def.bonusPerLevel;
    appendLog(
      `Upgrade: <span class="success">Chrono Forge Tuning</span> → Forge multiplier increased by <span class="highlight">${def.bonusPerLevel.toFixed(
        1
      )}x</span>.`
    );
  }
}
