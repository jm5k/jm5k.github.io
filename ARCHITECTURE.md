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
- A shared CSS foundation (`lcl.css`) for stable tokens and reused components
- A narrow shared time-formatting utility (`lcl-time.js`)
- Page-specific inline CSS and controller JS
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

LCL uses a hybrid JavaScript architecture: shared files hold only pure, reused utilities, while each page keeps its independent inline controller at the end of `<body>`.

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

## 6.3 LocalStorage System

Used for:

- Preferences (e.g., 12h vs 24h)
- Theme selections on customizable pages
- Timer/stopwatch session state

All keys must use:

    lcl-<feature>-<setting>

to avoid collisions.

## 6.4 Interval-Driven Tools

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

- Stable shared design tokens
- Accessibility-safe dark foundations
- Namespaced components used by multiple pages

Page-specific layout does not belong here.

## 8.6 lcl-time.js

Contains only the frozen, pure `LCLTime` formatting API. Page controllers remain inline and independent.

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
- No page-specific layout is added to `lcl.css`.
- No shared utility takes ownership of DOM state, LocalStorage, events, or intervals.
- No mixing of UI patterns across tool contexts without preserving identity.

---

# 11. Extensibility Architecture (Future-Proofing)

When adding new tools:

- They must follow existing layout + typography patterns.
- They must begin with the canonical `<head>` block.
- They inherit shared tokens and declare only necessary local overrides or page-specific tokens.
- They must contain a Home link.
- They must store user prefs via `localStorage`.
- They must use grid/flex patterns that match existing pages.
- They must not introduce new dark/light logic.
- They must avoid global namespace pollution.
- Code used by one page stays local until a clear multi-page reuse case exists.

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
