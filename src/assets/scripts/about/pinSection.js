import { gsap, ScrollTrigger } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger);

gsap
  .timeline({
    defaults: {
      ease: 'sine.inOut', // Smoother easing, faster at the start and slower at the end
    },
    scrollTrigger: {
      trigger: '.about-page-image-wrap',
      start: 'top top',
      end: '+=110%', // Increased scroll distance for smoother transition
      scrub: 2, // Lower scrub value for a more gradual effect
      pin: true,
      duration: 3, // Longer duration for a smoother feel
      markers: false,
    },
  })
  .to('.about-page-image-svg', { yPercent: -100, duration: 3 }) // Matching duration for synchronization
  .to('.about-page-image', {
    scale: 1.1,
    y: -50,
    duration: 4,
    ease: 'sine.inOut',
  });
