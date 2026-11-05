/**
 * Initializes physical and visual feedback on user scroll actions.
 * Supports haptic vibration (navigator.vibrate) on compatible mobile devices
 * and edge pulse flash effects.
 */
export function initScrollFeedback() {
  const btn = document.querySelector('.feedback-control');
  const flash = document.querySelector('.feedback-flash');

  if (!btn || !flash) return;

  const labelEl = btn.querySelector('b');
  const hasVibrate = typeof navigator.vibrate === 'function';
  let isEnabled = true;
  let hasUserActivated = !navigator.userActivation || navigator.userActivation.hasBeenActive;
  let vibrateFailed = false;
  let lastTrigger = -Infinity;
  let pulseTimer;

  function updateStatusUI() {
    btn.setAttribute('aria-pressed', String(isEnabled));
    btn.setAttribute('aria-label', isEnabled ? 'Turn scroll feedback off' : 'Turn scroll feedback on');

    if (!isEnabled) {
      if (labelEl) labelEl.textContent = 'SCROLL FEEDBACK OFF';
      return;
    }

    if (hasVibrate && !hasUserActivated) {
      if (labelEl) labelEl.textContent = 'TAP TO ENABLE HAPTICS';
      btn.setAttribute('aria-label', 'Enable haptics');
    } else if (hasVibrate && !vibrateFailed) {
      if (labelEl) labelEl.textContent = 'HAPTICS ON';
    } else {
      if (labelEl) labelEl.textContent = 'VISUAL FEEDBACK ON';
    }
  }

  function triggerFeedback() {
    if (!isEnabled || document.body.classList.contains('menu-open')) return;

    const now = performance.now();
    if (now - lastTrigger < 280) return;
    lastTrigger = now;

    if (navigator.userActivation?.hasBeenActive) {
      hasUserActivated = true;
    }

    // Trigger haptic vibration on mobile
    if (hasVibrate && hasUserActivated) {
      try {
        vibrateFailed = navigator.vibrate([100, 25, 100]) === false;
      } catch {
        vibrateFailed = true;
      }
    }

    // Trigger visual pulse flash
    flash.classList.remove('pulsing');
    void flash.offsetWidth; // Force reflow
    flash.classList.add('pulsing');
    btn.classList.add('pulsing');

    clearTimeout(pulseTimer);
    pulseTimer = setTimeout(() => btn.classList.remove('pulsing'), 230);
    updateStatusUI();
  }

  btn.addEventListener('click', () => {
    if (isEnabled && hasVibrate && !hasUserActivated) {
      hasUserActivated = true;
      triggerFeedback();
    } else {
      isEnabled = !isEnabled;
      if (!isEnabled && hasVibrate) {
        try {
          navigator.vibrate(0);
        } catch {}
      }
    }
    updateStatusUI();
  });

  window.addEventListener('wheel', triggerFeedback, { passive: true });
  window.addEventListener('touchmove', triggerFeedback, { passive: true });
  window.addEventListener('keydown', (e) => {
    if (e.altKey || e.ctrlKey || e.metaKey || e.target?.isContentEditable) return;
    if (['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(e.target?.tagName)) return;
    if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(e.key)) {
      triggerFeedback();
    }
  });

  updateStatusUI();
}
