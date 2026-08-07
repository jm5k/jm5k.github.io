# 🧭 Linear Clock Lab
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE) [![Build: Static HTML5](https://img.shields.io/badge/Build-Static%20HTML5-lightgrey.svg)](https://linearclocklab.com/) [![CSS](https://img.shields.io/badge/CSS-1572B6.svg?logo=css3&logoColor=white)](https://developer.mozilla.org/docs/Web/CSS) [![Made by jm5k](https://img.shields.io/badge/Made%20by-jm5k-00ffff.svg)](https://linearclocklab.com/)

A suite of minimalist, client-side time tools that visualize your day as a single continuous line — extended with timers, stopwatches, multi-timezone support, themes, and focus-tracking utilities.
Built by **[jm5k](https://linearclocklab.com/)** using pure HTML, CSS, and JavaScript — no frameworks, no dependencies, and no tracking.

The project uses a small hybrid foundation: stable design tokens and reused components live in `lcl.css`, pure multi-page time formatting lives in `lcl-time.js`, deterministic duration and date logic lives in narrow shared utilities, timezone conversion lives in `lcl-timezone.js`, shared timezone selector data lives in `lcl-timezone-select.js`, and each tool keeps its own inline layout and controller logic.
The suite is desktop-first while retaining its existing flexible layouts for narrower windows.

---

## 🔗 Live Demo
➡️ **Linear Clock Lab:** [https://linearclocklab.com/](https://linearclocklab.com/)
Explore the full suite — all pages load locally, with instant switching and zero backend dependencies.

---

## Local Use

No installation or build step is required. From the repository root, start a
simple static server:

```text
python -m http.server 8000
```

Then open `http://localhost:8000/`. Core calculations and saved preferences
remain in the browser; the site does not require a backend, analytics service,
or runtime network API.

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
- **Time Calculator** — intervals, elapsed durations, time shifts, and unit conversions
- **Date Calculator** — exact calendar shifts, date differences, weekdays, and patterns
- **Time Zone Converter** — dated conversions across IANA zones and daylight-saving changes
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
- **Time Calculator**
  - Complete-interval counts with remainders and exact totals
  - Same-day and midnight-crossing elapsed durations
  - Add/subtract time shifts with day offsets
  - Fixed-duration conversions from nanoseconds through weeks
  - Average Gregorian month, year, and decade conversions with approximation labels
- **Date Calculator**
  - Days before or after the current local calendar date
  - Signed date differences with weeks-and-days breakdowns
  - Exact day, week, month, and year calendar shifts
  - Day-of-week lookup and structured recurring pattern resolution through year 9999
  - Predictable clamp-to-valid-date behavior for month and year boundaries
- **Time Zone Converter**
  - Pinned and UTC-offset-sorted IANA timezone dropdowns shared with Multi-Clock
  - Past and future conversion using the selected source zone's actual dated offset
  - Previous-, same-, and next-day destination reporting
  - Explicit rejection of nonexistent DST times and earlier/later choice for ambiguous times
  - Instant-preserving zone Swap and reuse of the suite's saved 12/24-hour preference

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

## Time Calculator Overview
The **Time Calculator** provides four compact, instantly updating modes for
practical duration work: interval division, duration between times, adding or
subtracting durations, and conversion from nanoseconds through decades.
Nanoseconds through weeks use fixed ratios. Months, years, and decades use the
average Gregorian year of 365.2425 days and are marked approximate; they are not
calendar arithmetic. Calculations stay in the browser and do not persist input
data.

---

## Date Calculator Overview
The **Date Calculator** complements duration math with exact proleptic Gregorian
calendar operations. It uses timezone-safe date-only records for days from now,
date differences, calendar shifts, weekday lookup, and nth/last weekday
patterns. Month and year shifts retain the original day when possible and use a
clamp-to-valid-date rule otherwise, so January 31 plus one month becomes the
last valid day of February. Inputs are session-only and years 1 through 9999 are
supported.

---

## Time Zone Converter Overview
The **Time Zone Converter** converts a specific source wall-clock date and time
between real IANA time zones. Its From and To dropdowns reuse Multi-Clock's
pinned zones, readable labels, fallback list, offset sorting, and deduplication;
the labels use the selected conversion instant rather than today's offset.
`Intl.DateTimeFormat` supplies browser-native timezone rules and offsets; the
tool does not use fixed-offset tables, external APIs, location access, or
network requests. Source times are resolved by
round-tripping candidate instants through the selected zone, allowing DST gaps
to be rejected and ambiguous fall-back times to offer an explicit earlier or
later choice. Swap preserves the represented instant rather than merely
exchanging zone labels. Results are limited by the browser and operating
system's installed IANA timezone database.

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
- `time-calculator.html` — Time Calculator
- `date-calculator.html` — Date Calculator
- `time-zone-converter.html` — Time Zone Converter
- `dashboard.html` — Dashboard
- `todo.html` — To Do Lists
- `about.html` — Suite overview and license
- `lcl.css` — Shared design tokens and reusable UI foundations
- `lcl-time.js` — Pure shared clock-formatting utilities
- `lcl-duration.js` — BigInt-backed duration units, calculation, precision metadata, and formatting utilities
- `lcl-date.js` — Pure timezone-safe Gregorian date-only calculation and formatting utilities
- `lcl-timezone.js` — Pure Intl-backed IANA timezone resolution and conversion utilities
- `lcl-timezone-select.js` — Shared pinned, labelled, offset-sorted timezone selector data
- `todo.css` / `todo.js` — To Do Lists page assets
- `site.webmanifest` — Browser application metadata
- `sitemap.xml` — Public-page sitemap
- `robots.txt` — Minimal crawler policy and production sitemap location
- `tests/time-utils.test.js` — Shared time-formatting regression test
- `tests/duration-utils.test.js` — Duration calculation and validation regression test
- `tests/date-utils.test.js` — Gregorian date arithmetic, weekday, pattern, and validation regression test
- `tests/timezone-utils.test.js` — IANA conversion, offset, DST transition, and Swap regression test
- `tests/timezone-select-utils.test.js` — Shared timezone list, pinned group, label, and sorting regression test
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
node tests/duration-utils.test.js
node tests/date-utils.test.js
node tests/timezone-utils.test.js
node tests/timezone-select-utils.test.js
node tests/site-audit.test.js
node tests/docs-audit.test.js
```

The time utility tests protect shared clock formatting behavior, and the
duration utility tests protect interval, elapsed-time, time-shift, fixed and
Average Gregorian conversion, formatting, precision, and validation behavior.
The date utility tests protect timezone-safe date-only parsing, Gregorian leap
rules, calendar shifts, date differences, weekdays, recurrence patterns, and
invalid-input handling. The timezone utility tests protect dated IANA offsets,
date boundaries, fractional-hour zones, DST gap and overlap detection, and
instant-preserving Swap behavior. The selector utility tests protect the shared
supported list, pinned group, readable labels, offset sorting, deduplication,
and winter/summer label changes used by Multi-Clock and the converter. The site
audit protects public HTML publishing contracts: unique metadata, headings,
navigation, copyright, sitemap and robots coverage, exact hub discovery, local
links and assets, and shared script ordering. The documentation audit protects
documented architecture, file coverage, naming, and known stale claims.

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
