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

   - No light mode.
   - No OS theme inheritance.
   - No `prefers-color-scheme: light`.
   - All pages enforce dark colors and must remain consistent across browsers.

2. **Static HCJ only**

   - No frameworks, build systems, bundlers, preprocessors, TypeScript, or external libraries.

3. **Offline-first**

   - No CDNs.
   - No analytics.
   - No imports from remote URLs.

4. **Tool pages are independent**
   Each page contains:

   - Inline `<style>` with feature tokens.
   - Inline `<script>` (bottom of `<body>`).
   - A “Home” link back to `index.html`.
   - `index.html` is the only multi-link hub.

5. **Design tokens rule everything**

   - All new UI must use CSS variables.
   - No hard-coded colors except pure black (`#000`) in hard-fallback blocks.

6. **Neon accent identity**

   - Accent is consistent across tools.
   - Glows, markers, ticks, focus rings, etc. must follow existing accent usage patterns.

7. **SEO consistency**
   All pages follow a canonical head structure with:

   - Core meta tags.
   - Color scheme locks.
   - Social previews.
   - Icons from `https://linearclocklab.com/profile.png`.

8. **Responsiveness via CSS only**

   - Percent widths.
   - `min()` patterns.
   - Flex/grid auto-fit layouts.
   - Occasional `clamp()`.
   - No JS for layout.

9. **Index.html is the hub**

   - Tool pages do not cross-link each other.
   - Each tool page only returns to Home.

10. **User trust and clarity**

    - Small scripts.
    - Small UIs.
    - Simple patterns.
    - Predictable behavior.

---

# 2. Agent Roles

## 2.1 Codex Agent (Primary Engineering Agent)

Authoritative code-editing agent for HTML, CSS, and JavaScript.

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
- Inline CSS stays inline unless a rule must be truly global.
- Inline JS stays at bottom of `<body>`.
- No refactoring into modules unless explicitly requested.
- No altering of time logic or calculations unless explicitly instructed.

### Typical Tasks

- Remove legacy light-mode media queries.
- Standardize `<head>` and SEO blocks.
- Add missing design tokens to `:root`.
- Normalize tick/rail/marker styles.
- Ensure responsive patterns match existing layout patterns.
- Synchronize global behaviors (scroll bars, accent hover states).
- Enforce placement of script blocks and back-nav links.

---

## 2.2 LCL Architect Agent (Design & UX Consistency)

Ensures design and UX integrity.

### Responsibilities

- Verify CSS variable naming consistency.
- Validate color choices, glows, and accent patterns.
- Protect the neon-on-dark visual identity.
- Confirm typography stacks match page-specific patterns.
- Maintain component consistency (cards, grids, rails, inputs, buttons).

### Behavioral Rules

- No color drift: new features must use existing tokens or extend them with aligned naming.
- No layout innovations unless explicitly requested.
- No nav bars except:

  - Index hub grid.
  - Single “Home” link on all other pages.

- No light backgrounds.

### Example Checks

- `.wrap` consistency on clock pages.
- `.grid` + `.card` layout uniformity on index hub.
- Card borders and glow-on-hover behavior.
- Tick/marker rail visuals remain consistent across clock tools.

---

## 2.3 QA Agent (Validator)

Detects problems. Never modifies code.

### Responsibilities

- Validate correctness, accessibility, and rendering.
- Check for missing design tokens.
- Detect broken responsive behavior.
- Confirm absence of undesirable CSS (e.g., `prefers-color-scheme: light`).
- Ensure inline scripts avoid excessive global namespace pollution.
- Confirm “Home” link exists on every tool page.

### Categories for Findings

- Bug
- Inconsistency
- Missing element
- Theme break
- Optimization opportunity

---

## 2.4 Documentation Agent (Writer)

Creates consistent Markdown documentation.

### Responsibilities

- Produce readable, organized Markdown.
- Use monolithic code blocks for code examples (4-space indentation).
- Convert architectural details into maintainable docs.
- Never mix prose and code inside the same block.
- Respect the project voice: direct, clear, professional.

### Deliverables

- README sections.
- Feature guides.
- UX descriptions.
- Style, component, and theming docs.
- Changelogs (when requested).

---

## 2.5 PromptSmith Agent (Prompt Engineering)

Transforms UI/UX/code requests into Codex-ready instructions.

### Responsibilities

- Write precise, deterministic prompts.
- Enforce guardrails in prompts.
- Prevent accidental file destruction or unwanted refactors.
- Provide repo-wide batch-update prompts.
- Include rollback instructions when required.

### Example Tasks

- “Remove all light-mode CSS from every HTML file.”
- “Normalize all `<head>` blocks.”
- “Inject new back-nav pattern into all tool pages.”
- “Add/update SEO metadata across all pages.”

---

# 3. Page Structures

## 3.1 Standard Head

Every page must contain:

