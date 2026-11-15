import { readingList } from '@/lib/reading';
export function ReadingList() {
  return <ol className="reading-list">{readingList.map((item, index) => <li key={item.href}><a className="reading-resource" href={item.href} target="_blank" rel="noopener noreferrer"><span className="reading-number">{String(index + 1).padStart(2, '0')}</span><div><div className="entry-meta">{item.topic}<span> / </span>{item.format}</div><h3>{item.title}</h3><p>{item.source}</p></div><span className="reading-arrow" aria-hidden="true">↗</span><span className="sr-only">Opens in a new tab</span></a></li>)}</ol>;
}
