import type { Metadata } from 'next';
import InfoPage from '../InfoPage';
import { infoPages } from '../../lib/info-pages';

export const metadata: Metadata = {
  title: infoPages.privacy.title,
  description: infoPages.privacy.description,
  alternates: { canonical: '/privacy', types: { 'text/markdown': '/privacy.md' } },
  openGraph: { type: 'website', title: infoPages.privacy.title, url: '/privacy', images: ['/opengraph-image'] },
};
export default function Page() { return <InfoPage pageKey="privacy" />; }
