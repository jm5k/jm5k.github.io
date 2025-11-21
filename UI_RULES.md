# UI_RULES.md — Linear Clock Lab

This document defines the exact, enforceable UI rules for all pages and components in Linear Clock Lab (LCL).  
These rules govern spacing, margins, typography, glow behaviors, token usage, interaction patterns, line widths, and layout density.  
They ensure the entire suite retains its unified, minimalist, neon-accented dark theme.

These rules are binding for all agents.

---

# 1. Spacing Rules

## 1.1 Global Spacing Scale

LCL uses a tightly controlled spacing system:

    XS = 0.25rem
    S  = 0.5rem
    M  = 1rem
    L  = 1.5rem
    XL = 2rem

Rules:

- All elements must use these increments.
- No arbitrary pixel spacing unless matching existing code.
- Vertical spacing defaults to M (1rem) unless the page uses denser layouts (FocusLine, timers).
- Horizontal spacing typically S to M.

## 1.2 Page Padding

Every main wrapper (`.wrap`, `.lcl-main`, dashboard containers) must use:

    padding: 1rem–1.2rem

Rules:

- Never less than 0.8rem.
- Never more than 2rem.

## 1.3 Section Separation

Sections should be separated using:

- Margin-top: L (1.5rem)
- Or a hairline divider (see separators below)

Never stack large empty blocks.

---

# 2. Typography Rules

## 2.1 Font Families

Two approved font stacks:

Monospace pages (clock, stopwatch, timer):
ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace

System UI pages:
system-ui, "Segoe UI", sans-serif

Rules:

- Match the page’s existing font family.
- Do not mix families on the same page.

## 2.2 Font Sizes

Standard font sizes:

    h1 = 2.0rem
    h2 = 1.6rem
    h3 = 1.25rem
    body = 1rem
    small/muted = 0.85rem

Rules:

- All headings scale down on mobile using clamp where needed.
- No text smaller than 0.8rem.
- No exaggerated sizes unless part of a numeric display (clock, timers).

## 2.3 Numeric Displays

Time displays (clock rails, timers, stopwatch):

- Must use monospace fonts.
- Must have high contrast (var(--fg)).
- No blurs or shadows.
- No gradients.

---

# 3. Color + Glow Rules

## 3.1 Approved Tokens

All UI must use these tokens:

    --bg
    --fg
    --muted
    --accent
    --line
    --chip
    --chip-brd
    --glow

Rules:

- No hard-coded colors except #000 for fallback blocks.
- Accent must always be neon-cyan in its variants.
- Muted must always remain neutral gray.

## 3.2 Glow Standards

Glow behavior must follow:

    box-shadow: 0 0 10px var(--glow);

Rules:

- Glow must always use var(--glow).
- Glow radius <= 15px.
- No multi-layer glow stacks.
- Glow appears only on:
  - card hovers
  - markers
  - UI focus rings
  - selected presets

Glow must never:

- Shift layout
- Increase element size
- Spill bright enough to overpower background

## 3.3 Accent Hover Rules

Any interactive item must:

- Change underline/border color to var(--accent) OR
- Receive a subtle glow

Never both at the same time.

---

# 4. Border, Divider & Line Rules

## 4.1 Standard Border

    border: 1px solid rgba(255,255,255,0.15)

Accent border variant:
border: 1px solid var(--accent)

Rules:

- No thick borders.
- No drop shadows beyond glow.
- Rounded corners: 4–6px.

## 4.2 Hairline Divider

Structure:

<hr aria-hidden="true">

Styling:
height: 1px
background: rgba(255,255,255,0.1)
border: none
margin: 1rem 0

Rules:

- Must be subtle.
- Must not use accent color.
- Must not interrupt flow or create large gaps.

## 4.3 Time Rails & Tick Marks

- Tick width <= 2px
- Ticks use a muted tone unless representing a major division
- Marker uses accent + glow
- Percent-based placement only

---

