# Linear Clock Lab — Architecture Overview

This document defines the full technical architecture of Linear Clock Lab (LCL), detailing how every component, page, style pattern, script pattern, and UX structure fits together into one cohesive system. It serves as the master reference for all agents and future development.

LCL is a suite of standalone, static HCJ (HTML/CSS/JavaScript) applications unified by:

- A strict dark-only theme
- A consistent token-based design system
- A shared interaction philosophy
- A hub-and-spoke navigation model
- Backend-free, client-side, and local-first operation
- No runtime JavaScript or CSS library dependencies

This overview documents the internal structure, module behaviors, responsibilities, and rules that govern the entire LCL ecosystem.

---

# 1. High-Level System Architecture

LCL consists of:

- A central hub: `index.html`
- Multiple independent tool pages
- A shared CSS foundation (`lcl.css`) for stable tokens and reused components
- A narrow shared time-formatting utility (`lcl-time.js`)
- A pure duration-calculation utility (`lcl-duration.js`)
- A pure Gregorian date-only utility (`lcl-date.js`)
- A pure IANA timezone utility (`lcl-timezone.js`)
- Shared timezone selector data (`lcl-timezone-select.js`)
- Page-specific inline CSS and controller JS
- A small shared image/profile resource
- A consistent SEO + metadata layer
- A theme system powered by CSS variables
- LocalStorage-driven user preferences

There is **no build system**, **no bundler**, and **no framework**. Core
behavior uses browser-native HCJ with no remote JavaScript or CSS libraries,
analytics, or tracking. The suite is locally serveable; it does not claim
service-worker caching or guaranteed offline installation. External hyperlinks
and decorative remote images may exist without being required for core behavior.

---

# 2. Navigation Model (Hub-and-Spoke)

LCL uses a deliberately simple navigation architecture:

1.  **index.html = the hub**  
    Lists all tools using a `.grid` of `.card` links.  
    Contains full SEO sharing metadata.

2.  **All other public pages = spokes**
    Each public non-index page includes exactly one dedicated home control:

        <nav class="lcl-back-nav" aria-label="Return">
            <a
                href="index.html"
                class="lcl-back-link"
                aria-label="Back to Linear Clock Lab"
                title="Back to Linear Clock Lab"
            >&larr;</a>
        </nav>

The intention is:

- Predictability
- Zero nav clutter inside tools
- Users always return to the hub after completing a task
- No cross-linking among tools
- Shared anchor presentation through `.lcl-back-link`
- Page-specific navigation container placement and spacing

This reduces maintenance burden and keeps every tool focused.

---

# 3. Theming System (Token-Driven)

All LCL pages use a **universal dark theme** enforced by tokens.

## 3.1 Shared Foundation (lcl.css)

    :root {
        --bg: #000;
        --fg: #e0e0e0;
        --accent: #0ff;
    }
    html { color-scheme: dark; }
    html, body { background: var(--bg); color: var(--fg); }

This provides:

- Safe dark-only defaults
- Stable design tokens
- Namespaced components shared by multiple pages
- A compact, icon-only `.lcl-back-link` with shared hover and keyboard-focus
  behavior
- Normal cascade behavior for page-level token overrides
- Compatibility with operating-system forced-colors behavior

## 3.2 Local Token Overrides (Inline in Each Page)

Pages declare only overrides and page-specific tokens when needed:

    :root {
        --bg: #000;
        --fg: #e0e0e0;
        --muted: #5a5a5a;
        --accent: #00eaff;
        --line: #00eaff;
        --chip: #111;
        --chip-brd: #222;
        --glow: rgba(0, 234, 255, 0.5);
        /* page-specific tokens */
    }

Rules:

- No light-mode overrides.
- Add new tokens only when necessary.
- Token names must follow the existing pattern.
- Accent behaviors must match existing neon styling.

## 3.3 Multi-Theme Pages

Some pages (e.g., clock_presets.html) use:

    <html data-theme="...">

Each theme contains a full override block for tokens.  
This pattern is supported and reusable for future customizable pages.

---

# 4. Layout Architecture

LCL is desktop-first: desktop layouts and testing are the primary design target.
Existing flexible CSS may remain, but mobile-specific redesigns are performed
only when requested. Avoid catastrophic horizontal overflow and unusable
clipping while retaining keyboard accessibility, visible focus, readable
contrast, and semantic markup.

LCL uses a combination of:

- Flexbox layouts
- CSS grid
- min()/max()/clamp() responsive primitives

Common patterns include:

## 4.1 Wrappers

    .wrap {
        width: min(1000px, 92vw);
        margin: 0 auto;
        padding: 1.2rem;
    }

Used primarily for clock views.

