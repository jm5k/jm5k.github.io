# 24-Hour Linear Clocks Suite
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Build: Static HTML5](https://img.shields.io/badge/Build-Static%20HTML5-lightgrey.svg)](https://jm5k.github.io/)
[![Made by jm5k](https://img.shields.io/badge/Made%20by-jm5k-00ffff.svg)](https://jm5k.github.io/)

A minimalist web-based clock that visualizes the entire day as a single horizontal line.  
Built by **[jm5k](https://jm5k.github.io/)** using pure HTML, CSS, and JavaScript — no frameworks, no dependencies, and no tracking.

---

## 🕐 Core Features
- Continuous 24-hour timeline  
- Quarter-hour and hour tick marks  
- Live time marker  
- Workday highlight (08:00–17:00)  
- Real-time stats for % of day elapsed and remaining time  
- Minimalist UI — no clutter, no distractions  

---

## ✅ Completed Updates
- 12-hour / 24-hour toggle  
- **Multi-Timezone Linear Clocks**  
- **FocusLine Pomodoro**  
  - Adjustable Work / Short Break / Long Break  
  - Auto-advance, optional chime, desktop notifications  
  - Daily focus minutes (local history)  
  - Keyboard shortcuts: `Space` (Start/Pause), `S` (Skip), `R` (Reset), `N` (Focus notes)  
  - **Local Time Bar** between timer and notes (day progress at a glance)  
  - **Capture Notes** module (local-only, searchable, reorderable, exportable)  
  - **Instructions** card clarifying Pomodoro usage & note-taking philosophy

---

## 🧭 Planned Updates
- Vertical layout option  
- Reversible marker direction  
- Workday progress tracking  
- Custom marker zones (breaks, focus blocks, etc.)  
- Color customization (accent and background themes)  
- (Optional) “Move to Tasks” export for checked notes at session end

---

## 🌍 Multi-Clock View

**Multi-Clock** shows multiple 24-hour timelines for different time zones — perfect for global teams or travel coordination.  
Each added clock renders directly below your local line with synchronized live updates.

### ✨ Highlights
- Full IANA timezone list with auto-detection and pinned favorites  
- Custom labels per clock (e.g., “London HQ · Europe/London”)  
- Minimalist design: thin nav line, subtle percentage labels, cyan accents  
- Lightweight: runs locally with 1-second updates, no libraries  
- Quick actions: add via dropdown, remove with ✕ or middle-click  

#### 🔗 Try it
➡️ **Multi-Clock View:** https://jm5k.github.io/multi-clock.html

---

## 🕒 FocusLine Pomodoro

**FocusLine** is a minimalist Pomodoro timer designed to complement the Linear Clock.  
It turns your work sessions into a calm, cyan progress bar — no accounts, no tracking.

### ✨ Features
- Adjustable **Work**, **Short Break**, **Long Break**, and **Cycles**  
- Auto-advance on completion (toggleable)  
- Optional chime and desktop notifications  
- **Keyboard shortcuts:**  
  - `Space` — Start / Pause  
  - `S` — Skip  
  - `R` — Reset  
  - `N` — Jump to notes  
- Daily focus minutes stored locally (rolling 7-day pruning)  
- Fully offline, privacy-friendly design

### 🧩 Local Time Bar
A thin linear clock placed between the timer and notes that shows **how far through the day you are**.  
It updates every second — perspective without pressure.

### 📝 Capture Notes (during focus)
When an idea pops up mid-focus, **don’t context-switch**. Jot it down fast, then get back to the task.  
This preserves flow now and gives you a clean queue for later.

**Notes tools:**
- Add via button or **Ctrl/Cmd+Enter** from the textarea  
- Insert timestamp (includes current phase)  
- Mark done, edit inline, **drag to reorder** or use ↑/↓  
- **Search** live filter  
- **Export** as `.txt` or `.json`  
- **Clear Done** or **Clear All**  
- Everything is saved **locally** in your browser (no sync/no tracking)

### 📖 Instructions (built-in)
A short, skimmable card under the Notes explains:
- How the timer works (durations, cycles, auto-advance, notifications)  
- How minutes are tallied for “Today”  
- The **note-taking philosophy** above, in plain English

#### 🔗 Try it
➡️ **FocusLine Pomodoro:** https://jm5k.github.io/focus.html

---

## 🗺️ Project Structure (static)
- `index.html` — Single 24-hour Linear Clock  
- `multi-clock.html` — Multi-timezone Linear Clocks  
- `focus.html` — FocusLine Pomodoro with Local Time Bar & Notes  
- `about.html` — Project overview, credits, and roadmap

---

## ☕ Support
If you enjoy the project and want to support future development:  
**Buy Me a Coffee:** https://www.buymeacoffee.com/jm5k

---

## 📬 Contact
📧 **jm5k_dev@pm.me**

---

© 2025 **jm5k** — Minimal time, maximum clarity.
