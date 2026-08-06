# UI_RULES.md — Linear Clock Lab

This document defines the exact, enforceable UI rules for all pages and components in Linear Clock Lab (LCL).
These rules govern spacing, margins, typography, glow behaviors, token usage, interaction patterns, line widths, and layout density.
They ensure the entire suite retains its unified, minimalist, neon-accented dark theme.

These rules are binding for all agents.

---

# 1. Spacing Rules

## 1.1 Global Spacing Scale

LCL uses a tightly controlled spacing system:

---

XS = 0.25rem  
S = 0.5rem  
M = 1rem  
L = 1.5rem  
XL = 2rem

---

Rules:

- Treat this scale as guidance, not a mathematical requirement for every legacy
  element.
- Preserve deliberate page-specific spacing when it supports an existing page
  identity.
- Vertical spacing defaults to M (1rem) unless the page uses denser layouts.
- Horizontal spacing typically S to M.

## 1.2 Page Padding

Every main wrapper (`.wrap`, `.lcl-main`, dashboard containers) must use:

---

## padding: 1rem–1.2rem

Rules:

- Never less than 0.8rem.
- Never more than 2rem.

## 1.3 Section Separation

Sections should be separated using:

- Margin-top: L (1.5rem)
- Or a hairline divider

Never stack large empty blocks.

---

# 2. Typography Rules

## 2.1 Font Families

Approved font stacks:

**Monospace pages (clock, stopwatch, timer)**

---

## ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace

**System UI pages**

---

## system-ui, "Segoe UI", sans-serif

Rules:

- Match the page’s existing font family.
- Do not mix families on the same page.

## 2.2 Font Sizes

---

h1 = 2.0rem  
h2 = 1.6rem  
h3 = 1.25rem  
body = 1rem  
small/muted = 0.85rem

---

Rules:

- Use `clamp()` when appropriate for a task; desktop layouts are the primary
  design target.
- No text smaller than 0.8rem.
- No exaggerated sizes unless part of a numeric display.

## 2.3 Numeric Displays

- Must use monospace fonts.
- Must have high contrast (`var(--fg)`).
- No blurs.
- Numeric displays may use a subtle theme-controlled glow where already
  established, without reducing readability.
- No gradients.

---

# 3. Color + Glow Rules

## 3.1 Approved Tokens

All UI must use these tokens:

---

    --bg
    --fg
    --muted
    --accent
    --rail
    --rail-border
    --tick-q
    --tick-h
    --label
    --workhour
    --stats
    --border
    --switch-track
    --switch-thumb
    --switch-track-active
    --switch-border-active
    --line
    --chip
    --chip-brd
    --glow

---

Rules:

- Shared and theme-sensitive colors should use tokens. Deliberate page-specific
  colors may remain local when they are not reusable.
- Accent follows the established page or theme palette, including the suite's
  neon-accent identity.
- Muted text remains readable against the active theme.
- Stable shared defaults belong in `lcl.css`; pages may define local overrides and page-specific tokens.
- Zone colors continue to use approved Task Planner tokens; do not duplicate a
  reusable semantic color unnecessarily.

## 3.2 Glow Standards

Glow behavior:

---

## box-shadow: 0 0 10px var(--glow);

Rules:

- Default glow should be restrained and must not reduce readability or shift
  layout.
- Theme-controlled glow may use established page tokens.
- Intentional multi-layer glows are permitted for themed rails, markers, Timer,
  and Stopwatch effects.
- Glow commonly appears on:

  - card hovers
  - markers
  - UI focus rings
  - selected presets

Glow must never:

- Shift layout
- Increase element size
- Overpower background

## 3.3 Accent Hover Rules

Interactive items must:

- Change underline/border color to `var(--accent)`
  **OR**
- Receive a subtle glow

Never both.

---

# 3.4 Zone Color Palette (Required for Task Planner Clock)

The Task Planner Clock uses time-based zones (wake, routine, work, travel, event, rest, sleep).
Zones must never use arbitrary colors.
All zone colors must come from the approved palette below and must be used via CSS variables.

## 3.4.1 Zone Color Tokens

All schedule zones must use one of:

---

--zone-wake  
--zone-routine  
--zone-work  
--zone-break  
--zone-travel  
--zone-event  
--zone-evening  
--zone-night  
--zone-sleep  
--zone-focus  
--zone-workend

---

These represent color families, not single shades.
Their values are defined in the root theme.

### Recommended Base Values (Vaporwave Expanded)

---

--zone-wake: #7fffd4; /_ Mint aqua — uplifting green-blue _/
--zone-routine: #c084fc; /_ Pastel vaporwave lavender _/
--zone-work: #a5f3fc; /_ Soft electric cyan — stable attention _/
--zone-break: #fb923c; /_ Peach — high visibility _/
--zone-travel: #f97316; /_ Citrus orange — urgency for movement _/
--zone-event: #ff4d6d; /_ Neon rose - high-importance _/
--zone-evening: #d946ef; /_ Magenta-purple - evening tone _/
--zone-night: #6d28d9; /_ Deep royal purple - nighttime _/
--zone-sleep: #3b0764; /_ Deep violet - sleep _/
--zone-focus: #38bdf8; /_ Electric blue - concentrated work _/
--zone-workend: #34d399; /_ Workday boundary - stepping out of work into personal time _/

