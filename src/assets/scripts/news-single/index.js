import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import '../homepage/animation';

Swiper.use([Navigation, Pagination]);
const pxToVw = (px, screen) => {
  return (px / screen) * window.innerWidth;
};

const newsSlider = new Swiper('[data-news-more-swiper]', {
  slidesPerView: 4.17,
  spaceBetween: pxToVw(20, 1920),
  slidesOffsetAfter: pxToVw(40, 1920),
  slidesOffsetBefore: pxToVw(40, 1920),
  //   loop: true,
  navigation: {
    nextEl: '[data-news-more-next]',
    prevEl: '[data-news-more-prev]',
  },
  breakpoints: {
    360: {
      slidesPerView: 1.1,
      spaceBetween: pxToVw(12, 375),
      slidesOffsetAfter: pxToVw(16, 375),
      slidesOffsetBefore: pxToVw(16, 375),
    },
    768: {
      slidesPerView: 1.1,
      spaceBetween: pxToVw(16, 768),
      slidesOffsetAfter: pxToVw(20, 768),
      slidesOffsetBefore: pxToVw(24, 768),
    },
    1025: {
      slidesPerView: 3.17,
      spaceBetween: pxToVw(20, 1920),
      slidesOffsetAfter: pxToVw(40, 1920),
      slidesOffsetBefore: pxToVw(40, 1920),
    },
  },
});

window.addEventListener('load', () => {
  const contentChildren = document.querySelectorAll('.news-single-content > *');

  if (!contentChildren.length) return;

  contentChildren.forEach((el) => {
    gsap.fromTo(
      el,
      { autoAlpha: 0, y: 40 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      },
    );
  });
});

const constructionSingleSwiper = new Swiper('[data-construction-single-swiper]', {
  slidesPerView: 1,
  spaceBetween: pxToVw(20, 1920),
  navigation: {
    nextEl: '[data-construction-single-next]',
    prevEl: '[data-construction-single-prev]',
  },
  pagination: {
    el: '[data-construction-single-pagination]',
    type: 'fraction',
  },
  breakpoints: {
    360: {
      spaceBetween: pxToVw(12, 375),
    },
    768: {
      spaceBetween: pxToVw(16, 768),
    },
    1024: {
      spaceBetween: pxToVw(20, 1920),
    },
  },
});
