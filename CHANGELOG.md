Date: 2025-11-26
Short Title: Add Task Planner link and card
Summary:

- Added inline access to the full minimal clock and repointed the hub card to the Task Planner Linear Clock with concise Now/Not Now messaging.

LCL Technical Details:

- HTML pages updated: index.html now includes a helper link under the 12/24h toggle pointing to clock.html and repurposes the former Minimal Clock card to task-planner-lc.html with a new title/description.
- CSS/JS: No changes to rail behavior, toggle logic, or marker/stats updates.
- Navigation: Hub highlights Task Planner entry; other cards remain unchanged.
- SEO/meta: No updates.
- Accessibility/Responsive: Link uses existing base styling; layout unchanged.

Files Touched:

- index.html
- CHANGELOG.md

Testing Notes:

- Manual: Load index.html; click the inline clock link to open clock.html; click the Task Planner card to open task-planner-lc.html; confirm other cards stay the same.
- Browser: Smoke in Chrome/Firefox/Edge/Safari.

Risks & Edge Cases:

- Minimal risk beyond link destinations; no functional logic altered.

Follow-Up Suggestions (Optional):

- Consider adding a brief Task Planner highlight near the hub intro.

---

Date: 2025-11-26
Short Title: Planner UI and copy updates
Summary:

- Improved Task Planner UI with live time display, format helper, grouped color options, corrected footer symbol, and refreshed description copy.

LCL Technical Details:

- HTML/CSS: Added accent current time display and muted format helper near rail; ensured rail layout remains full width; corrected footer to use &copy;.
- JavaScript: Added time display and format helper updates tied to render, ticker, and format toggle; color selects now use semantic optgroups without changing tokens or storage keys.
- Content: Updated meta description and lead paragraph with new messaging.
- Navigation/SEO: Meta description updated only for task-planner-lc.
- Accessibility/Responsive: New labels reuse existing muted styling; no structural changes elsewhere.

Files Touched:

- task-planner-lc.html
- CHANGELOG.md

Testing Notes:

- Manual: Load task-planner-lc.html; confirm current time display matches 12h/24h toggle, format helper text updates, rail spans expected width, optgroup selections persist, and footer shows ©.
- Browser: Smoke in Chrome/Firefox/Edge/Safari.

Risks & Edge Cases:

- Time display relies on client clock; incorrect system time affects accuracy.
- Dropdown grouping should preserve selections; verify localStorage values remain unchanged.
- Rail/label layout may compress on very narrow screens; check mobile.

Follow-Up Suggestions (Optional):

- Add a reset-to-defaults control for templates and clamp font sizes for narrow viewports if needed.

---

Date: 2025-11-26
Short Title: Fix planner rail and labels
Summary:

- Adjusted Task Planner rail width and label formatting to match the main clock style, ensuring even spacing and clean hour markers.

LCL Technical Details:

- HTML/CSS: task-planner-lc.html bar height tuned to clock-standard sizing; label row uses evenly spaced spans over 95% width.
- JavaScript: Added hour-label formatter respecting 12h/24h toggle and renderLabels now outputs whole-hour markers (0/24 or 1-12) without :00.
- Navigation/SEO: No changes.
- Accessibility/Responsive: Label spacing now mirrors clock layout for clarity.

Files Touched:

- task-planner-lc.html
- CHANGELOG.md

Testing Notes:

- Manual: Open task-planner-lc.html; confirm bar spans the expected width; labels are evenly spaced numbers (12h/24h) without :00; rail marker still tracks current time.
- Browser: Smoke in Chrome/Firefox/Edge/Safari.

Risks & Edge Cases:

- Label density may compress on very narrow screens; rail still scales via 95% width.
- No logic changes to zones; existing localStorage data should remain unaffected.

Follow-Up Suggestions (Optional):

- Consider responsive font-size clamp for labels if further density tuning is needed.

---

Date: 2025-11-26
Short Title: Add Task Planner Linear Clock
Summary:

- Added a dedicated task-planner-lc page with 24-hour zone rail, template switching, now/next summaries, and per-template editing with persistence.

LCL Technical Details:

- HTML: New task-planner-lc.html mirrors clock layout with intro, template selector, time-format toggle, rail + ticks, now/next panel, zone list, and zone editor.
- CSS: Inline :root includes existing core tokens plus required --zone-\* palette; rail/segment/marker styles follow clock-family patterns with subtle glow highlighting.
- JavaScript: Inline logic loads/saves templates via lcl-taskplanner-templates/active-template/timeformat keys, formats minutes-based times for 12h/24h, renders contiguous zone segments, computes now/next summaries, and supports add/edit/delete with normalization.
- Navigation: Includes LCL back link to index.html.
- SEO/meta: Standard head block with canonical/social tags and dark-mode enforcement link to lcl.css.
- Accessibility/Responsive: Uses aria labels on controls, percent-based rail width, auto-fit grids for summaries and editor rows, and minute-level ticker for updates.

Files Touched:

- task-planner-lc.html
- CHANGELOG.md

Testing Notes:

- Manual: Load task-planner-lc.html on desktop/mobile; switch templates and confirm zones render and persist after reload; toggle 12h/24h and verify labels, zone list, and now/next reflect selection.
- Browser: Smoke test in Chrome, Firefox, Edge, Safari.
- Behavior: Confirm marker aligns with current time, current/next zone highlighting updates at least each minute, and add/edit/delete actions re-render and store to localStorage.

