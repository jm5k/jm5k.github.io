// tf-balance.js
// All the tuning knobs for cross-tier feedback live here.
// You can safely tweak these numbers without touching the rest of the code.

export const FEEDBACK_CONFIG = {
  // T2 (Pressed Flux) → buffs T1 (Aeon Dust) base rate
  fluxToDust: {
    enabled: true,
    // Every X Flux ever generated...
    stepSize: 100, // e.g., every 100 Flux
    // ...adds this much permanent Dust/s to tier1BaseRate
    dustBonusPerStep: 0.05, // e.g., +0.05 Dust/s per step
  },

  // T3 (Chrono Bars) → buffs T2 automation rate
  barsToAuto: {
    enabled: true,
    // Every X Bars ever generated...
    stepSize: 20, // e.g., every 20 Bars
    // ...adds this much Auto Press per second
    autoBonusPerStep: 0.02, // e.g., +0.02 Auto Press/s per step
  },

  // T4 (Epoch Cores) → extends Time Surge duration
  epochsToSurge: {
    enabled: true,

    // Every X Epoch Cores ever generated…
    stepSize: 1, // 1 = every Epoch, 2 = every 2 Epochs, etc.

    // …adds this many seconds to Surge duration (per step).
    surgeDurationPerStep: 1.5,

    // If you later want a cap, we can add maxSurgeDuration here
    maxSurgeDuration: 60,
  },
};
