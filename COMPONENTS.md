# COMPONENTS.md — Linear Clock Lab

This document describes all reusable components in Linear Clock Lab (LCL).  
Components are defined by shared structure, shared design tokens, and shared interaction patterns—not by external libraries or JavaScript classes.

All components:

- Use dark-only token-based theming
- Follow minimalistic neon-accent styling
- Are written in pure HTML/CSS
- Use `lcl.css` for stable tokens and genuinely shared components, with page-specific layout kept inline
- Must remain consistent across all tools

LCL is desktop-first: desktop layouts and testing are the primary component
target. Do not perform mobile-specific redesigns unless requested; retain
existing flexible CSS while avoiding catastrophic overflow or unusable clipping.
Keyboard accessibility, visible focus, readable contrast, and semantic markup
remain required.

Each component described here includes:

- Purpose
- Structure
- Token requirements
- Styling rules
- Behavioral rules
- Example markup

---

# 1. Wrapper Components

## 1.1 `.wrap` (Universal Page Container)

Purpose:  
Centers content, controls max width, and provides consistent padding across tools.

Structure:

<div class="wrap">
<!-- Page content -->
</div>

Rules:

- Width uses min(): min(1000px, 92vw)
- Padding around 1.2rem
- Used primarily by clock views but can be adopted by any tool
- Must not introduce vertical borders or large shadows

---

# 2. Grid & Card Components

## 2.1 `.grid` (Responsive Auto-Fit Grid)

Purpose:  
Used by the index.html hub. Dashboard uses its own purpose-driven tile workspace.

Structure:

<div class="grid">
<a class="card" href="clock.html">...</a>
<a class="card" href="clock_presets.html">...</a>
...
</div>

Rules:

- repeat(auto-fit, minmax(220px, 1fr))
- Gap around 1rem
- Desktop-first layouts are the primary target; retain existing flexible CSS and
  avoid catastrophic horizontal overflow or unusable clipping.

## 2.2 `.card` (Feature Tile)

Purpose:  
Reusable UI tile for index and dashboard modules.

Structure:

<div class="card">
<h2>Title</h2>
<p>Description</p>
</div>

Token Requirements:

- --bg, --fg, --accent, --glow

Styling Rules:

- Background ~ #0a0a0a
- 1px border using var(--accent) or low-opacity border
- Cards and panels may use approximately 10–16px radii when that preserves the
  existing page identity.
- Hover: accent glow only; no size or layout changes
- Click targets must be full-card when linked

---

# 3. Navigation Components

## 3.1 Hub Navigation (index.html only)

Purpose:  
Top-level directory of tools.

Structure:

<ul class="lcl-app-links">
<li><a href="clock.html">Clock</a></li>
...
</ul>

Rules:

- Listing only appears in index.html
- Must not appear on tool pages
- Accent underline on hover

## 3.2 Back Navigation (`.lcl-back-link`)

Purpose:  
Every public non-index page returns to the hub through one simple and
predictable dedicated control.

Structure:

<nav class="lcl-back-nav" aria-label="Return">
<a
  href="index.html"
  class="lcl-back-link"
  aria-label="Back to Linear Clock Lab"
  title="Back to Linear Clock Lab"
>&larr;</a>
</nav>

Rules:

- Home navigation uses the suite's icon-only back arrow
- Every public non-index page has exactly one dedicated return control
- Compact back arrows follow the established 38px by 38px control pattern
- `.lcl-back-link` owns anchor sizing, border, hover, and focus presentation
- Navigation containers own page-specific placement and spacing
- Icon-only controls require an `aria-label`, matching `title`, visible
  `:focus-visible` state, and an adequate click target
- Remove redundant visible labels only when the action remains unmistakable
- Keep visible text labels for ambiguous, destructive, or data-changing actions
- Do not pursue minimalism at the expense of clarity
- No multi-link rows

## 3.3 Visible Copyright Footer

Purpose:
Keep suite ownership consistent and available without JavaScript.

Rules:

- Every sitemap-listed public page visibly contains `© 2025–2026 jm5k`
- Preserve each page's existing footer structure, styling, placement, and any
  functional footer content
- Keep the copyright text static in HTML rather than generating it with JavaScript

---

# 4. Clock Components

## 4.1 Time Rails

Purpose:  
Render the time axis of the 24h linear clock and multi-zone clocks.

Structure:

<div class="rail">
<div class="ticks">
<span></span>
<span></span>
</div>
<div id="marker"></div>
</div>