## 4.2 Grid Layouts

    .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
        gap: 16px;
    }

The home grid is capped at 980px, which presents four columns at the established
desktop width. Dashboard uses its separate tile workspace rather than this
directory grid.

## 4.3 Cards

    .card {
        background: #0a0a0a;
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 14px 12px;
        transition: box-shadow 0.2s;
    }

Hover behavior:

- Soft accent glow
- Never shifts layout
- Never increases card size

---

# 5. Component Architecture

## 5.1 Tick / Rail System (Clocks)

Tick marks on clocks are generated using:

- Absolutely positioned spans
- Percent-based layout
- Accent markers
- Subtle glows for readability on dark backgrounds

Markers and work bands follow the same token rules to ensure consistency across time-based tools.

## 5.2 Inputs & Controls

All inputs and buttons follow:

- Dark backgrounds (`#111`)
- Light borders (1px, low opacity)
- Accent-color focus rings or hovers
- Compact sizing
- Monospace or system-ui text depending on the tool

Range inputs explicitly use:

    accent-color: var(--accent);

## 5.3 Return Link (Back to Hub)

Standard pattern:

    <nav class="lcl-back-nav" aria-label="Return">
        <a href="index.html" class="lcl-back-link"
           aria-label="Back to Linear Clock Lab"
           title="Back to Linear Clock Lab">&larr;</a>
    </nav>

Design:

- Accent-colored text
- Light border on hover
- Minimal layout footprint

---

# 6. JavaScript Architecture

LCL uses a hybrid JavaScript architecture: shared files hold only pure, reused
utilities, while each page keeps an independent controller. Controllers may be
inline at the end of `<body>` or repository-local external scripts loaded with
`defer` in `<head>`.

## 6.1 Principles

- Vanilla JS only
- Small, page-specific scopes
- No external libraries
- Shared utilities expose one narrow, frozen namespace
- Prefer const/let with narrow scope
- Query via ID for key elements
- Do not extract one-page logic without a clear reuse case
- Do not merge page controllers or migrate unrelated pages merely for consistency
- Refactors proceed in small, testable phases

## 6.2 Shared Time Utilities

`lcl-time.js` exposes the dependency-free `window.LCLTime` API for formatting hour labels, clock times, durations, and ordinal `YYYY-DDD` dates. It has no DOM, LocalStorage, event, interval, or page-state responsibilities and also supports `module.exports` for direct Node tests.

## 6.3 Duration Calculator Utilities

`lcl-duration.js` exposes the frozen, dependency-free `window.LCLDuration` API.
It owns the single ordered unit definition for nanoseconds, microseconds,
milliseconds, seconds, minutes, hours, days, weeks, months, years, and decades;
deterministic interval division; elapsed-duration and time-shift calculations;
conversion precision metadata; and human-readable duration formatting.

Each unit factor is stored as an integer BigInt number of nanoseconds. Decimal
inputs are parsed as rational BigInt values, so exact integer results can remain
exact beyond `Number.MAX_SAFE_INTEGER`; browser input strings are passed to the
utility without first losing precision. Numeric compatibility fields remain
available for ordinary time-of-day rendering, and the API reports when a caller
supplies an already-unsafe Number. Display formatting uses grouped decimal
notation where practical and scientific notation only for extreme magnitudes.

Nanoseconds through weeks are fixed durations. Months, years, and decades use
the average Gregorian definitions of 365.2425 days per year, one twelfth of that
per month, and ten average years per decade. Calculations involving those units
carry approximation metadata; exact calendar operations belong in Date
Calculator. The utility supports `module.exports` for direct Node tests.
`time-calculator.html` keeps input validation, tabs, approximation notes, and
result rendering in its inline controller.

## 6.4 Gregorian Date Calculator Utilities

`lcl-date.js` exposes the frozen, dependency-free `window.LCLDate` API for
Gregorian date-only parsing and formatting, signed day differences, day/week/
month/year shifts, weekday lookup, and nth/last weekday patterns. It operates on
immutable `{ year, month, day }` records and integer civil-day serials rather
than timestamps. ISO date input is parsed manually; it is never passed to
`new Date("YYYY-MM-DD")`, so UTC offsets cannot change the selected calendar
day. The utility supports `module.exports` for direct Node tests.

The supported public range is years 1 through 9999. Month and year arithmetic
retains the original day when valid and otherwise clamps to the destination
month's last valid day. Gregorian century leap rules are applied consistently.
`date-calculator.html` uses `Date` only to read the current local year, month,
and day as separate fields for the From Now reference; all subsequent math is
handled by `LCLDate`.

## 6.5 Timezone Conversion Utilities