---

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="color-scheme" content="dark light">
<meta name="theme-color" content="#000000">
<link rel="stylesheet" href="lcl.css">
---

Plus:

- `<title>`
- Description
- Keywords
- Author
- Robots
- Canonical URL
- Open Graph tags
- Twitter cards
- Favicon / apple-touch icon pointing to `https://linearclocklab.com/profile.png`

Scripts must be placed at the bottom of `<body>`.

## 3.2 Head/Meta Checklist

- `charset="UTF-8"` present.
- `viewport` present.
- `color-scheme="dark light"` and `theme-color="#000000"`.
- `lcl.css` linked in `<head>`.
- Title, description, keywords, author, robots, canonical present.
- OG/Twitter cards present; images use `https://linearclocklab.com/profile.png`.
- Icons set correctly.
- No duplicate or missing core meta entries.
- No light-mode media queries.
- Scripts live at end of `<body>`.

---

# 4. Theming

## 4.1 Design Tokens

Each page includes local tokens inside `<style>`:

---

:root {
--bg: #000;
--fg: #e0e0e0;
--muted: #5a5a5a;
--accent: #00eaff;
--line: #00eaff; /_ clock rails _/
--chip: #111;
--chip-brd: #222;
--glow: rgba(0, 234, 255, 0.5);
/_ additional tokens per tool as needed _/
}

---

Rules:

- New variables must follow existing naming patterns.
- Token sets must not redefine light-mode values.
- Tools like `clock_presets.html` may use `data-theme` with alternate token dictionaries.
- Accent glow must remain subtle and consistent across tools.

## 4.2 Global Dark Enforcement

Stored in `lcl.css`:

---

html, body { background: var(--bg) !important; color: var(--fg) !important; }
html { color-scheme: dark !important; }
@media (forced-colors: active) { \* { forced-color-adjust: none !important; }
}

---

Rules:

- Only truly global dark-mode behavior lives in `lcl.css`.
- Do not add page-specific tokens or layout rules to `lcl.css`.

---

# 5. Layout & Typography

## 5.1 Layout Patterns

- Use flex and grid.
- Width constraints:

  - `width: min(1000px, 92vw);` for primary wrappers.

- Common classes:

  - `.wrap` — clocks and linear tools.
  - `.grid` + `.card` — index hub.
  - `.toolbar`, `.header` — dashboard & tool UIs.

## 5.2 Typography

**Monospace (clock, timers, stopwatch):**

---

## ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace

**System UI (dashboards, other tools):**

---

## system-ui, "Segoe UI", sans-serif

Rules:

- Follow the font family already used on the page.
- Size adjustments may use `clamp()` where appropriate.
- Hairline separators use low-opacity strokes.

---

# 6. Component System

## 6.1 Rails & Ticks

- Percent-based positioning.
- Accent markers and light glows.
- Minimal borders.

## 6.2 Cards

- Background around `#0a0a0a`.
- 1px border using accent or muted tones.
- Small radii.
- Hover: glow shift, not structural shift.

## 6.3 Inputs / Controls

- Dark backgrounds (`#111`).
- Light 1px borders.
- Accent hover/focus rings.
- Compact spacing, monospace text where appropriate.

## 6.4 Back Navigation

Each non-index page includes:

---

<nav class="lcl-back-nav">
    <a href="index.html">← Home</a>
</nav>
---

Rules:

- Only one back link.
- No additional nav bars.

---

# 7. JavaScript Patterns

- Vanilla JS only (no libraries).
- Inline `<script>` at bottom of `<body>`.
- Query via `document.getElementById` for main controls.
- Attach event listeners once per element.
- Keep scopes narrow.
- Persist preferences using `localStorage`.
- Intervals for clocks/timers must be lightweight and avoid layout thrashing.
- No large global objects beyond existing patterns.

---

# 8. Responsiveness & Accessibility

- Use percentage widths, flex-wrap, and auto-fit grids.
- Apply `clamp()` for text on visually dense tools.
- Use `aria-label` for controls.
- Use `aria-hidden` on decorative items.
- Maintain high contrast (dark background + accent + readable text).
- Avoid purely color-based indicators when possible; use shape/position plus color.

---

# 9. File-Specific Rules

## 9.1 index.html

- Acts as the hub.
- Uses a `.grid` of `.card` links.
- Card hover = accent glow.
- Only index lists tools; tools do not cross-link each other.

## 9.2 clock.html, multi-clock.html, clock_presets.html

- Use `.wrap`.
- Monospace themes.
- Ticks, rails, markers share alignment patterns.
- `clock_presets.html` may use `<html data-theme>` as a pattern for extensible theming.

## 9.3 focus.html, stopwatch.html, timer.html

- Compact UIs with dark cards.
- Inputs/buttons consistent with accent and dark backgrounds.
- Maintain visual minimalism.

## 9.4 dashboard.html

