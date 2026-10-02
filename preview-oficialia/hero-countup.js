(() => {
  'use strict';

  const duration = 2600;
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
  const format = (n) => Math.round(n).toLocaleString('es-MX');

  function startCountUp() {
    const el = document.querySelector('.hero-summary-number[data-hero-kpi="committees"]');
    if (!el || el.dataset.countupDone === 'true' || el.dataset.countupRunning === 'true') return false;

    const target = Number(String(el.textContent || '').replace(/[^0-9.-]/g, ''));
    if (!Number.isFinite(target) || target <= 0) return false;

    el.dataset.countupRunning = 'true';
    el.textContent = '0';

    const start = performance.now();

    const frame = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = format(target * easeOutCubic(progress));

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        el.textContent = format(target);
        el.dataset.countupRunning = 'false';
        el.dataset.countupDone = 'true';
      }
    };

    requestAnimationFrame(frame);
    return true;
  }

  // Supabase escribe el total después de cargar la página.
  // Revisamos hasta encontrar un valor real y entonces animamos una sola vez.
  let attempts = 0;
  const timer = setInterval(() => {
    attempts += 1;
    if (startCountUp() || attempts >= 120) clearInterval(timer);
  }, 100);

  document.addEventListener('DOMContentLoaded', startCountUp);
  window.addEventListener('load', startCountUp);
})();