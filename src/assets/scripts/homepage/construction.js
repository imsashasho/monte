import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';

Swiper.use([Navigation]);
const pxToVw = (px, screen) => {
  return (px / screen) * window.innerWidth;
};

const constructionSlider = new Swiper('[data-construction-swiper]', {
  slidesPerView: 4.17,
  spaceBetween: pxToVw(20, 1920),
  slidesOffsetAfter: pxToVw(40, 1920),
  slidesOffsetBefore: pxToVw(40, 1920),
  //   loop: true,
  breakpoints: {
    360: {
      slidesPerView: 1.15,
      spaceBetween: pxToVw(12, 375),
      slidesOffsetAfter: pxToVw(20, 375),
      slidesOffsetBefore: pxToVw(20, 375),
    },
    768: {
      slidesPerView: 1.75,
      spaceBetween: pxToVw(16, 768),
      slidesOffsetAfter: pxToVw(20, 768),
      slidesOffsetBefore: pxToVw(20, 768),
    },
    1024: {
      slidesPerView: 3.17,
      spaceBetween: pxToVw(20, 1920),
      slidesOffsetAfter: pxToVw(40, 1920),
      slidesOffsetBefore: pxToVw(40, 1920),
    },
  },
});
