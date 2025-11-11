# Linear Clock Lab
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Build: Static HTML5](https://img.shields.io/badge/Build-Static%20HTML5-lightgrey.svg)](https://jm5k.github.io/)
[![Made by jm5k](https://img.shields.io/badge/Made%20by-jm5k-00ffff.svg)](https://jm5k.github.io/)

A minimalist web-based clock suite that visualizes time as a single continuous line — extended with multi-timezone and focus-tracking tools.  
Built by **[jm5k](https://jm5k.github.io/)** using pure HTML, CSS, and JavaScript — no frameworks, no dependencies, no tracking.

---

### 🔗 Live Demo
➡️ **Linear Clock:** https://jm5k.github.io/  
Visualize your day as one line — see progress, work hours, and time remaining at a glance.

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
- **12-hour / 24-hour toggle**  
- **Multi-Timezone Linear Clocks**  
- **FocusLine Pomodoro**  
  - Adjustable Work / Short Break / Long Break durations  
  - Auto-advance, optional chime, desktop notifications  
  - Daily focus minutes (local history)  
  - Keyboard shortcuts: `Space` (Start/Pause), `S` (Skip), `R` (Reset), `N` (Focus Notes)  
  - **Local Time Bar** between timer and notes (real-time day progress)  
  - **Capture Notes** module (local-only, searchable, reorderable, exportable)  
  - **Instructions Card** explaining Pomodoro usage and note-taking flow philosophy  
- **Unified Navigation Bar** across suite pages (active-page highlighting)

---

## 🧭 Planned Updates
- Vertical layout option  
- Reversible marker direction  
- Workday progress tracking  
- Custom marker zones (breaks, focus blocks, etc.)  
- Color customization (accent and background themes)  
- (Optional) “Move to Tasks” export for completed notes at session end  

---

## 🌍 Multi-Clock View
**Multi-Clock** displays multiple 24-hour timelines for different time zones — ideal for distributed teams, travel planning, or global collaboration.  
Each added clock updates in real time and can be labeled, reordered, or removed.

### ✨ Highlights
- Full IANA timezone list with pinned favorites  
- Custom labels per clock (e.g., “London HQ · Europe/London”)  
- Minimal design: thin nav line, subtle yellow percentages, cyan accents  
- Lightweight: runs locally, 1-second refresh rate  
- Quick actions: add via dropdown, remove with ✕ or middle-click  
- Drag-and-drop or ▲ / ▼ buttons for reordering  
- Labels editable inline with persistent localStorage saves  

#### 🔗 Try it
➡️ **Multi-Clock View:** https://jm5k.github.io/multi-clock.html  

---

## 🕒 FocusLine Pomodoro
**FocusLine** is a minimalist Pomodoro timer designed to complement the Linear Clock’s visual rhythm.  
Your focus sessions appear as a calm cyan bar — free from noise, accounts, or distractions.

### ✨ Features
- Adjustable **Work**, **Short Break**, **Long Break**, and **Cycle** durations  
- Auto-advance option and session chime  
- **Keyboard Shortcuts:**  
  - `Space` → Start / Pause  
  - `S` → Skip  
  - `R` → Reset  
  - `N` → Jump to Notes  
- Local focus time history for daily tracking  
- Privacy-first: runs offline, no telemetry  

### 🧩 Local Time Bar
A miniature linear clock between the timer and notes showing **day progression in real time**.  
It subtly reinforces awareness without pressure.

### 📝 Capture Notes (During Focus)
When ideas strike mid-session — **write, don’t switch**.  
Capture the thought instantly, then return to your focus. Process later.

**Tools:**
- Add notes via button or `Ctrl/Cmd+Enter`  
- Timestamped entries with phase markers  
- Mark done, edit inline, **drag to reorder**  
- Live search filter  
- Export as `.txt` or `.json`  
- Clear Done / Clear All  
- Saved locally — no cloud sync, no tracking  

### 📖 Instructions (Built-In)
Concise card at the bottom covers:
- Timer flow and controls  
- Minute-tracking logic  
- The “write-now, act-later” note philosophy  

#### 🔗 Try it
➡️ **FocusLine Pomodoro:** https://jm5k.github.io/focus.html  

---

## 🗺️ Project Structure (Static)
- `index.html` — Single 24-hour Linear Clock  
- `multi-clock.html` — Multi-timezone Linear Clocks  
- `focus.html` — FocusLine Pomodoro (with Local Time Bar & Notes)  
- `about.html` — Project overview, credits, and roadmap  

---

## ☕ Support
If you enjoy the project and want to support development:  
**Buy Me a Coffee →** https://www.buymeacoffee.com/jm5k  

---

## 📬 Contact
📧 **jm5k_dev@pm.me**

---

© 2025 **jm5k** — *Minimal time, maximum clarity.*
