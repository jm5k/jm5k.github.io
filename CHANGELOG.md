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
Date: 2025-11-26
Short Title: Improve Task Planner marker visibility
Summary:

- Updated the Task Planner current-time marker to a high-contrast white neon style for consistent visibility across all zone colors.

LCL Technical Details:

- CSS: task-planner-lc.html #marker now uses white background with dual white/blue glow for universal contrast; dimensions and positioning unchanged.
- HTML/JS: No logic or structure changes.
- Navigation/SEO: No changes.

Files Touched:

- task-planner-lc.html
- CHANGELOG.md

Testing Notes:

- Manual: Load task-planner-lc.html and verify the current-time marker remains visible over all zone colors.
- Browser: Smoke in Chrome, Firefox, Edge, Safari.

Risks & Edge Cases:

- None expected; glow intensity remains subtle but brighter contrast may vary slightly on very bright displays.

Follow-Up Suggestions (Optional):

- None.

---
Date: 2025-11-26
Short Title: Invert Task Planner time marker
Summary:

- Updated the Task Planner rail marker to invert the active zone color and apply a fixed white glow for consistent contrast across all zone palettes.

LCL Technical Details:

- JavaScript: Added helpers to read zone token colors, invert them, and apply the inverted color to the marker background with a white glow fallback; marker color now refreshes with current zone updates.
- CSS: Marker box-shadow simplified to a single white glow while retaining size/position.
- HTML/Layout: No structural changes.

Files Touched:

- task-planner-lc.html
- CHANGELOG.md

Testing Notes:

- Manual: Load task-planner-lc.html; confirm marker tracks current zone position and visibly contrasts against all zone colors; verify fallback accent when no zone active.
- Browser: Smoke in Chrome, Firefox, Edge, Safari.

Risks & Edge Cases:

- Non-hex token values would fall back to accent; ensure tokens remain hex-based.
- If no current zone is detected, fallback marker styling appears instead of inverted color.

Follow-Up Suggestions (Optional):

- Consider adding a tiny status note when fallback color is in use (not implemented here).

---
Date: 2025-11-26
Short Title: Add dedicated workday end zone color
Summary:
- Introduced a `--zone-workend` token and applied it to the Workday “workday ends” block so evening transitions no longer reuse neighboring colors.

LCL Technical Details:
- Added `--zone-workend` token to task-planner-lc.html :root palette and to UI_RULES.md zone palette spec with guidance.
- Updated defaultTemplates().Workday to assign `--zone-workend` to “workday ends” while keeping other evening blocks on break/evening tokens.
- Documented approved palette expansion and usage guidelines for work-to-personal boundaries.

Files Touched:
- task-planner-lc.html
- UI_RULES.md
- CHANGELOG.md

Testing Notes:
- Clear `lcl-taskplanner-templates` in localStorage or use a fresh profile; open task-planner-lc.html, select Workday, and confirm “workday ends” displays a distinct color between work and dinner.
- Verify Now/Next and rail markers still identify current/next zones correctly.

Risks & Edge Cases:
- Users with customized templates retain their stored colors until reset/import.
- Palette expansion is limited to the documented `--zone-workend`; no other new tokens should be introduced.

---

Date: 2025-11-26
Short Title: Add JSON Export/Import for Task Planner
Summary:
- Added backup/restore controls so Task Planner templates can be exported to and imported from JSON without changing other planner behavior.

LCL Technical Details:
- HTML/JS: task-planner-lc.html now includes Export (Blob download) and Import (FileReader) controls in the zone editor; imported data is sanitized with existing helpers, saved to localStorage, and re-rendered.
- Data model: Templates retained the same JSON structure (name, colorToken, startMinutes) and use existing sanitizeTemplate logic; active template falls back to Workday or first available if missing.
- Layout/Styling: Uses existing .btn and muted styles; no new tokens added.

Files Touched:
- task-planner-lc.html
- CHANGELOG.md

Testing Notes:
- Manual: Export templates and confirm a .json downloads; modify a zone in the JSON and re-import; verify templates update, renderAll refreshes, and active template selection remains valid.
- Browser: Smoke in Chrome/Firefox/Edge/Safari.

Risks & Edge Cases:
- Malformed or non-hex token colors are sanitized; invalid JSON aborts import without saving.
- Missing/extra templates or empty imports fall back to existing defaults; active template may switch to Workday or first valid entry if current is absent.

---
Date: 2025-11-26
Short Title: Break up Workday evening color wall
Summary:
- Recolored Workday evening defaults so “workday ends,” “dinner,” and “evening activities” no longer form a single color wall, improving visual clarity per palette rules.

LCL Technical Details:
- Updated defaultTemplates().Workday colorToken assignments: “dinner” now uses --zone-break while neighboring blocks remain --zone-evening to avoid triple repetition.
- Ensured no three consecutive distinct zones share the same token in Workday defaults; other templates already avoided color walls.
- Confirmed adherence to approved Zone Color Palette tokens without changing times or structures.

Files Touched:
- task-planner-lc.html
- CHANGELOG.md

Testing Notes:
- Clear lcl-taskplanner-templates in localStorage or use a fresh profile; load task-planner-lc.html and select Workday to verify distinct colors for “workday ends,” “dinner,” and “evening activities.”
- Confirm Now/Next highlights still track the correct zones and marker behavior is unchanged.

Risks & Edge Cases:
- Users with customized templates in localStorage will retain their colors until they reset or import defaults.
- No logic changes; only default color assignments adjusted.

