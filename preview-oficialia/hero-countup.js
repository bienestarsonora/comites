(() => {
  'use strict';

  const el = document.querySelector('[data-hero-kpi="committees"].hero-summary-number');
  if (!el) return;

  const duration = 2600;
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
  const format = (n) => Math.round(n).toLocaleString('es-MX');

  const parseValue = (text) => {
    const n = Number(String(text || '').replace(/[^0-9.-]/g, ''));
    return Number.isFinite(n) ? n : null;
  };

  const state = {
    finalValue: null,
    animated: false,
    animating: false,
    visible: false
  };

  const animate = () => {
    if (
      state.animated ||
      state.animating ||
      !state.visible ||
      state.finalValue === null ||
      state.finalValue <= 0
    ) return;

    state.animating = true;
    const target = state.finalValue;
    const start = performance.now();
    el.textContent = '0';

    const frame = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = format(target * easeOutCubic(progress));

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        el.textContent = format(target);
        state.animating = false;
        state.animated = true;
      }
    };

    requestAnimationFrame(frame);
  };

  const capture = () => {
    if (state.animated || state.animating) return;
    const value = parseValue(el.textContent);

    if (value !== null && value > 0) {
      state.finalValue = value;
      animate();
    }
  };

  const io = new IntersectionObserver((entries) => {
    state.visible = entries[0].isIntersecting;
    if (state.visible) {
      capture();
      animate();
    }
  }, { threshold: 0.35 });

  const mo = new MutationObserver(capture);

  io.observe(el);
  mo.observe(el, { childList: true, characterData: true, subtree: true });
  capture();
})();