import Link from 'next/link';
import type { Entry } from '@/lib/content';
import { statusLabel } from '@/lib/content';
export function EntryList({ entries }: { entries: Entry[] }) {
  return <div className="entry-list">{entries.map((entry, i) => <Link className="entry-row group" href={`/${entry.collection}/${entry.slug}/`} key={entry.slug}><span className="entry-number">{String(i + 1).padStart(2, '0')}</span><div><div className="entry-meta">{entry.topic}<span> / </span>{statusLabel(entry.status)}</div><h3>{entry.title}</h3><p>{entry.summary}</p></div><span className="entry-arrow" aria-hidden="true">↗</span></Link>)}</div>;
}
export function Architecture() {
  return <figure className="architecture"><div>MDX content<span aria-hidden="true">↓</span></div><div>Next.js + TypeScript<span aria-hidden="true">↓</span></div><div>Static pages + portrait interaction</div><figcaption>A small content pipeline, with interactive behavior kept at the edges.</figcaption></figure>;
}