- Composite tile-based layout.
- Must preserve spacing consistency with other tools.

## 9.5 lcl.css

- Holds only global dark-mode rules.
- No page-specific tokens or layout rules.

---

# 10. Authoring Checklist

1. Copy a correct head/meta block.
2. Declare local design tokens via `:root`.
3. Keep CSS and JS inline unless a rule belongs in `lcl.css`.
4. Add a top “Home” back link (`.lcl-back-nav`).
5. Build UI with flex/grid following existing page patterns.
6. Persist user settings with `localStorage`.
7. Validate responsiveness with `min()`, `max()`, and `clamp()`.
8. Confirm no light-mode media queries remain.
9. Test in Chrome, Firefox, Edge, Safari.
10. Confirm dark enforcement on system-light machines.

---

# 11. Clock-Family Time Standard

For all clock-like tools (e.g., `clock.html`, `task-planner-lc.html`, future timeline tools):

- Internal “time of day” must use one of:

  - **Seconds since midnight** (`0–86399`) for pure display clocks.
  - **Minutes since midnight** (`0–1439`) for schedule/planner logic.

The Task Planner Clock must:

- Store zone start times as **minutes since midnight**.
- Derive all human-readable times from those minutes using a single formatting helper that respects 12h/24h mode.

Rules:

- New tools must not introduce alternative encodings in storage.
- Do not store `Date` objects or raw `"HH:MM"` strings in `localStorage`.
- New time-visualization tools must clone layout + typography patterns from `clock.html`, including:

  - `.wrap` width and padding.
  - Monospace font stack.
  - 24h rail placement and tick behavior.

- Variations must be minimal and purpose-driven (additional overlays, labels, panels only).

---

# 12. CHANGELOG.md Rules

For every completed task that modifies any part of LCL (HTML, CSS, JS, metadata, tokens, navigation, or documentation), an agent must append a new entry at the **top** of `CHANGELOG.md`.

The changelog is a permanent truth record of all AI-performed changes and must always reflect exactly what was done.

Each entry must contain:

## 12.1 Date

- Format: `YYYY-MM-DD`.

## 12.2 Short Title

- 3–8 word summary capturing the purpose of the update.

  - Examples:

    - “Remove Light-Mode Overrides”
    - “Standardize Head Blocks”
    - “Add Token Set for Clock Presets”

## 12.3 Summary

- 1–3 sentences describing:

  - What changed.
  - Why it was changed.
  - What part of the system it affects.

## 12.4 LCL Technical Details (Bulleted)

Include bullets for:

- HTML pages updated (names + purpose).
- CSS blocks added/removed/modified.
- JavaScript logic added/updated (IDs, functions).
- Tokens created, renamed, or removed (`--bg`, `--fg`, `--accent`, etc.).
- Navigation changes (hub or back-nav updates).
- SEO/meta block updates.
- Accessibility improvements (ARIA labels, roles, etc.).
- Responsive layout fixes (grid/flex/wrapper changes).
- Dark-mode enforcement changes.

## 12.5 Files Touched

List every affected file:

- HTML pages.
- Inline `<style>` / `<script>` changes.
- `lcl.css` (if touched).
- JS blocks inside pages.
- Markdown/docs (e.g., `AGENTS.md`, `UI_RULES.md`, `STYLEGUIDE.md`, etc.).

## 12.6 Testing Notes

Specify:

- Manual tests to run (e.g., “Load `clock.html` on light-mode systems”).
- Browser compatibility checks (Chrome, Firefox, Edge, Safari).
- Responsive checks (mobile/desktop).
- Behavior tests (rails, markers, timers, presets, dashboard).
- `localStorage` persistence checks.
- Accessibility tests (screen reader, keyboard navigation).

## 12.7 Risks & Edge Cases

Identify:

- Potential regressions.
- Cross-page styling impacts.
- Token collisions or overrides.
- Dark-mode enforcement pitfalls.
- JS timing risks (e.g., `setInterval` sensitivity).
- Navigation consistency issues.

## 12.8 Follow-Up Suggestions (Optional)

Small, targeted improvements for future updates:

- Token normalization.
- Additional accessibility labeling.
- Code cleanup.
- Documentation corrections.
- Performance improvements.

## 12.9 Operational Rules

1. The newest entry is always added at the **top**.
2. Entries must be factual, concise, and specific.
3. Codex must not modify older entries unless explicitly instructed.
4. All entries must reflect actual changes performed during the task.
5. No task is considered complete until its changelog entry is created and validated.
6. If a task results in no file modifications, a short note entry must still be added indicating “No changes required”.
7. Separate each entry with a `---` divider for readability.

---

# 13. Final Notes

This `AGENTS.md` is the authoritative specification for all code, design, UX, JS, and documentation operations inside Linear Clock Lab. All future work must follow this guide to preserve the suite’s identity, consistency, performance, and maintainability.