---

Rules:

 - Codex must not create new zone tokens beyond the approved set (including `--zone-workend`).
 - Codex must not use raw hex values for zones except inside this definition.
 - Tokens must be applied directly to timeline segment fills.

## 3.4.2 Token Usage Guidelines

- Wake-up / energizing → `--zone-wake`
- Morning/evening routines → `--zone-routine`
- Work / focus tasks → `--zone-work` or `--zone-focus`
- Breaks / lunch → `--zone-break`
- Travel / leaving / commute → `--zone-travel`
- Critical events / appointments → `--zone-event`
- Downtime / relaxation → `--zone-evening`
- Nighttime wind-down → `--zone-night`
- Sleep → `--zone-sleep`

Warm/orange/rose tones must remain restricted to urgent or high-salience tasks.

## 3.4.3 Color Reuse Rules

- Same task type → same token.
- Tokens may repeat if the zones are separated by at least two other zones.
- Adjacent zones must not share a token unless the type is continuous.
- Only one `--zone-event` per schedule.
- Night and sleep must only use the night/sleep tokens.

## 3.4.4 Contrast & Accessibility

- All tokens must maintain 4.5:1 contrast on `--bg`.
- Zone labels must use `var(--fg)`.
- Glows must follow §3.2.

## 3.4.5 Allowed Transformations

Allowed:

- Opacity 0.8–1.0
- ±10% desaturation
- Standard LCL border/glow patterns

Forbidden:

- Gradients
- Hue shifts
- Multi-glow stacks
- Over-bright neon bloom

---

# 4. Border, Divider & Line Rules

## 4.1 Standard Border

---

## border: 1px solid rgba(255,255,255,0.15)

Accent border variant:

---

## border: 1px solid var(--accent)

Rules:

- No thick borders.
- No drop shadows beyond glow.
- Rounded corners: 4–6px.

## 4.2 Hairline Divider

---

## <hr aria-hidden="true">

Styling:

---

height: 1px  
background: rgba(255,255,255,0.1)  
border: none  
margin: 1rem 0

---

Rules:

- Must be subtle.
- Must not use accent color.
- Must not introduce large gaps.

## 4.3 Time Rails & Tick Marks

- Tick width ≤ 2px.
- Ticks use muted tones unless major divisions.
- Marker uses accent + glow.
- Placement must be percent-based.

---

# 5. Button & Input Rules

## 5.1 Buttons

Standard button:

---

## <button class="btn">...</button>

Rules:

- Background: `#111`
- Border: `1px solid rgba(255,255,255,0.15)`
- Padding: `0.4rem 0.8rem`
- Font: follow page family
- Hover: accent underline **or** subtle glow
- Active: no displacement

Prohibited:

- Radii that conflict with the existing page identity; compact controls generally
  use 6–10px, cards/panels may use approximately 10–16px, and pills may use 999px
- Heavy, decorative shadows that reduce readability
- Unrequested animations

A restrained filled-accent primary action is permitted where a page already
uses that pattern, such as FocusLine.

## 5.2 Text Inputs

Rules:

- Background `#111`
- Border muted
- Accent focus ring
- Tight spacing (0.45–0.6rem)

## 5.3 Range Inputs

Rules:

- Must use `accent-color: var(--accent)`
- Dark track
- Minimal thumb

---

# 6. Layout Rules

## 6.1 Flex Rules

---

display: flex  
gap: 0.5–1rem  
align-items: center

---

Rules:

- Use flex only when appropriate.
- Good for toolbars and row-style settings.

## 6.2 Grid Rules

---

display: grid  
gap: 1rem

---

Index:

---

## repeat(auto-fit, minmax(220px, 1fr))

Rules:

- Cards consistent width.
- Asymmetric layouts are allowed when purpose-driven, such as Dashboard or
  productivity views.

## 6.3 Wrapper Widths

---

## width: min(1000px, 92vw)

Rules:

- Index may be wider.
- Tools maintain clock-style tighter width.

---

# 7. Navigation Rules

## 7.1 Hub Navigation (index.html only)

Rules:

- One directory grid only.
- Cards use accent glow on hover.

## 7.2 Back Navigation

---

<nav class="lcl-back-nav" aria-label="Return">
  <a
    href="index.html"
    class="lcl-back-link"
    aria-label="Back to Linear Clock Lab"
    title="Back to Linear Clock Lab"
  >&larr;</a>
</nav>
---

Rules:

- Every public non-index page has exactly one dedicated return control.
- Home navigation uses the shared `.lcl-back-link` icon-only back arrow.
- The compact back arrow follows the established 38px by 38px control pattern.
- `.lcl-back-link` owns anchor sizing, border, hover, and focus presentation.
- Navigation container placement and spacing remain page-specific.
- Icon-only controls require an `aria-label`, matching `title`, visible
  `:focus-visible` state, and an adequate click target.
