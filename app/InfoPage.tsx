import SiteHeader from './SiteHeader';
import type { ReactNode } from 'react';
import { SITE_X } from '../lib/site';
import Link from 'next/link';
import { infoPages, INFO_UPDATED, type InfoPageKey } from '../lib/info-pages';
import indexStyles from './index.module.css';
import styles from './info.module.css';

export function InfoLayout({ title, children, updated = INFO_UPDATED, currentPath }: { title: string; children: ReactNode; updated?: string; currentPath?: string }) {
  return <div className={`${indexStyles.root} ${styles.frame}`}>
    <a className="skip" href="#page-content">Skip to content</a>
    <SiteHeader currentPath={currentPath} />
    <div className="page">

      <main id="page-content" className={styles.content}>
        <p className={styles.date}>Updated <time dateTime={updated}>{updated}</time></p>
        <h1>{title}</h1>
        {children}
      </main>
      <footer><p>JeezLabs · Product lab</p><nav aria-label="Information pages" className={styles.footerNav}><Link href="/contact">CONTACT</Link><Link href="/privacy">PRIVACY</Link><a href="https://github.com/jh1nresh/jeezlabs" target="_blank" rel="noopener noreferrer">GH ↗</a><a href={SITE_X} target="_blank" rel="noopener noreferrer">X ↗</a></nav></footer>
    </div>
  </div>;
}

export default function InfoPage({ pageKey }: { pageKey: InfoPageKey }) {
  const page = infoPages[pageKey];
  return <InfoLayout title={page.title} currentPath={`/${pageKey}`}>
        {page.sections.map(section=><section key={section.title}><h2>{section.title}</h2>{section.paragraphs.map(p=><p key={p}>{p}</p>)}{section.links.length>0&&<ul>{section.links.map(([label,url])=><li key={url}><a href={url}>{label}</a></li>)}</ul>}</section>)}
  </InfoLayout>;
}
