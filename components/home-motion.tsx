'use client';
import { useEffect } from 'react';

export function HomeMotion() {
  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>('[data-motion-reveal], main > .section');
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.setAttribute('data-revealed', 'true');
          observer.unobserve(entry.target);
        }
      }
    }, { threshold: 0.15 });
    targets.forEach(target => observer.observe(target));
    return () => {
      observer.disconnect();
      targets.forEach(target => target.removeAttribute('data-revealed'));
    };
  }, []);
  return null;
}

export function RateLimiterDiagram() {
  return <svg className="request-diagram" data-motion-reveal viewBox="0 0 820 600" aria-hidden="true">
    <rect width="820" height="600" fill="#e4e9e6" />
    <g stroke="#84917a" strokeWidth="3" fill="none">
      <path d="M140 300H350M470 300H680" />
      <path d="m665 288 15 12-15 12" />
      <path d="M410 150V220" strokeDasharray="7 8" />
    </g>
    <rect x="350" y="220" width="120" height="160" rx="18" fill="#c6d7cb" stroke="#4f6c5b" strokeWidth="3" />
    <g fill="#638673"><circle cx="385" cy="330" r="12" /><circle cx="435" cy="330" r="12" /><circle cx="410" cy="285" r="12" /></g>
    <circle className="refill-token" cx="410" cy="150" r="12" fill="#638673" />
    <circle className="request-dot" cx="140" cy="300" r="10" fill="#b94b36" />
    <g fill="#242522" fontFamily="Arial, sans-serif" fontSize="25" textAnchor="middle"><text x="140" y="425">Request</text><text x="410" y="425">Token bucket</text><text x="680" y="425">Service</text></g>
  </svg>;
}
