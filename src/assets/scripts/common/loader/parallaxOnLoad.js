import { gsap, ScrollTrigger } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger);

export function initParallaxHeroBlock() {
  ScrollTrigger.refresh();
  const parallaxImages = document.querySelectorAll('[parallax-block-hero]');
  // Retrieve the CSS variable --unit
  const unitVw = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--unit'));
  // Convert vw to pixels based on the current viewport width
  const viewportWidth = window.innerWidth;
  const unitPx = (unitVw / 50) * viewportWidth;

  parallaxImages.forEach(block => {
    const scale = block.dataset.scale || 1; // Default scale is 1.1 if not provided
    gsap.set(block, { willChange: 'transform', scale: scale });
    const speed = block.dataset.speed;
    const yPercent = block.dataset.percent || 0;
    const time = block.dataset.time || 1;
    gsap
      .timeline({
        ease: 'none',
        scrollTrigger: {
          trigger: block,
          scrub: 2,
          markers: false,
          start: `top-=${unitPx} top`,
          end: 'bottom top',
        },
      })
      .fromTo(
        block,
        {
          y: () => `${yPercent}%`,
        },
        {
          y: () => `${10 * (1 - speed)}%`,
          ease: 'sine.inOut',
        },
      );
  });
}

export function initParallaxHero() {
  ScrollTrigger.refresh();
  const parallaxImages = document.querySelectorAll('[img-parallax-hero]');
  // Retrieve the CSS variable --unit
  const unitVw = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--unit'));
  // Convert vw to pixels based on the current viewport width
  const viewportWidth = window.innerWidth;
  const unitPx = (unitVw / 15) * viewportWidth;
  console.log(unitPx);
  parallaxImages.forEach(image => {
    const wrap = document.createElement('div');
    wrap.classList.add('parallax-container');
    wrap.style.height = '100%';
    image.parentElement.prepend(wrap);
    const scale = image.dataset.scale || 1;
    const time = image.dataset.time || 1;
    gsap.set(image, { willChange: 'transform', scale: scale });
    wrap.prepend(image);

    const speed = image.dataset.speed;
    const startValue = `top-=${unitPx} top`;
    const endValue = `bottom top`;
    console.log(startValue);
    console.log(endValue);

    gsap
      .timeline({
        ease: 'none',
        scrollTrigger: {
          trigger: wrap,
          scrub: 3,
          markers: false,
          start: `top-=${unitPx} top`,
          end: 'bottom top',
        },
      })
      .fromTo(
        image,
        {
          y: () => `0%`,
        },
        {
          y: () => `${10 * (1 - speed)}%`,
          ease: 'sine.inOut',
        },
      );
  });
}
