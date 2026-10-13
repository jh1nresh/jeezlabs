import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { readdirSync } from 'node:fs';
import { PRODUCTS } from '../app/products.ts';

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
  assert.ok(json.description.length > 20); assert.ok(json.sameAs[0].startsWith('https://github.com/'));
  for (const p of PRODUCTS) for (const url of [p.href, p.repo].filter(Boolean)) assert.ok(body.includes(`href="${url}"`));
});
test('About keeps HTML and gains Markdown with its own canonical', async () => {
  const md = await get('/about', 'text/markdown');
  assert.equal(md.response.status, 200); vary(md.response); assert.match(md.body, /^# About JeezLabs/);
  const html = await get('/about', 'text/html');
  assert.equal(html.response.status, 200); if (process.env.TEST_BASE_URL) vary(html.response);
  assert.match(html.body, /TWO FRIENDS/); assert.match(html.body, /rel="canonical" href="https:\/\/www.jeezlabs.io\/about"/);
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
  assert.deepEqual(urls, ['https://www.jeezlabs.io/', 'https://www.jeezlabs.io/about']);
  for (const url of urls) assert.equal((await get(new URL(url).pathname, 'text/html')).response.status, 200);
});
test('all public assets and favicon retain binary/static responses even with Markdown Accept', async () => {
  const files = readdirSync('public', { recursive: true, withFileTypes: true }).filter(e => e.isFile()).map(e => '/' + `${e.parentPath}/${e.name}`.replace(/^public\//, ''));
  for (const path of [...files, '/favicon.ico']) {
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
