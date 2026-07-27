Date: 2026-07-26
Short Title: Extend Shared Suite Foundation
Summary:

Added live ordinal Julian date displays to the main homepage and minimal clock view. The displays use local calendar values in YYYY-DDD format, not the astronomical Julian Day system, and update as part of each page's existing clock cycle; visible site footers now show 2025–2026, the Minimal Clock shares the homepage clock palette, its layout is now top-oriented with compact utility controls, and site metadata and document structure have been validated. Established dependency-free shared CSS and time-formatting foundations while keeping page-specific layouts and controllers independent. Standardized every public tool page on one shared, accessible icon-only return control and normalized all existing public copyright notices without changing page placement or behavior. The To Do page now keeps data actions with the planner selector and uses a concise informational footer; Timer Lab, Stopwatch Lab, FocusLine, and Task Planner now reuse the shared time-formatting foundation while preserving their page-local behavior and display semantics. Completed a sitemap-driven public-page metadata and content audit and added a dependency-free regression test for the suite's publishing contracts.

LCL Technical Details:

- HTML: index.html and clock.html place a compact, clearly labelled Julian date line between the current time and the rail; clock.html keeps the line outside the orientation-specific rail-and-label cluster.
- Shared CSS: Expanded lcl.css with the main/minimal clock design-token defaults and namespaced Julian date, time switch, marker appearance, day statistics, and work-hour classes; removed unnecessary !important declarations and the global forced-color suppression.
- Shared Back Link: Added `.lcl-back-link` to lcl.css for the suite's 38px by 38px icon-only home control, including a neutral border, page-accent hover, subtle background, inherited typography, and visible accent focus outline without global positioning or margins.
- CSS Migration: index.html and clock.html now use the shared tokens and classes while retaining all page-specific layout, rail geometry, orientation, controls, and responsive rules inline.
- CSS: clock.html now uses homepage-matching tokens for the background, foreground, muted text, accent, rail, rail border, ticks, labels, work-hour highlight, statistics, and cyan glowing marker; layout dimensions and orientation rules are unchanged.
- Layout: clock.html no longer vertically centers .wrap; responsive top padding positions the clock near the top while retaining centered, scrollable clock content.
- Controls: Replaced the wide customization summary with a compact gear and the full return link with a compact back arrow; the existing details panel, selectors, and persistence behavior remain intact.
- SEO/Metadata: index.html now has one charset and viewport declaration with a static homepage canonical URL; focus.html now has one charset and viewport declaration, plus corrected canonical and Open Graph URLs for focus.html.
- Web Manifest: Added site.webmanifest with standalone presentation, dark colors, site description, and the verified 32x32 profile.png icon.
- HTML Structure: Repaired todo.html navigation, header nesting, and closing wrapper without changing IDs, controls, scripts, or localStorage behavior.
- Sitemap: Added every homepage-linked public tool and page to sitemap.xml using absolute HTTPS URLs.
- Shared JavaScript: Added the frozen LCLTime API in lcl-time.js for hour labels, clock times, durations, and ordinal Julian dates, with browser and direct Node compatibility and no DOM, LocalStorage, event, or timer access.
- JavaScript Migration: index.html and clock.html load lcl-time.js before their independent inline controllers and pass use24h explicitly to shared formatting calls; each updateClock() still reuses one Date instance and the one-second intervals are unchanged.
- Multi-Clock Migration: multi-clock.html now loads lcl-time.js before its inline controller and uses LCLTime.formatClockTime() for fixed 24-hour HH:MM formatting; its page-specific helper continues to append zero-padded seconds for the unchanged HH:MM:SS display.
- Multi-Clock CSS: Removed the exact-match --cyan and --marker aliases and now uses the shared --accent token for links, clock titles, current-time readouts, marker color, and the shared back control; retained all page-specific card, rail, tick, glow, control, and text values.
- Multi-Clock Metadata: Removed duplicate charset and viewport declarations while preserving the canonical URL and all remaining SEO, social, icon, title, and description metadata.
- Multi-Clock Compatibility: Timezone calculations, dropdown contents and sorting, pinned zones, one-second card timers, stored data under jm5k_multi_clocks_v2, JSON import/export formats, editing, reordering, removal, and independent page control remain unchanged.
- Preset Themes Migration: clock_presets.html now loads lcl-time.js before its inline controller; 01-24 labels use LCLTime.formatHourLabel(), the current HH:MM portion uses LCLTime.formatClockTime(), and its narrow page helper continues to append zero-padded seconds.
- Preset Themes Countdown: The DST-aware startOfDay/endOfDay calculation remains unchanged, while its clamped seconds-to-midnight value is formatted through LCLTime.formatDurationHMS() so 23-, 24-, and 25-hour local days remain supported.
- Preset Themes Compatibility: All 16 theme dictionaries, custom overrides, glow and label-offset behavior, panel state, reset behavior, import/export payload, and five LocalStorage keys remain unchanged.
- Preset Themes Footer: Synchronized the visible footer to © 2025–2026 jm5k without changing its styling or placement.
- Preset Themes Navigation: Replaced the visible return label with the established 38px by 38px back arrow while preserving the index.html destination; added matching aria-label and title text plus an accent focus-visible state.
- Suite Navigation: Standardized clock.html, task-planner-lc.html, multi-clock.html, clock_presets.html, focus.html, stopwatch.html, timer.html, dashboard.html, todo.html, and about.html on exactly one dedicated `.lcl-back-link` arrow with the shared accessible name and tooltip; index.html remains the hub without a back control.
- Page-Local CSS: Removed obsolete return-anchor sizing, border, hover, glow, and focus rules from nine public tool pages while retaining every navigation container's existing placement and spacing.
- To Do Shared CSS: Added lcl.css before todo.css so todo.html can use the shared return component while preserving its page-specific tokens, layout, and control overrides.
- To Do Data Controls: Moved the existing Export and Import buttons plus hidden JSON file input into the header after the planner selector; shortened the labels, added descriptive tooltips, retained visible text and focus states, and preserved all IDs and bindings.
- To Do Footer: Removed the redundant Local Only pill and replaced the footer toolbar with concise local-storage and © 2025–2026 jm5k lines; the footer now contains no buttons, while task, import, export, planner, and LocalStorage behavior remain unchanged.
- Timer and Stopwatch Duration Formatting: stopwatch.html and timer.html now load lcl-time.js before their independent inline controllers and route duration display through LCLTime.formatDurationHMS().
- Compact Duration Adapters: Page-local formatDisplayDuration() adapters remove the leading 00: below one hour to retain MM:SS output, while one hour and above remain HH:MM:SS; flooring partial seconds and clamping negative values are handled by the shared formatter.
- Timer and Stopwatch Compatibility: Existing timer and stopwatch calculations, controllers, LocalStorage keys, saved object shapes, timing fields, sort settings, color controls, notifications, sound settings, and lifecycle behavior remain unchanged.
- Stopwatch Copy: Removed the duplicate header persistence sentence while retaining the toolbar-adjacent persistence hint.
- FocusLine Shared Formatting: focus.html now loads lcl-time.js before its independent inline controller. Its formatFocusDuration() adapter rounds and clamps through LCLTime.formatDurationHMS(), then preserves the existing total MM:SS display through 120 minutes; note timestamps retain their local YYYY-MM-DD HH:MM output through LCLTime.formatClockTime(..., true).
- FocusLine Local Clock: The browser-locale toLocaleTimeString() display, local-day progress calculation, and one-second cadence remain unchanged; removed the earlier duplicate local-clock initialization so the final setup section owns the sole interval and immediate update.
- FocusLine Compatibility: Pomodoro phases, controls, requestAnimationFrame loop, notifications, chime, keyboard shortcuts, history, notes, drafts, exports, ordering, all four FocusLine LocalStorage keys, footer, back arrow, layout, and styling remain unchanged.
- Task Planner Shared Formatting: task-planner-lc.html now loads lcl-time.js before its independent inline controller. Its page-local minute adapter delegates ordinary clock output to LCLTime.formatClockTime(), while preserving clamping, rounding, and the Task Planner-specific 24:00 end-of-day boundary; rail labels now use LCLTime.formatHourLabel().
- Task Planner Shared Switch: Replaced the duplicate page-local 12/24-hour switch CSS and markup with lcl-time-switch, lcl-switch-track, and lcl-switch-label. A narrow page override preserves the existing muted label color, dimensions, thumb, cyan checked state, native checkbox, accessible name, title, and behavior.
- Task Planner Compatibility: Natural-language duration wording and native HH:MM time-input formatting remain local. Zone logic and colors, marker inversion and glow, 15-second ticker, templates, sanitization, sorting, all three Task Planner LocalStorage keys, import/export structure and filename, footer, back arrow, layout, and styling remain unchanged.
- About Metadata: Removed duplicate charset and viewport declarations; corrected canonical and og:url to https://linearclocklab.com/about.html; replaced copied homepage descriptions and social titles with page-specific About metadata while preserving theme, manifest, icons, and AboutPage structured data.
- About Content: Updated the current-suite summary and verified tool sections for the Main and Minimal clocks, Task Planner, Multi-Clock, Clock Colors, FocusLine, Stopwatch, Timer, Dashboard, and To Do Lists. Documented ordinal Julian YYYY-DDD displays and the static, dependency-free, client-side, local-first, analytics-free architecture without adding tool-page links.
- To Do Metadata: Added the missing page-specific description, author, robots, canonical, theme, color-scheme, Open Graph, and Twitter metadata while preserving the existing title, deferred controller, layout, and behavior.
- Site Audit: Added dependency-free tests/site-audit.test.js, which derives public pages from sitemap.xml and verifies sitemap uniqueness and file coverage, homepage tool-card coverage, core/social metadata and URLs, shared back navigation, visible copyright text, local asset existence, and lcl-time.js ordering on migrated pages.
- Public Page Audit: All 11 sitemap-listed pages now pass the required metadata, navigation, copyright, local-asset, sitemap, and shared-script checks.
- Tests: Added 25-hour duration coverage confirming 90000 seconds formats as 25:00:00.
- Tests: Added dependency-free Node assertions for Julian dates, 12/24-hour clock formatting, hour labels, duration formatting, negative clamping, and API freezing.
- Documentation: Updated agents.md, ARCHITECTURE.md, COMPONENTS.md, UI_RULES.md, and README.md to define the hybrid shared-foundation/page-controller boundary and phased migration rules; navigation documentation now defines one `.lcl-back-link` per public spoke, page-specific container placement, accessible icon-control requirements, clarity-first label minimization, and existing-public-notice copyright rules.
- LocalStorage: No keys added or changed; the existing 12/24-hour preference behavior remains unchanged.
- Footer: Every sitemap-listed public page now visibly contains © 2025–2026 jm5k without JavaScript generation; page-specific surrounding text, functional controls, and legal files remain unchanged.
- SEO/Metadata: Corrected About metadata, completed To Do metadata, and verified every public canonical and og:url against sitemap.xml; no dark-mode styling changed.
- Accessibility: The new value has an explicit ordinal YYYY-DDD Julian-date aria-label.
- Accessibility: The gear and back arrow have descriptive aria-label and title attributes, with visible keyboard focus states.

