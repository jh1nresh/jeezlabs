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
verified on the Vercel deployment before release. Styles, layout, and interactions are unchanged.

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
