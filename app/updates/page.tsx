import type { Metadata } from 'next';
import { InfoLayout } from '../InfoPage';
import { updates, UPDATES_UPDATED } from '../../lib/updates';
import PostEmbed from './PostEmbed';
import styles from './updates.module.css';

export const metadata: Metadata = {
  title: 'Updates — JeezLabs',
  description: 'Films, project news and appearances from the JeezLabs product lab.',
  alternates: { canonical: '/updates', types: { 'text/markdown': '/updates.md' } },
  openGraph: { type: 'website', title: 'Updates — JeezLabs', url: '/updates', images: ['/opengraph-image'] },
};
const dateFormat = new Intl.DateTimeFormat('en', { day:'2-digit', month:'short', year:'numeric', timeZone:'UTC' });
export default function UpdatesPage() {
  return <InfoLayout title="Updates" updated={UPDATES_UPDATED}>
    <p className={styles.intro}>Films, project news and appearances from the lab.</p>
    <ol className={styles.feed} aria-label="Studio updates">
      {[...updates].sort((a,b)=>b.published.localeCompare(a.published)).map(update=><li key={update.slug} id={update.slug}>
        <article aria-labelledby={`${update.slug}-title`}>
          <div className={styles.meta}><time dateTime={update.published}>{dateFormat.format(new Date(`${update.published}T00:00:00Z`))}</time><span>{update.kind}</span></div>
          <h2 id={`${update.slug}-title`} className={styles.title}>{update.title}</h2>
          <p>{update.description}</p>
          <p className={styles.attribution}>{update.source} <span>{update.sourceHandle}</span></p>
          <div className={styles.source}><a href={update.sourceUrl} target="_blank" rel="noopener noreferrer">Watch original on X ↗</a><p>Playback unavailable here? The original post remains linked above.</p></div>
          <PostEmbed postId={update.postId} title={update.title} />
        </article>
      </li>)}
    </ol>
  </InfoLayout>;
}
