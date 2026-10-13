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

Preview hosting gate (do not use production; production still returns HTML and
omits `Accept` from Vary). The authorized Vercel Preview for this change:

```sh
# Homepage Markdown + Vary: Accept
curl -sS -D - -o /tmp/home.md -H 'Accept: text/markdown' \
  https://jeezlabs-1mjl2n61y-jhinreshs-projects.vercel.app/
# Expect 200, content-type: text/markdown, Vary includes Accept,
# body starts with "# JeezLabs"

# About Markdown + Vary: Accept
curl -sS -D - -o /tmp/about.md -H 'Accept: text/markdown' \
  https://jeezlabs-1mjl2n61y-jhinreshs-projects.vercel.app/about
# Expect 200, content-type: text/markdown, Vary includes Accept,
# body starts with "# About JeezLabs"

# Same 29 endpoint/behavior tests against that preview
TEST_BASE_URL=https://jeezlabs-1mjl2n61y-jhinreshs-projects.vercel.app npm test
```

Inspect status, content type, Vary, and body. GitHub Actions `Verify` runs the
local lint/typecheck/build/test suite on pull requests and repeats the preview
Accept/Vary proof plus `TEST_BASE_URL` tests. Override the preview URL with
workflow_dispatch `test_base_url` or repository variable `TEST_BASE_URL`.

This GitHub repository is not linked to the Vercel project (the project still
points at the unavailable old JhiNResH/jeezlabs repo). Preview URLs come from
an authorized CLI/preview deploy, not from automatic Git integration. Relinking
Vercel to jh1nresh/jeezlabs is a separate project-configuration decision.

After production deployment, verify both apex and www and rerun Ora. Search
Console sitemap submission / indexing inspection requires an owner account;
press outreach and changes to canonical-domain redirect policy require separate
authorization.

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
