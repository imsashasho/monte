import { gsap, ScrollTrigger } from 'gsap/all';
import { initLoadedScreen } from './loadedScreen';

gsap.registerPlugin(ScrollTrigger);

const preloaderRef = document.querySelector('.loader-wrap');
const preloaderCircleRef = document.querySelector('.loader-circle');
const preloaderAnimationWrap = document.querySelector('.loader');

export const preloader = {
  el: preloaderRef,
  subscribers: [],

  removeHome() {
    if (this.el) {
      const tl = gsap.timeline({
        defaults: {
          ease: 'power2.inOut',
          duration: 1,
        },
        onComplete: () => {
          this.el.remove();

          this.subscribers.forEach(fn => fn());
        },
      });

      tl.to(preloaderRef, {
        // opacity: 0,
        y: '-100%',
        duration: 1,
        onStart: () => {
          setTimeout(() => {
            initLoadedScreen(); // Starts initLoadedScreen animation with delay
          }, 100);
        },
      });
      // .to(
      //   preloaderCircleRef,
      //   {
      //     duration: 1.2,
      //     scale: 0,
      //     transformOrigin: '50% 50%',
      //     onStart: () => {
      //       setTimeout(() => {
      //         initLoadedScreen(); // Starts initLoadedScreen animation with delay
      //       }, 500);
      //     },
      //   },
      //   '-=1',
      // )
      // .to(
      //   preloaderCircleRef,
      //   {
      //     opacity: 0,
      //     duration: 0.4, // Opacity animation duration
      //   },
      //   '-=0.4', // Start opacity animation halfway through the scaling
      // );
    }
  },
  removePage() {
    if (this.el) {
      const tl = gsap.timeline({
        defaults: {
          ease: 'power2.inOut',
          duration: 0.7,
        },
        onComplete: () => {
          this.el.remove();

          this.subscribers.forEach(fn => fn());
        },
      });

      tl.to(preloaderRef, {
        // opacity: 0,
        y: '-100%',
        duration: 1,
        onStart: () => {
          setTimeout(() => {
            initLoadedScreen(); // Starts initLoadedScreen animation with delay
          }, 0);
        },
      });

      // tl.to(preloaderAnimationWrap, {
      //   opacity: 0,
      //   duration: 2,
      // })
      //   .to(
      //     preloaderCircleRef,
      //     {
      //       duration: 1.2,
      //       scale: 0,
      //       transformOrigin: '50% 50%',
      //       onStart: () => {
      //         setTimeout(() => {
      //           initLoadedScreen(); // Starts initLoadedScreen animation with delay
      //         }, 0);
      //       },
      //     },
      //     '-=1',
      //   )
      //   .to(
      //     preloaderCircleRef,
      //     {
      //       opacity: 0,
      //       duration: 0.4, // Opacity animation duration
      //     },
      //     '-=0.4', // Start opacity animation halfway through the scaling
      //   );
    }
  },
  onRemove(fn) {
    this.subscribers.push(fn);
  },
};

const homepage = document.getElementById('index');
const homepage2 = document.getElementById('home');

if (homepage || homepage2) {
  window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      preloader.removeHome();
    }, 1500);
  });
} else {
  window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      preloader.removePage();
    }, 1000);
  });
}

export default preloader;
