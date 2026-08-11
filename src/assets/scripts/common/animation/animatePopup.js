import { gsap } from 'gsap';

export function animatePopupSVG() {
  const paths = Array.from(document.querySelectorAll('.form-popup-svg path'));

  // Shuffle paths array to get a random order
  paths.sort(() => Math.random() - 0.5);

  const tl = gsap.timeline();

  // Animate SVG paths
  tl.fromTo(
    paths,
    {
      opacity: 0,
    },
    {
      opacity: 1,
      duration: 1,
      ease: 'power4.inOut',
      stagger: {
        amount: 1,
        start: 0,
        each: index => Math.random() * 1.5,
      },
    },
  );
}