# 5. Button & Input Rules

## 5.1 Buttons

Standard button:

    <button class="btn">...</button>

Rules:

- Background: #111
- Border: 1px solid rgba(255,255,255,0.15)
- Padding: 0.4rem 0.8rem
- Font: monospace or system-ui based on page
- Hover: accent underline OR subtle glow
- Active: no displacement (no depress animations)

Prohibited:

- Large radii > 8px
- Multi-layer shadows
- Bright colored fills
- Animation unless explicitly requested

## 5.2 Text Inputs

Rules:

- Background #111
- Border muted
- Accent focus ring
- Tight spacing: 0.45–0.6rem

## 5.3 Range Inputs

Rules:

- Must use accent-color: var(--accent)
- Track dark
- Thumb visible but minimal

---

# 6. Layout Rules

## 6.1 Flex Rules

Patterns must follow:

    display: flex
    gap: 0.5–1rem
    align-items: center

Rules:

- No flex usage for large sections unless necessary.
- Flex used for toolbars, row-style settings, and top-level controls.

## 6.2 Grid Rules

Grid patterns must follow:

    display: grid
    gap: 1rem

On index:
repeat(auto-fit, minmax(220px, 1fr))

On dashboard:
repeat(auto-fit, minmax(250px, 1fr))

Rules:

- Cards remain consistent width.
- No asymmetric grids.

## 6.3 Wrapper Widths

Wrappers must use:

    width: min(1000px, 92vw)

Rules:

- Index grid expects wider layouts.
- Clock pages use tighter width (same pattern).

---

# 7. Navigation Rules

## 7.1 Hub Navigation (index.html only)

Rules:

- Only one full directory list.
- Uses .grid + .card.
- Cards must use accent glow on hover.

## 7.2 Back Navigation

On all tool pages:

    <nav class="lcl-back-nav">
        <a href="index.html">← Home</a>
    </nav>

Rules:

- Placed near top.
- Only one link.
- Accent underline on hover.
- Minimal footprint.

---

# 8. Interaction Rules

## 8.1 Hover Behavior

All hover interactions:

- Must be subtle
- Must not shift layout
- Must not add transitions longer than 0.15–0.2s

## 8.2 Active States

Active states can:

- Change text weight
- Change underline
- Show glow

They must not:

- Push elements
- Resize components

---

# 9. JavaScript Interaction Rules

## 9.1 DOM Access

Rules:

- Use document.getElementById for key elements.
- Keep script at bottom of <body>.
- No JS modifying layout structure beyond existing patterns.

## 9.2 Updates

- Keep DOM writes minimal.
- Use requestAnimationFrame only when necessary.
- Timers & clocks use setInterval with safe frequency.

## 9.3 LocalStorage

Keys must follow:

    lcl-<tool>-<setting>

Never store UI-only temporary state.

---

# 10. Responsiveness Rules

## 10.1 Scaling

- Font scaling may use clamp().
- Grid auto-fit must handle narrow devices gracefully.
- Cards must remain readable on phones.

## 10.2 No Horizontal Scroll

Rules:

- No component may overflow horizontally.
- Timescale rails must scale to container width.

## 10.3 Touch Targets

Minimum height for touch targets:
40–44px

---

# 11. Accessibility Rules

- aria-label required for icon-only elements.
- aria-hidden used for decorative separators.
- High contrast must be preserved.
- No flashing effects.
- Focus indicators must use accent.

---

# 12. Prohibited UI Patterns

These are **never** allowed:

- Light themes or light backgrounds.
- Multi-link tool navigation bars (only index may list tools).
- Hamburger menus or JS nav menus.
- Heavy shadows or skeuomorphic visuals.
- Multi-layer glows.
- External fonts or CDNs.
- Huge paddings or overly spaced layouts.
- White/bright UI elements that break dark aesthetic.

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
- Cohesive across tools

Any new UI element must obey these rules exactly to preserve the user experience and brand identity.
