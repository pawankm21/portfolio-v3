'use client';
import { useEffect, useRef, useState } from 'react';
import StickerPeel from './react-bits/sticker-peel';

type Eye = { side: string; x: number; y: number; width: number; height: number };
export function PortraitPeel({ artwork, eyes, gaze, frames }: { artwork: { src: string; width: number; height: number }; eyes: Eye[]; gaze: string; frames: readonly string[] }) {
  const root = useRef<HTMLDivElement>(null);
  const [textures, setTextures] = useState<Record<string, HTMLCanvasElement>>({});
  const [width, setWidth] = useState(0);
  const [peel, setPeel] = useState(0);
  useEffect(() => {
    let cancelled = false;
    const sources = [artwork.src, ...frames.flatMap(frame => eyes.map(eye => `/portrait/eyes/${frame}_${eye.side}.png`))];
    const images = sources.map(src => { const img = new Image(); img.src = src; return img; });
    // Use the same composed artwork before and during the curl, including the current gaze.
    Promise.all(images.map(img => img.decode())).then(() => {
      if (cancelled) return;
      const composed: Record<string, HTMLCanvasElement> = {};
      frames.forEach((frame, frameIndex) => {
        const canvas = document.createElement('canvas');
        canvas.width = Math.min(640, artwork.width);
        canvas.height = Math.round(canvas.width * artwork.height / artwork.width);
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.scale(canvas.width / artwork.width, canvas.height / artwork.height);
        ctx.drawImage(images[0], 0, 0);
        eyes.forEach((eye, i) => {
          const layer = document.createElement('canvas');
          layer.width = Math.ceil(eye.width); layer.height = Math.ceil(eye.height);
          const mask = layer.getContext('2d');
          if (!mask) return;
          mask.drawImage(images[1 + frameIndex * eyes.length + i], 0, 0, layer.width, layer.height);
          mask.globalCompositeOperation = 'destination-in';
          mask.scale(layer.width, layer.height);
          const gradient = mask.createRadialGradient(.5, .5, 0, .5, .5, .5);
          gradient.addColorStop(.65, '#fff'); gradient.addColorStop(1, '#fff0');
          mask.fillStyle = gradient; mask.fillRect(0, 0, 1, 1);
          ctx.drawImage(layer, eye.x, eye.y, eye.width, eye.height);
        });
        composed[frame] = canvas;
      });
      setTextures(composed);
    }).catch(() => { /* The original portrait remains visible if the texture cannot load. */ });
    return () => { cancelled = true; };
  }, [artwork, eyes, frames]);
  useEffect(() => {
    const element = root.current;
    const hero = element?.closest('.hero');
    if (!element || !hero) return;
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = hero.getBoundingClientRect();
      setWidth(element.clientWidth);
      setPeel(preference.matches ? 0 : Math.min(1, Math.max(0, -rect.top / (rect.height * .65))));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const resize = new ResizeObserver(schedule);
    resize.observe(element);
    window.addEventListener('scroll', schedule, { passive: true });
    preference.addEventListener('change', schedule);
    update();
    return () => { cancelAnimationFrame(frame); resize.disconnect(); window.removeEventListener('scroll', schedule); preference.removeEventListener('change', schedule); };
  }, []);
  return <div className="portrait-peel" ref={root} data-active={peel > .002} style={{ opacity: 1 - Math.max(0, (peel - .65) / .35) }} aria-hidden="true">
    {textures[gaze] && width > 0 && <StickerPeel imageSrc={artwork.src} textureSource={textures[gaze]} width={width} scrollPeel={peel} peelBackHoverPct={0} peelBackActivePct={100} peelDirection={225} draggable={false} followPointer={false} intro={false} finish="matte" backColor="#e7dfcd" />}
  </div>;
}
