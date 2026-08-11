import lenis from './lenisScroll';

// Scroll lock shared by every overlay (form popup, menu, mobile modal, gallery).
//
// The document is deliberately NOT taken out of flow. `position: fixed` on
// <body> collapses the document height, so the browser clamps the scroll offset
// to 0 — and that reset is what ScrollTrigger picks up (lenisScroll.js updates
// it every frame), which snaps every scroll-driven animation back to its start
// behind the semi-transparent popup. Hiding the viewport's overflow instead
// keeps the real offset, so nothing under the overlay moves at all.
//
// Locks are keyed by owner, so nested overlays hand the lock over without ever
// opening a gap: the mobile modal or the menu can release its own key while the
// form popup still holds one, and the page stays locked the whole time.

const LOCK_CLASS = 'is-scroll-locked';
const SCROLLBAR_WIDTH_VAR = '--scrollbar-width';

const owners = new Set();

const getScrollbarWidth = () =>
  Math.max(0, window.innerWidth - document.documentElement.clientWidth);

// The overlay's own scrollable areas (popup body, phone-input country list) must
// keep panning, so a touchmove is only cancelled when it has nothing of its own
// left to scroll.
const findScrollableAncestor = (node) => {
  let el = node instanceof Element ? node : null;

  while (el && el !== document.body && el !== document.documentElement) {
    const { overflowY } = window.getComputedStyle(el);

    if ((overflowY === 'auto' || overflowY === 'scroll') && el.scrollHeight > el.clientHeight) {
      return el;
    }

    el = el.parentElement;
  }

  return null;
};

// iOS Safari still pans the page on touch when the viewport's overflow is
// hidden. `overscroll-behavior: contain` on the overlay stops scroll chaining,
// this stops the pan itself. Lenis is destroyed on mobile, so nothing else does.
const handleTouchMove = (event) => {
  if (event.touches.length > 1) return; // pinch-zoom
  if (findScrollableAncestor(event.target)) return;
  if (event.cancelable) event.preventDefault();
};

const applyLock = () => {
  // Measured while the scrollbar is still there; CSS pads that gutter back so
  // neither the page nor the fixed header shifts sideways. Reads 0 wherever
  // scrollbars are overlaid or hidden.
  document.documentElement.style.setProperty(
    SCROLLBAR_WIDTH_VAR,
    `${getScrollbarWidth()}px`,
  );
  document.documentElement.classList.add(LOCK_CLASS);
  document.addEventListener('touchmove', handleTouchMove, { passive: false });

  if (lenis && typeof lenis.stop === 'function') lenis.stop();
};

const releaseLock = () => {
  document.documentElement.classList.remove(LOCK_CLASS);
  document.documentElement.style.removeProperty(SCROLLBAR_WIDTH_VAR);
  document.removeEventListener('touchmove', handleTouchMove);

  if (lenis && typeof lenis.start === 'function') lenis.start();
};

export function lockDocument(owner = 'default') {
  const wasLocked = owners.size > 0;
  owners.add(owner);

  if (!wasLocked) applyLock();
}

export function unlockDocument(owner = 'default') {
  if (!owners.delete(owner)) return;
  if (owners.size === 0) releaseLock();
}

export const isDocumentLocked = () => owners.size > 0;
