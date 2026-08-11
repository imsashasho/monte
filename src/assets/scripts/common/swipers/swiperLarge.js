import Swiper from 'swiper';

import { Navigation } from 'swiper/modules';

Swiper.use([Navigation]);

export const swiperLarge = (sliderName, navigationPrev, navigationNext) => {
  const swiperImage = new Swiper(sliderName, {
    loop: false,
    spaceBetween: 20,
    speed: 2000,
    slidesPerView: 'auto',
    centeredSlides: false,
    navigation: {
      nextEl: navigationNext,
      prevEl: navigationPrev,
    },
  });
};
