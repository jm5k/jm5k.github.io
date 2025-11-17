import {
  TIER1_PER_TIER2,
  TIER2_PER_TIER3,
  TIER3_PER_TIER4,
  SURGE_MULTIPLIER,
  SURGE_DURATION,
  SURGE_COOLDOWN,
  UNLOCK_FLUX_PRESS_T1,
  UNLOCK_CHRONO_FORGE_T2,
  UNLOCK_ARRAY_T3,
} from "./tf-constants.js";

export function createInitialState() {
  return {
    // Core tier resources
    tier1resource: 0, // Aeon Dust
    tier2resource: 0, // Pressed Flux
    tier3resource: 0, // Chrono Bars
    tier4resource: 0, // Epoch Cores

    // Rates & multipliers
    tier1BaseRate: 1,
    tier1BonusRate: 0,
    tier2AutomationRate: 0, // presses/sec if enabled & enough tier1
    tier2AutomationEnabled: false,
    tier3Multiplier: 1,

    // Upgrades
    upgrades: {
      tier1generation: 0,
      tier2automation: 0,
      tier3efficiency: 0,
    },

    // Lifetime totals (used for milestones & unlocks)
    totals: {
      tier1Generated: 0,
      tier2Generated: 0,
      tier3Generated: 0,
      tier4Generated: 0,
    },

    // Milestones
    milestones: {
      tier1_10k: false,
      tier1_100k: false,
      tier1_1m: false,
      tier2_100: false,
      tier2_500: false,
      tier2_2k: false,
      tier3_10: false,
      tier3_50: false,
      tier3_200: false,
      tier4_1: false,
      tier4_3: false,
      tier4_10: false,
    },

    // Boosts
    boosts: {
      timeSurge: {
        active: false,
        remaining: 0,
        cooldown: 0,
      },
    },

    // Machine unlocks based on lifetime totals
    machines: {
      fluxPressUnlocked: false,
      chronoForgeUnlocked: false,
      arrayUnlocked: false,
    },

    lastUpdate: Date.now(),
  };
}

export function clampNonNegative(value) {
  return value < 0 ? 0 : value;
}

export function computeBaseOrePerSec(state) {
  return state.tier1BaseRate + state.tier1BonusRate;
}

export function computeEffectiveOrePerSec(state) {
  const base = computeBaseOrePerSec(state);
  const surgeMult = state.boosts.timeSurge.active ? SURGE_MULTIPLIER : 1;
  return base * surgeMult;
}

export function computeEffectiveAutoRate(state) {
  return state.tier2AutomationEnabled ? state.tier2AutomationRate : 0;
}

export function updateBoostTimers(state, deltaSeconds, appendLog) {
  const surge = state.boosts.timeSurge;
  if (surge.active) {
    surge.remaining -= deltaSeconds;
    if (surge.remaining <= 0) {
      surge.active = false;
      surge.remaining = 0;
      surge.cooldown = SURGE_COOLDOWN;
      appendLog(
        `<span class="highlight">Time Surge</span> has ended. Dust flow returns to normal.`
      );
    }
  } else if (surge.cooldown > 0) {
    surge.cooldown -= deltaSeconds;
    if (surge.cooldown < 0) surge.cooldown = 0;
  }
}

export function tickResources(state, deltaSeconds) {
  const orePerSec = computeEffectiveOrePerSec(state);
  const oreGain = orePerSec * deltaSeconds;
  state.tier1resource += oreGain;
  state.totals.tier1Generated += oreGain;

  const autoRate = computeEffectiveAutoRate(state);

  if (autoRate > 0 && state.tier1resource > 0) {
    const potentialPresses = autoRate * deltaSeconds;
    const maxByDust = state.tier1resource / TIER1_PER_TIER2;
    const presses = Math.min(potentialPresses, maxByDust);
    if (presses > 0) {
      state.tier1resource -= presses * TIER1_PER_TIER2;
      state.tier2resource += presses;
      state.totals.tier2Generated += presses;
    }
  }
}

export function randomChance(p) {
  return Math.random() < p;
}

export function updateMachineUnlocks(state) {
  const totals = state.totals;
  state.machines.fluxPressUnlocked =
    totals.tier1Generated >= UNLOCK_FLUX_PRESS_T1;
  state.machines.chronoForgeUnlocked =
    totals.tier2Generated >= UNLOCK_CHRONO_FORGE_T2;
  state.machines.arrayUnlocked = totals.tier3Generated >= UNLOCK_ARRAY_T3;
}

export {
  TIER1_PER_TIER2,
  TIER2_PER_TIER3,
  TIER3_PER_TIER4,
  SURGE_MULTIPLIER,
  SURGE_DURATION,
  SURGE_COOLDOWN,
};
