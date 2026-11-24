'use client';

import { useEffect, useRef, useState } from 'react';
import type { FormEvent, PointerEvent } from 'react';
import './portfolio-pet.css';

const replies: [RegExp, string][] = [
  [/\b(hello|hi|hey)\b/i, 'Hi! I’m Mochi. Ask me about Pawan’s projects or what he’s learning.'],
  [/\b(projects?|build|building)\b/i, 'Pawan builds software and electronics projects. Take a look at Pennyvoice or his ESP32 quad bot on the Projects page.'],
  [/\b(learn\w*|math\w*|writing|notes|ml|ai)\b/i, 'Try Mathematics for machine learning in Writing. Pawan works through the math using house-price prediction.'],
  [/\b(pawan|work|experience)\b/i, 'Pawan is a software engineer based in India. You can find his work history in the Experience section.'],
  [/\b(pet|rabbit|bunny|mochi)\b/i, 'I’m Mochi, a rabbit who lives in the margin. You can drag me around if I’m in the way.'],
];

export function PortfolioPet() {
  const [position, setPosition] = useState<{ x: number; y: number }>();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ question: string; reply: string }[]>([]);
  const launcher = useRef<HTMLButtonElement>(null);
  const field = useRef<HTMLInputElement>(null);
  const log = useRef<HTMLDivElement>(null);
  const drag = useRef<{ id: number; x: number; y: number; left: number; top: number } | null>(null);
  const moved = useRef(false);

  useEffect(() => {
    if (open) field.current?.focus();
  }, [open]);

  useEffect(() => {
    if (log.current) log.current.scrollTop = log.current.scrollHeight;
  }, [messages, open]);

  function startDrag(event: PointerEvent<HTMLButtonElement>) {
    if (!event.isPrimary || event.button !== 0) return;
    const { left, top } = event.currentTarget.getBoundingClientRect();
    moved.current = false;
    drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, left, top };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function movePet(event: PointerEvent<HTMLButtonElement>) {
    const start = drag.current;
    if (start?.id !== event.pointerId) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (!moved.current && Math.hypot(dx, dy) < 5) return;
    moved.current = true;
    setPosition({
      x: Math.max(8, Math.min(start.left + dx, document.documentElement.clientWidth - event.currentTarget.offsetWidth - 8)),
      y: Math.max(8, Math.min(start.top + dy, window.innerHeight - event.currentTarget.offsetHeight - 8)),
    });
  }

  function closeChat() {
    setOpen(false);
    launcher.current?.focus();
  }

  function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const question = input.trim();
    if (!question) return;
    const reply = replies.find(([pattern]) => pattern.test(question))?.[1]
      ?? 'I have a few canned replies for now. Try asking about projects, writing, or Pawan.';
    setMessages(previous => [...previous, { question, reply }]);
    setInput('');
    field.current?.focus();
  }

  return <>
    <button
      ref={launcher}
      className="pet-launcher"
      style={position && {
        left: `clamp(8px, ${position.x}px, calc(100% - 72px))`,
        top: `clamp(8px, ${position.y}px, calc(100% - 72px))`,
        right: 'auto',
        bottom: 'auto',
      }}
      type="button"
      aria-label="Chat with Mochi"
      aria-controls="mochi-chat"
      aria-expanded={open}
      onPointerDown={startDrag}
      onPointerMove={movePet}
      onLostPointerCapture={() => { drag.current = null; }}
      onClick={event => {
        if (event.detail && moved.current) return;
        if (open) closeChat();
        else setOpen(true);
      }}
    >
      <span className="pet-face" aria-hidden="true"><span>ᴗ</span></span>
    </button>
    <section id="mochi-chat" className="pet-chat" aria-labelledby="mochi-title" hidden={!open}
      onKeyDown={event => { if (event.key === 'Escape') closeChat(); }}>
      <header>
        <h2 id="mochi-title">Mochi</h2>
        <button type="button" aria-label="Close chat" onClick={closeChat}>×</button>
      </header>
      <div className="pet-log" role="log" aria-label="Conversation with Mochi" ref={log} tabIndex={0}>
        <p>Hi, I’m Mochi! Ask me about Pawan’s projects or what he’s learning.</p>
        {messages.map(({ question, reply }, index) => <div key={index}>
          <p className="pet-question"><span className="sr-only">You: </span>{question}</p>
          <p><span className="sr-only">Mochi: </span>{reply}</p>
        </div>)}
      </div>
      <form className="pet-form" onSubmit={send}>
        <input ref={field} aria-label="Message Mochi" placeholder="Ask me something…" maxLength={240}
          value={input} onChange={event => setInput(event.target.value)} />
        <button type="submit" disabled={!input.trim()}>Send</button>
      </form>
    </section>
  </>;
}
