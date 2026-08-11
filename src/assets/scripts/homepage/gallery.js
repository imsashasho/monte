import Swiper from 'swiper';
import { Navigation, Manipulation } from 'swiper/modules';

Swiper.use([Navigation, Manipulation]);

const pxToVw = (px, screen) => (px / screen) * window.innerWidth;

const initGallery = () => {
  const section = document.querySelector('.gallery');
  const swiperElement = section?.querySelector('[data-gallery-swiper]');

  if (!section || !swiperElement) return;

  const tabs = [...section.querySelectorAll('[data-gallery-tab]')];
  const dataNode = section.querySelector('[data-gallery-data]');
  let galleryData = {};

  if (dataNode) {
    try {
      galleryData = JSON.parse(dataNode.textContent || '{}') || {};
    } catch (error) {
      galleryData = {};
    }
  }

  // Backend may send either a plain URL string or an object per image.
  const getImageSrc = (image) => {
    if (typeof image === 'string') return image;
    if (image && typeof image === 'object') {
      return image.url || image.src || image.path || '';
    }
    return '';
  };

  // Keys from the CMS are not guaranteed to match the tab keys, so fall back
  // to the position of the tab inside the data object.
  const dataKeys = Object.keys(galleryData);

  const getImages = (key, index) => {
    const byKey = galleryData[key];
    if (Array.isArray(byKey)) return byKey;

    const fallbackKey = dataKeys[index];
    const byIndex = fallbackKey ? galleryData[fallbackKey] : null;

    return Array.isArray(byIndex) ? byIndex : [];
  };

  const gallerySlider = new Swiper(swiperElement, {
    slidesPerView: 1,
    spaceBetween: 0,
    speed: 600,
    navigation: {
      nextEl: section.querySelector('[data-gallery-next]'),
      prevEl: section.querySelector('[data-gallery-prev]'),
    },
    breakpoints: {
      360: {
        slidesPerView: 1,
        spaceBetween: pxToVw(12, 375),
      },
      768: {
        slidesPerView: 1,
        spaceBetween: pxToVw(16, 768),
      },
      1024: {
        slidesPerView: 1,
        spaceBetween: 0,
      },
    },
  });

  const createSlide = (image) => {
    const src = getImageSrc(image);
    if (!src) return null;

    const slide = document.createElement('div');
    slide.className = 'swiper-slide gallery-swiper__slide';

    const img = document.createElement('img');
    img.className = 'gallery-swiper__image';
    img.src = src;
    img.alt = 'MONTE gallery image';
    img.loading = 'lazy';

    slide.append(img);

    return slide;
  };

  const buildSlides = (key, index) => {
    // Swiper's appendSlide only takes the first node out of an HTML string,
    // so slides have to be passed as an array of elements.
    const slides = getImages(key, index).map(createSlide).filter(Boolean);

    gallerySlider.removeAllSlides();

    if (slides.length) {
      gallerySlider.appendSlide(slides);
      gallerySlider.slideTo(0, 0);
    }

    gallerySlider.update();
  };

  const activateTab = (tab, index) => {
    tabs.forEach((item) => {
      item.classList.remove('is-active');
      item.setAttribute('aria-selected', 'false');
    });

    tab.classList.add('is-active');
    tab.setAttribute('aria-selected', 'true');

    buildSlides(tab.getAttribute('data-gallery-tab'), index);
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateTab(tab, index));
  });

  // Markup renders the first category by default while another tab can be
  // marked active, so sync the slider with the active tab on load.
  if (dataKeys.length) {
    const activeIndex = Math.max(
      tabs.findIndex((tab) => tab.classList.contains('is-active')),
      0,
    );
    const activeTab = tabs[activeIndex];

    if (activeTab) activateTab(activeTab, activeIndex);
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGallery);
} else {
  initGallery();
}
