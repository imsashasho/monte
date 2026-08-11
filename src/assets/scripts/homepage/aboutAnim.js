import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const initAboutFormatAnim = () => {
  const cards = document.querySelectorAll('.about-format-card');
  if (!cards.length) return;

  cards.forEach((card, index) => {
    // 0 = ліва картка (Home), 1 = права картка (Apartments)
    const isLeft = index === 0;

    // Внутрішні елементи для каскадної анімації
    const eyebrow = card.querySelector('.about-format-card__eyebrow');
    const title = card.querySelector('.about-format-card__title');
    const desc = card.querySelector('.about-format-card__description');
    const features = card.querySelectorAll('.about-format-card__feature');
    const button = card.querySelector('.about-format-card__button-wrap');

    const elementsToAnimate = [eyebrow, title, desc, ...features, button].filter(Boolean);

    // Initial state: картка зсунута вбік і розфокусована, елементи приховані
    gsap.set(card, {
      xPercent: isLeft ? -15 : 15,
      opacity: 0,
      filter: 'blur(10px)',
    });

    gsap.set(elementsToAnimate, {
      y: 20,
      opacity: 0,
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: card,
        start: 'top bottom-=100',
        once: true,
      },
      defaults: {
        ease: 'power2.out',
      },
    });

    // 1. Плавне випливання самої картки збоку
    tl.to(card, {
      xPercent: 0,
      opacity: 1,
      filter: 'blur(0px)',
      duration: 1.8,
      clearProps: 'filter,transform',
    });

    // 2. Дуже м'яка поява внутрішніх елементів (каскадом)
    tl.to(
      elementsToAnimate,
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.15,
      },
      '-=1.2', // Почати до того, як картка повністю доїде
    );
  });
};

initAboutFormatAnim();
