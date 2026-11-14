// Cloudflare Pages: set NEXT_PUBLIC_SITE_URL to the final custom-domain origin.
// Keep local builds local until a production domain is configured.
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
