import type { MetadataRoute } from 'next';
import { SITE_URL } from '../lib/site';
import { UPDATES_UPDATED } from '../lib/updates';
import { INFO_UPDATED } from '../lib/info-pages';

// Content revision dates, not the time a crawler or build generates the sitemap.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, lastModified: INFO_UPDATED },
    { url: `${SITE_URL}/about`, lastModified: INFO_UPDATED },
    { url: `${SITE_URL}/explore.html`, lastModified: INFO_UPDATED },
    { url: `${SITE_URL}/contact`, lastModified: INFO_UPDATED },
    { url: `${SITE_URL}/privacy`, lastModified: INFO_UPDATED },
    { url: `${SITE_URL}/updates`, lastModified: UPDATES_UPDATED },
  ];
}
