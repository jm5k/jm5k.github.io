# AGENTS.md — Linear Clock Lab (LCL)

This document defines the complete operational ruleset for all automation, coding, and documentation agents working within Linear Clock Lab (LCL). It expands the architecture, design, behavior, constraints, and workflows inferred from the current HTML/CSS, ensuring all future work remains consistent, safe, and predictable.

LCL is:

- Dark-only
- Neon-accented
- Static HTML/CSS/JS (HCJ)
- Framework-free
- Local-only and privacy-first
- Designed around consistency, minimalism, and reliability
- A suite of standalone tools unified by common design tokens and UX patterns

All agents must adhere to this guide strictly.

---

# 1. Architectural Principles

LCL conforms to these universal rules:

1. **Dark-only design**  
   No light mode. No OS theme inheritance. No `prefers-color-scheme: light`.  
   All pages enforce dark colors and must remain consistent across browsers.

2. **Static HCJ only**  
   No frameworks, build systems, bundlers, preprocessors, TypeScript, or external libraries.

3. **Offline-first**  
   No CDNs, no analytics, no imports from remote URLs.

4. **Tool pages are independent**  
   Each page contains:

   - Inline `<style>` with feature tokens
   - Inline `<script>` (bottom of `<body>`)
   - A “Home” link back to `index.html`  
     Index is the only multi-link hub.

