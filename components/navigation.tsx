'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
export function Navigation() {
  const path = usePathname();
  return <nav aria-label="Primary">{[{ href: '/', label: 'Home' }, { href: '/projects/', label: 'Projects' }, { href: '/writing/', label: 'Writing' }].map(({ href, label }) => {
    const active = href === '/' ? path === '/' : path.startsWith(href.slice(0, -1));
    return <Link key={href} href={href} aria-current={active ? 'page' : undefined} className={active ? 'active' : undefined}>{label}{href !== '/' && <span aria-hidden="true"> ↗</span>}</Link>;
  })}</nav>;
}
