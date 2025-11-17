import { SAVE_KEY } from "./tf-constants.js";
import { createInitialState } from "./tf-state.js";

export function loadState(appendLog) {
  let state = createInitialState();
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) {
      state.lastUpdate = Date.now();
      return state;
    }
    const data = JSON.parse(raw);
    state = {
      ...state,
      ...data,
      upgrades: { ...state.upgrades, ...(data.upgrades || {}) },
      totals: { ...state.totals, ...(data.totals || {}) },
      milestones: { ...state.milestones, ...(data.milestones || {}) },
      boosts: { ...state.boosts, ...(data.boosts || {}) },
      machines: { ...state.machines, ...(data.machines || {}) },
    };
    appendLog(
      `<span class="success">Loaded existing forge state.</span> You kept earning <span class="highlight">Aeon Dust</span> since your last visit.`
    );
  } catch (e) {
    console.error("Load error", e);
    appendLog(
      `<span class="danger">Save data corrupted.</span> A fresh forge has been initialized.`
    );
  } finally {
    state.lastUpdate = Date.now();
  }
  return state;
}

export function saveState(state, saveStatusEl) {
  try {
    const data = { ...state, lastUpdate: Date.now() };
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    if (saveStatusEl) {
      saveStatusEl.innerHTML = "Save: <span>OK</span>";
    }
  } catch (e) {
    console.error("Save error", e);
    if (saveStatusEl) {
      saveStatusEl.innerHTML =
        'Save: <span style="color:#ff4f4f">Error</span>';
    }
  }
}
