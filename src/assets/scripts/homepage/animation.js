import gsap from 'gsap/all';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Hero Animation (desktop: з pin, mobile: без pin)
const initHeroAnimation = () => {
  const mm = ScrollTrigger.matchMedia;

  mm({
    // Мобільна версія: ширина до 767px
    '(max-width: 767px)': () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: '+=100%', // коротший діапазон
          scrub: 1, // м’якший скраб
          pin: false, // БЕЗ pin на мобільному
          pinSpacing: false, // без додаткового простору
          invalidateOnRefresh: true,
          refreshPriority: 1,
        },
      });

      const leftElements = gsap.utils.toArray('.hero-intro-title');
      const rightElements = gsap.utils.toArray(
        '.hero-intro-badge--desktop, .hero-intro-list--desktop, .hero-intro-list--mobile, .hero-intro-badge--mobile',
      );

      const filterValue = 'none';
      const moveDistance = 400;

      tl.to(
        leftElements,
        {
          x: -moveDistance,
          opacity: 0,
          filter: filterValue,
          ease: 'power1.inOut',
        },
        0,
      )
        .to(
          rightElements,
          {
            x: moveDistance,
            opacity: 0,
            filter: filterValue,
            ease: 'power1.inOut',
            stagger: 0.1,
          },
          0,
        )
        .to(
          '.hero-intro-btn-to-section',
          {
            y: 100,
            opacity: 0,
            filter: 'none',
            ease: 'sine.in',
          },
          0.2,
        )
        .to(
          '.hero-bg-img',
          {
            scale: 1.2,
            ease: 'sine.inOut',
          },
          0,
        );
    },

    // Десктоп: ширина від 768px
    '(min-width: 768px)': () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: '+=200%',
          scrub: 3,
          pin: true, // з pin на десктопі
          pinSpacing: true,
          invalidateOnRefresh: true,
          refreshPriority: 1,
        },
      });

      const leftElements = gsap.utils.toArray('.hero-intro-title');
      const rightElements = gsap.utils.toArray(
        '.hero-intro-badge--desktop, .hero-intro-list--desktop, .hero-intro-list--mobile, .hero-intro-badge--mobile',
      );

      const filterValue = 'blur(20px)';
      const moveDistance = 800;

      tl.to(
        leftElements,
        {
          x: -moveDistance,
          opacity: 0,
          filter: filterValue,
          ease: 'power1.inOut',
        },
        0,
      )
        .to(
          rightElements,
          {
            x: moveDistance,
            opacity: 0,
            filter: filterValue,
            ease: 'power1.inOut',
            stagger: 0.1,
          },
          0,
        )
        .to(
          '.hero-intro-btn-to-section',
          {
            y: 200,
            opacity: 0,
            filter: 'blur(10px)',
            ease: 'sine.in',
          },
          0.2,
        )
        .to(
          '.hero-bg-img',
          {
            scale: 1.4,
            ease: 'sine.inOut',
          },
          0,
        );
    },
  });
};

// List Items — без змін, але використовуємо поточну ширину
const initListAnimation = () => {
  const isMobile = window.innerWidth < 768;
  const listItems = document.querySelectorAll('[data-list-item]');

  if (listItems.length > 0) {
    gsap.utils.toArray('[data-list-item]').forEach((item, i) => {
      gsap.from(item, {
        autoAlpha: 0,
        y: isMobile ? 30 : 50,
        duration: isMobile ? 0.5 : 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 95%',
          toggleActions: 'play none none none',
        },
        delay: isMobile ? i * 0.05 : i * 0.1,
      });
    });
  }
};

function initCardAnimation() {
  const sections = document.querySelectorAll('[data-card-list]');
  if (!sections.length) return;

  let mm = gsap.matchMedia();

  sections.forEach((section) => {
    const cards = section.querySelectorAll(':scope > li'); // :scope щоб брати тільки прямих нащадків

    mm.add('(min-width: 769px)', () => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            toggleActions: 'play none none reset',
          },
        })
        .fromTo(
          cards,
          { autoAlpha: 0, y: 150 },
          { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out' },
        );
    });

    mm.add('(max-width: 768px)', () => {
      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { autoAlpha: 0, y: 100 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              toggleActions: 'play none none reset',
            },
          },
        );
      });
    });
  });
}

function initListBlockAnimation() {
  const sections = document.querySelectorAll('[data-list]');
  if (!sections.length) return;

  let mm = gsap.matchMedia();

  sections.forEach((section) => {
    const cards = section.querySelectorAll(':scope > li');

    mm.add('(min-width: 769px)', () => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            toggleActions: 'play none none none',
          },
        })
        .fromTo(
          cards,
          { autoAlpha: 0, y: 150 },
          { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power2.out' },
        );
    });

    mm.add('(max-width: 768px)', () => {
      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { autoAlpha: 0, y: 100 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              toggleActions: 'play none none none',
            },
          },
        );
      });
    });
  });
}

initListBlockAnimation();
initListAnimation();
