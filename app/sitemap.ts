import type { MetadataRoute } from 'next';
import { getEntries } from '@/lib/content';
import { siteUrl } from '@/lib/site';
export const dynamic = 'force-static';
export default function sitemap(): MetadataRoute.Sitemap {
  return ['/', '/projects/', '/writing/', ...getEntries('projects').map(e => `/projects/${e.slug}/`), ...getEntries('writing').map(e => `/writing/${e.slug}/`)].map(route => ({ url: `${siteUrl}${route}` }));
}
