import Lenis from 'lenis';
import { gsap, ScrollTrigger } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis({
  smoothWheel: true,
  duration: 1.2,
});

function raf(time) {
  lenis.raf(time);
  ScrollTrigger.update();
  requestAnimationFrame(raf);
}
if (/Mobi|Android/i.test(navigator.userAgent)) {
  lenis.destroy();
}

ScrollTrigger.update();

requestAnimationFrame(raf);

export default lenis;
