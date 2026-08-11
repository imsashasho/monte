import { gsap, ScrollTrigger } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger);

const initScaled = () => {
  const parallaxImages = document.querySelectorAll('[img-scale]');
  parallaxImages.forEach((image) => {
    const wrap = document.createElement('div');
    wrap.style.overflow = 'hidden';
    wrap.style.height = '100%';
    image.parentElement.prepend(wrap);
    gsap.set(image, { willChange: 'transform' });
    wrap.prepend(image);

    gsap
      .timeline({
        ease: 'none',
        scrollTrigger: {
          trigger: wrap,
          scrub: 0.5,
          start: 'top bottom',
          end: 'center center',
          markers: false,
          onLeave: () => {
            console.log('leave');
          },
          // markers: true,
        },
      })
      .fromTo(
        image,
        {
          scale: 1,
        },
        {
          scale: 1.2,
          ease: 'linear',
        },
      );
  });
};

const initBannerEntrance = () => {
  const banner = document.querySelector('[img-scale]');
  if (!banner) return;

  gsap.set(banner, { scale: 1.15, autoAlpha: 0 });

  gsap.fromTo(
    banner,
    { scale: 1.15, autoAlpha: 0 },
    {
      scale: 1,
      autoAlpha: 1,
      duration: 1.5,
      ease: 'power2.out',
      delay: 0.2,
    },
  );
};

const imageScaled = document.querySelectorAll('[img-scale]');

if (imageScaled) {
  initBannerEntrance();
  initScaled();
}
