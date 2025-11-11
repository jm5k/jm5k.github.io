# 🧭 Linear Clock Lab
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE) [![Build: Static HTML5](https://img.shields.io/badge/Build-Static%20HTML5-lightgrey.svg)](https://jm5k.github.io/) [![Made by jm5k](https://img.shields.io/badge/Made%20by-jm5k-00ffff.svg)](https://jm5k.github.io/)

A suite of minimalist, client-side time tools that visualize your day as a single continuous line — extended with multi-timezone, theme, and focus-tracking utilities.  
Built by **[jm5k](https://jm5k.github.io/)** using pure HTML, CSS, and JavaScript — no frameworks, no dependencies, and no tracking.

---

## 🔗 Live Demo
➡️ **Linear Clock Lab:** [https://jm5k.github.io/](https://jm5k.github.io/)  
View and explore the entire suite — all pages load locally, with instant switching and no backend dependencies.

---

## 🕐 Core Tools
- **24-Hour Linear Clock** — your full day on one line  
- **Minimal View** — compact version of the main clock  
- **Multi Clocks** — world-time tracking with drag/drop reordering  
- **Color Theme Clocks** — fully customizable theme and glow presets  
- **FocusLine Pomodoro** — timeboxing with live local-day awareness  

All components share the same **unified navigation bar**, **visual style**, and **privacy-first design**.

---

## ✅ Completed Features
- Clean gray rail with subtle inset glow and cyan live marker  
- Quarter-hour and hour tick marks with smooth updates  
- 12-hour / 24-hour toggle (persisted with `localStorage`)  
- Workday highlight band (08:00–17:00)  
- Real-time stats for % of day elapsed and remaining  
- Multi-Timezone Linear Clocks  
  - Add/remove clocks dynamically  
  - Inline label editing  
  - Full IANA timezone dropdown  
  - Drag-and-drop and ▲ / ▼ ordering  
  - JSON Export / Import for clock sets  
  - Clear-All option for quick reset  
- **FocusLine Pomodoro**
  - Adjustable Work / Short / Long Break durations  
  - Auto-advance, optional chime, and desktop notifications  
  - Daily total minutes (local history)  
  - Built-in **Local Time Bar** showing day progress  
  - Notes capture system with export and search  
  - Clear Done / Clear All / local persistence  
- **Color Theme Clocks**
  - Collapsible Customization Panel (🎨 section)  
  - Real-time color pickers for all major UI elements  
  - Live preview while editing  
  - Custom glow slider  
  - Local save of all color and glow settings  
  - One-click Export / Import of theme JSON  
  - Automatic theme switching without residual overrides  
  - Full preset reset and reseed behavior  
  - Persistent panel open/closed state  

---

## 🧭 Planned Updates
- Vertical layout and reversible marker direction  
- Workday-only mode (% of workday elapsed / remaining)  
- Custom marker zones for breaks, events, or focus blocks  
- Optional export integration (e.g., “Move to Tasks” for FocusLine)  
- Saved multi-clock groups (Engineering / Family / Travel, etc.)  
- Global theme sync across all clock views  

---

## 🕒 FocusLine Overview
**FocusLine** ties your focus blocks to the real passage of time.  
No accounts. No analytics. Just pure flow.

### ✨ Features
- Adjustable Pomodoro-style phases  
- Optional chime + desktop notifications  
- Built-in local linear clock  
- Capture Notes section (local-only)
  - Timestamped, reorderable, searchable  
  - Export as `.txt` or `.json`  
- Keyboard shortcuts:  
  - `Space` → Start / Pause  
  - `S` → Skip  
  - `R` → Reset  
  - `N` → Jump to Notes  

### 🧩 Note Philosophy
Ideas deserve capture, not interruption.  
Write fast, stay focused, act later.

---

## 🌍 Multi-Clock Overview
Visualize time across the world in a clean, single-line view.

### ✨ Highlights
- Add, label, and reorder timezones  
- Inline editing and auto-save  
- Lightweight, 1s update rate  
- Minimal design: subtle yellow percentages, cyan accents  
- Local-only persistence — no cookies, no sync  
- Export / Import for saved clock setups  

---

## 🎨 Theme Editor Overview
The **Color Theme Clock** brings full visual customization to the suite.  
Every accent, background, and glow element can be tuned and saved locally.

### ✨ Features
- Collapsible customization section for a clean interface  
- Interactive color pickers (no hex code knowledge needed)  
- Real-time preview for all color attributes and glow strength  
- Preset themes: TechnoLust, Midnight, Vaporwave, Terminal, Amber, and more  
- Automatic preset switching without lingering overrides  
- Reset button to restore the original preset instantly  
- Local persistence across sessions  
- One-click **Export / Import** of your entire theme setup  
- Compatible with future preset updates  

This system uses a hybrid model of CSS variable updates and localStorage persistence — ensuring that every change is instant, reversible, and private.

---

## 🗺️ Project Structure
- `index.html` — 24-hour Linear Clock (main view)  
- `clock.html` — Minimal View  
- `multi-clock.html` — Multi-Timezone Clocks  
- `focus.html` — FocusLine Pomodoro with Notes  
- `about.html` — Suite overview, roadmap, and license info  
- `clock_presets.html` — Theme and color variant presets  

---

## ☕ Support
If you enjoy the Linear Clock Lab and want to support future updates:  
**Buy Me a Coffee →** [https://www.buymeacoffee.com/jm5k](https://www.buymeacoffee.com/jm5k)

---

## 📬 Contact
📧 **jm5k_dev@pm.me**

---

## ⚖️ License
© 2025 **jm5k** — Released under the [MIT License](https://github.com/jm5k/jm5k.github.io/blob/main/LICENSE).  
Minimal time, maximum clarity.  
[https://jm5k.github.io/](https://jm5k.github.io/)
