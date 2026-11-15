import Link from 'next/link';
import remarkGfm from 'remark-gfm';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getRelated, statusLabel, type Entry } from '@/lib/content';
import { Architecture, EntryList } from './content-ui';
export function Article({ entry }: { entry: Entry }) {
  const related = getRelated(entry);
  const isProject = entry.collection === 'projects';
  return <article className="article page-width"><Link className="back-link" href={`/${entry.collection}/`}>← All {isProject ? 'projects' : 'writing'}</Link><header className="article-header"><div className="eyebrow">{entry.topic} / {statusLabel(entry.status)}</div><h1>{entry.title}</h1><p className="lede">{entry.summary}</p></header><div className="article-body"><MDXRemote source={entry.body} components={{ Architecture }} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} /></div>{related.length > 0 && <section className="related"><h2>{isProject ? 'From the notebook.' : 'Related work.'}</h2><EntryList entries={related} /></section>}<div className="article-end"><span className="hand">More questions. Always.</span><Link href={isProject ? '/writing/' : '/projects/'} className="text-link">{isProject ? 'Explore the notebook' : 'Explore the projects'} <span aria-hidden="true">↗</span></Link></div></article>;
}
