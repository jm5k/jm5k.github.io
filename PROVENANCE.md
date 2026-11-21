# Linear Clock Lab Provenance

## Known origin and license

[README.md](README.md) credits jm5k as the creator of Linear Clock Lab.
[LICENSE](LICENSE) contains the MIT License and a 2025 jm5k copyright notice.
Preserve its notice and license conditions when redistributing covered code.

## Runtime dependencies and references

The inspected implementation uses browser-native HTML, CSS, and JavaScript,
repository-local styles and utilities, and no runtime JavaScript or CSS library
dependencies. Timezone behavior uses the browser's Intl timezone data; it is
limited by the installed browser/OS database.

Production metadata references https://linearclocklab.com/profile.png. README
badges and external hyperlinks are references rather than core tool dependencies.

## Lunar Feature References (2026-11-21)

- Original dependency-free code in lcl-moon.js implements orbital mathematics
  described by Paul Schlyter in [Computing planetary positions](https://stjarnhimlen.se/comp/ppcomp.html),
  sections 4-9: solar/lunar orbital elements, Kepler solution, and lunar
  perturbations. No external source code or library was imported. This reduced
  phase display does not claim the full reference algorithm's positional accuracy.
- Twelve independent UTC phase-event fixtures from the
  [US Naval Observatory's 2026 phase table](https://aa.usno.navy.mil/calculated/moon/phases?date=2026-01-01&format=p&nump=60&submit=Get+Data)
  validate broad phase positions and illumination, not event prediction accuracy
  over the full supported year range.
- The user supplied a moon-calendar image as layout inspiration. Its ownership
  and license have not been established; no pixels, faces, artwork, or fonts
  were copied into the repository. Moon icons are original geometric SVG paths.
- No dependencies or downloaded assets were added. Reference sites are consulted
  only during development; runtime calculations make no network requests.

## Unresolved provenance

The original sources and separate licensing, if any, of profile imagery, icons,
and other image assets have not yet been established. This review did not perform
a complete asset or imported-code provenance audit; the repository license alone
does not establish ownership of all external material.
