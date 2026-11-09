// Gentle page changes and scroll reveals; all content remains available without JS.
(() => {
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  window.addEventListener('pageshow', () => document.documentElement.classList.remove('page-is-leaving'));
  document.addEventListener('click', (event) => {
    if (motionPreference.matches || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest('a[href]');
    if (!link || link.target || link.hasAttribute('download')) return;
    const url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin || !['http:', 'https:', 'file:'].includes(url.protocol)) return;
    if (url.pathname === window.location.pathname && url.search === window.location.search) return;
    event.preventDefault();
    document.documentElement.classList.add('page-is-leaving');
    window.setTimeout(() => { window.location.href = url.href; }, 260);
  });

  if ('IntersectionObserver' in window && !motionPreference.matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove('reveal-await');
        entry.target.classList.add('reveal-in');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('[data-reveal]').forEach((item) => {
      if (item.getBoundingClientRect().top > window.innerHeight * 0.92) item.classList.add('reveal-await');
      observer.observe(item);
    });
  }

  const replay = document.querySelector('#replay-intro');
  if (replay) replay.addEventListener('click', () => {
    try { sessionStorage.removeItem('birthday-intro-polished-seen'); } catch (error) { /* Reload still works without storage. */ }
    window.location.reload();
  });

  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !motionPreference.matches) {
    document.querySelectorAll('.postcard').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.setProperty('--tilt-x', `${(-y * 5).toFixed(2)}deg`);
        card.style.setProperty('--tilt-y', `${(x * 5).toFixed(2)}deg`);
      });
      card.addEventListener('pointerleave', () => {
        card.style.removeProperty('--tilt-x');
        card.style.removeProperty('--tilt-y');
      });
    });
  }
})();
