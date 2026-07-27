# 🧭 Linear Clock Lab
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE) [![Build: Static HTML5](https://img.shields.io/badge/Build-Static%20HTML5-lightgrey.svg)](https://linearclocklab.com/) [![CSS](https://img.shields.io/badge/CSS-1572B6.svg?logo=css3&logoColor=white)](https://developer.mozilla.org/docs/Web/CSS) [![Made by jm5k](https://img.shields.io/badge/Made%20by-jm5k-00ffff.svg)](https://linearclocklab.com/)

A suite of minimalist, client-side time tools that visualize your day as a single continuous line — extended with timers, stopwatches, multi-timezone support, themes, and focus-tracking utilities.
Built by **[jm5k](https://linearclocklab.com/)** using pure HTML, CSS, and JavaScript — no frameworks, no dependencies, and no tracking.

The project uses a small hybrid foundation: stable design tokens and reused components live in `lcl.css`, pure multi-page time formatting lives in `lcl-time.js`, and each tool keeps its own inline layout and controller logic.

---

## 🔗 Live Demo
➡️ **Linear Clock Lab:** [https://linearclocklab.com/](https://linearclocklab.com/)
Explore the full suite — all pages load locally, with instant switching and zero backend dependencies.

---

## 🕐 Core Tools
- **Main 24-Hour Linear Clock** — the day on one continuous rail
- **Minimal Clock** — configurable horizontal/vertical clock with forward/backward direction
- **Task Planner Linear Clock** — editable daily timeline zones and templates
- **Multi-Clock** — world-time tracking with reordering and JSON backup
- **Clock Colors / Preset Themes** — themed clock customization
- **FocusLine** — Pomodoro cycles, notes, and local focus tracking
- **Timer** — multiple persistent countdowns
- **Stopwatch** — multiple persistent elapsed-time tools
- **Dashboard** — configurable tile workspace
- **To Do Lists** — local planners and prioritized task boards

`index.html` is the suite's tool hub. Each public tool page has one compact,
accessible back-arrow control that returns to the hub. The suite shares a
consistent dark design and privacy-first, browser-local behavior.

---

## ✅ Completed Features
- Smooth cyan marker and clean gradient rail
- Quarter-hour and hour tick marks
- Real-time day elapsed, remaining, and time-left statistics
- Main, Minimal, and Preset Themes ordinal Julian dates in YYYY-DDD format (not astronomical Julian Day)
- 12-hour / 24-hour preferences where provided, saved in browser-local storage
- Work-hour emphasis from 08:00 through 17:00
- **Multi-Timezone Linear Clocks**
  - Add/remove clocks dynamically
  - Full IANA timezone dropdown
  - Label editing, reordering, export/import
  - Clear-all and auto-save features
- **FocusLine Pomodoro**
  - Adjustable intervals
  - Chime and desktop notifications
  - Notes capture, export, and search
  - Persistent local stats and timers
- **Clock Colors / Preset Themes**
  - Sixteen preset themes, custom colors, glow, and label offset
  - JSON import/export and instant theme switching
  - Top-oriented minimalist clock view with a settings gear and Julian YYYY-DDD statistic
- **Timer**
  - Multiple timers with editable labels and per-timer colors
  - Manual up/down ordering and sorting by time remaining
  - Completion sound, desktop notifications, and browser-local persistence
  - Paused after reload
- **Stopwatch**
  - Multiple stopwatches with editable labels and per-stopwatch colors
  - Sorting and browser-local persistence
  - MM:SS below one hour and HH:MM:SS at one hour and above
  - Paused after reload

---

## 🧭 Planned Updates
- Workday-only mode (% of workday elapsed/remaining)
- Custom marker zones for breaks and focus blocks
- Saved multi-clock groups (Engineering / Family / Travel)
- Global theme sync across all tools
- Stopwatch export logs

---

## ⏱️ Timer Overview
**Timer** lets you create, label, and manage multiple countdowns.
All data stays local — close or reload safely.

### ✨ Features
- Multiple timers with editable labels and per-timer colors
- Manual up/down ordering and sorting by time remaining
- Completion sound and optional desktop notifications
- Browser-local persistence; timers are paused after reload

---

## ⏳ Stopwatch Overview
A clean, responsive stopwatch that visualizes progress as a glowing line filling from left to right.

### ✨ Features
- Multiple stopwatches with editable labels and per-stopwatch colors
- Sorting, browser-local persistence, and paused-after-reload state
- MM:SS below one hour; HH:MM:SS at one hour and above
- Consistent design and navigation with other tools

---

## 🕒 FocusLine Overview
**FocusLine** ties your focus blocks to the real passage of time — combining Pomodoro cycles and note capture.
Privacy-first, backend-free, and client-side.

---

## 🌍 Multi-Clock Overview
View multiple timezones at a glance with synchronized linear progress bars.

---

## 🎨 Theme Editor Overview
The **Clock Colors / Preset Themes** page provides sixteen preset themes,
custom colors, glow, label offset, JSON import/export, and a top-oriented
clock-first view with all controls behind a settings gear. Its statistics row
also shows the ordinal Julian YYYY-DDD date.

---

## 🗺️ Project Structure
- `index.html` — Main 24-Hour Linear Clock and tool hub
- `clock.html` — Minimal Clock
- `task-planner-lc.html` — Task Planner Linear Clock
- `multi-clock.html` — Multi-Clock
- `clock_presets.html` — Clock Colors / Preset Themes
- `focus.html` — FocusLine
- `stopwatch.html` — Stopwatch
- `timer.html` — Timer
- `dashboard.html` — Dashboard
- `todo.html` — To Do Lists
- `about.html` — Suite overview and license
- `lcl.css` — Shared design tokens and reusable UI foundations
- `lcl-time.js` — Pure shared clock-formatting utilities
- `todo.css` / `todo.js` — To Do Lists page assets
- `site.webmanifest` — Browser application metadata
- `sitemap.xml` — Public-page sitemap
- `tests/time-utils.test.js` — Shared time-formatting regression test
- `tests/site-audit.test.js` — Sitemap-driven public HTML publishing-contract audit
- `tests/docs-audit.test.js` — Documentation architecture and stale-claim audit
- `agents.md` — Repository agent rules
- `ARCHITECTURE.md` — System architecture
- `COMPONENTS.md` — Component patterns
- `UI_RULES.md` — UI rules and design direction

---

## 🧪 Testing

Run the dependency-free Node checks directly:

```text
node tests/time-utils.test.js
node tests/site-audit.test.js
node tests/docs-audit.test.js
```

The time utility tests protect shared formatting behavior. The site audit
protects public HTML publishing contracts: metadata, navigation, copyright,
sitemap coverage, shared script ordering, and local assets. The documentation
audit protects documented architecture, file coverage, naming, and known stale
claims.

---

## ☕ Support
If you enjoy the Linear Clock Lab and want to support future updates:
**Buy Me a Coffee →** [https://www.buymeacoffee.com/jm5k](https://www.buymeacoffee.com/jm5k)

---

## 📬 Contact
📧 **jm5k_dev@pm.me**

---

## ⚖️ License
© 2025–2026 jm5k — Released under the [MIT License](https://linearclocklab.com/LICENSE).
Minimal time, maximum clarity.
[https://linearclocklab.com/](https://linearclocklab.com/)