- Remove redundant visible labels only when the action remains unmistakable.
- Keep visible text labels for ambiguous, destructive, or data-changing actions.
- Do not pursue minimalism at the expense of clarity.

## 7.3 Visible Copyright Footer

- Every sitemap-listed public page visibly contains exactly `© 2025–2026 jm5k`.
- Keep the footer text static in HTML rather than generating it with JavaScript.
- Page-specific footer content may surround the notice; preserve functional
  footer content.

---

# 8. Interaction Rules

## 8.1 Hover Behavior

- Must be subtle.
- Must not shift layout.
- Transitions ≤ 0.15–0.2s.

## 8.2 Active States

Allowed:

- Weight change
- Underline
- Glow

Not allowed:

- Layout shifts
- Size changes

## 8.3 Mode Selectors

- Multi-mode tools may use a compact `tablist` when only one work surface is
  needed at a time.
- The selected tab uses the page accent, exposes `aria-selected="true"`, and
  controls one visible `tabpanel`.
- Arrow, Home, and End keys move selection and focus without reloading.
- Switching modes must be immediate and must not alter unrelated form values.
- Approximate duration results use an unobtrusive approximation symbol and
  muted `Average Gregorian duration` note; they must not resemble exact calendar
  arithmetic.

---

# 9. JavaScript Interaction Rules

## 9.1 DOM Access

- Use `document.getElementById`.
- Use either an inline controller at the bottom of `<body>` or a
  repository-local external controller loaded with `defer` in `<head>`.
- Load any shared utility script before the controller that uses it.
- No layout rewrites beyond existing patterns.

## 9.2 Shared Utility Boundary

- Shared JavaScript contains only pure, dependency-free functions used by multiple pages.
- Shared utilities expose a narrow documented API and do not access the DOM, LocalStorage, events, timers, or page state.
- `lcl-duration.js` owns pure calculator math and formatting; the Time
  Calculator controller owns validation feedback, tabs, and DOM output. Unit
  factors and ordered selector choices come only from the shared utility.
- `lcl-date.js` owns Gregorian date-only math and formatting; the Date
  Calculator controller owns current-local-date capture, validation feedback,
  tabs, and DOM output. Never parse an ISO date input through the Date
  constructor.
- Page scripts remain independent; do not create a monolithic controller.
- Do not extract one-page code or migrate unrelated pages solely for consistency.
- Refactor in small, testable phases.

## 9.3 Updates

- Keep DOM writes minimal.
- Use `requestAnimationFrame` only when needed.
- Timers/clocks use safe `setInterval`.

## 9.4 LocalStorage

Existing production LocalStorage keys are compatibility contracts and must not
be renamed solely for consistency. New persistent keys should use a clear page
or tool namespace; established `lcl-...`, `focusline:...`, and documented
legacy styles remain valid. Do not force migrations of existing user data.
Temporary session-only state does not need LocalStorage.

## 9.5 Task Planner Clock – Storage Keys

All Task Planner state must use:

---

lcl-taskplanner-templates
lcl-taskplanner-active-template
lcl-taskplanner-timeformat

---

Rules:

- No additional keys.
- Template names must match visible labels.
- Times stored as minutes since midnight (0–1439).

---

# 10. Responsiveness Rules

Linear Clock Lab is desktop-first: desktop layouts and testing are the primary
design target. Do not perform mobile-specific redesigns unless explicitly
requested. Existing flexible CSS may remain, but avoid catastrophic horizontal
overflow and unusable clipping. Keyboard accessibility, visible focus, readable
contrast, and semantic markup remain required.

## 10.1 Scaling

- Use clamp() where appropriate.
- Preserve existing flexible layouts when they remain usable; perform narrow
  screen checks only when a task explicitly affects responsive behavior.

## 10.2 No Horizontal Scroll

- Avoid catastrophic horizontal overflow and unusable rail clipping.

## 10.3 Touch Targets

- Maintain adequate, visible controls for the page context. Established compact
  utility controls, including the suite back arrow, may use the 38px by 38px
  pattern when they retain clear spacing and visible focus.

---

# 11. Accessibility Rules

- Use `aria-label` and a matching `title` for icon-only controls.
- Give icon-only controls a visible `:focus-visible` state and an adequate click
  target.
- Remove a visible label only when the action remains unmistakable.
- Keep visible text labels for ambiguous, destructive, or data-changing actions.
- Do not pursue minimalism at the expense of clarity.
- Use `aria-hidden` for decorative items.
- Maintain high contrast.
- No flashing.
- Focus indicators use accent.

---

# 12. Prohibited UI Patterns

Never allowed:

- Light themes.
- Multi-link navbars (only index lists tools).
- Hamburger menus.
- Heavy shadows.
- Skeuomorphic elements.
- External fonts/CDNs.
- Excessive padding.
- Bright/white UI elements that break dark mode.

---

# 13. Summary

These UI rules define the precise visual language of Linear Clock Lab.
Following them ensures all pages remain:

- Minimal
- Neon-accented
- Dark-only
- Consistent
- Predictable
- Lightweight
- Cohesive

Apply these rules with purpose-driven judgment while preserving each page's
existing identity.

---

