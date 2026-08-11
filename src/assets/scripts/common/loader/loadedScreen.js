import { gsap, ScrollTrigger } from 'gsap/all';
import { initParallaxHeroBlock } from './parallaxOnLoad';
import { initParallaxHero } from './parallaxOnLoad';

gsap.registerPlugin(ScrollTrigger);

export function initLoadedScreen() {
  const mainScreenImg = document.querySelector('.hero-img');
  const header = document.querySelector('header');
  const infoBlock = document.querySelector('.hero-title-wrap');
  const developerBlock = document.querySelector('.hero-developer-wrap');
  const infoBtn = document.querySelector('.hero-subtitle-wrap');
  const dateList = document.querySelector('.hero-progress-list');
  const promoBlock = document.querySelectorAll('.hero-promo-wrap');
  const breadcrumbs = document.querySelector('[data-breadcrumbs]');
  const blockTitle = document.querySelector('[data-title]');
  const blockContent = document.querySelectorAll('[data-content]');

  const tl = gsap.timeline({
    paused: true,
  });

  gsap.set(header, { yPercent: -100 });

  if (mainScreenImg) {
    tl.fromTo(
      mainScreenImg,
      {
        scale: 2,
        opacity: 0,
      },
      {
        scale: 1,
        opacity: 1,
        ease: 'power4.easeInOut',
        duration: 1.5,
        clearProps: 'all',
      },
      '-=0.1',
    );
  }

  if (infoBlock) {
    tl.fromTo(
      infoBlock,
      { yPercent: 100, autoAlpha: 0 },
      {
        yPercent: 0,
        autoAlpha: 1,
        ease: 'power4.easeInOut',
        duration: 1,
        clearProps: 'all',
        stagger: 0.15,
      },
      '-=1',
    );
  }
  if (developerBlock) {
    tl.fromTo(
      developerBlock,
      { yPercent: 100, autoAlpha: 0 },
      {
        yPercent: 0,
        autoAlpha: 1,
        ease: 'power4.easeInOut',
        duration: 1,
        clearProps: 'all',
        stagger: 0.15,
      },
      '-=1',
    );
  }

  if (infoBtn) {
    tl.fromTo(
      infoBtn,
      { yPercent: 200, autoAlpha: 0 },
      {
        yPercent: 0,
        autoAlpha: 1,
        ease: 'power4.easeInOut',
        duration: 1.2,
        clearProps: 'all',
      },
      '-=1.1',
    );
  }
  if (dateList) {
    tl.fromTo(
      dateList,
      { yPercent: 200, autoAlpha: 0 },
      {
        yPercent: 0,
        autoAlpha: 1,
        ease: 'power4.easeInOut',
        duration: 1.2,
        clearProps: 'all',
      },
      '-=1.1',
    );
  }

  if (promoBlock) {
    promoBlock.forEach(el => {
      tl.fromTo(
        el,
        { scale: 0, autoAlpha: 0 },
        {
          scale: 1,
          autoAlpha: 1,
          ease: 'power4.easeInOut',
          duration: 1.2,
          clearProps: 'all',
        },
        '-=1.1',
      );
    });
  }

  tl.play();
  const tl2 = gsap.timeline({
    paused: true,
  });

  // Set a small delay before the animations start
  const delay = 0.1; // Slightly increased delay
  const duration = 1.8; // Slightly extended duration

  if (blockTitle) {
    tl2.fromTo(
      blockTitle,
      { top: '-100vh' },
      { top: 0, duration: duration, ease: 'expo.out', clearProps: 'all' },
      delay,
    );
  }

  blockContent.forEach(e => {
    if (e) {
      tl2.fromTo(
        e,
        { top: '100vh' },
        { top: 0, duration: duration, ease: 'expo.out', clearProps: 'all' },
        delay,
      );
    }
  });

  if (breadcrumbs) {
    tl2.fromTo(
      header,
      { yPercent: '-100%' },
      { yPercent: 0, duration: 0.5, ease: 'power4.out', clearProps: 'all' },
      delay,
    );
  } else {
    tl.fromTo(
      header,
      { yPercent: -100, autoAlpha: 0 },
      { yPercent: 0, ease: 'expo.out', duration: duration, autoAlpha: 1, clearProps: 'all' },
      delay,
    );
  }

  tl2.play();

  tl.eventCallback('onComplete', () => {
    const imageParallaxHeroBlock = document.querySelectorAll('[parallax-block-hero]');
    const imageParallaxHero = document.querySelectorAll('[img-parallax-hero]');
    if (imageParallaxHeroBlock) {
      initParallaxHeroBlock();
    }
    if (imageParallaxHero) {
      initParallaxHero();
    }
  });
}
