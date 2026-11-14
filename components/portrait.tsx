'use client';
import { useEffect, useRef, useState } from 'react';

// The face and eye overlay share this canvas. Replace the base image and adjust
// these landmarks to match your portrait. No artwork is embedded in the tracker.
const artwork = { src: '/portrait/face.svg', width: 320, height: 340, eyes: [{ x: 127, y: 158 }, { x: 193, y: 158 }] };
export function Portrait() {
  const container = useRef<HTMLDivElement>(null);
  const overlay = useRef<SVGSVGElement>(null);
  const pupils = useRef<(SVGGElement | null)[]>([]);
  const [paused, setPaused] = useState(true);
  const pausedRef = useRef(true);
  const reset = useRef<() => void>(() => {});

  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const points = artwork.eyes.map(() => ({ x: 0, y: 0, tx: 0, ty: 0 }));
    let pointer: { x: number; y: number } | null = null;
    let visible = false, frame = 0, previous = 0;
    const apply = (i: number) => pupils.current[i]?.setAttribute('transform', `translate(${points[i].x.toFixed(3)} ${points[i].y.toFixed(3)})`);
    const tick = (time: number) => {
      frame = 0;
      const ease = 1 - Math.exp(-Math.min(time - previous || 16, 64) / 65);
      previous = time;
      let moving = false;
      points.forEach((p, i) => {
        p.x += (p.tx - p.x) * ease; p.y += (p.ty - p.y) * ease;
        if (Math.abs(p.tx - p.x) + Math.abs(p.ty - p.y) < 0.01) { p.x = p.tx; p.y = p.ty; } else moving = true;
        apply(i);
      });
      if (moving) frame = requestAnimationFrame(tick);
    };
    const update = () => {
      const rect = overlay.current?.getBoundingClientRect();
      points.forEach((p, i) => {
        if (!rect?.width || !pointer || pausedRef.current || !visible || document.hidden) { p.tx = p.ty = 0; }
        else {
          const dx = (pointer.x - rect.left) * artwork.width / rect.width - artwork.eyes[i].x;
          const dy = (pointer.y - rect.top) * artwork.height / rect.height - artwork.eyes[i].y;
          const distance = Math.hypot(dx, dy), strength = Math.min(distance / 110, 1);
          p.tx = distance ? dx / distance * 7 * strength : 0;
          p.ty = distance ? dy / distance * 3.5 * strength : 0;
        }
        if (preference.matches || !visible || document.hidden) { p.x = p.tx; p.y = p.ty; apply(i); }
      });
      if (preference.matches || !visible || document.hidden) { cancelAnimationFrame(frame); frame = 0; }
      else if (!frame) { previous = 0; frame = requestAnimationFrame(tick); }
    };
    const clear = () => { pointer = null; update(); };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch' || pausedRef.current || !visible) return;
      pointer = { x: event.clientX, y: event.clientY }; update();
    };
    const onPreference = () => { pausedRef.current = preference.matches; setPaused(preference.matches); clear(); };
    reset.current = clear;
    onPreference();
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); });
    if (container.current) observer.observe(container.current);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('blur', clear);
    document.documentElement.addEventListener('pointerleave', clear);
    document.addEventListener('visibilitychange', clear);
    preference.addEventListener('change', onPreference);
    return () => {
      cancelAnimationFrame(frame); observer.disconnect();
      window.removeEventListener('pointermove', onMove); window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update); window.removeEventListener('blur', clear);
      document.documentElement.removeEventListener('pointerleave', clear);
      document.removeEventListener('visibilitychange', clear); preference.removeEventListener('change', onPreference);
      reset.current = () => {};
    };
  }, []);

  return <div className="portrait" ref={container}><div className="portrait-stage">
    {/* SVG is already lightweight and has an intrinsic size; it needs no image optimizer. */}
    <img className="portrait-base" src={artwork.src} width={artwork.width} height={artwork.height} alt="A stand-in illustrated portrait; its eyes follow the cursor." fetchPriority="high" />
    <svg ref={overlay} className="portrait-eyes" viewBox={`0 0 ${artwork.width} ${artwork.height}`} aria-hidden="true"><defs>{artwork.eyes.map((eye, i) => <clipPath id={`portrait-eye-${i}`} key={i}><ellipse cx={eye.x} cy={eye.y} rx="15" ry="8" /></clipPath>)}</defs>{artwork.eyes.map((eye, i) => <g key={i}><ellipse className="eye-white" cx={eye.x} cy={eye.y} rx="15" ry="8" /><g clipPath={`url(#portrait-eye-${i})`}><g ref={node => { pupils.current[i] = node; }}><circle className="iris" cx={eye.x} cy={eye.y} r="7" /><circle className="pupil" cx={eye.x} cy={eye.y} r="3.5" /><circle className="glint" cx={eye.x + 2} cy={eye.y - 2} r="1.6" /></g></g><ellipse className="eye-outline" cx={eye.x} cy={eye.y} rx="15" ry="8" /></g>)}</svg>
    </div><span className="hand portrait-note">Just keeping an eye<br />on latest tech.</span><span className="portrait-caption">A STAND-IN FOR THE REAL ME</span><button className="gaze-toggle" type="button" aria-pressed={paused} onClick={() => { pausedRef.current = !pausedRef.current; setPaused(pausedRef.current); reset.current(); }}>{paused ? 'Enable eye tracking' : 'Pause eye tracking'}</button></div>;
}
