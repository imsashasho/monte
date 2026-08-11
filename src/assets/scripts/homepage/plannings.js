import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';

Swiper.use([Navigation]);
const pxToVw = (px, screen) => {
  return (px / screen) * window.innerWidth;
};
const advantagesSlider = new Swiper('.plannings-list-wrap', {
  slidesPerView: 3,
  spaceBetween: pxToVw(40, 1920),
  navigation: {
    nextEl: '[data-plannings-next]',
    prevEl: '[data-plannings-prev]',
  },

  breakpoints: {
    0: {
      // або 360
      slidesPerView: 1.1,
      spaceBetween: pxToVw(12, 375),
      slidesOffsetAfter: pxToVw(16, 375),
      slidesOffsetBefore: pxToVw(16, 375),
    },
    360: {
      slidesPerView: 1.1,
      spaceBetween: pxToVw(12, 375),
      slidesOffsetAfter: pxToVw(16, 375),
      slidesOffsetBefore: pxToVw(16, 375),
    },
    767: {
      slidesPerView: 2.15,
      spaceBetween: pxToVw(16, 768),
      slidesOffsetAfter: pxToVw(20, 768),
      slidesOffsetBefore: pxToVw(24, 768),
    },
    1024: {
      slidesPerView: 3,
      spaceBetween: pxToVw(40, 1920),
    },
  },
});
