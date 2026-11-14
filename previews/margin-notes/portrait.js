/* Eye tracking adapted from the supplied prototype's layered portrait approach.
   Swap assets/portrait-base.svg for an eye-free portrait. For a new composition,
   update the SVG viewBox/eye clips in index.html and the eye centers below. */
(() => {
  const portrait = document.querySelector('[data-portrait]');
  const overlay = portrait.querySelector('.portrait-eyes');
  const pupils = [...portrait.querySelectorAll('[data-pupil]')].map(node => ({
    node, center: node.dataset.pupil.split(',').map(Number), x: 0, y: 0, tx: 0, ty: 0,
  }));
  const button = portrait.querySelector('.gaze-toggle');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reduced.matches;
  let visible = true;
  let frame = 0;
  let pointer = null;
  let lastTime = 0;

  function animate(time) {
    frame = 0;
    const ease = 1 - Math.exp(-Math.min(time - lastTime || 16, 64) / 65);
    lastTime = time;
    let moving = false;
    pupils.forEach(eye => {
      eye.x += (eye.tx - eye.x) * ease;
      eye.y += (eye.ty - eye.y) * ease;
      if (Math.abs(eye.tx - eye.x) + Math.abs(eye.ty - eye.y) < 0.01) {
        eye.x = eye.tx; eye.y = eye.ty;
      } else moving = true;
      eye.node.setAttribute('transform', `translate(${eye.x.toFixed(3)} ${eye.y.toFixed(3)})`);
    });
    if (moving) frame = requestAnimationFrame(animate);
  }
  function update() {
    // Map each eye independently from SVG coordinates into viewport coordinates.
    const rect = overlay.getBoundingClientRect();
    pupils.forEach(eye => {
      if (!pointer || paused || !visible || document.hidden || !rect.width) {
        eye.tx = eye.ty = 0;
      } else {
        const dx = (pointer.x - rect.left) * 320 / rect.width - eye.center[0];
        const dy = (pointer.y - rect.top) * 340 / rect.height - eye.center[1];
        const distance = Math.hypot(dx, dy);
        const strength = Math.min(distance / 110, 1);
        eye.tx = distance ? dx / distance * 7 * strength : 0;
        eye.ty = distance ? dy / distance * 3.5 * strength : 0;
      }
      if (reduced.matches || !visible || document.hidden) {
        eye.x = eye.tx; eye.y = eye.ty;
        eye.node.setAttribute('transform', `translate(${eye.x} ${eye.y})`);
      }
    });
    if (reduced.matches || !visible || document.hidden) {
      cancelAnimationFrame(frame); frame = 0;
    } else if (!frame) { lastTime = 0; frame = requestAnimationFrame(animate); }
  }
  function syncButton() {
    button.textContent = paused ? 'Enable eye tracking' : 'Pause eye tracking';
    button.setAttribute('aria-pressed', String(paused));
  }
  window.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch' || paused || !visible) return;
    pointer = { x: event.clientX, y: event.clientY }; update();
  }, { passive: true });
  function reset() { pointer = null; update(); }
  document.documentElement.addEventListener('pointerleave', reset);
  window.addEventListener('blur', reset);
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  document.addEventListener('visibilitychange', reset);
  button.addEventListener('click', () => { paused = !paused; pointer = null; syncButton(); update(); });
  reduced.addEventListener('change', () => { paused = reduced.matches; syncButton(); reset(); });
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); }).observe(portrait);
  syncButton();
})();
