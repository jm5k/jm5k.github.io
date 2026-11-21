# Linear Clock Lab Roadmap

## Current status

The static suite contains 15 sitemap-listed public pages. See [README.md](README.md)
for implemented tools and [VERIFICATION.md](VERIFICATION.md) for current checks.

## Active work

Moon Phases implemented locally on 2026-11-21: current phase beside the homepage
Julian date opens a daily current-calendar-year grid with year controls. The
user approved an About card and explicitly excluded an additional homepage
card. See [verification](VERIFICATION.md) for automated and pending acceptance.
The user reported that the lunar result matched the requested appearance and
behavior. Cross-browser acceptance and publication state remain unverified.
No Git or deployment operation was performed.

## All-page review recommendations (2026-11-21)

The review is complete; application fixes have not been authorized by this
review request. [VERIFICATION.md](VERIFICATION.md#all-page-maintenance-review-2026-11-21)
records all 15 page outcomes, reproduced cases, priorities, and references.

- First suggested repair batch: F01 Dashboard imported-markup handling and
  F02 To Do date-only normalization. Preserve saved data and existing keys;
  do not guess corrections to dates that may already have shifted.
- Further suggested repairs: background timer completion, Multi-Clock zone
  handling/offset refresh, FocusLine completion accounting, guarded storage,
  Clock Colors' DST scale, Date Calculator's Today reference, and Timer inputs.
- Lower-priority follow-up: rare skipped-date handling in Moon Phases, older
  contributor/About wording, and optional Dashboard quick-add maintenance.
- Add regression coverage for approved fixes. Existing nine suites pass but
  do not protect the newly discovered cases.

Next actionable step: owner chooses the scope of a separate repair task.

## Existing planned ideas

The [README planned updates](README.md#-planned-updates) list workday-only mode,
custom marker zones, saved multi-clock groups, global theme sync, and stopwatch
export logs. These remain ideas without a newly approved implementation order.

## Known follow-up

- The earlier back-arrow documentation mismatch was corrected while documenting
  the lunar feature's navigation exception; see current verification results.
- !CONTRIBUTORS.md contains older inline-only, shared-CSS, and mobile-testing
  guidance that conflicts with the current hybrid, desktop-first agent rules.
  Follow the higher-priority agent rules; reconcile contributor guidance in a
  future documentation task.
- Hands-on browser acceptance remains with the user.

Deferred or rejected feature decisions have not yet been established here.
