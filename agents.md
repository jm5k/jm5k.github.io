# AGENTS.md — Linear Clock Lab

## Project Overview

Linear Clock Lab (LCL) is a unified suite of minimalist, privacy-first, browser-native time visualization tools. Everything is built using pure HTML, CSS, and JavaScript (HCJ). No frameworks. No external calls. No dependencies. No telemetry. Each page is static, local, and designed around a consistent neon-cyan-on-black visual identity.

Apps include:

- 24-hour linear clock
- Multi-zone clock
- FocusLine Pomodoro
- Timers
- Stopwatch
- Dashboard
- Presets
- Future modules as the suite grows

The goal is design consistency, code stability, and predictable UX across all tools.

---

# 1. Codex Agent (Primary Engineering Agent)

## Responsibilities

- Apply safe, deterministic code updates.
- Perform repo-wide search/replace operations with strict boundaries.
- Inject or remove repeated structures (nav bars, meta blocks, theme blocks).
- Enforce LCL HTML/CSS/JS consistency.
- Generate complete drop-in files when requested.
- Provide diff-style patch summaries where appropriate.
- Never redesign or reflow unless explicitly instructed.

## Rules

- Determinism is required; avoid creativity unless asked.
- Never hallucinate files or structures.
- Preserve (do not rewrite) formatting unless specifically asked.
- Avoid mixing prose inside code blocks.
- Respect the project’s “dark-only + neon cyan” identity at all times.

## Typical Tasks

- Global HTML head normalization.
- Removing breaking CSS like prefers-color-scheme overrides.
- Ensuring consistent use of lcl.css.
- Normalizing nav structure across all pages.
- Standardizing localStorage keys.
- Safe refactors inside js/shared.js.

---

# 2. LCL Architect (Design Consistency Agent)

## Responsibilities

- Prevent UI drift between pages.
- Enforce the neon cyan accent and black/dark background theme.
- Verify layout rules (container widths, spacing, headers, nav).
- Validate that each page uses consistent CSS variables.

## Rules

- No new colors unless explicitly approved.
- No layout experiments unless defined by the user.
- Maintain identical nav and header structures across apps.

---

# 3. QA Agent (Validator)

## Responsibilities

- Identify issues without modifying code.
- Test rendering in dark-only mode.
- Confirm no white backgrounds, broken CSS, or missing variables.
- Validate that all pages load lcl.css and inline styles correctly.
- Confirm localStorage works safely across pages.

## Output Format

- Must categorize findings as:
  - Bug
  - Inconsistency
  - Missing element
  - Theme break
  - Optimization opportunity

---

# 4. Writer Agent (Documentation & Markdown)

## Responsibilities

- Produce clean Markdown documentation.
- Maintain clarity without creativity unless allowed.
- Preserve monolithic code-block formatting.
- Use 4-space indentation inside code examples.
- Avoid mode switches or mixed prose inside code.

## Typical Tasks

- Writing README sections.
- Creating feature documentation.
- Explaining architecture or module behavior.

---

# 5. PromptSmith Agent (Prompt Engineering)

## Responsibilities

- Translate feature requests into precise Codex instructions.
- Prevent ambiguity and unintended edits.
- Ensure safety when applying repo-wide changes.
- Provide rollback instructions when needed.

## Typical Tasks

- Creating prompts for mass HTML cleanup.
- Removing deprecated CSS blocks.
- Synchronizing metadata across pages.
- Enforcing new global design rules.

---

# Shared Rules for All Agents

1. No frameworks of any kind.
2. No dependencies or external libraries.
3. No network calls; LCL is fully offline.
4. All styling must use CSS variables defined in :root.
5. No bright/light theme values ever.
6. No altering of page layout without explicit instruction.
7. All code must support Chrome, Edge, Firefox, Safari.
8. Never change semantics of tools (timers remain timers, etc.).
9. Respect the user’s strict Markdown+code-block rules.
10. All code output must be deterministic, stable, and consistent.

---

# STYLEGUIDE.md — Linear Clock Lab

## Purpose

This styleguide defines the visual identity, structure, and behavior of all Linear Clock Lab pages. It ensures every module looks and behaves the same across the entire suite.

---

# 1. Core Philosophy

- Minimalist, not empty.
- Dark-only aesthetic, never OS-dependent.
- Neon cyan accent as brand cornerstone.
- Pure HTML/CSS/JS.
- No telemetry, no network calls.
- Predictable layout and UI behavior.
- Consistent nav, typography, spacing, and interaction.

---

# 2. Directory Structure

