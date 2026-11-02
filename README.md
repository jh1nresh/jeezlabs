# JeezLabs

The homepage is the black product index. Status filters narrow the list without
changing its order or project numbers. **Explore** opens `/explore.html`, an
optional illustrated island with orbit, tilt, zoom, pan and click-to-enter
camera transitions. Its **Index** link returns to the homepage.

**Updates** (`/updates`, with `/updates.md` for agents) is a dated archive of
films and project appearances. `lib/updates.ts` owns the source metadata. The
first item is the 2026-03-12 Virtuals Protocol introduction, titled “a little about us” in this archive. Its
original X post remains linked as a fallback. The HTML page loads X's official
widget script and lets it size its own iframe, without a fixed-height wrapper,
poster or extra controls. The Markdown page does not load third-party media.
This does not host a copy of the video or guarantee X playback. The privacy
notice describes the X connection on the HTML page.

`app/products.ts` is the product source for the React index, Markdown responses,
and the generated Explore page. The current selection has 11 projects:
Live 3, Shipped 4, Building 2, Preview 2. OUTPUT and EZNest are previews. MAIAT
Protocol is Shipped; savvy replaces SAV-E. Pincher, SKLL-R and Cloak are removed
from the current directory.

## Development

Use Node.js 22.6+ and npm:

```sh
npm ci
npm run dev
```

`predev` and `prebuild` regenerate `public/explore.html` from `studio/explore/`
and the shared product source. To regenerate it independently:

```sh
npm run build:explore
```

The island is portable HTML with its drawing library and license inlined. It
uses a scoped adaptation of Colorfigures by April Zhu; see
`studio/explore/LICENSE`. Project-specific architecture also uses the MIT Anatomy
convex solids subset (`studio/explore/LICENSE-Anatomy`). Its rounded bevels share
the Colorfigures orbit camera. See `studio/explore/ARCHITECTURE.md` for the project
forms and parts. Camera state and rendering are described in
`studio/VERIFICATION.md`. Keep the positional scene metadata in `island.js`
aligned with `PRODUCTS` when changing project order.

## Checks

```sh
npm run lint
npm run build
npm run typecheck
npm test
```

The runtime tests start and stop their own production server. They cover
HTML/Markdown negotiation, metadata, existing About/RSC behaviour, static assets,
product counts/statuses and Explore data parity. See `AGENT-READINESS.md` for the
existing publishing-specific checks; local tests do not establish deployment.

## Design provenance

The index follows the approved black monospace prototype. The island uses
original Colorfigures geometry inspired by a miniature-island reference from
hellothere.de: https://www.instagram.com/reels/DeNVdk7oPYA/ . No media was copied.
Polish applied Unslop by Damir Sokolovsky (@heydamir), CC BY 4.0:
https://heydamir.design/unslop . Product names and factual preview boundaries
remain explicit.

This change adds public directory content and local UI state only. It introduces
no order, equipment, payment, agent execution, authentication or collection
endpoint. Dependencies remain unchanged; the repository's existing dependency
advisories and Vercel HTML `Vary` verification remain separate release concerns.
