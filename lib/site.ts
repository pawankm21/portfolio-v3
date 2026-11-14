// Build-time origin for metadata and sitemap URLs.
const defaultOrigin = process.env.NODE_ENV === 'production'
  ? 'https://pawanmishra.link'
  : 'http://localhost:3000';
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || defaultOrigin).replace(/\/$/, '');
