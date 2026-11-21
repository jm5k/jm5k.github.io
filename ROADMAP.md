# Linear Clock Lab Roadmap

## Current status

The static suite contains 15 sitemap-listed public pages. See [README.md](README.md)
for implemented tools and [VERIFICATION.md](VERIFICATION.md) for current checks.

## Active work

The owner approved the next Timer/FocusLine batch: F03 deadline checks and
lifecycle catch-up, F05 once-only focus completion, F09 timer input validation,
and reducing FocusLine settings writes. These are implemented locally with a
full-controller fake-clock regression suite. Browser acceptance is pending;
the owner has now authorized committing and pushing this batch separately.

Checkpoint 88af717 (Moon Phases plus all-page review) was committed and pushed
to origin/main on 2026-11-21 at the owner's request. This confirms the push,
not completion of any hosting deployment.

The owner then authorized the two P1 fixes. F01 Dashboard input/rendering
boundaries and F02 To Do date-only normalization are implemented locally with
regression coverage; browser acceptance remains pending. The owner authorized
committing and pushing these fixes as a separate checkpoint after 88af717.
See current verification and Git history for the repair commit.

Moon Phases implemented locally on 2026-11-21: current phase beside the homepage
Julian date opens a daily current-calendar-year grid with year controls. The
user approved an About card and explicitly excluded an additional homepage
card. See [verification](VERIFICATION.md) for automated and pending acceptance.
The user reported that the lunar result matched the requested appearance and
behavior, then confirmed the online clock display updates in 8e9a385 look and
work correctly. Independent cross-browser acceptance remains unverified.
No Git or deployment operation was performed during the initial implementation;
the subsequent checkpoint push is recorded above.

## All-page review recommendations (2026-11-21)

The review is complete. F01/F02 were repaired and pushed in 46adb19. F03/F05/F09
and the FocusLine settings-write follow-up are now implemented locally after
the owner's approval. Remaining findings are recommendations, not approved work.
[VERIFICATION.md](VERIFICATION.md#all-page-maintenance-review-2026-11-21)
records all 15 page outcomes, reproduced cases, priorities, and references.

- Completed locally: F01 Dashboard imported-markup handling and F02 To Do
  date-only normalization. Existing storage keys and canonical saved dates are
  preserved; no guessed correction of possibly shifted dates is performed.
- Completed locally in the second repair batch: independent Timer/FocusLine
  deadline checks and catch-up, once-only FocusLine completion, Timer duration
  validation, and settings writes on changes. Background alarm timing remains
  limited by browser throttling/suspension.
- Further suggested repairs: F04 Multi-Clock zone handling/offset refresh,
  F06 guarded storage, F07 Clock Colors' DST scale, and F08 Date Calculator's
  Today reference.
- Lower-priority follow-up: rare skipped-date handling in Moon Phases, older
  contributor/About wording, and optional Dashboard quick-add maintenance.
- Regression coverage includes F01/F02 and the new Timer/FocusLine controller
  suite. See VERIFICATION.md for current executed results and limitations.

Recommended next item: F04 Multi-Clock zone handling and offset refresh, because
it can display the wrong time during DST transitions. This recommendation is
not authorization to begin that repair. Timer/FocusLine browser acceptance is
still pending.

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
