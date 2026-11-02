export const INFO_UPDATED = '2026-11-02';
export const infoPages = {
  contact: {
    title: 'Contact JeezLabs',
    description: 'Public contact channels for the JeezLabs product lab and its builders.',
    sections: [
      { title: 'Reach the builders', paragraphs: [
        'JeezLabs is a two-person product lab run by jhinresh and ezven. For questions about the product directory, a broken project link, attribution or a possible collaboration, use the builders’ existing public profiles below. JeezLabs does not publish a contact email, telephone number or postal address.',
        'For a question about a particular product, start with its website or source repository in the index. Include the product name, the page you were using and a short description of what happened. A directory listing does not mean every product has the same support arrangements or availability.',
      ], links: [
        ['JeezLabs on X', 'https://x.com/jeezlabsio'],
        ['jhinresh on GitHub', 'https://github.com/JhiNResH'],
        ['jhinresh on X', 'https://x.com/JhiNResH'],
        ['ezven on GitHub', 'https://github.com/Ferxxo-pa'],
        ['ezven on X', 'https://x.com/ezveng'],
      ] },
      { title: 'What to include', paragraphs: [
        'For a reproducible website issue, include the URL, browser and expected result. Public profile pages and repositories have their own communication options; private messages may not be available. Do not put passwords, wallet recovery phrases, customer files or other private information in a public post or issue. We do not promise a response time through these channels.',
      ], links: [['Product index', '/'], ['Privacy notice', '/privacy']] },
    ],
  },
  privacy: {
    title: 'JeezLabs website privacy',
    description: 'How this product directory handles visits, local interactions and external links.',
    sections: [
      { title: 'Scope', paragraphs: [
        'This notice covers the JeezLabs product directory at www.jeezlabs.io, including About, Contact, Updates and the illustrated Explore view. The products linked from this directory are separate websites or applications. Their account, payment, upload and privacy arrangements are described by those products; this notice does not cover their operation.',
      ], links: [] },
      { title: 'Browsing and local controls', paragraphs: [
        'You can read this directory without creating an account. The directory has no sign-in, payment, contact form or file-upload feature. Its application code does not add advertising trackers or analytics scripts, and does not write application cookies or save filter selections in browser storage.',
        'The status filters, island camera and selected project are held in page memory. Reloading the page resets them. Images and other website files may be stored in your browser’s normal cache. Reading a page still sends a network request to the hosting provider.',
      ], links: [] },
      { title: 'Hosting and other websites', paragraphs: [
        'Vercel hosts this website. Delivering and protecting the site can involve processing request information such as an IP address, browser details, requested URL and request time. Hosting-provider processing is described in Vercel’s privacy notice. JeezLabs has not published a fixed retention period for infrastructure logs.',
        'Following a product, GitHub or X link sends you to another service, which receives your request and applies its own privacy practices. Review that service’s notice before sharing personal information or using its account features.',
      ], links: [['Vercel privacy notice', 'https://vercel.com/legal/privacy-notice']] },
      { title: 'Optional X embeds', paragraphs: [
        'The Updates HTML page loads X’s embedding script to display external posts and videos. Visiting that page with JavaScript enabled connects your browser to X, which may receive request information or use its own cookies and account state under its privacy practices. You can read /updates.md without loading external media. Embedded playback and controls are provided by X.',
      ], links: [['X privacy policy', 'https://x.com/en/privacy']] },
      { title: 'Questions and changes', paragraphs: [
        'For questions about this directory or this notice, use the public contact options on the Contact page. Do not include private information in a public post. The date on this page records its latest content update; changes to the directory’s data handling should be reflected here.',
      ], links: [['Contact JeezLabs', '/contact']] },
    ],
  },
} as const;
export type InfoPageKey = keyof typeof infoPages;
export function infoMarkdown(key: InfoPageKey, origin: string) {
  const page = infoPages[key];
  return `# ${page.title}\n\nUpdated ${INFO_UPDATED}\n\n${page.sections.map(s => `## ${s.title}\n\n${s.paragraphs.join('\n\n')}\n\n${s.links.map(([label,url])=>`- [${label}](${new URL(url, origin).href})`).join('\n')}`).join('\n\n')}\n`;
}
