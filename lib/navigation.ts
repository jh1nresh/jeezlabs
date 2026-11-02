export const PRIMARY_NAV = [
  { label: 'ABOUT', href: '/about' },
  { label: 'UPDATES', href: '/updates' },
] as const;

// Portable Explore uses the same fixed destinations and CSS as the React pages.
export function portableHeader() {
  return `<header class="site-header"><a class="site-brand" href="/" aria-label="JeezLabs home"><span aria-hidden="true"></span>JEEZLABS</a><nav class="site-nav" aria-label="Main navigation">${PRIMARY_NAV.map(item=>`<a href="${item.href}">${item.label}</a>`).join('')}</nav></header>`;
}
