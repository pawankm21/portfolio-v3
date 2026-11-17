import Link from 'next/link';
import { Portrait } from '@/components/portrait';
import { OutsidePhotos } from '@/components/outside-photos';
import { EntryList } from '@/components/content-ui';
import { getEntries } from '@/lib/content';
import { profile } from '@/lib/profile';
export default function Home() {
  const projects = getEntries('projects');
  const featured = projects.filter(project => ['pennyvoice', 'esp32-quad-bot'].includes(project.slug));
  const notes = getEntries('writing');
  const diagrams: Record<string, { src: string; title: string }> = {
    'how-nand-flash-works': { src: '/writing/how-nand-flash-works/lifecycle.svg', title: 'How NAND flash works' },
    'google-docs-system-design': { src: '/writing/google-docs-system-design/architecture.svg', title: 'Concurrent edits & offline sync' },
    'rate-limiter': { src: '/projects/rate-limiter.svg', title: 'Rate limiters & shared state' },
  };
  return <>
    <section className="hero hero-identity page-width" aria-labelledby="intro">
      <div className="eyebrow"><span className="dot" /> Based in India</div>
      <h1 id="intro"><span className="hero-name">Pawan Mishra<span className="period">,</span></span><em className="hero-role">Software Engineer<span className="period">.</span></em></h1>
      <div className="hero-bottom"><p>I build software and study how systems work.</p><a className="text-link" href="#building">Explore the work <span aria-hidden="true">↓</span></a></div>
      <Portrait />
      <div className="hero-footer"><span>SOFTWARE · SYSTEMS · ELECTRONICS</span><a href="#experience">EXPERIENCE ↓</a></div>
    </section>
    <section className="section page-width selected-work" id="building" aria-labelledby="building-title"><div className="section-label">01 / BUILDING</div><div className="section-content"><div className="section-heading"><h2 id="building-title">Selected projects.</h2><Link href="/projects/" className="text-link">All projects <span aria-hidden="true">↗</span></Link></div><EntryList entries={featured} cards /></div></section>
    <section className="section page-width experience-section" id="experience" aria-labelledby="experience-title">
      <div className="section-label">02 / EXPERIENCE</div>
      <div className="section-content">
        <h2 id="experience-title">Experience.</h2>
        <ol className="career-timeline" aria-label="Career timeline, most recent first">
          {profile.experience.map(company => <li className="career-stop" key={company.company}>
            <span className="career-period">{company.period}</span>
            <div className="career-position">
              <div className="career-company"><span className="company-logo-slot"><img className={`company-logo ${company.logoClass}`} src={company.logo} width={company.logoWidth} height="32" alt="" /></span><h3>{company.company}</h3></div>
              <ol className="career-roles" aria-label={`Positions at ${company.company}`}>
                {company.roles.map(role => <li key={role.title}><p>{role.title}</p>{company.roles.length > 1 && <span className="role-period">{role.period}</span>}</li>)}
              </ol>
            </div>
          </li>)}
        </ol>
      </div>
    </section>
    <section className="section page-width engineering-notes" aria-labelledby="notes-title"><div className="section-label">03 / EXPLORING</div><div className="section-content"><div className="section-heading"><h2 id="notes-title">Engineering notes.</h2><Link href="/writing/" className="text-link">All notes <span aria-hidden="true">↗</span></Link></div><div className="notes-grid">{notes.map(note => {
      const diagram = diagrams[note.slug];
      return <Link className="note-card" href={`/writing/${note.slug}/`} key={note.slug}>{diagram && <div className="note-card-image"><img src={diagram.src} alt="" width="820" height="600" loading="lazy" /></div>}<span className="entry-meta">{note.topic}</span><h3>{diagram?.title ?? note.title}<span aria-hidden="true">↗</span></h3></Link>;
    })}</div></div></section>
    <section className="section page-width outside" id="outside" aria-labelledby="outside-title"><div className="section-label">04 / FIELD NOTES</div><div className="section-content"><h2 id="outside-title">A few frames.</h2><OutsidePhotos /></div></section>
  </>;
}