Files Touched:

- index.html
- clock.html
- clock_presets.html
- lcl.css
- lcl-time.js
- tests/time-utils.test.js
- tests/site-audit.test.js
- agents.md
- ARCHITECTURE.md
- COMPONENTS.md
- UI_RULES.md
- about.html
- focus.html
- multi-clock.html
- task-planner-lc.html
- stopwatch.html
- timer.html
- dashboard.html
- todo.html
- todo.css
- sitemap.xml
- site.webmanifest
- README.md
- CHANGELOG.md

Testing Notes:

- Automated: Run node tests/time-utils.test.js and node --check for lcl-time.js, the test file, and extracted inline scripts; the test suite covers all required Julian-date, clock, hour-label, and duration cases.
- Multi-Clock Automated: Compile the extracted multi-clock.html controller, validate HTML structure and script ordering, confirm one charset and viewport declaration, verify shared accent migration, and confirm storage/JSON compatibility constants remain unchanged.
- Multi-Clock Manual: Exercise UTC, America/New_York, America/Los_Angeles, Europe/London, and Asia/Tokyo clocks; verify ticking, offsets, progress, labels, ordering, removal, persistence, import/export, empty state, return navigation, footer, and unchanged visual appearance.
- Preset Themes Automated: Compile the extracted clock_presets.html controller, validate HTML structure and script ordering, confirm all shared formatting calls, verify all 16 themes and five LocalStorage keys remain, and run the 25-hour duration assertion.
- Preset Themes Manual: Verify every preset and custom control, one-second clock/countdown updates, DST-safe progress, marker and rail appearance, persistence, reset/collapse behavior, import/export compatibility, navigation, and the synchronized footer.
- Preset Themes Accessibility: Tab to the back arrow and confirm its accent focus ring, 38px by 38px target, accessible name, tooltip, and index.html destination.
- Suite Navigation Automated: Audit every sitemap-listed public spoke for exactly one dedicated index.html anchor using `.lcl-back-link`, the required aria-label and title, and arrow-only visible content; confirm index.html has no back control and no conflicting page-local anchor styles remain.
- Suite Copyright Automated: Confirm every sitemap-listed public page visibly contains exactly one © 2025–2026 jm5k notice and no visible 2025-only jm5k notice remains.
- Suite Navigation Manual: Open every sitemap-listed page at desktop and mobile widths; verify arrow placement, current-page accent hover, visible keyboard focus, the 38px square target, index.html destination, footer content, functional controls, and forced-colors usability.
- To Do Automated: Confirm the preserved Export, Import, and hidden file-input IDs occur exactly once inside .header-actions; confirm the footer has no buttons and renders the required two informational lines.
- To Do Manual: Verify desktop and narrow header wrapping, button tooltips and keyboard focus, planner switching, export filename and payload, import picker and replacement confirmation, persisted task data, board layout, and non-sticky footer spacing.
- Timer and Stopwatch Automated: Run shared utility tests, syntax-check the shared utility and both extracted inline controllers, verify compact duration values at zero, minute, hour, and negative boundaries, and confirm the two pages load lcl-time.js before their controllers.
- Timer and Stopwatch Manual: Verify duration transitions, controls, sorting, colors, rails, persistence, paused-on-reload behavior, completion handling, footers, and back arrows without changing the existing application lifecycle.
- FocusLine Automated: Run the shared utility tests, syntax-check the shared utility and extracted focus.html controller, validate total-MM:SS duration outputs and half-second rounding, verify fixed 24-hour note timestamps, confirm a single local-clock interval and immediate initialization, and audit the unchanged storage keys, export structures, local-time formatter, and animation-frame loop.
- FocusLine Manual: Verify all Pomodoro controls and phase durations, progress, auto-advance, chime, notifications, shortcuts, today's total, one-second locale local clock, notes and timestamp insertion, drafts, searches, note actions, exports, persistence, footer, back arrow, and unchanged layout.
- Task Planner Automated: Run the shared utility tests, syntax-check the shared utility and extracted task-planner-lc.html controller, verify 12/24-hour output including 24:00, confirm shared hour labels and switch classes, and audit the unchanged duration helper, native time inputs, storage keys, template JSON, export filename, and 15-second ticker.
- Task Planner Manual: Verify templates, custom zones, current/next summaries, marker color and position, 12/24-hour persistence and labels, native time editing, import/export, keyboard-accessible switch behavior, footer, back arrow, and unchanged desktop/mobile layout.
- Site Audit Automated: Run node tests/site-audit.test.js after public HTML, sitemap, shared local asset, navigation, copyright, or metadata changes; run node tests/time-utils.test.js as well when shared time code or a migrated time page changes.
- Manual: Load index.html and clock.html at desktop and mobile widths; confirm current-time updates, marker movement, statistics, 12/24-hour toggle, clock.html horizontal/vertical orientations, and forward/backward directions remain correct.
- Visual: Compare index.html and clock.html to confirm matching clock palette values, including the cyan marker and glow in both Minimal Clock orientations.
- Layout/Controls: Verify desktop, narrow mobile, and short-height layouts remain top-oriented and scrollable; open the gear panel, change orientation/direction, tab to both utility icons, and follow the back arrow to index.html.
- Validation: Confirm modified HTML structure, sitemap XML, and manifest JSON are valid; verify each sitemap URL maps to an existing public file and no stale focusline.html or Liquid canonical references remain.
- Footer: Confirm every public page visibly contains © 2025–2026 jm5k.
- Browser: Smoke test in Chrome, Firefox, Edge, and Safari.

