# Index / Explore verification

Delivery endpoint: PR for the approved index and optional island. No merge or
production deployment is included.

Observable acceptance:

- `/` displays the black index and all 11 products before JavaScript runs.
- Filters show Live 3 / Shipped 4 / Building 2 / Preview 2; All restores 11.
- Index and Explore navigate in both directions. About, metadata, Markdown,
  sitemap, robots and RSC remain available.
- Explore has 11 buildings; selecting a building moves the camera to that
  building, then reveals its correct description and original links.
- Manual input, reset and new selections interrupt old transitions. Reduced
  motion jumps to the end; hidden pages stop pending movement. One RAF owner.
- Narrow layouts retain document-width containment and usable controls.

The drawing sources and camera code were reviewed against the local prototype.
That earlier review exercised all 11 entries in an isolated VM, finite SVG
coordinates, shortest-turn entry, cancellation, reduced motion, hidden/visible
transitions and zero idle RAF. Product removal changed matching positions,
colours and descriptions together, including MAIAT's tower focus height.

Repo integration additionally runs the production build, lint, TypeScript and
HTTP tests, plus actual browser checks of the Next.js server. Prototype receipts
alone are not evidence for the Next.js integration. Physical iOS/Safari touch
and hosting-specific headers require separate checks before release.

## Repo integration receipt (2026-11-02)

- `npm run lint`, `npm run build`, `npm run typecheck`: passed.
- `npm test`: 32 passed, 0 failed/skipped; owned production server stopped by
  the suite. Explore now has HTML/Markdown negotiation, a direct Markdown URL,
  canonical metadata and sitemap coverage.
- Actual Next production server: all filters returned 3/4/2/2/11; Explore
  contained 11 buildings and entered MAIAT with Shipped status; Index returned
  correctly. At 320px, document width was 301px; 11 rows rendered and About/home
  navigation worked. Browser warnings/errors were empty.
- Browser evidence was taken from the repo server, not the original prototype.
  Physical touch devices and hosting-specific Vercel header behavior remain
  outside local evidence. No dependency upgrades or release actions included.

## Project architecture receipt (2026-11-02)

- All eleven plots now use project-specific forms and attached details. The
  homepage and shared product data are unchanged. See `explore/ARCHITECTURE.md`.
- Colorfigures remains the ink/colour renderer; the vendored Anatomy convex
  solids subset supplies bevelled slabs. Both MIT notices are inlined.
- Added portable-artifact tests: camera registration across continuous yaw,
  four quarter-turn views and 20–78 degree elevation; finite/distinct geometry
  for eleven projects; self-contained scripts and license retention.
- Lint, production build and typecheck passed. Full suite: 35 passed.
- Actual browser: island overview, project entry, 90-degree orbit and reset;
  PINGME tabletop and EZNest layout close-ups; 390px quick-select/entry, document
  width 371px, all eleven buildings; console warnings/errors empty.
- Near views suppress other project labels so they cannot cover the subject.
  Roof glazing follows its host slope and culling; library pillars meet the roof.
- This is the existing SVG orbit adapter, not Anatomy's optional live-3D engine.
  Its mechanical audit/line-check tools were not run; physical touch devices
  and hosting-specific headers remain outside this local evidence.
- Security: no new inputs, network calls, execution or production endpoints.
  Product text remains escaped and the builder checks inline delimiters.
