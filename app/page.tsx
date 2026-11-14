import Link from 'next/link';
import { Portrait } from '@/components/portrait';
import { EntryList } from '@/components/content-ui';
import { getEntries } from '@/lib/content';
import { profile, topics } from '@/lib/profile';
export default function Home() {
  const projects = getEntries('projects');
  const notes = getEntries('writing');
  return <>
    <section className="hero hero-identity page-width" aria-labelledby="intro"><div className="eyebrow"><span className="dot" /> Hi, I am</div><h1 id="intro"><span className="hero-name">Pawan Mishra<span className="period">,</span></span><em className="hero-role">Software Engineer<span className="period">.</span></em></h1><div className="hero-bottom"><p>Based in India. I care about thoughtful software design and building reliable systems. Welcome to my corner of the web.</p><a className="text-link" href="#experience">A little about my work <span aria-hidden="true">↓</span></a></div><Portrait /><details className="margin-note"><summary><span>01</span> a small footnote <span className="disclosure" aria-hidden="true" /></summary><p>Outside work, you’ll find me exploring electronics, running, dancing, and occasionally figuring out dinner.</p></details><div className="hero-footer"><span>ENGINEERING, WITH ROOM FOR THE REST.</span><a href="#experience">SCROLL TO WANDER ↓</a></div></section>
    <section className="section page-width experience-section" id="experience" aria-labelledby="experience-title">
      <div className="section-label">01 / EXPERIENCE</div>
      <div className="section-content">
        <h2 id="experience-title">A few stops<br /><em>along the way.</em></h2>
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
    <section className="section exploring" aria-labelledby="exploring-title"><div className="section-label">02 / OPEN QUESTIONS</div><div className="section-content"><div className="section-heading"><h2 id="exploring-title">Currently<br /><em>following a thread.</em></h2><span className="hand">Curiosity, before certainty.</span></div><p className="lede">A few things taking up space in my head.</p>{notes.length ? <EntryList entries={notes.slice(0, 2)} /> : topics.slice(0, 2).map((topic, i) => <div className="question" key={topic.name}><span>{String(i + 1).padStart(2, '0')}</span><div><h3>{topic.question}</h3><p>{topic.name} <span>·</span> EXPLORING</p></div>{i === 0 && <span className="asterisk" aria-hidden="true">✳</span>}</div>)}<Link href="/writing/" className="text-link">Inside the notebook <span aria-hidden="true">↗</span></Link></div></section>
    <section className="section page-width" aria-labelledby="building-title"><div className="section-label">03 / BUILDING NEXT</div><div className="section-content"><h2 id="building-title">A little room for<br /><em>the next thing.</em></h2><p className="lede narrow">Small experiments count. So do unfinished ideas with a good question behind them.</p><EntryList entries={projects.filter(p => p.featured).slice(0, 2)} /><Link href="/projects/" className="text-link">All projects, past & present <span aria-hidden="true">↗</span></Link></div></section>
    <section className="section page-width outside" aria-labelledby="outside-title"><div className="section-label">04 / OUTSIDE THE TERMINAL</div><div className="section-content"><h2 id="outside-title">Occasionally,<br /><em>I go outside.</em></h2><p className="lede narrow">Running. Dancing. Getting a little lost somewhere new. Cooking something that was supposed to be simpler.</p><ul className="personal-interests"><li><span>01</span> A good run.</li><li><span>02</span> A questionable dance move.</li><li><span>03</span> Somewhere I haven’t been.</li><li><span>04</span> One more experiment.</li></ul><p className="personal-note">There’s a person behind the pull requests.</p></div></section>
  </>;
}
