'use client';
import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';

type ObjectName = 'book' | 'laptop' | 'camera' | 'shoes';
const objects: { id: ObjectName; label: string; title: string; text: string; href: string; link: string }[] = [
  { id: 'book', label: 'Reading & curiosity', title: 'One more rabbit hole.', text: 'Systems, AI, electronics. There’s usually another question worth following.', href: '/writing/', link: 'Open the notebook' },
  { id: 'laptop', label: 'Software & building', title: 'Ideas into software.', text: 'Thoughtful design, useful experiments, and the satisfaction of making something work.', href: '/projects/', link: 'See what I’m building' },
  { id: 'camera', label: 'Travel & exploring', title: 'A change of scenery.', text: 'I like travelling, exploring new places, and seeing where a detour leads.', href: '#outside', link: 'Outside the terminal' },
  { id: 'shoes', label: 'Running & movement', title: 'A little time on my feet.', text: 'Running and working out help me step away from the screen and reset.', href: '#outside', link: 'Meet the other side' },
];
function Illustration({ name }: { name: ObjectName }) {
  return <svg viewBox="0 0 64 64" fill="none" stroke="#34372f" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {name === 'book' && <><path d="M10 13c8-3 15-1 22 3 7-4 14-6 22-3v37c-8-3-15-1-22 3-7-4-14-6-22-3Z" fill="#84917a"/><path d="M14 9c7-2 13 1 18 5 5-4 11-7 18-5v35c-7-1-13 1-18 5-5-4-11-6-18-5Z" fill="#f4f0e6"/><path d="M32 14v35M19 19l8 3m-8 5 8 3m-8 5 8 3m10-16 8-3m-8 11 8-3m-8 11 8-3"/><path d="M40 10v14l3-3 3 1V9" fill="#d78262" strokeWidth="1.2"/></>}
    {name === 'laptop' && <><rect x="10" y="12" width="44" height="32" rx="3" fill="#34372f"/><rect x="14" y="16" width="36" height="24" rx="1" fill="#dce1d2"/><path d="m25 23-5 5 5 5m14-10 5 5-5 5m-8 1 3-12" stroke="#65745d"/><path d="M10 44h44l6 8c0 2-3 3-5 3H9c-2 0-5-1-5-3Z" fill="#f4f0e6"/><path d="M25 44h14l2 4H23Z" fill="#d3d0c5"/></>}
    {name === 'camera' && <><path d="m19 18 4-7h17l4 7" fill="#f4f0e6"/><rect x="7" y="18" width="50" height="34" rx="6" fill="#cf815f"/><path d="M7 27h50"/><circle cx="32" cy="35" r="13" fill="#f4f0e6"/><circle cx="32" cy="35" r="9" fill="#84917a"/><path d="M29 30a6 6 0 0 1 8 5" stroke="#f4f0e6"/><rect x="45" y="22" width="6" height="3" rx="1" fill="#f4f0e6"/><path d="M12 16h7" strokeWidth="3"/></>}
    {name === 'shoes' && <><g transform="rotate(-18 28 24)"><path d="M9 14h12l5 13 15 5c7 2 9 6 9 10H9Z" fill="#84917a"/><path d="M9 37c14 3 27 3 41 1v7H9Z" fill="#f4f0e6"/><path d="m22 23 7-2m-4 7 8-2m-4 7 8-3M12 18v9"/></g><g transform="translate(6 13) rotate(8 28 24)"><path d="M9 14h12l5 13 15 5c7 2 9 6 9 10H9Z" fill="#f4f0e6"/><path d="M9 37c14 3 27 3 41 1v7H9Z" fill="#d3d0c5"/><path d="m22 23 7-2m-4 7 8-2m-4 7 8-3M12 18v9" stroke="#b94b36"/></g></>}
  </svg>;
}
export function PortraitObjects({ motionPaused }: { motionPaused: boolean }) {
  const [active, setActive] = useState<ObjectName | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const triggers = useRef<Partial<Record<ObjectName, HTMLButtonElement | null>>>({});
  const panelId = useId();
  const selected = objects.find(item => item.id === active);
  useEffect(() => {
    if (!active) return;
    const dismiss = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setActive(null); };
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') { setActive(null); triggers.current[active]?.focus(); } };
    document.addEventListener('pointerdown', dismiss);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('pointerdown', dismiss); document.removeEventListener('keydown', onKey); };
  }, [active]);
  return <div className="portrait-objects" data-motion-paused={motionPaused} ref={root}>
    {objects.map(item => <button key={item.id} ref={node => { triggers.current[item.id] = node; }} type="button" className={`floating-object object-${item.id}`} aria-label={item.label} aria-expanded={active === item.id} aria-controls={active === item.id ? panelId : undefined} onClick={() => setActive(active === item.id ? null : item.id)}><Illustration name={item.id} /><span className="object-label">{item.label}</span></button>)}
    {selected && <section id={panelId} className="object-note" aria-labelledby={`${panelId}-title`}>
      <button className="object-close" type="button" aria-label="Close note" onClick={() => { setActive(null); triggers.current[selected.id]?.focus(); }}>×</button>
      <span className="entry-meta">A NOTE FROM THE MARGINS</span><h3 id={`${panelId}-title`}>{selected.title}</h3><p>{selected.text}</p><Link className="text-link" href={selected.href} onClick={() => setActive(null)}>{selected.link}<span aria-hidden="true">↗</span></Link>
    </section>}
  </div>;
}
