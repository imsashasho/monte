import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const target = document.querySelector('.about-title br');
  if (target && target.parentNode) {
    target.parentNode.removeChild(target);
  }

  if (reduceMotion) return;

  const landscape = document.querySelector('.about__landscape');
  const landscapeImg = document.querySelector('.about__landscape-img');

  if (!landscape || !landscapeImg) return;

  gsap.set(landscapeImg, {
    scale: 1.05,
    yPercent: -4,
    transformOrigin: 'center center',
    willChange: 'transform',
  });

  gsap.to(landscapeImg, {
    yPercent: 4,
    ease: 'none',
    scrollTrigger: {
      trigger: landscape,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 0.8,
      invalidateOnRefresh: true,
    },
  });
});
