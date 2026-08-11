import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';

Swiper.use([Navigation]);
const pxToVw = (px, screen) => {
  return (px / screen) * window.innerWidth;
};

const advantagesSlider = new Swiper('[data-advantages-swiper]', {
  slidesPerView: 4,
  spaceBetween: pxToVw(20, 1920),
  navigation: {
    nextEl: [...document.querySelectorAll('[data-advantages-next]')],
    prevEl: [...document.querySelectorAll('[data-advantages-prev]')],
  },
  breakpoints: {
    360: {
      slidesPerView: 1.12,
      spaceBetween: pxToVw(12, 375),
      slidesOffsetAfter: pxToVw(20, 375),
      slidesOffsetBefore: pxToVw(20, 375),
    },
    767: {
      slidesPerView: 1.3,
      spaceBetween: pxToVw(16, 768),
      slidesOffsetAfter: pxToVw(20, 768),
      slidesOffsetBefore: pxToVw(20, 768),
    },
    1024: {
      slidesPerView: 2.25,
      spaceBetween: pxToVw(20, 1920),
      slidesOffsetAfter: pxToVw(40, 1920),
      slidesOffsetBefore: pxToVw(40, 1920),
    },
  },
});
