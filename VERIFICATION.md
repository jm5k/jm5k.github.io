# Linear Clock Lab Verification

## Automated checks

Run these dependency-free checks from the repository root with Node.js:

    node tests/time-utils.test.js
    node tests/moon-utils.test.js
    node tests/moon-calendar.test.js
    node tests/duration-utils.test.js
    node tests/date-utils.test.js
    node tests/timezone-utils.test.js
    node tests/timezone-select-utils.test.js
    node tests/site-audit.test.js
    node tests/docs-audit.test.js

The [README testing section](README.md#-testing) describes coverage. Follow
agents.md for change-specific required checks.

## Initial review results: 2026-11-21

- PASS: time, duration, date, timezone, and timezone-selector utility suites.
- PASS: site audit covering 14 public pages, metadata, navigation, copyright,
  sitemap, and local assets.
- FAIL: documentation audit stops at tests/docs-audit.test.js:70 because the
  agents.md navigation example uses a literal arrow instead of `&larr;`.
  Later assertions are unverified until that failure is resolved.
- PASS: live homepage content retrieved from https://linearclocklab.com/;
  its tool directory agrees with the local homepage directory.
- NOT RUN: rendered desktop appearance, cross-browser compatibility, keyboard
  and screen-reader acceptance, timers, notifications, and storage persistence.
  Reading the live page does not establish interactive behavior.

## Manual acceptance

The user performs interactive and visual acceptance. For a changed tool, open
the page on desktop, exercise its controls and boundary cases, check keyboard
focus and labels, and verify reload persistence when applicable. Compare in
Chrome, Edge, Firefox, and Safari as available. Run narrow-window/mobile checks
only when the task affects responsive behavior.

Historical verification beyond existing changelog entries has not yet been
established in this file. No development server was started during this review.

## Moon Phases implementation: 2026-11-21

- PASS: node tests/moon-utils.test.js. Twelve independent USNO UTC fixtures
  spanning January, June/July, and December 2026 agree within 0.003 cycles and
  one percentage point of illumination at the primary phases. Daily continuity
  and numeric bounds checked for 1900, 2000, 2024, 2026, and 2100. Geometry
  branches, invalid inputs, and frozen API records checked.
- PASS: node tests/moon-calendar.test.js. Actual inline controller executed in
  an in-memory DOM surface: 365/366 valid dates, 1900/2100 century exceptions,
  current/previous/next/direct year controls, year bounds, today marker,
  one tab stop, arrow/Home/End navigation, March-to-February clamping, and
  date-rollover focus preservation. This is a unit check, not browser acceptance.
  Also passed with TZ=Pacific/Kiritimati and TZ=America/Los_Angeles.
- PASS: node tests/time-utils.test.js for the changed homepage consumer.
- PASS: node tests/site-audit.test.js for 15 public pages, required metadata,
  navigation, local assets, copyright, lunar utility order, one homepage moon
  entry, one About card, and the preserved twelve-card homepage directory.
- PASS: node tests/docs-audit.test.js. The earlier literal-arrow example mismatch
  was corrected in agents.md and UI_RULES.md using the existing &larr; convention.
- PASS: modified inline controllers parse with Node's vm.Script.
- NOT RUN: rendered desktop/narrow-window layouts, real-browser keyboard and
  screen-reader behavior, hover/focus appearance, or cross-browser acceptance.
  No application, development server, or browser was started for this feature.
- NOT RUN: publication. All changes remain local; no Git operation performed.

Manual acceptance: on Home confirm the phase icon sits beside the Julian date,
its tooltip names the phase, and clicking opens the calendar without a new hub
card. Check the About card and calendar home arrow. Try leap/non-leap years,
1900/2100 limits, direct entry, keyboard navigation, today's highlight, legend,
and daily details. At narrow widths, confirm scrolling stays within the calendar.

The calendar uses local-noon estimates and Northern Hemisphere icon orientation;
the homepage uses the current instant. No precise event-time accuracy or
independent historical/future accuracy across the full year range is claimed.

## All-page maintenance review: 2026-11-21

Scope: all 15 repository HTML pages, their controllers, seven standalone JS
assets, shared styles, publishing contracts, and current documentation. Current
browser behavior was checked against MDN references below. This is a source and
automated logic review, not rendered-browser acceptance or a deployed/source
version comparison. A web retrieval of Home returned cached content; it does
not establish deployment freshness.

### Verification executed

- PASS: all nine tests/*.test.js suites, executed directly with Node.
- PASS: all 13 inline controllers in the 15 HTML pages parsed with vm.Script;
  About has no controller and To Do uses its external controller. All seven
  standalone JS assets parsed successfully.
- FAIL (targeted behavior): F02, F04, F05, F06 (malformed saved preference),
  F07, F09, and F10 reproduced by executing extracted source functions or their
  exact date arithmetic in isolated Node contexts. F01's raw-markup construction
  was reproduced with an inert test string; no browser exploit was executed.
- Source-confirmed: F03's animation-frame scheduling, F04's stale offset labels,
  F06's unguarded storage calls, F08's captured Today value, and F11's stale text.
  The F08 Today handler was executed against its captured startup date and
  returned that old date. Real-browser midnight/hidden-tab testing was NOT RUN.
- NOT RUN: visual, interactive, screen-reader, cross-browser, or mobile checks;
  no app/server started, dependency installed, Git operation, or application fix.

### Page coverage

All pages passed the metadata, navigation, copyright, sitemap, and local-asset
audit. Finding IDs below identify additional issues beyond those contracts.

| Page | Additional review outcome |
| --- | --- |
| index.html | F06: malformed shared preference stops initialization |
| clock.html | F06: same startup vulnerability |
| clock_presets.html | F06, F07: storage guards and DST rail mismatch |
| multi-clock.html | F04: host-zone reinterpretation and stale offsets |
| task-planner-lc.html | F06: unguarded saved-state reads/writes |
| focus.html | F03, F05, F06; frequent settings writes noted below |
| timer.html | F03, F09: background completion and input validation |
| stopwatch.html | No additional correctness finding established; browser/sleep acceptance remains unverified |
| time-calculator.html | Utility tests and source review found no additional confirmed defect |
| date-calculator.html | F08: stale Today reference after midnight |
| time-zone-converter.html | Utility tests and source review found no additional confirmed defect; accuracy depends on browser/OS timezone data |
| moon-phases.html | F10: rare skipped civil-date normalization |
| dashboard.html | F01, F06, F11: imported markup, persistence, older quick-add list |
| todo.html / todo.js | F02, F06: date normalization and storage availability |
| about.html | F11: wording about leaving Timer is too broad |

### Findings and recommended corrections

These are review recommendations, not authorization to implement or redesign.
P1 = fix first; P2 = ordinary correctness/reliability; P3 = lower-impact edge
case or maintenance. Line references identify the reviewed source snapshot.

1. **F01 / P1 - Dashboard interprets imported titles and URLs as markup.**
   dashboard.html:504-514 interpolates model.title and model.url into innerHTML;
   the importer at line 828 accepts tiles without field/protocol validation and
   saves before rendering. A title containing an image tag remains executable
   markup rather than text, consistent with MDN's documented injection risk.
   A crafted imported layout could execute same-origin script and access local
   suite data. Build text/attributes through DOM properties, validate tile shape
   and allowed URL schemes, and validate before replacing saved state. No actual
   script execution or data access was attempted.
2. **F02 / P1 - To Do due dates move backward.** todo.js:186-193 parses an ISO
   date-only string as a timestamp, then reads local fields. Under
   America/New_York, actual normalizeDateString calls produced
   2026-11-21 -> 2026-11-20 -> 2026-11-19 -> 2026-11-18. Task creation, editing,
   export (line 297), and import reuse the helper, so repeated backups can shift
   dates repeatedly. Preserve and validate date-only fields using the existing
   Gregorian utility. Do not guess a bulk correction for already-shifted data.
3. **F03 / P2 - Timer and FocusLine completion depend on animation frames.**
   timer.html:464-487 and focus.html:362-369 check expiry only in
   requestAnimationFrame. Browsers generally pause these callbacks in hidden
   tabs/iframes, delaying completion sounds, notifications, and phase changes
   until the page is active. Separate deadline bookkeeping from animation,
   reconcile on visibility changes, and describe background/sleep limitations;
   changing to setInterval alone cannot guarantee asleep/closed-page alarms.
4. **F04 / P2 - Multi-Clock reinterprets foreign wall times in the host zone.**
   multi-clock.html:165-171 formats target-zone fields then constructs a local
   Date. With host America/New_York and instant 2026-03-08T02:30Z, UTC should
   show 02:30 but the function returns 03:30 because local 02:30 does not exist
   on that date. Render numeric zone fields directly, following the converter's
   existing approach. Separately, header offsets (line 235) and dropdown offsets
   (line 194) are built once; tickClock (line 343) never refreshes them after a
   DST change. Refresh date-sensitive labels as offsets change.
5. **F05 / P2 - FocusLine can count the same work block twice.** With
   auto-advance off, finishPhase (focus.html:407) leaves completed elapsed state;
   start (line 372) resumes at the completed duration and finishes it again.
   Extracted source functions reproduced 25 + 25 recorded minutes from one
   completed block followed by Start. Define an explicit completed-state action
   that advances/resets once and prevents duplicate history credit.
6. **F06 / P2 - Stored-setting failures can disable otherwise local tools.**
   index.html:376 and clock.html:401 throw SyntaxError on malformed use24h JSON,
   before initializing their clocks. Unguarded storage access also occurs in
   FocusLine saveTimer, Task Planner active/format reads, Clock Colors initial
   reads, Dashboard saves, and To Do active-planner reads/saves. Storage can be
   blocked or writes can fail. Guard access, validate shapes, preserve existing
   key contracts, and keep usable in-memory state when persistence is unavailable.
7. **F07 / P2 - Clock Colors' marker drifts from its hour labels on DST days.**
   clock_presets.html:333-342 uses actual elapsed time divided by a 23/25-hour
   day while its rail labels use equal wall-clock hour spacing. On New York's
   2026-03-08 at noon, the marker is at 47.83% rather than the noon position,
   50%. Keep wall-clock placement separate from an actual-time-to-midnight
   statistic, or explicitly label and redesign the scale if elapsed time is
   intended. Do not silently change the clock-family time convention.
8. **F08 / P2 - Date Calculator's Today becomes yesterday.**
   date-calculator.html:484-485 captures today and todayIso only during startup;
   From Now reuses that reference, and the Today button (line 769) assigns the
   captured ISO date. Recalculate the current local date for those operations
   or refresh it on date/visibility changes, preserving explicit user inputs.
9. **F09 / P2 - Timer accepts negative durations despite input limits.**
   timer.html:293-295 checks only whether totalMs is truthy; Add is a click
   handler rather than a validated form submission. Executing addTimer with
   -1 minute creates a timer with totalMs=-60000. Validate finite, nonnegative
   component values and a positive finite total before creating a timer.
10. **F10 / P3 - Moon calendar can duplicate a historical skipped date.**
    moon-phases.html:159-160 constructs local noon and checks only the month.
    Under Pacific/Apia, 2011-12-30 normalizes to December 31 (the skipped civil
    day), passes the month test, and uses December 31's label/phase for row 30.
    Validate all returned date fields and show an unavailable-local-date state,
    or choose a clearly documented fallback instant. The current-year ordinary
    date behavior is unaffected by this rare historical case.
11. **F11 / P3 - Older documentation and discovery lists need reconciliation.**
    !CONTRIBUTORS.md:40-42 still says all controllers are inline and lcl.css only
    enforces dark mode; line 135 requires universal mobile checks, conflicting
    with the newer hybrid/desktop-first rules. About:427 says leaving Timer
    pauses it; the implementation promises paused restoration after reload,
    not a general tab-switch pause. Dashboard's quick-add list (line 321 onward)
    contains six older tools and omits newer calculators and other existing
    tools; Custom URL still works. Updating that list is optional, and the
    approved Moon Phases icon/About-only discovery must remain intact.

Performance follow-up (source-observed, not benchmarked): FocusLine updateUI
(focus.html:435-441) writes settings synchronously on every running animation
frame. Save settings on changes or debounce writes instead; this is separate
from reliable deadline handling.

### Current primary references

- [MDN Date parsing and local/UTC interpretation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- [MDN requestAnimationFrame hidden-tab behavior](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame)
- [MDN background timer throttling](https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout)
- [MDN innerHTML injection considerations](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML)
- [MDN localStorage availability and exceptions](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

These browser behaviors are longstanding; no verified recent browser change
requires replacing the static architecture, adding frameworks, or installing
dependencies. Existing date/timezone utilities provide useful patterns for
repairing older page-local logic. Passing tests do not cover every listed case.
