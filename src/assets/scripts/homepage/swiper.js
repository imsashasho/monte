import { t } from 'i18next';
import Swiper from 'swiper';
import { EffectCreative, Autoplay, Controller } from 'swiper/modules';

Swiper.use([EffectCreative, Autoplay, Controller]);

const paginationButtons = Array.from(document.querySelectorAll('.hero-swiper-pagination-item'));

// Змінні для свайперів
let swiperDesktop = null;
let swiper = null;
let isPaginationClick = false; // Флаг для кліків пагінації

function scrollPaginationIntoView(activeButton) {
  const isMobile = window.innerWidth < 1024;

  if (isMobile && activeButton) {
    const currentIndex = parseInt(activeButton.dataset.index, 10);
    const totalButtons = paginationButtons.length;
    const paginationContainer =
      activeButton.closest('.features-main-swiper-pagination') || activeButton.parentElement;

    if (!paginationContainer) return;

    const skipLastItems = 2;

    if (currentIndex >= totalButtons - skipLastItems) {
      console.log('Handling scroll for last item(s) - ensuring visibility');

      const containerRect = paginationContainer.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();

      const isFullyVisible =
        buttonRect.left >= containerRect.left && buttonRect.right <= containerRect.right;

      if (!isFullyVisible) {
        if (currentIndex === totalButtons - 1) {
          const maxScrollLeft = paginationContainer.scrollWidth - paginationContainer.clientWidth;
          paginationContainer.scrollTo({
            left: maxScrollLeft,
            behavior: 'smooth',
          });
        } else {
          const neededScroll = buttonRect.right - containerRect.right + 20;
          if (neededScroll > 0) {
            paginationContainer.scrollTo({
              left: paginationContainer.scrollLeft + neededScroll,
              behavior: 'smooth',
            });
          }
        }
      }
      return;
    }

    const containerRect = paginationContainer.getBoundingClientRect();
    const buttonRect = activeButton.getBoundingClientRect();

    const isFullyVisible =
      buttonRect.left >= containerRect.left && buttonRect.right <= containerRect.right;

    if (!isFullyVisible) {
      activeButton.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });

      setTimeout(() => {
        const newContainerRect = paginationContainer.getBoundingClientRect();
        const newButtonRect = activeButton.getBoundingClientRect();

        if (
          newButtonRect.left < newContainerRect.left ||
          newButtonRect.right > newContainerRect.right
        ) {
          const scrollLeft =
            paginationContainer.scrollLeft +
            (newButtonRect.left - newContainerRect.left) -
            (newContainerRect.width - newButtonRect.width) / 2;

          paginationContainer.scrollTo({
            left: Math.max(0, scrollLeft),
            behavior: 'smooth',
          });
        }
      }, 100);
    }
  }
}

// Update custom pagination
function updateCustomPagination(index) {
  paginationButtons.forEach((btn) => btn.classList.remove('active'));
  const activeBtn = paginationButtons.find((btn) => Number(btn.dataset.index) === index);

  if (activeBtn) {
    activeBtn.classList.add('active');
    setTimeout(() => {
      scrollPaginationIntoView(activeBtn);
    }, 100);
  }
}

// Function to check if slide contains video
function hasVideo(slide) {
  return slide && slide.querySelector('video') !== null;
}

// Function to handle video playback
function handleVideoPlayback(slide) {
  document.querySelectorAll('.swiper-slide video').forEach((video) => {
    video.pause();
    video.currentTime = 0;
  });

  if (hasVideo(slide)) {
    const video = slide.querySelector('video');

    if (video && typeof video.play === 'function') {
      slide.classList.add('video-loading');

      video
        .play()
        .then(() => {
          console.log('Video is playing');
          slide.classList.remove('video-loading');
          slide.classList.add('video-playing');
        })
        .catch((error) => {
          console.warn('Video playback error:', error.message);
          slide.classList.remove('video-loading');

          if (error.name === 'NotAllowedError') {
            console.warn('Autoplay prevented by browser. User interaction required.');
          }
        });

      video.onended = () => {
        slide.classList.remove('video-playing');
      };
    }
  }
}

function checkDesktopSlidesForImages() {
  const desktopSwiperElement = document.querySelector('.hero-swiper-desktop');

  if (!desktopSwiperElement) {
    console.log('Desktop swiper element not found');
    return;
  }

  const slides = desktopSwiperElement.querySelectorAll('.swiper-slide');

  slides.forEach((slide, index) => {
    const hasImage = slide.querySelector('img') !== null;

    if (!hasImage) {
      slide.classList.add('no-image');
      console.log(`Slide ${index} has no image, added 'no-image' class`);
    } else {
      // Опціонально можна додати клас для слайдів З зображенням
      slide.classList.add('has-image');
      console.log(`Slide ${index} has image, added 'has-image' class`);
    }
  });
}