Risks & Edge Cases:

- The value follows the local calendar date. Date.UTC subtraction avoids daylight-saving off-by-one errors; verify rollover at local midnight. The minimal clock's Julian date remains independent of its orientation, direction, and time-format settings.
- The expanded utility panel reserves vertical space so it does not overlap the footer on narrow viewports.
- FocusLine: The compact adapter depends on the frozen shared duration formatter retaining its HH:MM:SS contract; its local conversion intentionally restores total minutes and preserves rounded countdown behavior above 59 minutes.
- Task Planner: The page adapter intentionally owns the 24:00 boundary because a 24-hour day endpoint is not a general clock-time value; verify that it remains distinct from 12:00 PM in 12-hour mode after future shared-utility changes.
- Site Audit: The dependency-free checker intentionally uses tolerant, case-insensitive HTML matching rather than a parser dependency; keep static metadata and asset references in ordinary HTML tags so regressions remain detectable.
- Removing forced-color suppression allows the operating system to adapt colors in high-contrast modes; browser forced-colors behavior should be included in future accessibility smoke tests.
- Multi-Clock remains intentionally responsible for timezone conversion, state, card intervals, and import/export behavior; only pure HH:MM formatting is shared.
- Preset Themes retains its independent theme, custom override, persistence, and controller logic; only pure time formatting is shared.
- The icon-only home control depends on its aria-label and title for a textual name; keep both synchronized if the destination wording changes.
- The shared back-link component intentionally owns only anchor presentation; page-local navigation containers retain positioning so top-, header-, fixed-, and bottom-oriented controls do not shift.
- To Do header controls retain the existing IDs so their event bindings remain location-independent; verify compact actions do not crowd the title at narrow widths.
- The page-local duration adapters intentionally retain compact sub-hour output; keep timer and stopwatch algorithms independent of the shared pure formatter.