5. **Design tokens rule everything**  
   All new UI must use CSS variables. No hard-coded colors except pure black (#000) in hard-fallback blocks.

6. **Neon accent identity**  
   Accent is consistent across tools. Glows, markers, ticks, focus rings, etc. must follow the existing accent usage patterns.

7. **SEO consistency**  
   All pages follow a canonical head structure with:

   - Core meta tags
   - Color scheme locks
   - Social previews
   - Icons from `https://linearclocklab.com/profile.png`

8. **Responsiveness via CSS only**  
   Percent widths, `min()` patterns, flex/grid auto-fit layouts, and occasional `clamp()`. No JS for layout.

9. **Index.html is the hub**  
   Tool pages do not cross-link; they only return to Home.

10. **User trust and clarity**  
    Small scripts, small UIs, simple patterns, predictable behavior.

---

# 2. Agent Roles

## 2.1 Codex Agent (Primary Engineering Agent)

This is the authoritative code-editing agent.  
It modifies HTML, CSS, and JavaScript within strict constraints.

### Responsibilities

- Perform safe edits across the repo.
- Maintain structure, spacing, ordering, indentation, and design tokens.
- Preserve existing inline CSS and JS patterns.
- Guarantee dark-mode enforcement on all pages.
- Apply global multi-file changes without breaking formatting.
- Produce diff-style output for updates unless a full file rewrite is requested.
- Never introduce frameworks, dependencies, external scripts, or redesigns.

### Behavioral Rules

- Deterministic edits; no speculation.
- Adhere to token names (`--bg`, `--fg`, `--muted`, `--accent`, `--line`, etc.).
- Inline CSS stays inline unless rule must be truly global.
- Inline JS stays at bottom of `<body>`.
- No refactoring into modules unless explicitly requested.
- No altering of time logic or calculations unless instructed.

### Typical Tasks

- Remove legacy light-mode media queries.
- Standardize `<head>` and SEO blocks.
- Add missing design tokens to `:root`.
- Normalize tick/rail/marker styles.
- Ensure responsive patterns match existing layout patterns.
- Synchronize global behaviors (e.g., scroll bars, accent hover states).
- Enforce placement of script blocks and back-nav links.

---

## 2.2 LCL Architect Agent (Design & UX Consistency)

Ensures design integrity.

### Responsibilities

- Verify CSS variable naming consistency.
- Validate color choices, glows, gradients, and accent patterns.
- Protect the neon-on-dark visual identity.
- Confirm typography stacks match page-specific patterns.
- Maintain component consistency (cards, grids, rails, inputs, buttons).

### Behavioral Rules

- No color drift: new features must use existing tokens or extend them using aligned naming.
- No layout innovations unless explicitly greenlit.
- No nav bar except index hub and one “Home” link on all other pages.
- No light backgrounds — ever.

### Example Checks

- `.wrap` consistency on clock pages.
- `.grid` + `.card` layout uniformity on index hub.
- Cards maintain subtle borders and glow-on-hover.
- Tick/marker rail visuals remain consistent across clock tools.

---

## 2.3 QA Agent (Validator)

Detects problems. Never modifies code.

### Responsibilities

- Validate correctness, accessibility, rendering, contrast.
- Check for missing design tokens.
- Detect broken responsive behavior.
- Confirm absence of undesirable CSS (e.g., `prefers-color-scheme: light`).
- Ensure no inline scripts cause global namespace pollution beyond existing patterns.
- Confirm Home link exists on every tool page.

### Categories for Findings

- Bug
- Inconsistency
- Missing element
- Theme break
- Optimization opportunity

---

## 2.4 Documentation Agent (Writer)

Creates consistent Markdown files.

### Responsibilities

- Produce readable, organized Markdown.
- Use monolithic code blocks for code examples (4-space indentation).
- Convert architectural details into maintainable docs.
- Never mix prose and code inside a block.
- Respect the project voice: direct, clear, professional.

### Deliverables

- README sections
- Feature guides
- UX descriptions
- Style, component, and theming docs
- Change logs (when requested)

---

## 2.5 PromptSmith Agent (Prompt Engineering)

Transforms UI/UX/code requests into Codex-ready instructions.

### Responsibilities

- Write precise, deterministic prompts.
- Enforce guardrails.
- Prevent accidental file destruction or unwanted refactors.
- Provide repo-wide batch-update prompts.
- Include rollback instructions when required.

### Example Tasks

- “Remove all light-mode CSS from every HTML file”
- “Normalize all `<head>` blocks”
- “Inject new back-nav pattern into all tool pages”
- “Add/update SEO metadata across all pages”

---

# 3. Expanded System: Page Structures

## Standard Head

Every page must contain:

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="color-scheme" content="dark light">
    <meta name="theme-color" content="#000000">
    <link rel="stylesheet" href="lcl.css">

Plus:

- title
- description
- keywords
- author
- robots
- canonical URL
- OG tags
- Twitter cards
- favicons that point to https://linearclocklab.com/profile.png

Scripts:  
Placed at the bottom of `<body>`.

## Head/Meta Smoke Checklist

- Charset = UTF-8 and viewport present.
- color-scheme = dark light, theme-color = #000000.
- lcl.css linked in head.
- Title + description + keywords + author + robots + canonical.
- OG/Twitter cards present; images point to https://linearclocklab.com/profile.png.
- Icons (favicon/apple-touch/manifest) set.
- No duplicate or missing core meta entries; no light-mode media queries.
- Scripts live at end of body.

---

# 4. Expanded System: Theming

## Design Tokens

Each page includes local tokens inside `<style>`:

    :root {
        --bg: #000;
        --fg: #e0e0e0;
        --muted: #5a5a5a;
        --accent: #00eaff;
        --line: #00eaff;  /* clock rails */
        --chip: #111;
        --chip-brd: #222;
        --glow: rgba(0, 234, 255, 0.5);
        /* additional tokens per tool as needed */
    }

Rules:

- All new variables must follow existing naming patterns.
- Token sets must not redefine light-mode values.
- Tools like `clock_presets.html` may use `data-theme` with alternate token dictionaries.
- Accent glow must remain subtle and consistent across tools.

## Global Dark Enforcement

Stored in lcl.css:

    html, body { background: var(--bg) !important; color: var(--fg) !important; }
    html { color-scheme: dark !important; }
    @media (forced-colors: active) {
        * { forced-color-adjust: none !important; }
    }

Never expand lcl.css unless the rule must apply globally.

---

# 5. Layout & Typography System

## Layout Patterns

- Use flex and grid.
- Width constraints:
  - min/max patterns: min(1000px, 92vw)
  - Generous padding around wrappers.
- Common classes:
  - `.wrap` — clocks
  - `.grid` + `.card` — index hub
  - `.toolbar`, `.header` — dashboard & tool UIs

## Typography

- Monospace stacks for clocks and precision views:
  ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace

- System UI stacks for more general tools:
  system-ui, "Segoe UI", sans-serif

Rules:

- Follow the font family already used on the page.
- Size adjustments must use clamp() where appropriate.
- Hairline separators use low-opacity strokes.

---

# 6. Component System

### Rails & Ticks

- Percent-based positioning.
- Light glows, accent markers.
- No heavy borders; minimalistic.

### Cards

- Background around #0a0a0a
- 1px border using accent or muted tones
- Small radii
- Hover: glow shift, not structural shift

### Inputs / Controls

- Dark backgrounds (#111)
- Light 1px borders
- Accent hover/focus rings
- Compact spacing and monospace text

### Back Navigation

Each non-index page includes:

    <nav class="lcl-back-nav">
        <a href="index.html">← Home</a>
    </nav>

No other navigation allowed.

---

# 7. JavaScript Patterns

- Vanilla JS only (no libraries).
- Inline `<script>` tags at bottom of body.
- Query via ID for main controls.
- Attach event listeners once.
- Keep scopes narrow.
- Persist preferences using localStorage.
- Intervals for clock/timers must remain lightweight and avoid layout thrashing.
- No globals except small state objects when already established.

---

# 8. Responsiveness & Accessibility

- Use percentage widths, flex-wrap, and auto-fit grids.
- Apply clamp() for text on visually dense tools.
- Use aria-label for controls.
- Use aria-hidden on decorative items.
- Maintain high contrast always (dark + accent).
- Avoid purely color-based indicators when possible (accent + shape preferred).

---

# 9. File-Specific Rules (Expanded)

## index.html

- The hub.
- Uses a `.grid` of `.card` links.
- Card hover = accent glow.
- New tools added only in index, not cross-linked elsewhere.

## clock.html, multi-clock.html, clock_presets.html

- Use `.wrap`.
- Monospace themes.
- Ticks, rails, markers follow consistent alignment patterns.
- `clock_presets` uses `<html data-theme>` as a pattern for extensible theming.

## focus.html, stopwatch.html, timer.html

- Tools with compact UIs and dark cards.
- Inputs/buttons consistent with accent and dark backgrounds.
- Keep visual minimalism.

## dashboard.html

- Composite tile-based layout.
- Must preserve spacing consistency with other tools.

## lcl.css

- Holds only the enforced dark-mode rules.
- Do not add page-specific tokens or layout rules here.

---

# 10. Authoring Checklist (Expanded)

1. Start by copying a correct head/meta block.
2. Declare local design tokens via `:root`.
3. Keep all CSS and JS inline unless a rule belongs in lcl.css.
4. Add a top-left “Home” back link.
5. Build UI with flex/grid following existing page patterns.
6. Persist user settings with `localStorage`.
7. Validate responsiveness with min()/max()/clamp().
8. Confirm no light-mode media queries remain.
9. Test in Chrome, Firefox, Edge, and Safari.
10. Confirm dark enforcement works on system-light machines.

---

# 11. Enforcement Rules for All Agents

- Maintain dark-only rendering.
- Maintain neon accent and token consistency.
- Never redesign UI unless explicitly asked.
- Never introduce external dependencies.
- Never restructure JS unless requested.
- Always preserve formatting and code style.
- Any global change must be mirrored in all affected pages.
- Limit changes in lcl.css to global dark enforcement.
- Output must remain deterministic and safe.

# 12. CHANGELOG.md Rules

For every completed task that modifies any part of Linear Clock Lab (HTML, CSS, JS, metadata, tokens, navigation, or documentation), an agent must append a new entry at the TOP of `CHANGELOG.md`.

The changelog is a permanent truth record of all AI-performed changes and must always reflect EXACTLY what was done.

Each entry must contain the following fields:

#### • Date

    Format: YYYY-MM-DD

#### • Short Title

    A 3–8 word summary capturing the purpose of the update
    (e.g., “Remove Light-Mode Overrides”, “Standardize Head Blocks”, “Add Token Set for Clock Presets”)

#### • Summary

    1–3 sentences describing:
    - What changed
    - Why it was changed
    - What part of the system it affects

#### • LCL Technical Details (Bullet List)

    - HTML pages updated (names + purpose)
    - CSS blocks added/removed/modified
    - JavaScript logic added/updated (IDs touched, functions affected)
    - Tokens created, renamed, or removed (`--bg`, `--fg`, `--accent`, etc.)
    - Navigation changes (hub or back-nav updates)
    - SEO/meta block updates
    - Accessibility improvements (aria labels, roles, etc.)
    - Responsive layout fixes (grid/flex/wrapper changes)
    - Dark-mode enforcement changes (e.g., removing prefers-color-scheme blocks)

#### • Files Touched

    List **every** affected file:
    - HTML pages
    - Inline `<style>` or `<script>` changes
    - `lcl.css` (if touched)
    - JS blocks inside pages
    - Markdown/documentation files (AGENTS.md, STYLEGUIDE.md, ARCHITECTURE.md, etc.)

#### • Testing Notes

    Specify:
    - Manual tests to run (e.g., “Load clock.html on light-mode systems”)
    - Browser compatibility checks (Chrome, Firefox, Edge, Safari)
    - Responsive checks (mobile/desktop)
    - Behavior tests (rails, markers, timers, presets, dashboard)
    - LocalStorage persistence checks
    - Accessibility tests (screen reader, keyboard navigation)

#### • Risks & Edge Cases

    Identify:
    - Potential regressions
    - Cross-page styling impacts
    - Token collisions or overrides
    - Dark-mode enforcement pitfalls
    - JS timing risks (setInterval sensitivity)
    - Navigation consistency issues

#### • Follow-Up Suggestions (Optional)

    Small, targeted improvements for future updates:
    - Token normalization
    - Additional accessibility labeling
    - Code cleanup
    - Documentation corrections
    - Performance improvements

---

#### CHANGELOG.md Operational Rules

1. The newest entry is always added at the **top**.
2. Entries must be factual, concise, and specific—no speculation.
3. Codex must NEVER modify older entries unless explicitly instructed.
4. All entries must reflect actual changes performed during the task.
5. No task is considered “complete” until its changelog entry is created and validated.
6. If a task results in _no_ file modifications, a short note entry must still be added indicating “No changes required”.

This section establishes the authoritative logging rules for all future modifications within LCL.

---

# 13. Final Notes

This AGENTS.md is the authoritative specification for all code, design, UX, JS, and documentation operations inside Linear Clock Lab. All future work must follow this guide to preserve the suite’s identity, consistency, performance, and maintainability.

The Codex-generated design system has been fully expanded into actionable rules for every agent.
