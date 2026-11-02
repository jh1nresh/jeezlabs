import Link from 'next/link';
import { PRIMARY_NAV } from '../lib/navigation';

export default function SiteHeader({ currentPath }: { currentPath?: string }) {
  return <header className="site-header">
    <Link className="site-brand" href="/" aria-label="JeezLabs home"><span aria-hidden="true" />JEEZLABS</Link>
    <nav className="site-nav" aria-label="Main navigation">{PRIMARY_NAV.map(item=><Link key={item.href} href={item.href} aria-current={currentPath===item.href?'page':undefined}>{item.label}</Link>)}</nav>
  </header>;
}