---

Date: 2025-12-12
Short Title: Added todo.html, todo.css, todo.js
Summary:

Introduced a new To Do module to Linear Clock Lab, providing a local-only way to capture, organize, and reorder actionable items by urgency, intent, and time context. The module supports multiple planners (Work, Home, Event), quadrant-based prioritization (Now, Next, Planned, Back Burner), manual ordering independent of due dates, pinning with visual emphasis, and JSON import/export. Styling aligns with the existing LCL dark theme, and all data is stored locally with no external dependencies.

Date: 2025-11-26
Short Title: Remove 00 hour label
Summary:

- Removed the 00 hour label from clock_presets.html to eliminate crowding with 01 while keeping the remaining labels aligned under the 24-hour rail.

LCL Technical Details:

- HTML/JS: Hour labels now render 01-24 only; positioning logic and offset control remain, with the first label starting at 01.
- CSS: Removed the 00-specific transform override; existing muted styling and end-label handling remain intact.
- Navigation/SEO: No changes.
- Accessibility/Responsive: Label offset control and persistence unchanged; spacing improved at the left edge.

Files Touched:

- clock_presets.html
- CHANGELOG.md

Testing Notes:

- Manual: Load clock_presets.html, verify labels start at 01, remain centered on ticks, and offset control still applies/persists; confirm 24 aligns at the rail end.
- Browser: Smoke in Chrome/Firefox/Edge/Safari.