Token Requirements:

- --line
- --accent
- --glow

Styling Rules:

- Ticks are absolutely positioned percentage-based spans
- Marker uses accent glow
- Work bands use tokens for color and shine
- Subtle gradients allowed (using color-mix)

## 4.2 Tick Marks

Purpose:  
Represent hours, half-hours, or quarter-hours.

Rules:

- Small width (1–2px max)
- Low opacity fg or muted color
- Percent-based left positioning
- May glow lightly under accent conditions

## 4.3 Marker / Now-Line

Purpose:  
Shows current time.

Structure:

<div id="marker" class="lcl-now-marker"></div>

Rules:

- Accent color
- Vertical or horizontal line depending on orientation
- Small neon glow permitted
- Movement handled by JS updating style.left or style.top
- Shared CSS owns only the accent color and glow; page CSS owns dimensions and orientation

## 4.4 Shared Clock Text States

The main and minimal clocks share narrowly scoped text-state classes:

- `.lcl-julian-date` for the muted ordinal `YYYY-DDD` line
- `.lcl-day-stats` for elapsed-day and remaining-time text
- `.lcl-workhour` for yellow work-hour labels

These classes own only stable presentation shared by both pages. Rail geometry, label layout, and orientation remain page-specific.

## 4.5 Time-Format Switch

Structure:

<label class="lcl-time-switch">
<input type="checkbox">
<span class="lcl-switch-track"></span>
<span class="lcl-switch-label">24-hour</span>
</label>

Rules:

- The native checkbox remains the keyboard- and pointer-operable control.
- Shared CSS owns the track, thumb, label, and checked-state appearance.
- Page controllers own preference storage and change handling.

---

# 5. Tool Components (Timers, Stopwatch, FocusLine)

## 5.1 Button Components

Purpose:

- Controls for starting/stopping/resetting timers and mode toggles.

Structure:
<button class="btn">Start</button>

Rules:

- Shared and theme-sensitive colors use tokens; deliberate page-specific colors
  may remain local when they are not reusable.
- Border: 1px solid var(--accent) or a muted tone
- Hover: accent glow or underline
- Font: monospace or system-ui depending on tool
- No heavy shadows
- Compact controls generally use 6–10px radii; pill controls may use 999px.
- A restrained filled-accent primary action is allowed when a page already uses
  that pattern, such as FocusLine.

## 5.2 Range Input Components

Purpose:

- Adjust durations or user settings (FocusLine, dashboard, presets).

Structure:
<input type="range">

Rules:

- Must use accent-color: var(--accent)
- Dark track
- Clear thumb visibility

## 5.3 Timer/Stopwatch Display Components

Purpose:

- Large numeric time outputs.

Structure:

<div class="timer-display">00:00:00</div>

Rules:

- Monospace font
- High contrast
- Centered layout
- No transparency effects
- No animations unless explicitly script-driven

---

# 6. Text & Typography Components

## 6.1 Headers

Purpose:

- Identify feature sections with clarity.

Rules:

- Use h1, h2, h3 appropriately
- Fonts must match page’s existing family
- No uppercase transforms unless used consistently

## 6.2 Notes / Spacer Text

Used for:

- Small hints
- Settings descriptions
- Status text

Rules:

- Must use var(--muted)
- Must not exceed 0.9–1rem
- No italics unless extremely subtle

---

# 7. Feedback & Glow Components

## 7.1 Neon Accent Hover States

Purpose:

- Provide user feedback using subtle but noticeable glow.

Structure Example:
.card:hover {
box-shadow: 0 0 10px var(--glow);
}

Rules:

- Default glow is restrained and must not reduce readability or shift layout.
- Theme-sensitive glows use their established tokens where available.
- Intentional multi-layer glows are allowed for themed rails, markers, Timer,
  and Stopwatch effects.

## 7.2 Active State Indicators

Purpose:

- Display active modes (e.g., 12h/24h, preset selected)

Rules:

- Use bold text or accent underline
- Do not shift layout
- Glow allowed but subtle

---

# 8. Input & Form Components

## 8.1 Text Input Fields

Structure:
<input type="text" class="input">

Rules:

