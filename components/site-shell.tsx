import Link from 'next/link';
import { Navigation } from './navigation';
import { profile } from '@/lib/profile';
export function Header() {
  return <header className="site-header"><Link className="wordmark" href="/" aria-label={`${profile.name} home`}>{profile.name.toLowerCase()}<span> /</span></Link><Navigation /><a className="edition" href={`mailto:${profile.email}`}>GET IN TOUCH ↗</a></header>;
}
export function Footer() {
  return <footer className="site-footer" id="contact"><div className="section-label">05 / SAY HELLO</div><div><h2>Get in touch.</h2>{profile.email ? <a className="contact-link" href={`mailto:${profile.email}`}>{profile.email} <span aria-hidden="true">↗</span></a> : <p className="contact-pending">A little more about me, and a way to say hello, soon.</p>}{profile.links.length > 0 && <div className="social-links">{profile.links.map(link => <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">{link.label} ↗<span className="sr-only"> (opens in a new tab)</span></a>)}</div>}</div><div className="footer-bottom"><Link className="wordmark" href="/">{profile.name.toLowerCase()}<span> /</span></Link><span>PAWAN MISHRA · SOFTWARE ENGINEER</span><a href="#main">Back to the top ↑</a></div></footer>;
}