Risks & Edge Cases:

- Low risk; ensure left-edge visibility on narrow viewports after removing 00.

---

Date: 2025-11-26
Short Title: Expand hour label offset range
Summary:

- Extended the clock_presets hour-label offset range so users can fine-tune alignment up to +3 and increased spacing between 00 and 01 while keeping other labels centered on their ticks.

LCL Technical Details:

- HTML: Label offset control now allows values up to 3; hour-label row unchanged beneath the rail.
- CSS: First label applies a slightly larger negative adjustment so 00 stays separated from 01 when offsets are positive.
- JavaScript: Offset clamping now supports -3 to 3; persistence and tick alignment logic remain intact.
- Navigation/SEO: No changes.
- Accessibility/Responsive: Muted monospace labels preserved; control styling matches existing inputs.

Files Touched:

- clock_presets.html
- CHANGELOG.md

Testing Notes:

- Manual: Load clock_presets.html, set Label offset near 1–3, and verify 00 is distinct from 01 while all labels align with hour ticks; reload to confirm persistence.
- Browser: Smoke in Chrome/Firefox/Edge/Safari.

Risks & Edge Cases:

- Low risk; check extreme offsets on narrow viewports to ensure labels remain readable and aligned.

---

Date: 2025-11-26
Short Title: Refine 00-hour label spacing in presets
Summary:

