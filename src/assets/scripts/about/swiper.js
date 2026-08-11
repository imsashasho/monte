import Swiper from 'swiper';
import { Navigation, Controller, EffectFade } from 'swiper/modules';
Swiper.use([Navigation, Controller, EffectFade]);

const advantages = new Swiper('.about-advantages-swiper', {
  slidesPerView: 1,
  speed: 800,
  loop: false,
  effect: 'fade', // Correctly setting the fade effect
  fadeEffect: {
    crossFade: true, // Ensures smooth transition between slides
  },
  navigation: {
    nextEl: '.about-advantages-swiper-button--next',
    prevEl: '.about-advantages-swiper-button--prev',
  },
  breakpoints: {
    360: {
      slidesPerView: 1,
    },
  },
});

if (window.innerWidth < 1023) {
  const aboutSwiper = new Swiper('.about-infrastructure-list-wrap', {
    slidesPerView: 1.1,
    speed: 1500,
    // loop: false,

    navigation: {
      nextEl: '.about-infrastructure-list-button--next',
      prevEl: '.about-infrastructure-list-button--prev',
    },
    breakpoints: {
      360: {
        slidesPerView: 1.1,
        spaceBetween: 10,
      },

      768: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
    },
  });
}
