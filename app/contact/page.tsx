import type { Metadata } from 'next';
import InfoPage from '../InfoPage';
import { infoPages } from '../../lib/info-pages';

export const metadata: Metadata = {
  title: infoPages.contact.title,
  description: infoPages.contact.description,
  alternates: { canonical: '/contact', types: { 'text/markdown': '/contact.md' } },
  openGraph: { type: 'website', title: infoPages.contact.title, url: '/contact', images: ['/opengraph-image'] },
};
export default function Page() { return <InfoPage pageKey="contact" />; }