- Dark background (#111)
- Border: 1px solid rgba(255,255,255,0.15)
- Focus ring: accent-based
- Padding tight (0.4–0.6rem)

## 8.2 Select Dropdowns

Rules:

- Use system-ui font
- Rounded corners: small
- Accent hover or focus

---

# 9. Decorative Components

## 9.1 Hairline Dividers

Structure:

<hr aria-hidden="true">

Rules:

- Low opacity
- Thin (1px)
- Muted color token
- No label text or patterns

## 9.2 Spacer Blocks

Structure:

<div style="height:1.2rem;"></div>

Rules:

- Should be minimal
- Page-specific, not componentized globally

---

# 10. Accessibility Components

## 10.1 Screen Reader Labels

Purpose:

- Provide accessible names for buttons, inputs, and toggles.

Structure:
<button aria-label="Start the timer">▶</button>

Rules:

- `aria-label` and a matching `title` are required on icon-only elements
- Icon-only controls require a visible `:focus-visible` state and an adequate
  click target
- Remove visible labels only when the action remains unmistakable
- Keep visible text labels for ambiguous, destructive, or data-changing actions
- Do not pursue minimalism at the expense of clarity
- Decorative elements must use aria-hidden="true"

---

# 11. Page-Specific Components

## 11.1 Preset Theme Blocks (clock_presets.html)

Purpose:

- Switch themes using `<html data-theme>` while keeping the clock-first view
  compact.

Structure:

<html data-theme="blue">
<!-- Token overrides declared in <style> -->
</html>

Rules:

- Token sets must be full and consistent
- No light-mode semantics
- The top-oriented view keeps the current time, rail, labels, and statistics
  visible; the ordinal Julian YYYY-DDD date is part of the statistics row.
- All preset, display, theme-data, and custom-color controls live in
  `<details id="themePanel">` behind a compact gear summary.
- The gear and `.lcl-back-link` share a centered utility row.
- Data-changing actions retain visible text labels.

## 11.2 Dashboard Tiles

Structure:

<div class="tile">
<h3>Metric</h3>
<p>Value</p>
</div>

Rules:

- Uses an asymmetric, purpose-driven workspace that may share `.card` DNA
- No additional shadows beyond glow

## 11.3 Time Calculator Modes

Purpose:

- Keep four practical calculators in one compact page without presenting four
  full forms at once.

Rules:

- Use one keyboard-accessible `tablist` with one visible `tabpanel`.
- Selected mode controls use the accent border, restrained glow, and
  `aria-selected`; selection must not shift layout.
- Results use a compact bordered panel with one prominent accent value and
  muted secondary totals.
- Duration selectors are populated from the ordered `LCLDuration.units`
  definition so Intervals, Add/Subtract, and Convert stay synchronized.
- Months, years, and decades retain the same visual result treatment but add a
  subtle `Average Gregorian duration` note and an approximation symbol.
- Group large exact integer results; use scientific notation only for genuinely
  extreme magnitudes, and preserve readable subsecond output.
- Each mode updates immediately and has a visible Reset action.
- DOM and tab behavior remain page-local; deterministic calculations use the
  pure `LCLDuration` API.

## 11.4 LocalStorage Compatibility

- Existing production LocalStorage keys are compatibility contracts and must
  remain unchanged.
- New keys should use a clear page or tool namespace; established `lcl-...`,
  `focusline:...`, and documented legacy styles remain valid.
- Do not force migrations of existing user data. Temporary session-only state
  does not need LocalStorage.

---

# 12. Component Development Principles

All new components must:

1. Use existing tokens or extend them with consistent naming.
2. Use dark backgrounds and neon accents.
3. Avoid external or remote CSS/JS dependencies; repository-local shared foundations are allowed.
4. Fit into wrapper/grid/card systems already used.
5. Follow monospace or system-ui fonts as determined by the page.
6. Maintain predictable hover/active behavior.
7. Fit into the hub-and-spoke navigation model.
8. Include accessibility attributes as required.
9. Keep page-specific layout and controllers inline; extract only stable components or pure utilities used by multiple pages.
10. Work on Chrome, Edge, Firefox, and Safari without patches.
11. Keep shared APIs narrow and dependency-free; never create a monolithic controller.
12. Migrate pages in small, testable phases rather than changing the whole suite for consistency.

---

# 13. Summary

LCL components are intentionally small, minimal, and token-driven.  
Every piece of UI in the suite follows consistent dark-only patterns, accent behaviors, typography stacks, and spacing logic.

This document defines the reusable building blocks that make Linear Clock Lab feel cohesive and reliable across all tools.  
Future work should always reference these components to maintain consistency and prevent UI drift.