- Adjusted the first hour label in clock_presets.html so 00 no longer crowds 01 when using the label offset control, while keeping all labels aligned to their ticks.

LCL Technical Details:

- HTML/CSS: clock_presets hour-label row retains existing structure; first label now applies a slight negative offset to preserve spacing when offsets are positive.
- JavaScript: No changes to label generation or persistence; offset control still drives the shared --label-offset variable stored in localStorage.
- Navigation/SEO: No changes.
- Accessibility/Responsive: Muted monospace labels maintained; layout unchanged elsewhere.

Files Touched:

- clock_presets.html
- CHANGELOG.md

Testing Notes:

- Manual: Load clock_presets.html, set Label offset to 1, and confirm 00 is separated from 01 while other labels stay centered on hour ticks; verify persistence on reload.
- Browser: Smoke in Chrome/Firefox/Edge/Safari.

Risks & Edge Cases:

- Low risk; check left edge on narrow screens to ensure 00 remains visible with offsets applied.

---

Date: 2025-11-26
Short Title: Add presets label offset control
Summary:

- Added a UI fine-tune control to shift 00-24 hour labels under the preset rail, with live updates and persisted offset via localStorage.

LCL Technical Details:

- HTML pages updated: clock_presets.html controls now include a Label offset number input; hour-label row remains beneath the rail.
- CSS: Hour labels use a shared --label-offset variable applied via transforms; control styling extends existing input rules.
- JavaScript: Hour labels still align to hour ticks with half-hour correction; new offset is applied through a single property, saved/loaded from localStorage, and updated on input.
- Navigation/SEO: No changes.
- Accessibility/Responsive: Muted monospace labels; minimal control footprint alongside existing sliders/buttons.

Files Touched:

- clock_presets.html
- CHANGELOG.md

Testing Notes:

- Manual: Load clock_presets.html; adjust Label offset and confirm labels remain centered on hour ticks, shifting consistently; reload to verify persistence across themes and viewports.
- Browser: Smoke in Chrome/Firefox/Edge/Safari.