/root  
 index.html  
 lcl.css  
 favicon.svg  
 /img  
 /js  
 shared.js  
 (app-specific modules)  
 /apps  
 clock.html  
 multi.html  
 focusline.html  
 timers.html  
 stopwatch.html  
 dashboard.html  
 presets.html

Rules:

- All styling goes in lcl.css or in-page <style> blocks following this guide.
- All shared JS lives in js/shared.js.
- No duplicated utility logic across pages.

---

# 3. HTML Structure Rules

## Required Head Block

Each page must contain:

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="color-scheme" content="dark light">
    <meta name="theme-color" content="#000000">
    <link rel="stylesheet" href="lcl.css">
    <link rel="icon" href="favicon.svg">

Rules:

- Keep this ordering.
- Do not place scripts in <head>.
- Keep SEO blocks after these required lines.

## Body Structure

Each page begins:

    <body>
        <nav class="lcl-nav">...</nav>
        <main>...</main>
    </body>

Prohibited:

- No inline styles unless fallback.
- No conflicting CSS variables.
- No duplicate nav structures.

---

# 4. Color Style Rules

Use CSS variables exclusively:

    :root {
        --bg:#000000;
        --fg:#e0e0e0;
        --muted:#5a5a5a;
        --line:#00eaff;
        --accent:#00eaff;
        --chip:#111111;
        --chip-brd:#222222;
    }

Rules:

- Never hardcode colors except #000 for emergency fallbacks.
- No light theme variant.
- Remove all @media (prefers-color-scheme: light).

---

# 5. Background / Theme Enforcement

These rules must exist either in lcl.css or in each page’s <style>:

    html, body { background: var(--bg) !important; color: var(--fg) !important; }
    html { color-scheme: dark !important; }
    @media (forced-colors: active) {
        * { forced-color-adjust: none !important; }
    }

These prevent white backgrounds and force Chrome/Safari to stay dark.

---

# 6. Typography

Use system-safe fonts:

    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

Sizes:

- h1 = 2.0rem
- h2 = 1.6rem
- h3 = 1.25rem
- body = 1rem

Rules:

- No external font imports.
- No decorative fonts.

---

# 7. Navigation Bar

Structure:

    <nav class="lcl-nav">
        <a href="index.html">Home</a>
        <a href="clock.html">Linear Clock</a>
        <a href="multi.html">Multi-Zone</a>
        <a href="focusline.html">FocusLine</a>
        <a href="timers.html">Timers</a>
        <a href="stopwatch.html">Stopwatch</a>
        <a href="dashboard.html">Dashboard</a>
        <a href="presets.html">Presets</a>
    </nav>

Rules:

- Identical on all pages.
- Thin cyan underline.
- Dark background integration.
- Never collapses to hamburger; multiline wrapping only.

---

# 8. Layout Rules

## Container

    max-width: 920px;
    margin: 0 auto;
    padding: 1rem;

## Cards

    background: var(--bg-alt);
    border: 1px solid var(--accent);
    padding: 1rem;
    border-radius: 6px;

## Two-column grid

    .two-col {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }

---

# 9. JavaScript Rules

- camelCase for variables
- UPPER_SNAKE_CASE for constants
- No global variables except app state container
- Event listeners only in JS
- No inline onclick usage
- localStorage keys must begin with "lcl-"

---

# 10. Accessibility

- Maintain 4.5:1 contrast.
- Use semantic HTML (nav, main, button).
- Avoid click-only divs.

---

# 11. Mobile

- Minimum button height: 44px
- Timeline/clock elements must scale linearly
- Avoid text overflow
- Navigation wraps, not compresses

---

# 12. Browser Support

- Chrome
- Edge
- Firefox
- Safari (iOS included)
- No legacy browser hacks

---

# 13. Prohibited Practices

- No frameworks
- No CDNs
- No analytics
- No TypeScript
- No Bootstrap/Tailwind
- No React/Vue/Svelte
- No system light-mode behaviors
- No white backgrounds
- No redesigns unless explicitly asked
- No mixing code and prose output

---

# 14. Commit Rules

Format:

    [module]: brief description

Examples:

- clock: fix tick rendering
- css: remove light-mode override
- dashboard: add module cards
- timers: improve localStorage handling

---

# 15. Documentation Rules

- Pure Markdown
- Use monolithic code blocks
- Use 4-space indentation
- No mid-block prose

---

# Conclusion

These documents form the single source of truth for all structure, design, and behavioral rules within Linear Clock Lab. Following them ensures consistent look, predictable performance, stable code, and a cohesive brand across the entire suite.