`lcl-timezone.js` exposes the frozen, dependency-free `window.LCLTimeZone` API
for source wall-clock resolution, instant-to-zone conversion, UTC offset
metadata, DST transition detection, and calendar-day comparison. It uses
`Intl.DateTimeFormat` as the timezone-rule source and does not contain fixed
offsets, daylight-saving tables, selector presentation, DOM access, storage,
events, or network logic.

`lcl-timezone-select.js` separately exposes the frozen `window.LCLTimeZoneSelect`
API consumed by both Multi-Clock and Time Zone Converter. It owns the supported
IANA/fallback list, the single pinned and major-zone definitions, readable
region/location labels, UTC-offset formatting, offset-then-name sorting, and
offset deduplication. It returns immutable option-group data and does not own
DOM elements or page state. Multi-Clock builds these groups for the current
instant; Time Zone Converter rebuilds them from the resolved conversion instant
so winter and summer labels remain date-aware.

An arbitrary source wall time is never parsed as a browser-local `Date`.
Instead, the utility validates its numeric calendar fields, samples the source
zone's actual offsets around that date, derives candidate instants, and
round-trips each candidate through `Intl`. Zero candidates identifies a
nonexistent spring-forward time; multiple candidates identify an ambiguous
fall-back time. `time-zone-converter.html` requires an explicit earlier/later
choice for an overlap and rewrites the wall-clock inputs from the preserved
instant when zones are swapped. Input years are limited to 1900 through 9999;
historical and future authority depends on the browser/OS IANA database.

## 6.6 LocalStorage System

Used for:

- Preferences (e.g., 12h vs 24h)
- Theme selections on customizable pages
- Clock collections, labels, and ordering in Multi-Clock
- Timer, stopwatch, FocusLine, Task Planner, Dashboard, and To Do state
- JSON-backed layouts, schedules, notes, and planner data where those pages
  provide import/export

Existing production LocalStorage keys are compatibility contracts and must not
be renamed solely for consistency. New persistent keys should use a clear
page/tool namespace; established `lcl-...`, `focusline:...`, and documented
legacy styles remain valid. Do not force user-data migrations, and do not use
LocalStorage for temporary session-only state.

## 6.7 Interval-Driven Tools

Clock, stopwatch, timer, and dashboard rely on:

- Lightweight setInterval loops
- Minimal DOM writes per tick
- Graceful degradation if visibility state changes
- No animation-frame dependencies unless explicitly needed

---

# 7. SEO, Meta, and Sharing Architecture

All pages include:

- charset
- viewport
- color-scheme lock
- theme-color
- canonical URL
- robots
- keywords (optional)
- description
- Open Graph metadata
- Twitter cards

Images point to:

    https://linearclocklab.com/profile.png

These ensure consistent previews across platforms. Required metadata is charset,
viewport, title, description, author, robots, canonical, theme-color,
color-scheme, `lcl.css`, Open Graph metadata, and Twitter metadata; keywords
are optional.

Inline controllers go at the bottom of `<body>`. Repository-local external
controllers may use `defer` in `<head>`; a shared utility loads before a
controller that uses it.

---

# 8. File-Specific Architectural Notes

## 8.1 index.html

- Primary landing page and hub.
- Uses grid + cards.
- Contains full tool directory.
- Hover rules rely on accent glows.

## 8.2 clock.html / multi-clock.html / clock_presets.html

- Focus on precision time tracking.
- Monospace typography.
- Rail/tick/marker system with consistent placement logic.
- `clock_presets` handles advanced token sets via HTML attributes.

## 8.3 focus.html / timer.html / stopwatch.html

- Compact tool UIs.
- UI-oriented token sets (e.g., button glows).
- Uses system-ui or monospace depending on function.
- Range inputs use accent colors.

## 8.4 dashboard.html

- Tile-based workspace.
- Uses its own tile workspace and absolute positioning rather than mirroring
  the index grid.
- Uses toolbar/header sections consistent with other UIs.

## 8.5 lcl.css

Contains only:

- Stable shared design tokens
- Accessibility-safe dark foundations
- Namespaced components used by multiple pages
- The compact `.lcl-back-link` return-control presentation

Page-specific layout does not belong here.

## 8.6 lcl-time.js

Contains only the frozen, pure `LCLTime` formatting API. Page controllers remain inline and independent.

## 8.7 lcl-duration.js / time-calculator.html

- `lcl-duration.js` contains only the frozen, pure `LCLDuration` calculation
  and duration-formatting API, including the single BigInt-backed unit table and
  Average Gregorian approximation metadata.
- `time-calculator.html` owns its four-mode tab interface, DOM validation, and
  result presentation. Duration selectors are populated from
  `LCLDuration.units` rather than duplicating unit factors or lists.
