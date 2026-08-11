import Swiper from 'swiper';
import { EffectCreative, Autoplay } from 'swiper/modules';

Swiper.use([EffectCreative, Autoplay]);

const paginationButtons = Array.from(
  document.querySelectorAll('.features-main-swiper-pagination-item'),
);

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
      }, 200);
    }
  }
}

// Update custom pagination
function updateCustomPagination(index) {
  console.log('Updating pagination for index:', index);
  paginationButtons.forEach((btn) => btn.classList.remove('active'));
  const activeBtn = paginationButtons.find((btn) => Number(btn.dataset.index) === index);

  if (activeBtn) {
    activeBtn.classList.add('active');

    // Scroll pagination into view on mobile with slight delay
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
  // First pause all videos to ensure only one plays at a time
  document.querySelectorAll('.swiper-slide video').forEach((video) => {
    video.pause();
    video.currentTime = 0;
  });

  // If current slide has video, play it
  if (hasVideo(slide)) {
    const video = slide.querySelector('video');

    // Check if video element exists and is valid
    if (video && typeof video.play === 'function') {
      // Add loading class if needed
      slide.classList.add('video-loading');

      // Try to play the video with proper error handling
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

          // Handle autoplay restrictions
          if (error.name === 'NotAllowedError') {
            console.warn('Autoplay prevented by browser. User interaction required.');
            // You could add a play button overlay here if needed
          }
        });

      // Set up ended event to handle loop or next slide
      video.onended = () => {
        slide.classList.remove('video-playing');
        // Optionally advance to next slide when video ends
        // swiper.slideNext();
      };
    }
  }
}

let isTransitioning = false;

const swiper = new Swiper('.features-main-swiper', {
  loop: false,
  grabCursor: true,
  slidesPerView: 1,
  direction: 'vertical',

  preventInteractionOnTransition: true,
  touchReleaseOnEdges: true,

  breakpoints: {
    360: {
      direction: 'horizontal',
      speed: 600,
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
      speed: 1100,
    },
  },

  on: {
    init: function () {
      updateCustomPagination(this.realIndex);
      setTimeout(() => {
        handleVideoPlayback(this.slides[this.activeIndex]);
      }, 150);
    },

    slideChangeTransitionStart: function () {
      isTransitioning = true;
      console.log('Starting transition to slide:', this.activeIndex);
      updateCustomPagination(this.realIndex);
    },

    slideChangeTransitionEnd: function () {
      isTransitioning = false;
      console.log('Transition complete - on slide:', this.activeIndex);

      handleVideoPlayback(this.slides[this.activeIndex]);
    },

    touchEnd: function () {
      if (!isTransitioning) {
        setTimeout(() => {
          console.log('Touch end - current slide:', this.activeIndex);
          updateCustomPagination(this.realIndex);
          handleVideoPlayback(this.slides[this.activeIndex]);
        }, 50);
      }
    },
  },
});

// Handle pagination clicks
paginationButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const index = parseInt(button.dataset.index, 10);
    swiper.slideTo(index);
  });
});

// Handle resize to update pagination scroll behavior
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    // Update pagination visibility after resize
    const activeBtn = paginationButtons.find((btn) => btn.classList.contains('active'));
    if (activeBtn) {
      scrollPaginationIntoView(activeBtn);
    }
  }, 250);
});

// Add observer to handle video visibility changes (useful for tab switching, etc)
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target.querySelector('video');
        if (video) {
          if (entry.isIntersecting) {
            // Only play if this is the active slide
            if (swiper.slides[swiper.activeIndex] === entry.target) {
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

  // Observe all slides
  swiper.slides.forEach((slide) => {
    if (hasVideo(slide)) {
      observer.observe(slide);
    }
  });
}

// Optional: Setup event listeners for all videos to handle errors better
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
