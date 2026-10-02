(() => {
  'use strict';

  const duration = 2600;
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
  const format = (n) => Math.round(n).toLocaleString('es-MX');

  const targets = [
    '.hero-summary-number[data-hero-kpi="committees"]',
    '.metric-grid [data-kpi="committees"]',
    '.metric-grid [data-kpi="ccs"]',
    '.metric-grid [data-kpi="cps"]',
    '.metric-grid [data-kpi="members"]'
  ];

  function animateElement(el) {
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

  function setupTarget(el) {
    if (!el) return;

    const tryAnimate = () => {
      if (el.dataset.countupDone === 'true' || el.dataset.countupRunning === 'true') return;
      const value = Number(String(el.textContent || '').replace(/[^0-9.-]/g, ''));
      if (!Number.isFinite(value) || value <= 0) return;

      const rect = el.getBoundingClientRect();
      const visible = rect.top < window.innerHeight && rect.bottom > 0;
      if (visible) animateElement(el);
    };

    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) tryAnimate();
    }, { threshold: 0.35 });

    const mo = new MutationObserver(tryAnimate);

    io.observe(el);
    mo.observe(el, { childList: true, characterData: true, subtree: true });

    let attempts = 0;
    const timer = setInterval(() => {
      attempts += 1;
      tryAnimate();
      if (el.dataset.countupDone === 'true' || attempts >= 120) clearInterval(timer);
    }, 100);
  }

  const init = () => {
    targets.forEach(selector => {
      document.querySelectorAll(selector).forEach(setupTarget);
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();