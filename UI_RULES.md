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

- All elements must use these increments.
- No arbitrary pixel spacing unless matching existing code.
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

- Headings scale down on mobile with clamp().
- No text smaller than 0.8rem.
- No exaggerated sizes unless part of a numeric display.

## 2.3 Numeric Displays

- Must use monospace fonts.
- Must have high contrast (`var(--fg)`).
- No blurs.
- No shadows.
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
--line  
--chip  
--chip-brd  
--glow

---

Rules:

- No hard-coded colors except `#000` for fallback blocks.
- Accent must be neon-cyan.
- Muted must remain neutral gray.

## 3.2 Glow Standards

Glow behavior:

---

## box-shadow: 0 0 10px var(--glow);

Rules:

- Glow must use `var(--glow)`.
- Glow radius ≤ 15px.
- No multi-layer glows.
- Glow appears only on:

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

- Radii > 8px
- Multi-layer shadows
- Bright filled buttons
- Unrequested animations

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

Dashboard:

---

## repeat(auto-fit, minmax(250px, 1fr))

Rules:

- Cards consistent width.
- No asymmetric grids.

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

<nav class="lcl-back-nav">
  <a href="index.html">← Home</a>
</nav>
---

Rules:

- Placed near top.
- One link only.
- Accent underline on hover.

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

---

# 9. JavaScript Interaction Rules

## 9.1 DOM Access

- Use `document.getElementById`.
- Script at bottom of `<body>`.
- No layout rewrites beyond existing patterns.

## 9.2 Updates

- Keep DOM writes minimal.
- Use `requestAnimationFrame` only when needed.
- Timers/clocks use safe `setInterval`.

## 9.3 LocalStorage

Keys must follow:

---

## lcl-<tool>-<setting>

Never store UI-only temporary state.

## 9.4 Task Planner Clock – Storage Keys

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

## 10.1 Scaling

- Use clamp() where appropriate.
- Grids must handle narrow screens.
- Cards must remain readable.

## 10.2 No Horizontal Scroll

- No horizontal overflow.
- Time rails must scale to width.

## 10.3 Touch Targets

- Minimum height: 40–44px.

---

# 11. Accessibility Rules

- Use `aria-label` for icon-only elements.
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
- Multi-layer glows.
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

Any new UI element must obey these rules exactly.

---

