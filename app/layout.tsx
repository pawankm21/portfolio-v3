import type { Metadata } from 'next';
import '@fontsource-variable/newsreader';
import '@fontsource-variable/newsreader/wght-italic.css';
import '@fontsource-variable/inter';
import '@fontsource/caveat/400.css';
import './globals.css';
import { PortfolioPet } from '@/components/portfolio-pet';
import { Header, Footer } from '@/components/site-shell';
import { profile } from '@/lib/profile';
import { siteUrl } from '@/lib/site';
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'Pawan Mishra — The Margin Notes', template: '%s — Pawan Mishra' },
  description: profile.description,
  openGraph: { title: 'Pawan Mishra — The Margin Notes', description: profile.description, type: 'website' },
};
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><a className="skip-link" href="#main">Skip to content</a><Header /><main id="main" tabIndex={-1}>{children}</main><Footer /><PortfolioPet /></body></html>;
}