---
Date: 2025-11-26
Short Title: Align Task Planner hour labels with rail
Summary:
- Fixed the Task Planner hour labels to use the same 0–24 scale as the rail ticks and marker, eliminating the one-hour visual shift.

LCL Technical Details:
- Updated the hour label loop in task-planner-lc.html to generate labels from 0 through 24, matching the rail’s time scale.
- Adjusted formatPlannerHourLabel to keep 24h labels as simple integers (no leading zeros) while retaining 12h formatting aligned to the same positions.
- Ticks and marker logic remain unchanged; only label generation now matches the existing 0–24 rail scale.

Files Touched:
- task-planner-lc.html
- CHANGELOG.md

Testing Notes:
- Load task-planner-lc.html and confirm the marker aligns with the corresponding hour label on the rail (e.g., at 14:23 the marker sits under the 14 label in 24h mode).
- Toggle between 12h/24h modes to verify formatting changes but label positions/count stay consistent.

Risks & Edge Cases:
- Future changes to tick or marker positioning must keep label generation aligned to the same 0–24 scale.
- Users familiar with the previous off-by-one labels may notice the shift; behavior is now correct.

---
Date: 2025-11-26
Short Title: Fix Task Planner rail label alignment
Summary:
- Aligned Task Planner hour labels with the rail’s 0–24 scale so labels, ticks, and marker share the same positions as the original minimal clock.

LCL Technical Details:
- Updated task-planner-lc.html label generation to produce 25 labels (0–24) in sync with the rail scale and format them without leading zeros in 24h mode.
- Ensured bar and label row use matching min(95%, 980px) widths to mirror the original minimal clock’s alignment.
- Retained marker/tick positioning logic; only label alignment and width reference were adjusted.

Files Touched:
- task-planner-lc.html
- CHANGELOG.md

Testing Notes:
- Load task-planner-lc.html and index.html; in 24h mode at a known time (e.g., 14:23), verify the marker sits under the corresponding “14” label on both clocks.
- Toggle 12h/24h modes to confirm only label text changes while positions stay aligned.

Risks & Edge Cases:
- Future rail or tick spacing changes must keep label generation on the same 0–24 scale and width reference.
- Users may notice a slight shift from the previous misaligned labels, but this reflects correct behavior.

---
Date: 2025-11-26
Short Title: Zero-pad Task Planner hour labels
Summary:
- Updated the Task Planner Linear Clock to zero-pad 24-hour labels (00–24), matching the original minimal clock’s visual format while keeping alignment and marker behavior unchanged.

LCL Technical Details:
- Updated the 24-hour branch of formatPlannerHourLabel in task-planner-lc.html to return two-digit, zero-padded hour labels (00–24).
- Kept label count, positions, ticks, and marker alignment intact on the existing 0–24 rail.
- Left 12-hour mode logic unchanged; only the 24-hour label text formatting was adjusted.

Files Touched:
- task-planner-lc.html
- CHANGELOG.md

Testing Notes:
- Load task-planner-lc.html in 24-hour mode and verify labels show as 00 01 02 … 23 24.
- Confirm the marker still aligns with corresponding hour positions (e.g., 14:23 near label 14).
- Toggle between 12h and 24h and verify only label text changes.

Risks & Edge Cases:
- Future label-format changes must preserve zero-padding in 24-hour mode to stay consistent with index.html.
- Label count/layout must remain unchanged to keep alignment with ticks and marker.

---
Date: 2025-11-26
Short Title: Zero-pad Task Planner 12h labels
Summary:
- Updated the Task Planner Linear Clock 12-hour labels to use two-digit, zero-padded formatting (01–12) for consistency with the minimal clock while leaving 24h labels unchanged.

LCL Technical Details:
- Adjusted the 12-hour branch of formatPlannerHourLabel in task-planner-lc.html to pad hour labels to two digits (01–12).
- Kept the 24-hour branch as-is (00–24) and left label counts/positions unchanged so ticks and marker alignment remain intact.
- No changes to ticks, marker positioning, or template data.

Files Touched:
- task-planner-lc.html
- CHANGELOG.md

Testing Notes:
- Load task-planner-lc.html and switch to 12-hour mode; verify labels render as 01 02 03 … 11 12.
- Switch back to 24-hour mode and confirm labels remain 00 01 02 … 23 24; marker alignment should be unaffected.
- Confirm marker alignment against labels in both modes (e.g., 2 PM near label 14 in 24h and 02 in 12h).

Risks & Edge Cases:
- Future label-format changes must preserve zero-padding in both modes; altering label counts or positions would misalign ticks/marker.

---
Date: 2025-11-26
Short Title: Fix Task Planner marker offset
Summary:
- Corrected the Task Planner marker math so it aligns with true time-of-day, matching the minimal clock’s rail behavior in both 12h and 24h modes.

LCL Technical Details:
- Updated marker positioning in task-planner-lc.html to use the same fraction-of-day placement as clock.html, removing the prior offset while leaving ticks and labels unchanged.
- No changes to label formatting, tick generation, or template data; only marker positioning logic was adjusted.

Files Touched:
- task-planner-lc.html
- CHANGELOG.md

Testing Notes:
- Load clock.html and task-planner-lc.html side by side; verify markers align at the same positions for the same system time across morning, midday, and evening.
- Toggle 12h/24h modes in the Task Planner and confirm marker position stays consistent while labels only change text.

Risks & Edge Cases:
- Future changes to rail width or tick math must keep marker placement on the same 0–24 fraction to avoid drift.
- DST/timezone depends on browser Date; no new handling was added.

---