- The page loads `lcl-time.js` for 12-hour clock result formatting and
  `lcl-duration.js` for calculation behavior before its inline controller.
- Calculator inputs are temporary session state and are not stored.

## 8.8 lcl-date.js / date-calculator.html

- `lcl-date.js` contains only frozen, deterministic Gregorian date-only logic;
  it has no DOM, LocalStorage, event, timer, or page-state responsibilities.
- `date-calculator.html` owns five compact tab panels: From Now, Between Dates,
  Add/Subtract, Day of Week, and Pattern Finder.
- Native date inputs are used for ordinary date selection. Structured numeric
  controls keep Day of Week and Pattern Finder reliable through year 9999.
- Calendar month/year shifts use the documented clamp-to-valid-date rule and do
  not reuse Time Calculator's Average Gregorian duration factors.
- Calculator inputs are temporary session state and are not stored.

## 8.9 lcl-timezone.js / lcl-timezone-select.js / timezone pages

- `lcl-timezone.js` contains pure `Intl`-backed wall-clock resolution,
  conversion, and day-boundary logic.
- `lcl-timezone-select.js` contains the shared pinned/common lists, supported
  zone fallback, region/location labels, offsets, sorting, and deduplication
  used by Multi-Clock and Time Zone Converter.
- `time-zone-converter.html` owns native dropdown controls, validation,
  Reset, DST occurrence choice, result presentation, and instant-preserving
  Swap behavior.
- `multi-clock.html` retains its current-time dropdown presentation and clock
  behavior while sourcing its option groups and card offset/name text from the
  shared selector API.
- The page reuses `LCLTime` for the established `use24h` display preference and
  `LCLDate` for full Gregorian destination-date formatting.
- Conversion inputs are temporary session state and are not stored. No external
  timezone service, geolocation, or network request is used.

## 8.10 Productivity and Planning Pages

- `task-planner-lc.html` stores editable templates as minutes since midnight
  and renders color-coded schedule zones from page-local controller state.
- `focus.html` owns Pomodoro phases, local notes, and short local history while
  reusing `LCLTime` for duration formatting.
- `timer.html` and `stopwatch.html` own independent collections, ordering,
  colors, and paused-on-reload state while reusing `LCLTime` formatting.
- `dashboard.html` owns its movable/resizable tile layout and layout import or
  export; it does not share the home-page card grid.
- `todo.html` and `todo.js` own the Work, Home, and Event planners, ordering,
  due dates, filtering, and JSON import or export.
- `about.html` is a concise implemented/planned feature inventory and license
  page. It does not introduce tool-to-tool navigation.

---

# 9. Accessibility Architecture

- High contrast always maintained (dark + accent).
- Icon-only controls use matching aria-labels and title tooltips.
- Keyboard focus is visibly indicated.
- aria-hidden applied to decorative separators.
- Accessible click targets with visible keyboard focus; touch optimization is
  not a mandatory design target.
- No reliance on color-only interactions.

---

# 10. Error Prevention Architecture (Critical)

Agents must ensure:

- No `@media (prefers-color-scheme: light)` exists anywhere.
- No light-mode tokens remain.
- No tool replicates the multi-link navigation of index.
- No accidental introduction of remote JavaScript or CSS libraries.
- Shared utilities load before controllers that use them; preserve either
  supported controller placement pattern.
- No page-specific layout is added to `lcl.css`.
- No shared utility takes ownership of DOM state, LocalStorage, events, or intervals.
- No arbitrary-zone wall-clock input is parsed through a browser-local Date or
  converted with a hard-coded current offset.
- No mixing of UI patterns across tool contexts without preserving identity.

---

# 11. Extensibility Architecture (Future-Proofing)

When adding new tools:

- They must follow existing layout + typography patterns.
- They must begin with the canonical `<head>` block.
- They inherit shared tokens and declare only necessary local overrides or page-specific tokens.
- Public non-index pages must contain exactly one `.lcl-back-link` home control.
- Existing LocalStorage contracts remain unchanged; new persistence is added
  only when it has a clear user benefit.
- They must use grid/flex patterns that match existing pages.
- They must not introduce new dark/light logic.
- They must avoid global namespace pollution.
- Code used by one page stays local until a clear multi-page reuse case exists.

---

# 12. Summary

Linear Clock Lab operates as a collection of highly consistent, tightly scoped,
static, client-side, backend-free, local-first tools held together by a shared
dark theme, a synchronized design-token system, a hub-and-spoke navigation
model, and strict architectural rules.

All future work must remain:

- Deterministic
- Minimalist
- Dark-only
- Locally serveable
- Neon-accented
- Consistent in design and function
- Compatible with existing patterns

This document serves as the authoritative architecture reference for all agents and all future development within LCL.
