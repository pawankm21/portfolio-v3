'use client';
import { useEffect, useRef, useState } from 'react';

// All positions use the original portrait's coordinate system. Each eye has
// its own fixed placement, so changing its size never changes the eye spacing.
const artwork = { src: '/portrait/pawan.png', width: 1199, height: 1312 };
const frames = ['right', 'downright', 'down', 'downleft', 'left', 'upperleft', 'up', 'upperright', 'straight', 'towards'] as const;
type Gaze = typeof frames[number];
const centerFrame: Gaze = 'straight';
const eyes = [
  { side: 'left', x: 366, y: 464, width: 208, height: 136 },
  { side: 'right', x: 610, y: 468, width: 208, height: 134},
] as const;
export function Portrait() {
  const container = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const sprites = useRef<Partial<Record<Gaze, SVGGElement | null>>>({});
  const [paused, setPaused] = useState(true);
  const pausedRef = useRef(true);
  const reset = useRef<() => void>(() => {});

  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    let pointer: { x: number; y: number } | null = null;
    let visible = false, frame = 0;
    let active: Gaze = centerFrame;
    const show = (next: Gaze) => {
      if (next === active) return;
      sprites.current[active]?.setAttribute('opacity', '0');
      sprites.current[next]?.setAttribute('opacity', '1');
      active = next;
    };
    const update = () => {
      frame = 0;
      const rect = stage.current?.getBoundingClientRect();
      if (!rect?.width || !pointer || pausedRef.current || !visible || document.hidden) { show(centerFrame); return; }
      const x = (pointer.x - rect.left) * artwork.width / rect.width;
      const y = (pointer.y - rect.top) * artwork.height / rect.height;
      const dx = x - 600, dy = y - 550;
      if (Math.hypot(x - 600, y - 625) < 65) { show('towards'); return; }
      if (Math.hypot(dx, dy) < 100) { show(centerFrame); return; }
      const sector = (Math.round(Math.atan2(dy, dx) / (Math.PI / 4)) + 8) % 8;
      show(frames[sector]);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const clear = () => { pointer = null; cancelAnimationFrame(frame); frame = 0; show(centerFrame); };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch' || pausedRef.current || !visible) return;
      pointer = { x: event.clientX, y: event.clientY }; schedule();
    };
    const onPreference = () => { pausedRef.current = preference.matches; setPaused(preference.matches); clear(); };
    reset.current = clear;
    onPreference();
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (!visible) clear(); else schedule(); });
    if (container.current) observer.observe(container.current);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('blur', clear);
    document.documentElement.addEventListener('pointerleave', clear);
    document.addEventListener('visibilitychange', clear);
    preference.addEventListener('change', onPreference);
    return () => {
      cancelAnimationFrame(frame); observer.disconnect();
      window.removeEventListener('pointermove', onMove); window.removeEventListener('resize', schedule);
      window.removeEventListener('scroll', schedule); window.removeEventListener('blur', clear);
      document.documentElement.removeEventListener('pointerleave', clear);
      document.removeEventListener('visibilitychange', clear); preference.removeEventListener('change', onPreference);
      reset.current = () => {};
    };
  }, []);

  return <div className="portrait personal-portrait" ref={container}><div className="portrait-stage" ref={stage}>
    <img className="portrait-base" src={artwork.src} width={artwork.width} height={artwork.height} alt="Illustrated portrait of Pawan Mishra, with eyes that follow the cursor." fetchPriority="high" />
    <svg className="portrait-eyes" viewBox={`0 0 ${artwork.width} ${artwork.height}`} aria-hidden="true">
      <defs>
        <radialGradient id="eye-blend"><stop offset="65%" stopColor="white" /><stop offset="100%" stopColor="black" /></radialGradient>
        <mask id="portrait-eye-blend" maskContentUnits="objectBoundingBox"><rect width="1" height="1" fill="url(#eye-blend)" /></mask>
      </defs>
      {frames.map(gaze => <g key={gaze} ref={node => { sprites.current[gaze] = node; }} data-gaze-frame={gaze} opacity={gaze === centerFrame ? 1 : 0}>
        {eyes.map(eye => <image key={eye.side} data-eye={eye.side} href={`/portrait/eyes/${gaze}_${eye.side}.png`} x={eye.x} y={eye.y} width={eye.width} height={eye.height} preserveAspectRatio="none" mask="url(#portrait-eye-blend)" />)}
      </g>)}
    </svg>
    </div><span className="hand portrait-note">Just keeping an eye<br />on latest tech.</span><button className="gaze-toggle" type="button" aria-pressed={paused} onClick={() => { pausedRef.current = !pausedRef.current; setPaused(pausedRef.current); reset.current(); }}>{paused ? 'Enable eye tracking' : 'Pause eye tracking'}</button></div>;
}
