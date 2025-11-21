# Linear Clock Lab — Architecture Overview

This document defines the full technical architecture of Linear Clock Lab (LCL), detailing how every component, page, style pattern, script pattern, and UX structure fits together into one cohesive system. It serves as the master reference for all agents and future development.

LCL is a suite of standalone, static HCJ (HTML/CSS/JavaScript) applications unified by:

- A strict dark-only theme
- A consistent token-based design system
- A shared interaction philosophy
- A hub-and-spoke navigation model
- Full offline compatibility
- Zero external dependencies

This overview documents the internal structure, module behaviors, responsibilities, and rules that govern the entire LCL ecosystem.

---

# 1. High-Level System Architecture

LCL consists of:

- A central hub: `index.html`
- Multiple independent tool pages
- A minimal shared CSS file (`lcl.css`)
- Page-specific inline CSS and JS
- A small shared image/profile resource
- A consistent SEO + metadata layer
- A theme system powered by CSS variables
- LocalStorage-driven user preferences

There is **no build system**, **no bundler**, **no framework**, and **no external scripts**.

Everything runs in browser-native HCJ only.

---

# 2. Navigation Model (Hub-and-Spoke)

LCL uses a deliberately simple navigation architecture:

1.  **index.html = the hub**  
    Lists all tools using a `.grid` of `.card` links.  
    Contains full SEO sharing metadata.

2.  **All other pages = spokes**  
    Each tool page includes a single back-navigation element:

        <nav class="lcl-back-nav">
            <a href="index.html">← Home</a>
        </nav>

The intention is:

- Predictability
- Zero nav clutter inside tools
- Users always return to the hub after completing a task
- No cross-linking among tools

This reduces maintenance burden and keeps every tool focused.

---

# 3. Theming System (Token-Driven)

All LCL pages use a **universal dark theme** enforced by tokens.

## 3.1 Global Dark Enforcement (lcl.css)

    html, body { background: var(--bg) !important; color: var(--fg) !important; }
    html { color-scheme: dark !important; }
    @media (forced-colors: active) {
        * { forced-color-adjust: none !important; }
    }

This prevents:

- OS light mode overrides
- Browser auto-theming
- Contrast mode distortions

## 3.2 Local Token Definitions (Inline in Each Page)

Each page declares a local token set via:

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
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 1rem;
    }

Used on index hub and dashboard-like sections.

## 4.3 Cards

    .card {
        background: #0a0a0a;
        border: 1px solid var(--accent);
        border-radius: 6px;
        padding: 1rem;
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

    <nav class="lcl-back-nav">
        <a href="index.html">← Home</a>
    </nav>

Design:

- Accent-colored text
- Light border on hover
- Minimal layout footprint

---

# 6. JavaScript Architecture

LCL uses inline `<script>` tags at the end of `<body>`.

## 6.1 Principles

- Vanilla JS only
- Small, page-specific scopes
- No external libraries
- No global namespace pollution beyond existing patterns
- Prefer const/let with narrow scope
- Query via ID for key elements

## 6.2 LocalStorage System

Used for:

- Preferences (e.g., 12h vs 24h)
- Theme selections on customizable pages
- Timer/stopwatch session state

All keys must use:

    lcl-<feature>-<setting>

to avoid collisions.

## 6.3 Interval-Driven Tools

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
- keywords
- description
- Open Graph metadata
- Twitter cards

Images point to:

    https://linearclocklab.com/profile.png

These ensure consistent previews across platforms.

Scripts go at the bottom of `<body>` to avoid blocking rendering.

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
- Mirrors `.grid` and `.card` logic from index.
- Uses toolbar/header sections consistent with other UIs.

## 8.5 lcl.css

Contains only:

- Global dark enforcement
- Forced-colors override

No additional styling belongs here.

---

# 9. Accessibility Architecture

- High contrast always maintained (dark + accent).
- aria-labels used for controls.
- aria-hidden applied to decorative separators.
- Large, touch-friendly click targets.
- No reliance on color-only interactions.

---

# 10. Error Prevention Architecture (Critical)

Agents must ensure:

- No `@media (prefers-color-scheme: light)` exists anywhere.
- No light-mode tokens remain.
- No tool replicates the multi-link navigation of index.
- No accidental introduction of external scripts or CDN assets.
- No rearrangement of script positions.
- No global CSS rules are added to lcl.css unless truly global.
- No mixing of UI patterns across tool contexts without preserving identity.

---

# 11. Extensibility Architecture (Future-Proofing)

When adding new tools:

- They must follow existing layout + typography patterns.
- They must begin with the canonical `<head>` block.
- They must declare their own `:root` tokens.
- They must contain a Home link.
- They must store user prefs via `localStorage`.
- They must use grid/flex patterns that match existing pages.
- They must not introduce new dark/light logic.
- They must avoid global namespace pollution.

---

# 12. Summary

Linear Clock Lab operates as a collection of highly consistent, tightly scoped, fully static tools held together by a shared dark theme, a synchronized design-token system, a hub-and-spoke navigation model, and strict architectural rules.

All future work must remain:

- Deterministic
- Minimalist
- Dark-only
- Offline-native
- Neon-accented
- Consistent in design and function
- Compatible with existing patterns

This document serves as the authoritative architecture reference for all agents and all future development within LCL.
