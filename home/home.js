// This page works without JavaScript; this adds a small keyboard-friendly touch.
document.querySelectorAll('.postcard').forEach((card) => {
  card.addEventListener('pointerdown', () => card.classList.add('is-pressed'));
  card.addEventListener('pointerup', () => card.classList.remove('is-pressed'));
  card.addEventListener('pointerleave', () => card.classList.remove('is-pressed'));
});

// The opening begins on a still cake. A gesture or the accessible button
// starts the cutting scene, and the video then opens the website.
const intro = document.querySelector('#intro-screen');
const introVideo = document.querySelector('#intro-video');
const introSkip = document.querySelector('#intro-skip');
const introPlay = document.querySelector('#intro-play');
const introSound = document.querySelector('#intro-sound');
const sliceStage = document.querySelector('#intro-slice-stage');
const sliceLine = document.querySelector('#intro-slice-line');
const slicePrompt = document.querySelector('#intro-slice-prompt');
const cutButton = document.querySelector('#intro-cut-button');
const siteShell = document.querySelector('.site-shell');
if (intro && introVideo && introSkip && introPlay && introSound && sliceStage && sliceLine && slicePrompt && cutButton && siteShell) {
  const showingIntro = document.documentElement.classList.contains('intro-pending');
  if (showingIntro) {
    siteShell.inert = true;
    let closing = false;
    let waitingForSlice = true;
    let cakeSliced = false;
    let cutFramePositioned = false;
    let swipeStart = null;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const finishIntro = () => {
      if (closing) return;
      closing = true;
      try { sessionStorage.setItem('birthday-intro-polished-seen', 'yes'); } catch (error) { /* Continue without storage. */ }
      introVideo.pause();
      intro.classList.add('is-leaving');
      window.setTimeout(() => {
        document.documentElement.classList.remove('intro-pending');
        siteShell.inert = false;
        siteShell.classList.add('site-arrived');
        intro.hidden = true;
        const heading = document.querySelector('.hero h1');
        if (heading) heading.focus({ preventScroll: true });
      }, reduceMotion ? 0 : 350);
    };

    const startVideo = () => {
      if (closing || waitingForSlice) return;
      introPlay.hidden = true;
      const attempt = introVideo.play();
      if (attempt && typeof attempt.catch === 'function') {
        attempt.catch(() => { if (!closing && !waitingForSlice) introPlay.hidden = false; });
      }
    };

    const positionCutFrame = () => {
      // Seek to the still cake just before the filmed knife enters. The
      // user's gesture remains the only action that starts playback.
      if (closing || cutFramePositioned || introVideo.readyState < 1) return;
      try {
        const configuredTime = Number(window.HOME_SETTINGS?.cutStartSeconds ?? 1);
        const safeTime = Number.isFinite(configuredTime) ? Math.max(0, configuredTime) : 1;
        const maxTime = Number.isFinite(introVideo.duration) ? Math.max(0, introVideo.duration - 0.1) : safeTime;
        introVideo.currentTime = Math.min(safeTime, maxTime);
        cutFramePositioned = true;
      } catch (error) { /* If seeking is unavailable, play from the start. */ }
    };

    const celebrateSlice = (point) => {
      if (reduceMotion) return;
      const burst = document.createElement('div');
      burst.className = 'intro-burst';
      burst.setAttribute('aria-hidden', 'true');
      burst.style.left = `${point && Number.isFinite(point.x) ? point.x : window.innerWidth / 2}px`;
      burst.style.top = `${point && Number.isFinite(point.y) ? point.y : window.innerHeight / 2}px`;
      const colors = ['#fff4df', '#ffd0b7', '#edb5a5', '#f6d895'];
      for (let index = 0; index < 12; index += 1) {
        const fleck = document.createElement('span');
        const angle = (index / 12) * Math.PI * 2;
        const distance = 42 + (index % 3) * 16;
        fleck.style.setProperty('--spark-x', `${Math.cos(angle) * distance}px`);
        fleck.style.setProperty('--spark-y', `${Math.sin(angle) * distance}px`);
        fleck.style.setProperty('--spark-color', colors[index % colors.length]);
        burst.appendChild(fleck);
      }
      intro.appendChild(burst);
      window.setTimeout(() => burst.remove(), 1000);
    };

    const completeSlice = (point) => {
      if (closing || !waitingForSlice || cakeSliced) return;
      celebrateSlice(point);
      positionCutFrame();
      cakeSliced = true;
      waitingForSlice = false;
      swipeStart = null;
      sliceStage.hidden = true;
      slicePrompt.hidden = true;
      sliceLine.hidden = true;
      startVideo();
    };

    const crossesCake = (start, end, rect) => {
      // The cake occupies the centre of the supplied 16:9 film. Allow a
      // generous target so a natural swipe from either side works on phones.
      const left = rect.left + rect.width * 0.28;
      const right = rect.left + rect.width * 0.72;
      const top = rect.top + rect.height * 0.14;
      const bottom = rect.top + rect.height * 0.9;
      for (let step = 0; step <= 32; step += 1) {
        const part = step / 32;
        const x = start.x + (end.x - start.x) * part;
        const y = start.y + (end.y - start.y) * part;
        if (x >= left && x <= right && y >= top && y <= bottom) return true;
      }
      return false;
    };

    sliceStage.addEventListener('pointerdown', (event) => {
      if (!waitingForSlice || !event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0)) return;
      const rect = sliceStage.getBoundingClientRect();
      swipeStart = { x: event.clientX, y: event.clientY, rect, pointerId: event.pointerId };
      sliceStage.setPointerCapture(event.pointerId);
      sliceStage.classList.add('is-slicing');
      sliceLine.style.left = `${event.clientX - rect.left}px`;
      sliceLine.style.top = `${event.clientY - rect.top}px`;
      sliceLine.style.width = '0px';
      sliceLine.hidden = false;
    });
    sliceStage.addEventListener('pointermove', (event) => {
      if (!swipeStart || event.pointerId !== swipeStart.pointerId) return;
      const dx = event.clientX - swipeStart.x;
      const dy = event.clientY - swipeStart.y;
      sliceLine.style.width = `${Math.hypot(dx, dy)}px`;
      sliceLine.style.transform = `rotate(${Math.atan2(dy, dx)}rad)`;
    });
    sliceStage.addEventListener('pointerup', (event) => {
      if (!swipeStart || event.pointerId !== swipeStart.pointerId) return;
      const start = swipeStart;
      const end = { x: event.clientX, y: event.clientY };
      const distance = Math.hypot(end.x - start.x, end.y - start.y);
      swipeStart = null;
      sliceLine.hidden = true;
      sliceStage.classList.remove('is-slicing');
      if (distance >= Math.max(24, start.rect.width * 0.055) && crossesCake(start, end, start.rect)) completeSlice(end);
    });
    sliceStage.addEventListener('pointercancel', () => { swipeStart = null; sliceLine.hidden = true; sliceStage.classList.remove('is-slicing'); });

    introVideo.addEventListener('loadedmetadata', positionCutFrame, { once: true });
    if (introVideo.readyState >= 1) positionCutFrame();
    introVideo.addEventListener('ended', finishIntro, { once: true });
    introVideo.addEventListener('error', finishIntro, { once: true });
    introSkip.addEventListener('click', finishIntro);
    introPlay.addEventListener('click', startVideo);
    cutButton.addEventListener('click', () => completeSlice());
    introSound.addEventListener('click', () => {
      introVideo.muted = !introVideo.muted;
      introSound.textContent = introVideo.muted ? (window.HOME_TEXT?.soundOn || 'Turn sound on') : (window.HOME_TEXT?.soundOff || 'Mute sound');
      introSound.setAttribute('aria-pressed', String(!introVideo.muted));
      if (introVideo.paused && !waitingForSlice) startVideo();
    });
    // Do not play until the cake has been sliced or the cut button is used.
  }
}