// Функція ініціалізації свайперів
function initSwipers() {
  const isDesktop = window.innerWidth > 1024;

  // Основний свайпер (.hero-swiper) - завжди ініціалізується
  if (!swiper) {
    swiper = new Swiper('.hero-swiper', {
      loop: false,
      grabCursor: true,
      slidesPerView: 1,
      speed: 1100,
      spaceBetween: 0,

      breakpoints: {
        360: {
          direction: 'horizontal',
          speed: 1200,
          effect: 'slide',

          touchRatio: 0.9, // Менша чутливість

          // Опір для кращого контролю
          resistance: true,
          resistanceRatio: 0.25,

          // Додаткові налаштування
          followFinger: true,
          centeredSlides: true,
          watchSlidesProgress: true,
        },
        1024: {
          direction: 'vertical',
          effect: 'creative',
          creativeEffect: {
            prev: {
              shadow: true,
              translate: [0, '-100%', -20],
            },
            next: {
              shadow: true,
              translate: [0, '100%', -30],
            },
          },
        },
      },
      on: {
        init: function () {
          setTimeout(() => {
            handleVideoPlayback(this.slides[this.activeIndex]);
            updateCustomPagination(this.realIndex);
          }, 100);
        },
        slideChange: function () {
          updateCustomPagination(this.realIndex);

          // Синхронізація тільки якщо це НЕ клік пагінації
          if (!isPaginationClick && swiperDesktop && swiperDesktop.realIndex !== this.realIndex) {
            swiperDesktop.slideTo(this.realIndex, 0, false); // Без анімації для синхронізації
          }
        },
        slideChangeTransitionEnd: function () {
          handleVideoPlayback(this.slides[this.activeIndex]);
          // Скидаємо флаг після завершення анімації
          isPaginationClick = false;
        },
        touchEnd: function () {
          setTimeout(() => {
            handleVideoPlayback(this.slides[this.activeIndex]);
          }, 100);
        },
      },
    });
  }

  // Десктопний свайпер (.hero-swiper-desktop) - тільки на десктопі
  if (isDesktop && !swiperDesktop) {
    swiperDesktop = new Swiper('.hero-swiper-desktop', {
      loop: false,
      grabCursor: false, // Вимикаємо grab cursor
      slidesPerView: 1,
      speed: 1100,
      allowTouchMove: false, // Вимикаємо touch/swipe
      simulateTouch: false, // Вимикаємо симуляцію дотиків
      touchRatio: 0, // Вимикаємо чутливість до дотиків
      touchAngle: 90, // Мінімізуємо кути для дотиків
      shortSwipes: false, // Вимикаємо короткі свайпи
      longSwipes: false, // Вимикаємо довгі свайпи
      followFinger: false,
      direction: 'horizontal',
      on: {
        init: function () {
          // Перевіряємо слайди після ініціалізації
          setTimeout(() => {
            checkDesktopSlidesForImages();
          }, 100);
        },
        slideChange: function () {
          if (!isPaginationClick && swiper && swiper.realIndex !== this.realIndex) {
            swiper.slideTo(this.realIndex, 0, false); // Без анімації для синхронізації
          }
        },
      },
    });
  }

  // Знищуємо десктопний свайпер на мобільних
  if (!isDesktop && swiperDesktop) {
    swiperDesktop.destroy(true, true);
    swiperDesktop = null;
  }
}

// Обробка зміни розміру екрану
let resizeTimeout;
function handleResize() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    const currentIndex = swiper?.realIndex || 0;
    initSwipers();

    // Синхронізуємо позицію після re-init БЕЗ анімації
    setTimeout(() => {
      if (swiper && currentIndex > 0) {
        swiper.slideTo(currentIndex, 0, false);
      }
      if (swiperDesktop && currentIndex > 0) {
        swiperDesktop.slideTo(currentIndex, 0, false);
      }
    }, 100);
  }, 250);
}

// Ініціалізація при завантаженні
initSwipers();

// Handle pagination clicks - З ПОВНОЮ АНІМАЦІЄЮ!
paginationButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const index = parseInt(button.dataset.index, 10);

    // Встановлюємо флаг що це клік пагінації
    isPaginationClick = true;

    // Переходимо з анімацією на основному свайпері
    if (swiper) {
      swiper.slideTo(index); // З повною анімацією!
    }

    // Синхронізуємо десктопний БЕЗ анімації (щоб не дублювати ефект)
    if (swiperDesktop) {
      swiperDesktop.slideTo(index, 0, false);
    }
  });
});

// Resize listener
window.addEventListener('resize', handleResize);

// Video observer
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target.querySelector('video');
        if (video) {
          if (entry.isIntersecting) {
            if (swiper && swiper.slides[swiper.activeIndex] === entry.target) {
              video.play().catch((e) => console.warn('Visibility observer video play error:', e));
            }
          } else {
            video.pause();
          }
        }
      });
    },
    { threshold: 0.5 },
  );

  setTimeout(() => {
    if (swiper) {
      swiper.slides.forEach((slide) => {
        if (hasVideo(slide)) {
          observer.observe(slide);
        }
      });
    }
  }, 500);
}

// Video error handlers
document.querySelectorAll('.swiper-slide video').forEach((video) => {
  video.addEventListener('error', (e) => {
    console.error('Video error:', e);
    const slide = video.closest('.swiper-slide');
    if (slide) {
      slide.classList.remove('video-loading');
      slide.classList.add('video-error');
    }
  });
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (swiperDesktop) swiperDesktop.destroy(true, true);
  if (swiper) swiper.destroy(true, true);
});
