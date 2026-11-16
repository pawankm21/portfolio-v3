import type { Metadata } from 'next';
import Link from 'next/link';
import { getEntries } from '@/lib/content';
import { EntryList } from '@/components/content-ui';
export const metadata: Metadata = { title: 'Projects', description: 'Personal projects, earlier work, and ongoing experiments by Pawan Mishra.' };
export default function Projects() {
  const entries = getEntries('projects');
  return <div className="page-width"><section className="page-intro"><h1>Projects</h1><p className="lede">Personal projects and earlier work.</p></section><section className="collection-section" aria-label="Projects"><EntryList entries={entries.filter(p => !p.topic.startsWith('Professional'))} /></section><div className="page-crosslink"><p>Reading & notes.</p><Link href="/writing/" className="text-link">Visit the notebook <span aria-hidden="true">↗</span></Link></div></div>;
}
