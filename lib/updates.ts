// Public source metadata, verified against the original post and X oEmbed.
export const UPDATES_UPDATED = '2026-11-02';
export const updates = [
  {
    slug: 'a-little-about-us',
    title: 'a little about us',
    published: '2026-03-12',
    kind: 'Introduction',
    source: 'Virtuals Protocol',
    sourceHandle: '@virtuals_io',
    sourceUrl: 'https://x.com/virtuals_io/status/2032005346185920557',
    postId: '2032005346185920557',
    description: 'An earlier introduction shared by Virtuals Protocol.',
  },
] as const;
export function updatesMarkdown(origin: string) {
  return `# JeezLabs updates\n\nFilms, project news and appearances from the lab.\n\n${updates.map(update=>`## ${update.title}\n\n- Published: ${update.published}\n- Type: ${update.kind}\n- Source: ${update.source} (${update.sourceHandle})\n\n${update.description}\n\n- [Watch the original post on X](${update.sourceUrl})\n`).join('\n')}\nThe HTML page loads an embedded X post and video. This Markdown version does not load external media. Playback on the HTML page is provided by X and may require signing in.\n\n- [Product index](${origin}/index.md)\n- [About JeezLabs](${origin}/about.md)\n`;
}
