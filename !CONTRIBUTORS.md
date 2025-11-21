# CONTRIBUTORS.md — Linear Clock Lab (LCL)

Thank you for your interest in contributing to Linear Clock Lab.  
LCL is a suite of minimalist, neon-accented, dark-only time tools built entirely with static HTML, CSS, and JavaScript.  
This document outlines expectations, workflows, quality rules, and collaboration guidelines for all contributors.

Please read this guide carefully before submitting changes.

---

# 1. Core Principles

All contributions must follow these foundational rules:

1. **Dark-Only**  
    LCL intentionally ships with *no* light theme and does not respect OS light-mode.  
    Every page enforces dark backgrounds via tokens.

2. **Neon-Accent Identity**  
    Accent color is neon-cyan and must remain consistent across all tools.

3. **Static HCJ**  
    LCL is 100% framework-free:  
    - No React, Vue, Svelte  
    - No Tailwind, Bootstrap, Material  
    - No bundlers  
    - No external CDNs or dependencies

4. **Hub-and-Spoke Navigation**  
    - `index.html` is the hub  
    - All other pages contain *one* back-link to Home  
    - No multi-link navigation in tool pages

5. **Minimal, Predictable UI**  
    Layouts, typography, spacing, and glow patterns follow strict rules (see UI_RULES.md).

6. **Token-Based Theming**  
    All colors, glows, borders, and UI metrics use `:root` CSS variables.

7. **Inline CSS + Inline JS**  
    All tool-specific styling and scripting is inline per file.  
    `lcl.css` contains only global dark-mode enforcement.

---

# 2. How to Contribute

## 2.1 Fork → Branch → PR
Standard workflow:

    1. Fork the repo  
    2. Create a feature branch  
    3. Make isolated, well-scoped changes  
    4. Ensure compliance with all architecture + UI rules  
    5. Add a CHANGELOG entry  
    6. Submit a pull request

PRs without proper CHANGELOG entries may be rejected.

---

# 3. Contribution Types

## 3.1 Documentation
- Fixing inconsistencies  
- Improving clarity  
- Adding examples  
- Updating architectural documents  
- Writing guides for new contributors  
- Enhancing internal agent documentation  

## 3.2 Feature Development
- New tool pages (clocks, dashboards, timers, visualizers)
- New presets or settings
- UI improvements following UX consistency rules
- Additional configuration options for existing tools

All new tools must:
    - Start from the canonical HTML structure
    - Declare their own `:root` tokens
    - Add a back navigation link
    - Use inline CSS and JS
    - Add themselves to `index.html`

## 3.3 Fixes & Improvements
- Removing light-mode overrides
- Fixing alignment or spacing bugs
- Improving responsive behavior
- Tuning glows, borders, or accents
- Ensuring accessibility (aria tags, role attributes)

---

# 4. Code Style Requirements

## 4.1 HTML
- Use semantic HTML5  
- Keep structure minimal  
- Place scripts at bottom of `<body>`  

## 4.2 CSS
- Use only inline `<style>` blocks  
- Use only tokens (`--bg`, `--fg`, etc.)  
- No external stylesheets except `lcl.css`  
- No animations unless explicitly requested  

## 4.3 JavaScript
- Use vanilla JS  
- Use `const` and `let` carefully  
- Query elements by `id` for core interactions  
- Keep logic small and page-specific  
- Use `localStorage` sparingly but consistently  
- Avoid global pollution  

---

# 5. Design Consistency Requirements

All contributions *must* comply with:
- `ARCHITECTURE.md`
- `UI_RULES.md`
- `COMPONENTS.md`
- `AGENTS.md`

Breaking these rules risks a UI or UX drift, and pull requests will be rejected.

---

# 6. Testing Requirements

Before submitting changes:

### Functional Tests
- Load the modified pages in Chrome, Edge, Firefox, Safari  
- Test on desktop and mobile  
- Validate clock alignment, tick positions, rail markers, timers, and layout stability  
- Test localStorage persistence when applicable  

### Visual Tests
- Confirm dark theme remains consistent  
- Check accent hover, glow, and border consistency  
- Ensure no light backgrounds appear  
- Validate responsive behaviors  

### Accessibility Tests
- Check keyboard navigation  
- Check aria labels  
- Ensure no elements break screen reader flow  

---

# 7. CHANGELOG Requirements

Every PR **must** update the top of `CHANGELOG.md` following the format in AGENTS.md:

- Date  
- Short Title  
- Summary  
- Technical Details  
- Files Touched  
- Testing Notes  
- Risks & Edge Cases  
- Follow-Up Suggestions (optional)

No exceptions.

---

# 8. PR Review Expectations

When reviewing contributions, maintainers will check for:

- Architectural consistency  
- Dark-only enforcement  
- Token usage correctness  
- UI spacing and glow rules  
- Navigation rules  
- Code clarity  
- Proper CHANGELOG entry  
- Accurate testing notes  

PRs that violate any of these criteria will be returned with clear feedback.

---

# 9. Communication Guidelines

We keep collaboration focused, kind, and constructive.

Contributors should:
- Ask questions early  
- Keep proposals small and scoped  
- Provide screenshots when changing UI  
- Reference related docs when suggesting improvements  
- Follow the hub-and-spoke navigation model  

---

# 10. License and Ownership

Linear Clock Lab is open for contributions, but the project direction, design language, and architectural consistency are tightly maintained to ensure long-term cohesion.

By contributing, you agree that:
- All contributions become part of LCL  
- All contributions must comply with the design and architecture rules  
- Changes may be edited or refined for consistency  

---

# 11. Thank You

We appreciate your interest in contributing to LCL.  
Your help makes the project stronger, more polished, and more delightful to use.

If you're unsure where to begin, feel free to start with:
- Documentation improvements  
- UI polish  
- Dark-mode consistency fixes  
- Small bug fixes  
- Adding new presets or tweakable controls  

Welcome aboard, and thanks for helping make Linear Clock Lab even better.
