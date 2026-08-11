import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const mm = gsap.matchMedia();

mm.add('(min-width: 1024px)', () => {
  // NEWS cascade
  const newsItems = document.querySelectorAll('.news-swiper-item');
  if (newsItems.length > 0) {
    gsap.set(newsItems, { y: 80, opacity: 0 });

    ScrollTrigger.create({
      trigger: '.news-swiper',
      start: 'top 88%',
      once: true,
      onEnter: () => {
        gsap.to(newsItems, {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.12,
          clearProps: 'transform,opacity',
        });
      },
    });
  }

  // CONSTRUCTION cascade
  const constructionItems = document.querySelectorAll('.construction-swiper-item');
  if (constructionItems.length > 0) {
    gsap.set(constructionItems, { y: 80, opacity: 0 });

    ScrollTrigger.create({
      trigger: '.construction-swiper',
      start: 'top 88%',
      once: true,
      onEnter: () => {
        gsap.to(constructionItems, {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.12,
          clearProps: 'transform,opacity',
        });
      },
    });
  }
});
