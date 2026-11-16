import Link from 'next/link';
import type { Entry } from '@/lib/content';
import { statusLabel } from '@/lib/content';
export function EntryList({ entries, cards = entries.length > 0 && entries.every(entry => entry.collection === 'projects') }: { entries: Entry[]; cards?: boolean }) {
  if (cards) {
    return <div className="project-grid">{entries.map(entry => <Link className="project-card" href={`/${entry.collection}/${entry.slug}/`} key={entry.slug}>
      {entry.image && <div className="project-card-image"><img src={entry.image} alt={entry.imageAlt} width="960" height="600" loading="lazy" /></div>}
      <div className="project-card-copy"><div className="entry-meta">{entry.topic}<span> / </span>{statusLabel(entry.status)}</div><h3>{entry.title}<span aria-hidden="true">↗</span></h3><p>{entry.summary}</p></div>
    </Link>)}</div>;
  }
  return <div className="entry-list">{entries.map((entry, i) => <Link className="entry-row group" href={`/${entry.collection}/${entry.slug}/`} key={entry.slug}><span className="entry-number">{String(i + 1).padStart(2, '0')}</span><div><div className="entry-meta">{entry.topic}<span> / </span>{statusLabel(entry.status)}</div><h3>{entry.title}</h3><p>{entry.summary}</p></div><span className="entry-arrow" aria-hidden="true">↗</span></Link>)}</div>;
}
export function Architecture() {
  return <figure className="architecture"><div>MDX content<span aria-hidden="true">↓</span></div><div>Next.js + TypeScript<span aria-hidden="true">↓</span></div><div>Static pages + portrait interaction</div><figcaption>A small content pipeline, with interactive behavior kept at the edges.</figcaption></figure>;
}
