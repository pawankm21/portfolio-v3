'use client';
import { useEffect, useRef, useState } from 'react';
import { PortraitObjects } from './portrait-objects';

// All positions use the original portrait's coordinate system. Each eye has
// its own fixed placement, so changing its size never changes the eye spacing.
const artwork = { src: '/portrait/pawan.png', width: 1199, height: 1312 };
const frames = ['right', 'downright', 'down', 'downleft', 'left', 'upperleft', 'up', 'upperright', 'straight', 'towards'] as const;
type Gaze = typeof frames[number];
const centerFrame: Gaze = 'straight';
// Final values chosen with the live calibration controls.
const eyeCalibration = { width: 206, height: 151, distance: 244 };
const eyes = [{ side: 'left', y: 464 }, { side: 'right', y: 468 }].map((eye, index) => ({
  ...eye,
  width: eyeCalibration.width,
  height: eyeCalibration.height + (index === 0 ? 1 : -1),
  x: 592 + (index === 0 ? -1 : 1) * eyeCalibration.distance / 2 - eyeCalibration.width / 2,
  y: eye.y + (135 - eyeCalibration.height) * 0.65,
}));
export function Portrait() {
  const container = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const sprites = useRef<Partial<Record<Gaze, SVGGElement | null>>>({});
  const [reducedMotion, setReducedMotion] = useState(true);
  const [assetState, setAssetState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [loadAttempt, setLoadAttempt] = useState(0);
  const assetsReady = useRef(false);

  useEffect(() => {
    let cancelled = false;
    assetsReady.current = false;
    setAssetState('loading');
    const sources = [artwork.src, ...frames.flatMap(gaze => eyes.map(eye => `/portrait/eyes/${gaze}_${eye.side}.png`))];
    let timeout: ReturnType<typeof setTimeout>;
    const decoded = Promise.all(sources.map(src => {
      const image = new Image();
      image.src = src;
      return image.decode();
    }));
    const deadline = new Promise<never>((_, reject) => {
      timeout = setTimeout(() => reject(new Error('Portrait loading timed out')), 15000);
    });
    Promise.race([decoded, deadline]).then(() => {
      if (!cancelled) { assetsReady.current = true; setAssetState('ready'); }
    }).catch(() => { if (!cancelled) setAssetState('error'); }).finally(() => clearTimeout(timeout));
    return () => { cancelled = true; clearTimeout(timeout); };
  }, [loadAttempt]);

  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    let pointer: { x: number; y: number } | null = null;
    let visible = false, frame = 0;
    let idleTimer: ReturnType<typeof setTimeout> | undefined;
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
      if (!assetsReady.current || !rect?.width || !pointer || preference.matches || !visible || document.hidden) { show(centerFrame); return; }
      const x = (pointer.x - rect.left) * artwork.width / rect.width;
      const y = (pointer.y - rect.top) * artwork.height / rect.height;
      const dx = x - 600, dy = y - 550;
      if (Math.hypot(x - 600, y - 625) < 65) { show('towards'); return; }
      if (Math.hypot(dx, dy) < 100) { show(centerFrame); return; }
      const sector = (Math.round(Math.atan2(dy, dx) / (Math.PI / 4)) + 8) % 8;
      show(frames[sector]);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const clear = () => { clearTimeout(idleTimer); idleTimer = undefined; pointer = null; cancelAnimationFrame(frame); frame = 0; show(centerFrame); };
    const onMove = (event: PointerEvent) => {
      if (!assetsReady.current || event.pointerType === 'touch' || preference.matches || !visible) return;
      clearTimeout(idleTimer);
      idleTimer = setTimeout(clear, 2000);
      pointer = { x: event.clientX, y: event.clientY }; schedule();
    };
    const onPreference = () => { setReducedMotion(preference.matches); clear(); };
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
      clearTimeout(idleTimer); cancelAnimationFrame(frame); observer.disconnect();
      window.removeEventListener('pointermove', onMove); window.removeEventListener('resize', schedule);
      window.removeEventListener('scroll', schedule); window.removeEventListener('blur', clear);
      document.documentElement.removeEventListener('pointerleave', clear);
      document.removeEventListener('visibilitychange', clear); preference.removeEventListener('change', onPreference);
    };
  }, []);

  return <div className="portrait personal-portrait" ref={container}><div className="portrait-stage" ref={stage} aria-busy={assetState === 'loading'}>
    {assetState !== 'ready' && <div className="portrait-loading" role="status" aria-live="polite"><span className="portrait-loading-mark" aria-hidden="true">p<span>/</span></span><p>{assetState === 'error' ? 'Portrait couldn’t load.' : 'Loading portrait…'}</p>{assetState === 'error' && <button type="button" onClick={() => setLoadAttempt(attempt => attempt + 1)}>Try again</button>}</div>}
    <div className="portrait-artwork" data-ready={assetState === 'ready'} aria-hidden={assetState !== 'ready'}>
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
    </div>
    <PortraitObjects motionPaused={reducedMotion || assetState !== 'ready'} />
    </div><span className="hand portrait-note">Just keeping an eye<br />on Everything.</span></div>;
}
