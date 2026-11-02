import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { InfoLayout } from '../InfoPage';
import { aboutIntro, aboutDirectory, aboutExplore, aboutMakers, builders } from '../../lib/about';
import { SITE_X } from '../../lib/site';
import styles from '../info.module.css';

export const metadata: Metadata = {
  title: 'About JeezLabs — product lab',
  description: 'Meet jhinresh and ezven, the builders behind JeezLabs.',
  alternates: { canonical: '/about', types: { 'text/markdown': '/about.md' } },
  openGraph: { type: 'website', title: 'About JeezLabs — product lab', url: '/about', images: ['/opengraph-image'] },
};
export default function AboutPage() {
  return <InfoLayout title="About JeezLabs">
    <section><h2>Two friends. One lab.</h2><p>{aboutIntro}</p></section>
    <section aria-labelledby="builders-title"><h2 id="builders-title">The builders</h2><div className={styles.builders}>{builders.map(builder=><article className={styles.builder} key={builder.name}>
      <Image src={builder.image} alt={`${builder.name} profile picture`} width={96} height={96} />
      <div><h3>{builder.name}</h3><p>Builder / product</p><nav aria-label={`${builder.name} profiles`}><a href={builder.github}>GitHub ↗</a><a href={builder.x}>X ↗</a></nav></div>
    </article>)}</div></section>
    <section><h2>What you will find here</h2><p>{aboutDirectory}</p><p>{aboutMakers}</p></section>
    <section><h2>Another way to explore</h2><p>{aboutExplore}</p><ul><li><Link href="/">Browse the product index</Link></li><li><a href="/explore.html">Explore the island</a></li><li><a href={SITE_X}>JeezLabs on X ↗</a></li></ul></section>
  </InfoLayout>;
}
