export const SAVE_KEY = "TemporalForgeSave_v4";
export const DEV_MODE = true; // flip to false for production

// Economy: 60/60/12 pattern
export const TIER1_PER_TIER2 = 60; // Aeon Dust -> Pressed Flux
export const TIER2_PER_TIER3 = 60; // Pressed Flux -> Chrono Bars
export const TIER3_PER_TIER4 = 12; // Chrono Bars -> Epoch Cores

// Crits
export const CRIT_SMELT_CHANCE = 0.05;
export const CRIT_FORGE_CHANCE = 0.05;
export const CRIT_SMELT_MULTIPLIER = 3;
export const CRIT_FORGE_MULTIPLIER = 3;

// Time Surge
export const SURGE_MULTIPLIER = 3;
export const SURGE_DURATION = 20; // seconds
export const SURGE_COOLDOWN = 300; // seconds

// Machine unlock milestones (lifetime totals)
export const UNLOCK_FLUX_PRESS_T1 = 10000; // Aeon Dust
export const UNLOCK_CHRONO_FORGE_T2 = 1000; // Pressed Flux
export const UNLOCK_ARRAY_T3 = 100; // Chrono Bars
