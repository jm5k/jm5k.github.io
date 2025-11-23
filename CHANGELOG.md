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
