import axios from 'axios';
// // // eslint-disable-next-line import/no-extraneous-dependencies
import { gsap, ScrollTrigger } from 'gsap/all';
// import './common/i18nGeneral';

// import './common/loader/loader';
import './common/header/header';
// import './common/footer/footer';
import './common/lenisScroll';
import './common/animation/parallaxImages';
// import './common/animation/scaleImages';
import './common/animation/textAppearence';
// import { fun } from './common/fun';

global.gsap = gsap;
global.ScrollTrigger = ScrollTrigger;
gsap.core.globals('ScrollTrigger', ScrollTrigger);
global.axios = axios;

gsap.registerPlugin(ScrollTrigger);

// --- Stable --app-height (no iOS toolbar jitter) ---------------------------
// On iOS Safari the address bar hides/shows while scrolling, changing the live
// visible height on every scroll. Locking --app-height to a stable large-
// viewport estimate for the current orientation keeps `var(--app-height)`
// elements from jittering, while still updating on real resizes / rotation.
let lastAppHeight = 0;
let lastViewportWidth = 0;
let lastOrientation = '';
let appHeightTimer = null;

const isTouchMobileViewport = () =>
  window.matchMedia('(max-width: 1023px)').matches &&
  window.matchMedia('(hover: none) and (pointer: coarse)').matches;

const getViewportMetrics = () => {
  const width = Math.round(window.innerWidth || document.documentElement.clientWidth || 0);
  const visibleHeight = Math.round(
    window.visualViewport?.height ||
      window.innerHeight ||
      document.documentElement.clientHeight ||
      0,
  );
  const orientation = width > visibleHeight ? 'landscape' : 'portrait';

  const screenWidth = Math.round(window.screen?.width || 0);
  const screenHeight = Math.round(window.screen?.height || 0);
  const screenLongSide = Math.max(screenWidth, screenHeight);
  const screenShortSide = Math.min(screenWidth, screenHeight);
  const stableScreenHeight = orientation === 'portrait' ? screenLongSide : screenShortSide;

  // On touch mobile take the LARGER of the live height and the screen-derived
  // estimate, so toolbar collapse/expand never shrinks the value.
  const height = isTouchMobileViewport()
    ? Math.max(visibleHeight, stableScreenHeight)
    : visibleHeight;

  return { width, height, orientation };
};

const applyAppHeight = (height) => {
  document.documentElement.style.setProperty('--app-height', `${height}px`);
  lastAppHeight = height;
};

const setAppHeight = ({ force = false } = {}) => {
  const { width, height, orientation } = getViewportMetrics();
  const widthChanged = Math.abs(width - lastViewportWidth) > 2;
  const orientationChanged = orientation !== lastOrientation;

  // Ignore iOS toolbar show/hide cycles where only the live visible height
  // changes — width and orientation stay the same.
  if (!force && !widthChanged && !orientationChanged && lastAppHeight) {
    return false;
  }

  lastViewportWidth = width;
  lastOrientation = orientation;
  applyAppHeight(height);

  return true;
};

// Debounced: only touch the layout (and refresh ScrollTrigger) when the value
// actually changed.
const scheduleAppHeight = () => {
  if (appHeightTimer) clearTimeout(appHeightTimer);
  appHeightTimer = setTimeout(() => {
    if (setAppHeight()) ScrollTrigger.refresh();
  }, 150);
};

window.addEventListener('resize', scheduleAppHeight);
window.addEventListener('orientationchange', () => {
  if (setAppHeight({ force: true })) ScrollTrigger.refresh();
});
if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', scheduleAppHeight);
}
setAppHeight({ force: true });
// // fun();
