import Link from 'next/link';
import { getEntries } from '@/lib/content';
import { ReadingList } from '@/components/reading-list';
import { EntryList } from '@/components/content-ui';
export default function Writing() {
  const notes = getEntries('writing');
  return <div className="page-width"><section className="page-intro"><div className="eyebrow">THE NOTEBOOK / THINKING OUT LOUD</div><h1>Writing <em>& notes.</em></h1><p className="lede">Systems, AI, electronics, and the occasional detour.<br className="desktop-break" /> A place for questions, small discoveries, and changing my mind.</p></section>{notes.length ? <section className="collection-section" aria-label="Published notes"><EntryList entries={notes} /></section> : <section className="notebook-empty" aria-labelledby="first-note"><div className="empty-mark" aria-hidden="true">✳</div><div><span className="entry-meta">BEFORE THE FIRST PAGE</span><h2 id="first-note">No published notes yet.</h2><p>Until then, here are the resources I’m reading and watching.</p></div></section>}<section className="topic-section" aria-labelledby="topics-title"><h2 id="topics-title" className="reading-section-title">Reading & watching</h2><ReadingList /></section><div className="page-crosslink"><p>Explore my projects.</p><Link href="/projects/" className="text-link">See the projects <span aria-hidden="true">↗</span></Link></div></div>;
}
