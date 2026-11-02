# Agent-readable website

The homepage and `/about` negotiate HTML or Markdown using `Accept`, including
quality values, wildcards, media parameters, and `q=0`. Unsupported representations
receive 406. GET/HEAD requests for unknown pages receive a Markdown 404 when
Markdown is preferred, with a recovery link to `/llms.txt`. Normal HTML 404s remain
Next.js's error page. RSC, server actions, framework endpoints, and public assets
keep their existing handling.

`/index.md`, `/about.md`, and `/llms.txt` are explicit Markdown resources.
`/robots.txt` and `/sitemap.xml` describe the canonical `https://www.jeezlabs.io`
site, matching the existing apex-to-www redirect. Homepage metadata and JSON-LD
identify JeezLabs as a product lab / Organization. These signals cannot guarantee
a search ranking or a specific audit score.

The product Markdown uses `app/products.ts`, the same source as the homepage.
When adding a new HTML page, add its Markdown representation in `proxy.ts` and
include it in the sitemap and tests. `next.config.ts` inventories public files at
build time so assets bypass content negotiation without maintaining a second list.
Negotiated responses are private/no-store. Next.js 16.2.4 overwrites the
HTML Vary header, including ordinary Vercel header configuration, so `vercel.json`
uses a response-header transform to append Accept while preserving Next.js Vary
fields. Local Next.js cannot exercise that hosting
configuration: tests require HTML Vary when TEST_BASE_URL is set, and it must be
verified on the Vercel deployment before release. The product index now has filters and an optional island view. `/explore.html` negotiates HTML/Markdown, `/explore.md` is its direct Markdown representation, and the sitemap includes the island. Other public files retain static handling.

## Verification

Use Node.js 22.6+ (the test runner strips TypeScript types):

```sh
npm ci
npm run lint
npm run build
npm run typecheck
npm test
```

`npm test` starts and stops its own production server. It checks all page routes,
Markdown resources, sitemap and robots content/links, JSON-LD, public assets,
404s, HEAD, Accept edge cases, alternating representations, and RSC navigation.
To run the same read-only checks against an authorized deployment:

```sh
TEST_BASE_URL=https://jeezlabs.io npm test
curl -sS -L -i -H 'Accept: text/markdown' https://jeezlabs.io/
curl -sS -L -i -H 'Accept: text/html' https://jeezlabs.io/
curl -sS -L -i -H 'Accept: text/markdown' https://jeezlabs.io/some-path-that-does-not-exist
```

Inspect the final response after redirects: status, content type, Vary, and body.
After deployment, verify both apex and www and rerun Ora. Search Console sitemap
submission / indexing inspection requires an owner account; press outreach and
changes to canonical-domain redirect policy require separate authorization.

## Protocol references

- [HTTP Accept semantics](https://www.rfc-editor.org/rfc/rfc9110.html#name-accept)
- [Markdown content negotiation](https://acceptmarkdown.com/)
- [llms.txt format](https://llmstxt.org/): H1, summary blockquote, guidance paragraphs,
  then H2 sections containing Markdown link lists.
- [Schema.org Organization](https://schema.org/Organization)

## Security scope

New responses contain public, repository-owned content only; request paths are not
reflected into Markdown. JSON-LD escapes `<`. The Accept parser is the maintained
`negotiator` package rather than a substring test. No credentials, auth, payment,
API operations, remote content fetches, or production data changes are introduced.
The existing dependency tree has npm audit findings (including Next.js); upgrading
that framework and evaluating advisory applicability is a separate follow-up.

## Follow-up to the supplied 68/100 report (2026-11-02)

Read-back of the production deployment at commit `53a7e43` already confirmed
Markdown homepage negotiation, a Markdown 404 body, Organization JSON-LD,
when-to-use guidance and the sitemap. The supplied score is not evidence of the
current deployment's behavior. Repeated `Vary` header fields must be combined;
HTML has Next.js fields plus a separate `Accept` field.

This follow-up adds the missing Open Graph metadata and generated 1200×630 PNG,
Contact/Privacy pages (HTML and Markdown, each with substantive content), content
revision dates in the sitemap, and the confirmed studio X URL. About now uses
the black index typography and retains both builders' portraits and personal
profile links. Its prose and Markdown share the same facts.

The owner confirmed there is no contact email or address. The Organization
contactPoint links to the real Contact page; it does not invent email, telephone
or PostalAddress fields. Therefore the audit's email/address completeness item
remains unsatisfied. The privacy notice describes this directory's application
behavior and hosting boundary, not a policy for every linked product.

Validation: lint, Webpack production build, TypeScript and 39 tests pass. Tests
cover every public page, Markdown representation, image asset, HEAD, 404,
metadata, sitemap date, existing RSC and product behavior. Browser checks cover
desktop/narrow About, Contact and Privacy, builder links, footer wrapping and
console errors. Production read-back of these new additions follows separate
merge/deployment authorization; no new Is Agentic score is claimed.

Brand search placement, Search Console indexing/ownership and external press
links require search-engine time, owner credentials or separate outreach
approval. Markup changes cannot guarantee a top-ten ranking.

References: https://ogp.me/ ; https://www.sitemaps.org/protocol.html ;
https://llmstxt.org/ ; https://schema.org/Organization .

## Updates (2026-11-02)

`/updates` and `/updates.md` expose the same repository-owned archive metadata.
The initial entry is titled “a little about us”, following the owner's chosen
label; its original Virtuals Protocol source and 2026-03-12 publication date
were verified against the public post and X oEmbed response. The page's update
date is separate from the original post date. No transcript, duration or video
performance claim was inferred from inaccessible playback.

The X iframe is absent from initial HTML and client render. A visitor explicitly
loads it, can close it, and can always use the original link. No external X SDK
runs in the host document. The privacy page describes this optional connection.

Lint, Webpack build, typecheck and 41 tests passed. Browser checks exercised
iframe counts 0/1/0/1, keyboard activation and focus return to the load button.
At 320px, the Updates document stayed within the viewport; Index and Explore
navigation also stayed contained at a narrower 291px browser viewport. The X
frame endpoint loaded, but actual video playback was unavailable in the test
browser and is not claimed as verified. A visible original-source fallback
remains available above the player. No merge or deployment is included.
