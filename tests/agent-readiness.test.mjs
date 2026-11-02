import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { readdirSync } from 'node:fs';
import { PRIMARY_NAV } from '../lib/navigation.ts';
import { updates, updatesMarkdown, UPDATES_UPDATED } from '../lib/updates.ts';
import { PRODUCTS } from '../app/products.ts';
import { SITE_URL, SITE_X } from '../lib/site.ts';
import { aboutIntro, aboutDirectory, aboutExplore, aboutMakers, builders } from '../lib/about.ts';
import { infoPages, infoMarkdown, INFO_UPDATED } from '../lib/info-pages.ts';

let base = process.env.TEST_BASE_URL;
let server;
let serverExit;
let output = '';
before(async () => {
  if (base) return;
  const socket = createServer();
  await new Promise(resolve => socket.listen(0, '127.0.0.1', resolve));
  const { port } = socket.address();
  await new Promise(resolve => socket.close(resolve));
  base = `http://127.0.0.1:${port}`;
  server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', String(port)], { stdio: ['ignore', 'pipe', 'pipe'] });
  serverExit = new Promise(resolve => server.once('exit', resolve));
  server.stdout.on('data', chunk => { output += chunk; });
  server.stderr.on('data', chunk => { output += chunk; });
  for (let i = 0; i < 100; i++) {
    try { await fetch(base); return; } catch { /* wait for the owned server */ }
    if (server.exitCode !== null) throw new Error(output);
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error(`Server did not start: ${output}`);
});
after(async () => { if (server) { server.kill('SIGTERM'); await serverExit; } });

async function get(path, accept, method = 'GET', extraHeaders = {}) {
  const response = await fetch(`${base}${path}`, { method, headers: { ...(accept === null ? {} : { Accept: accept }), ...extraHeaders }, signal: AbortSignal.timeout(15000) });
  return { response, body: await response.text() };
}
function vary(response) { assert.ok(response.headers.get('vary')?.toLowerCase().split(/,\s*/).includes('accept'), 'Vary must include Accept'); }
const vectors = [
  ['text/markdown', 'text/markdown', 200],
  ['text/html', 'text/html', 200],
  ['text/markdown;q=0.9,text/html;q=0.5', 'text/markdown', 200],
  ['text/markdown;q=0.1,text/html;q=0.9', 'text/html', 200],
  ['text/markdown;q=0,text/html', 'text/html', 200],
  ['text/markdown;q=0,*/*;q=0.8', 'text/html', 200],
  ['text/html;q=0,text/*;q=0.5', 'text/markdown', 200],
  ['TEXT/MARKDOWN; charset=UTF-8', 'text/markdown', 200],
  ['text/markdown;variant=unsupported,text/html;q=0.5', 'text/html', 200],
  ['text/markdown;variant="a,b",text/html;q=0.5', 'text/html', 200],
  ['text/markdown;q=oops', 'text/plain', 406],
  ['application/json', 'text/plain', 406],
  ['text/html;q=0,text/markdown;q=0', 'text/plain', 406],
  ['*/*', 'text/html', 200],
  ['text/*', 'text/html', 200],
  [null, 'text/html', 200],
];
for (const [accept, type, status] of vectors) {
  test(`homepage negotiates ${accept ?? '(absent)'}`, async () => {
    const { response, body } = await get('/', accept);
    assert.equal(response.status, status); if (type !== 'text/html' || process.env.TEST_BASE_URL) vary(response);
    assert.ok(response.headers.get('content-type').startsWith(type));
    assert.ok(body.length > 20);
    if (type === 'text/markdown') { assert.match(body, /^# JeezLabs/); assert.doesNotMatch(body, /<!DOCTYPE|<html/i); }
    if (type === 'text/html') assert.match(body, /<!DOCTYPE html>/i);
  });
}
test('Markdown contains every product, status, builder, and outgoing link from the shared source', async () => {
  const { body } = await get('/', 'text/markdown');
  for (const product of PRODUCTS) {
    assert.ok(body.includes(`### ${product.t}`));
    assert.ok(body.includes(product.desc));
    assert.ok(body.includes(`- Status: ${product.s}`));
    for (const url of [product.href, product.repo].filter(Boolean)) assert.ok(body.includes(`](${url})`));
  }
});
test('home HTML exposes brand metadata and parseable Organization JSON-LD without changing product links', async () => {
  const { body } = await get('/', 'text/html');
  assert.match(body, /<title>JeezLabs.*product lab/);
  assert.match(body, /<h1[^>]*>JeezLabs product lab/);
  assert.match(body, /rel="canonical" href="https:\/\/www.jeezlabs.io\/?"/);
  assert.match(body, /type="text\/markdown" href="https:\/\/www.jeezlabs.io\/index.md"/);
  const json = JSON.parse(body.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)?.[1] ?? 'null');
  assert.equal(json?.['@context'], 'https://schema.org');
  assert.equal(json?.['@type'], 'Organization');
  assert.equal(json?.name, 'JeezLabs');
  assert.equal(json?.url, 'https://www.jeezlabs.io/');
  assert.deepEqual(json.contactPoint, { '@type': 'ContactPoint', contactType: 'General inquiries', url: 'https://www.jeezlabs.io/contact' });
  assert.ok(!('email' in json) && !('address' in json), 'Unprovided business details must stay absent');
  assert.ok(json.description.length > 20); assert.deepEqual(json.sameAs, ['https://github.com/jh1nresh/jeezlabs', SITE_X]);
  for (const p of PRODUCTS) for (const url of [p.href, p.repo].filter(Boolean)) assert.ok(body.includes(`href="${url}"`));
});
test('About keeps HTML and gains Markdown with its own canonical', async () => {
  const md = await get('/about', 'text/markdown');
  assert.equal(md.response.status, 200); vary(md.response); assert.match(md.body, /^# About JeezLabs/);
  const html = await get('/about', 'text/html');
  assert.equal(html.response.status, 200); if (process.env.TEST_BASE_URL) vary(html.response);
  assert.match(html.body, /Two friends/); assert.match(html.body, /rel="canonical" href="https:\/\/www.jeezlabs.io\/about"/);
});
for (const path of ['/__ora-404-probe-test', '/missing/deep/path', '/missing-file.md', '/missing-image.png']) {
  test(`unknown path ${path} retains 404 and negotiates Markdown`, async () => {
    const md = await get(path, 'text/markdown');
    assert.equal(md.response.status, 404); vary(md.response);
    assert.ok(md.response.headers.get('content-type').startsWith('text/markdown'));
    assert.ok(md.body.length > 20); assert.match(md.body, /\[agent guidance\]\(https:\/\/www.jeezlabs.io\/llms.txt\)/);
    const html = await get(path, 'text/html');
    assert.equal(html.response.status, 404); assert.ok(html.response.headers.get('content-type').startsWith('text/html'));
    assert.match(html.body, /This page could not be found/);
  });
}
test('HEAD has the same status and media type but no body', async () => {
  for (const [path, status] of [['/', 200], ['/missing', 404], ['/llms.txt', 200]]) {
    const { response, body } = await get(path, 'text/markdown', 'HEAD');
    assert.equal(response.status, status); assert.equal(body, ''); vary(response);
    assert.ok(response.headers.get('content-type').startsWith('text/markdown'));
  }
});
test('fixed Markdown representations and llms.txt format and links', async () => {
  for (const [direct, page] of [['/index.md', '/'], ['/about.md', '/about']]) {
    const md = await get(direct, '*/*'); const negotiated = await get(page, 'text/markdown');
    assert.equal(md.response.status, 200); assert.equal(md.body, negotiated.body);
    assert.ok(md.response.headers.get('content-type').startsWith('text/markdown'));
  }
  const { response, body } = await get('/llms.txt', '*/*');
  assert.equal(response.status, 200); assert.ok(response.headers.get('content-type').startsWith('text/markdown'));
  assert.match(body, /^# JeezLabs\n\n> /); assert.match(body, /## When to use this/);
  assert.match(body, /GET request with Accept: text\/markdown/);
  assert.match(body, /not a unified product API/);
  const sections = body.split(/^## .+$/m).slice(1);
  for (const section of sections) for (const line of section.trim().split('\n').filter(Boolean)) assert.match(line, /^- \[.+\]\(https:\/\/[^)]+\)(: .+)?$/);
  for (const match of body.matchAll(/\]\(https:\/\/www.jeezlabs.io([^)]*)\)/g)) {
    const linked = await get(match[1], '*/*'); assert.equal(linked.response.status, 200, match[1]);
  }
});
test('robots and sitemap use canonical URLs and valid document structure', async () => {
  const robots = await get('/robots.txt', '*/*');
  assert.equal(robots.response.status, 200); assert.match(robots.body, /User-Agent: \*/i); assert.match(robots.body, /Allow: \//);
  assert.match(robots.body, /Sitemap: https:\/\/www.jeezlabs.io\/sitemap.xml/);
  const sitemap = await get('/sitemap.xml', '*/*'); assert.equal(sitemap.response.status, 200);
  assert.match(sitemap.response.headers.get('content-type'), /xml/);
  assert.match(sitemap.body, /<urlset xmlns="http:\/\/www.sitemaps.org\/schemas\/sitemap\/0.9">/);
  const urls = [...sitemap.body.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
  assert.deepEqual(urls, ['https://www.jeezlabs.io/', 'https://www.jeezlabs.io/about', 'https://www.jeezlabs.io/explore.html', 'https://www.jeezlabs.io/contact', 'https://www.jeezlabs.io/privacy', 'https://www.jeezlabs.io/updates']);
  const dates = [...sitemap.body.matchAll(/<lastmod>(.*?)<\/lastmod>/g)].map(m => m[1]);
  assert.equal(dates.length, urls.length);
  for (const date of dates) assert.ok(Number.isFinite(Date.parse(date)));
  assert.equal(dates[1], INFO_UPDATED);
  assert.equal(dates[3], INFO_UPDATED);
  for (const url of urls) assert.equal((await get(new URL(url).pathname, 'text/html')).response.status, 200);
});
test('all public assets and favicon retain binary/static responses even with Markdown Accept', async () => {
  const files = readdirSync('public', { recursive: true, withFileTypes: true }).filter(e => e.isFile()).map(e => '/' + `${e.parentPath}/${e.name}`.replace(/^public\//, ''));
  for (const path of [...files, '/favicon.ico']) {
    if (path === '/explore.html') continue; // Page negotiates Markdown; other public files remain assets.
    const { response } = await get(path, 'text/markdown'); assert.equal(response.status, 200, path);
    assert.ok(!response.headers.get('content-type')?.startsWith('text/markdown'), path);
  }
});
test('RSC navigation still receives a Flight response', async () => {
  const { response, body } = await get('/about?_rsc=agent-test', '*/*', 'GET', { RSC: '1' });
  assert.equal(response.status, 200); assert.match(response.headers.get('content-type'), /text\/x-component/);
  assert.doesNotMatch(body, /^# About/);
});
test('alternating Markdown and HTML cannot mix representations', async () => {
  for (const accept of ['text/markdown', 'text/html', 'text/markdown', 'text/html']) {
    const { response } = await get('/', accept); assert.ok(response.headers.get('content-type').startsWith(accept)); if (accept === 'text/markdown' || process.env.TEST_BASE_URL) vary(response);
  }
});

test('approved index has eleven products and the requested status changes', async () => {
  assert.equal(PRODUCTS.length, 11);
  assert.ok(!PRODUCTS.some(p => ['pincher', 'jiagon', 'cloak'].includes(p.slug)));
  assert.equal(PRODUCTS.find(p => p.slug === 'maiat-protocol')?.s, 'shipped');
  const savvy = PRODUCTS.find(p => p.slug === 'wanderly');
  assert.equal(savvy?.t, 'savvy');
  assert.equal(savvy?.href, 'https://savvy.jeezlabs.io/');
  assert.equal(savvy?.repo, 'https://github.com/jh1nresh/SAV-E');
  assert.equal(PRODUCTS.find(p => p.slug === 'agentshack')?.repo, 'https://github.com/jh1nresh/agentshack');
  assert.equal(PRODUCTS.find(p => p.slug === 'gimi')?.repo, 'https://github.com/jh1nresh/Gimi');
  assert.equal(PRODUCTS.find(p => p.slug === 'maiat-protocol')?.repo, undefined);
  assert.equal(PRODUCTS.filter(p => p.s === 'live').length, 3);
  assert.equal(PRODUCTS.filter(p => p.s === 'shipped').length, 4);
  assert.equal(PRODUCTS.filter(p => p.s === 'building').length, 2);
  assert.equal(PRODUCTS.filter(p => p.s === 'preview').length, 2);
  const { body } = await get('/', 'text/html');
  assert.equal([...body.matchAll(/<li class="product"/g)].length, 11);
  assert.match(body, /aria-label="Filter projects by status"/);
  assert.match(body, /href="\/explore.html"/);
});

test('Explore is portable HTML and uses the same products as the index and Markdown', async () => {
  const { response, body } = await get('/explore.html', 'text/html');
  assert.equal(response.status, 200);
  assert.ok(response.headers.get('content-type').startsWith('text/html'));
  const rows = JSON.parse(body.match(/const projects=(\[.*?\]);/s)?.[1] ?? 'null');
  assert.deepEqual(rows.map(p => [p[0], p[2].toLowerCase(), p[4], p[5]]), PRODUCTS.map(p => [p.t, p.s, p.href ?? null, p.repo ?? null]));
  assert.match(body, /MIT License/);
  assert.doesNotMatch(body, /<script\s+src=/);
  assert.match(body, /function isEnter\(/);
  assert.match(body, /href="\.\/">01 \/ INDEX/);
});

test('Explore negotiates Markdown, supports HEAD and exposes a direct representation', async () => {
  const md = await get('/explore.html', 'text/markdown');
  assert.equal(md.response.status, 200); vary(md.response);
  assert.match(md.body, /^# Explore JeezLabs/);
  assert.equal(md.body, (await get('/explore.md', '*/*')).body);
  for (const p of PRODUCTS) assert.ok(md.body.includes(`## ${p.t}`));
  const head = await get('/explore.html', 'text/markdown', 'HEAD');
  assert.equal(head.response.status, 200); assert.equal(head.body, '');
});

for (const key of ['contact', 'privacy']) {
  test(`${key} is a substantive public page with matching Markdown and discovery links`, async () => {
    const html = await get(`/${key}`, 'text/html');
    assert.equal(html.response.status, 200);
    assert.match(html.body, new RegExp(`rel="canonical" href="https://www.jeezlabs.io/${key}"`));
    assert.match(html.body, new RegExp(`<h1>${infoPages[key].title}</h1>`));
    const main = html.body.match(/<main[^>]*>(.*?)<\/main>/s)?.[1];
    assert.ok(main.replace(/<[^>]+>/g, '').length >= 500);
    for (const section of infoPages[key].sections) for (const text of section.paragraphs) assert.ok(main.includes(text));
    const md = await get(`/${key}`, 'text/markdown');
    assert.equal(md.response.status, 200); vary(md.response);
    assert.ok(md.response.headers.get('content-type').startsWith('text/markdown'));
    assert.equal(md.body, infoMarkdown(key, SITE_URL));
    assert.equal(md.body, (await get(`/${key}.md`, '*/*')).body);
    const head = await get(`/${key}`, 'text/markdown', 'HEAD');
    assert.equal(head.response.status, 200); assert.equal(head.body, '');
    const home = await get('/', 'text/html');
    assert.ok(home.body.includes(`href="/${key}"`));
    const guidance = await get('/llms.txt', '*/*');
    assert.ok(guidance.body.includes(`/${key}.md`));
  });
}
test('homepage includes the four Open Graph properties and a reachable PNG', async () => {
  const { body } = await get('/', 'text/html');
  for (const property of ['title', 'type', 'image', 'url']) assert.match(body, new RegExp(`property="og:${property}" content="[^" ]+`));
  assert.match(body, /property="og:type" content="website"/);
  const image = body.match(/property="og:image" content="([^"]+)"/)?.[1];
  const imagePath = new URL(image).pathname;
  const response = await fetch(`${base}${imagePath}`, {headers:{Accept:'text/markdown'}});
  assert.equal(response.status, 200); assert.match(response.headers.get('content-type'), /^image\/png/);
  const bytes = Buffer.from(await response.arrayBuffer());
  assert.equal(bytes.subarray(1,4).toString(), 'PNG');
  assert.equal(bytes.readUInt32BE(16), 1200); assert.equal(bytes.readUInt32BE(20), 630);
});

test('About preserves builder identity and shares factual content with Markdown', async () => {
  const html = await get('/about', 'text/html'); const md = await get('/about.md', '*/*');
  for (const text of [aboutIntro, aboutDirectory, aboutExplore, aboutMakers]) { assert.ok(html.body.includes(text)); assert.ok(md.body.includes(text)); }
  assert.ok(aboutIntro.length + aboutDirectory.length + aboutExplore.length + aboutMakers.length >= 500);
  for (const builder of builders) { assert.ok(html.body.includes(`alt="${builder.name} profile picture"`)); assert.ok(html.body.includes(`href="${builder.github}"`)); assert.ok(html.body.includes(`href="${builder.x}"`)); }
  for (const path of ['/', '/about', '/contact', '/privacy', '/explore.html']) {
    const {body} = await get(path, 'text/html'); assert.ok(body.includes(`href="${SITE_X}"`),path); assert.ok(!body.includes('x.com/0xmaiat'),path);
  }
});

test('Updates has a minimal native embed with a dated heading and original-source fallback', async () => {
  const { response, body } = await get('/updates', 'text/html');
  assert.equal(response.status, 200);
  assert.match(body, /rel="canonical" href="https:\/\/www.jeezlabs.io\/updates"/);
  assert.match(body, /property="og:url" content="https:\/\/www.jeezlabs.io\/updates"/);
  assert.match(body, /<h1>Updates<\/h1>/);
  assert.doesNotMatch(body, /<iframe|<script[^>]+src="https:\/\/(platform|publish)\./);
  for (const entry of updates) {
    assert.ok(body.includes(`id="${entry.slug}"`));
    assert.ok(body.includes(entry.title));
    assert.ok(body.includes(`dateTime="${entry.published}"`));

    assert.ok(body.includes(`href="${entry.sourceUrl}"`));
    assert.ok(new Date(entry.published) <= new Date(UPDATES_UPDATED));
  }
  assert.match(body, /a little about us/); assert.doesNotMatch(body, /Meet Jerry/);
  assert.doesNotMatch(body, /Close X embed|X provides this player|Load X post|INTRODUCTION \/ ORIGINAL/);
  assert.match(body, /View original post on X/);
  for (const path of ['/', '/about', '/contact', '/privacy', '/explore.html']) {
    assert.ok((await get(path, 'text/html')).body.includes('href="/updates"'),path);
  }
  assert.ok((await get('/llms.txt', '*/*')).body.includes('/updates.md'));
});
test('Updates supports negotiated/direct Markdown, HEAD and invalid Accept', async () => {
  const md=await get('/updates','text/markdown');
  assert.equal(md.response.status,200); vary(md.response);
  assert.ok(md.response.headers.get('content-type').startsWith('text/markdown'));
  assert.equal(md.body,updatesMarkdown(SITE_URL));
  assert.equal(md.body,(await get('/updates.md','*/*')).body);
  for (const entry of updates) {assert.ok(md.body.includes(entry.published));assert.ok(md.body.includes(entry.sourceUrl));assert.ok(md.body.includes(entry.description));}
  const head=await get('/updates','text/markdown','HEAD');
  assert.equal(head.response.status,200); assert.equal(head.body,''); vary(head.response);
  const denied=await get('/updates','application/json');assert.equal(denied.response.status,406);
});

test('all pages keep the same two primary links and expose external links in the footer', async () => {
  for (const path of ['/', '/about', '/updates', '/contact', '/privacy', '/explore.html']) {
    const {body}=await get(path,'text/html');
    const header=body.match(/<header class="site-header">(.*?)<\/header>/s)?.[1];
    assert.ok(header,path);
    const nav=header.match(/<nav[^>]*>(.*?)<\/nav>/s)?.[1];
    const items=[...nav.matchAll(/<a[^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/g)].map(m=>({href:m[1],label:m[2]}));
    assert.deepEqual(items,PRIMARY_NAV,path);
    assert.ok(header.includes('aria-label="JeezLabs home"'));
    const current=[...nav.matchAll(/<a[^>]*aria-current="page"[^>]*>/g)];
    assert.equal(current.length,['/about','/updates'].includes(path)?1:0,path);
    const footer=body.match(/<footer[^>]*>(.*?)<\/footer>/s)?.[1];
    assert.ok(footer.includes(`href="${SITE_X}"`),path);
    assert.ok(footer.includes('href="https://github.com/jh1nresh/jeezlabs"'),path);
  }
});
