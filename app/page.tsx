import Link from 'next/link';
import { Portrait } from '@/components/portrait';
import { OutsidePhotos } from '@/components/outside-photos';
import { EntryList } from '@/components/content-ui';
import { getEntries } from '@/lib/content';
import { profile } from '@/lib/profile';
import { ReadingList } from '@/components/reading-list';
export default function Home() {
  const projects = getEntries('projects');
  const featured = [...projects.filter(project => project.featured), ...getEntries('writing').filter(entry => entry.slug === 'rate-limiter')];
  return <>
    <section className="hero hero-identity page-width" aria-labelledby="intro"><div className="eyebrow"><span className="dot" /> Hi, I am</div><h1 id="intro"><span className="hero-name">Pawan Mishra<span className="period">,</span></span><em className="hero-role">Software Engineer<span className="period">.</span></em></h1><div className="hero-bottom"><p>Based in India. I care about thoughtful software design and building reliable systems. Welcome to my corner of the web.</p><a className="text-link" href="#experience">A little about my work <span aria-hidden="true">↓</span></a></div><Portrait /><details className="margin-note"><summary><span>01</span> a small footnote <span className="disclosure" aria-hidden="true" /></summary><p>Outside work, you’ll find me exploring electronics, running, dancing, and occasionally figuring out dinner.</p></details><div className="hero-footer"><span>ENGINEERING, WITH ROOM FOR THE REST.</span><a href="#experience">SCROLL TO WANDER ↓</a></div></section>
    <section className="section page-width experience-section" id="experience" aria-labelledby="experience-title">
      <div className="section-label">01 / EXPERIENCE</div>
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
    <section className="section exploring" aria-labelledby="exploring-title"><div className="section-label">02 / READING LIST</div><div className="section-content"><h2 id="exploring-title">Reading <em>& watching.</em></h2><p className="lede">Papers, articles, and videos I’m working through.</p><ReadingList /><Link href="/writing/" className="text-link">Writing & notes <span aria-hidden="true">↗</span></Link></div></section>
    <section className="section page-width" aria-labelledby="building-title"><div className="section-label">03 / PROJECTS</div><div className="section-content"><h2 id="building-title">Projects <em>& experiments.</em></h2><p className="lede narrow">Personal projects and system design.</p><EntryList entries={featured.slice(0, 2)} cards /><Link href="/projects/" className="text-link">All projects, past & present <span aria-hidden="true">↗</span></Link></div></section>
    <section className="section page-width outside" id="outside" aria-labelledby="outside-title"><div className="section-label">04 / OUTSIDE THE TERMINAL</div><div className="section-content"><h2 id="outside-title">Outside work.</h2><p className="lede narrow">Running. Dancing. Getting a little lost somewhere new. Cooking something that was supposed to be simpler.</p><OutsidePhotos /><ul className="personal-interests"><li><span>01</span> A good run.</li><li><span>02</span> A questionable dance move.</li><li><span>03</span> Somewhere I haven’t been.</li><li><span>04</span> One more experiment.</li></ul><p className="personal-note">There’s a person behind the pull requests.</p></div></section>
  </>;
}
