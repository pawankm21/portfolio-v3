import type { Metadata } from 'next';
import Link from 'next/link';
import { getEntries } from '@/lib/content';
import { EntryList } from '@/components/content-ui';
export const metadata: Metadata = { title: 'Projects', description: 'Personal projects, earlier work, and ongoing experiments by Pawan Mishra.' };
export default function Projects() {
  const entries = getEntries('projects');
  return <div className="page-width"><section className="page-intro"><div className="eyebrow">THE WORK / AN EVOLVING COLLECTION</div><h1>Things I’ve built.<br /><em>Things I’m figuring out.</em></h1><p className="lede">From the systems behind the scenes to the experiments<br className="desktop-break" /> on my desk. A few decisions, details, and lessons along the way.</p><span className="hand page-annotation">Always a work in progress.</span></section><section className="collection-section" aria-labelledby="personal"><div className="collection-heading"><h2 id="personal">On my own time.</h2><span className="entry-meta">PERSONAL & EARLIER WORK</span></div><EntryList entries={entries.filter(p => !p.topic.startsWith('Professional'))} /></section><div className="page-crosslink"><p>Some ideas become projects.<br /><em>Others start as a question.</em></p><Link href="/writing/" className="text-link">Visit the notebook <span aria-hidden="true">↗</span></Link></div></div>;
}