Risks & Edge Cases:

- Low risk; verify extreme offset values do not cause overlap on very narrow screens.

---

Date: 2025-11-26
Short Title: Correct presets hour label positions
Summary:

- Shifted 24-hour labels left to center each 00-24 label on its hour tick instead of the half-hour, keeping ticks and marker aligned.

LCL Technical Details:

- HTML pages updated: clock_presets.html retains the hour-label row beneath the rail for 00-24 labels.
- CSS: Hour labels keep muted styling while absolute positioning remains; edge transforms handled inline for bounds.
- JavaScript: Label positions now subtract a half-hour offset (except edges) and set edge transforms so labels sit on hour ticks; tick grid/marker math unchanged.
- Navigation/SEO: No changes.
- Accessibility/Responsive: Labels stay monospace/muted; layout and sizing unchanged.

Files Touched:

- clock_presets.html
- CHANGELOG.md

Testing Notes:

- Manual: Load clock_presets.html; verify labels 00-24 center on hour ticks (no half-hour drift) across themes and viewports.
- Browser: Smoke in Chrome/Firefox/Edge/Safari.

Risks & Edge Cases:

- Low risk; confirm edge labels stay visible and aligned on narrow screens.

---

Date: 2025-11-26
Short Title: Fix presets hour label alignment
Summary:

- Centered the 24-hour labels under the preset rail ticks to remove drift and keep labels, ticks, and marker aligned across the bar.

LCL Technical Details:

- HTML pages updated: clock_presets.html retains the hour-label container below the rail for 00-24 labels.
- CSS: Hour labels now use absolute positioning with start/end adjustments so each label centers on its hour tick while keeping muted styling.
- JavaScript: Labels are placed at hour/24 percentage offsets (00-24); tick grid and marker math remain unchanged.
- Navigation/SEO: No changes.
- Accessibility/Responsive: Labels stay monospace/muted; container height and spacing align with existing layout.

Files Touched:

- clock_presets.html
- CHANGELOG.md

Testing Notes:

- Manual: Load clock_presets.html; verify labels 00-24 sit centered on corresponding hour ticks and stay readable across themes and widths.
- Browser: Smoke in Chrome/Firefox/Edge/Safari.

Risks & Edge Cases:

- Low risk; check that labels do not overlap on very narrow viewports and remain aligned at both edges.

---

Date: 2025-11-26
Short Title: Add presets rail hour labels
Summary:

- Added a 24-hour label row under the preset themes rail so clock_presets aligns its tick marks with readable hour text.

LCL Technical Details:

- HTML pages updated: clock_presets.html now includes an hour-label container below the rail with 00–24 labels.
- CSS: Added .hour-labels flex layout with muted styling to align labels across the rail width.
- JavaScript: Populate 25 zero-padded hour labels (00–24) after tick creation; no changes to marker math or timers.
- Navigation/SEO: No changes.
- Accessibility/Responsive: Labels use existing muted palette and flex spacing within the wrap.

Files Touched:

- clock_presets.html
- CHANGELOG.md

Testing Notes:

- Manual: Load clock_presets.html; verify labels 00–24 render beneath the rail, align with ticks, and remain readable across themes.
- Browser: Smoke in Chrome/Firefox/Edge/Safari.

Risks & Edge Cases:

- Low risk; confirm label row does not wrap on narrow viewports.

---

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
- Date: 2025-11-26
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

Date: 2025-11-26
Short Title: Added Task Planner section to About page
Summary:

- Inserted a Task Planner documentation block into about.html before the copyright section; no other sections were modified.

LCL Technical Details:

- Added a new Task Planner section with completed/planned lists in about.html, maintaining existing section styling and layout.
- No changes to scripts, styles, or other content.

Files Touched:

- about.html
- CHANGELOG.md

Testing Notes:

- Load about.html and verify the Task Planner section appears above Copyright & License with consistent styling.

Risks & Edge Cases:

- None; content-only addition.

---