Risks & Edge Cases:

- User-supplied zone times rely on client clock; incorrect system time skews highlights.
- Templates with overlapping or identical start times rely on sort order; users may need to adjust times for clarity.
- New localStorage data may conflict if keys were previously used for other experiments.

Follow-Up Suggestions (Optional):

- Add validation hints for overlapping zones and an explicit reset-to-defaults control per template.

---

Date: 2025-11-22
Short Title: Clarify changelog separators
Summary:

- Updated agent rules to mandate `---` dividers between changelog entries for readability; log reflects this guidance.

LCL Technical Details:

- Documentation: AGENTS.md now requires separator lines between changelog entries; CHANGELOG.md entry added to record the rule change.
- HTML/CSS/JS: No changes.

Files Touched:

- AGENTS.md
- CHANGELOG.md

Testing Notes:

- Docs-only change; no runtime testing required.

Risks & Edge Cases:

- None.

Follow-Up Suggestions (Optional):

- Continue using `---` separators when adding future entries.

---

Date: 2025-11-22
Short Title: Add changelog separators
Summary:

- Inserted visual separators between changelog entries to improve readability.

LCL Technical Details:

- Documentation: Added `---` divider lines between entries in CHANGELOG.md.
- HTML/CSS/JS: No changes.

Files Touched:

- CHANGELOG.md

Testing Notes:

- Docs-only change; no runtime testing required.

Risks & Edge Cases:

- None.

Follow-Up Suggestions (Optional):

- Keep using divider lines when adding future entries for clarity.

---

Date: 2025-11-22
Short Title: Add head/meta checklist
Summary:

- Documented a quick smoke checklist to keep head/meta blocks consistent across future pages.

LCL Technical Details:

- Documentation: AGENTS.md gained a head/meta smoke checklist covering charset, viewport, color-scheme/theme-color, lcl.css link, SEO/OG/Twitter, icons, and script placement.
- HTML/CSS/JS: No changes.

Files Touched:

- AGENTS.md
- CHANGELOG.md

Testing Notes:

- Docs-only change; no runtime testing required.

Risks & Edge Cases:

- None; informational addition only.

Follow-Up Suggestions (Optional):

- Use the checklist during code reviews for new or updated pages.

Date: 2025-11-22
Short Title: Enforce dark theme assets
Summary:

- Added unified dark-theme head entries across tool pages, introduced shared lcl.css for global background/foreground enforcement, removed light-mode overrides, documented current design/architecture, and refreshed badges.

LCL Technical Details:

- HTML: Added color-scheme/theme-color meta tags and lcl.css link to index.html, about.html, clock.html, clock_presets.html, dashboard.html, focus.html, multi-clock.html, stopwatch.html, timer.html.
- CSS: Created lcl.css with global dark enforcement and forced-colors guard; removed @media (prefers-color-scheme: light) blocks from about.html and focus.html.
- JavaScript: No changes.
- Tokens: No new tokens; global enforcement uses existing --bg/--fg variables.
- Navigation: No changes.
- SEO/meta: Added color-scheme + theme-color meta entries to the updated pages.
- Accessibility/Responsive: Improved consistency in dark contrast and forced-colors handling.
- Documentation: Added lcl.md design/style/architecture guide; updated README badge set with CSS shield.

Files Touched:

- index.html
- about.html
- clock.html
- clock_presets.html
- dashboard.html
- focus.html
- multi-clock.html
- stopwatch.html
- timer.html
- lcl.css
- lcl.md
- README.md
- CHANGELOG.md

Testing Notes:

- Manual: Load each updated HTML page to confirm dark theme persists (including on light-mode systems) and lcl.css loads correctly.
- Visual: Verify forced-colors handling and absence of light-mode overrides on about.html and focus.html.
- Automated: Not run.

Risks & Edge Cases:

- Browser caching could delay pickup of new lcl.css.
- Ensure no CDN blocks access to lcl.css when served statically.
- Verify no duplicate meta tags cause unexpected overrides in older browsers.

Follow-Up Suggestions (Optional):

- Add a simple smoke checklist to verify head/meta consistency across future pages.
- 
Date: 2025-11-26
Short Title: Simplify Task Planner Next panel
Summary:

- Simplified the Task Planner “Next” section to show only the upcoming block name and its start time, removing countdown text.

LCL Technical Details:

- HTML/JS: task-planner-lc.html Next panel now renders next zone name plus start time using existing formatTime helper; all countdown/duration strings removed.
- Navigation/SEO: No changes.
- Accessibility/Responsive: No layout changes; display text trimmed for clarity.

Files Touched:

- task-planner-lc.html
- CHANGELOG.md

Testing Notes:

- Manual: Load task-planner-lc.html; confirm Now panel unchanged; Next panel shows only name and start time (no countdown); verify 12h/24h toggle updates the Next start time format.
- Browser: Smoke in Chrome/Firefox/Edge/Safari.

Risks & Edge Cases:

- Minimal; depends on correct next zone detection; formatTime still driven by toggle state.

Follow-Up Suggestions (Optional):

- None.

---
