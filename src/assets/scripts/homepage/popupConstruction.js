import Swiper from 'swiper';
import { Navigation, Controller } from 'swiper/modules';
import { getConstructionById } from './getItemById';
import { constructionView } from './sliderViev';
import { lockDocument, unlockDocument } from '../common/lenis-stop-handlers';

Swiper.use([Navigation, Controller]);

const tabsListRef = document.querySelector('.construction-cards-list');
const slidersContainerRef = document.querySelector('.popup-construction-swiper');
const popupRef = document.querySelector('.popup-construction');
const closeBtnRef = document.querySelector('.popup-construction-close');

let gallerySwiper = null;

closeBtnRef.addEventListener('click', () => {
  popupRef.classList.remove('active');
  slidersContainerRef.innerHTML = '';
  unlockDocument('construction-popup');

  if (gallerySwiper) {
    gallerySwiper.destroy(true, true);
    gallerySwiper = null;
  }
});

const updateSlideNumbers = (swiper) => {
  const currentNumberEl = document.querySelector('.popup-construction-swiper-current-number');
  const totalNumberEl = document.querySelector('.popup-construction-swiper-total-number');
  const sliderNumberEl = document.querySelector('.popup-construction-swiper-number-wrapper');
  if (currentNumberEl && totalNumberEl) {
    const currentSlide = swiper.realIndex + 1;
    const realSlides = Array.from(swiper.slides || []).filter(
      (slide) => !slide.classList.contains('swiper-slide-duplicate'),
    );
    const totalSlides = realSlides.length;
    if (totalSlides <= 1) {
      sliderNumberEl.style.display = 'none';
    } else {
      sliderNumberEl.style.display = 'flex';
      currentNumberEl.textContent = String(currentSlide).padStart(2, '0');
      totalNumberEl.textContent = String(totalSlides).padStart(2, '0');
    }
  }
};

const handleOpenConstructionGallery = async (event) => {
  const { target } = event;
  console.log(target);

  const tabRef = target.closest('.construction-cards-item');
  if (!tabRef) return;

  document.querySelectorAll('.construction-cards-item').forEach((btn) => {
    btn.classList.remove('active');
  });

  tabRef.classList.add('active');

  const id = +tabRef.dataset.id;
  try {
    const { data } = await getConstructionById(id);

    popupRef.classList.add('active');

    lockDocument('construction-popup');

    const isDev =
      window.location.href.match('localhost') ||
      window.location.href.match('https://soul-park-verstka.smartorange.com.ua/');

    const prepareGalleryData = isDev ? data.data.gallery : data.data.gallery;
    const prepareIframeData = isDev ? data.data.iframe : data.data.iframe;

    const galleryData = prepareGalleryData;

    slidersContainerRef.innerHTML = '';

    if (gallerySwiper) {
      gallerySwiper.destroy(true, true);
      gallerySwiper = null;
    }

    // Якщо є iframe
    if (prepareIframeData) {
      slidersContainerRef.innerHTML = `
        <div class="swiper-wrapper">
          <div class="swiper-slide popup-construction-homepage-slide">
            <div class="iframe-wrapper">
              <iframe src="${prepareIframeData}" frameborder="0" allow="autoplay; fullscreen; vr" allowfullscreen></iframe>
            </div>
          </div>
        </div>`;

      setTimeout(() => {
        gallerySwiper = new Swiper('.popup-construction-swiper', {
          slidesPerView: 1,
          speed: 1500,
          loop: false,
          navigation: {
            nextEl: '.popup-construction-swiper-button--next',
            prevEl: '.popup-construction-swiper-button--prev',
          },
          on: {
            init: function () {
              updateSlideNumbers(this);
            },
            slideChange: function () {
              updateSlideNumbers(this);
            },
          },
        });
      }, 100);

      return;
    }

    // Якщо є галерея зображень
    if (galleryData && galleryData.length !== 0) {
      const galleryHTML = constructionView(galleryData);
      slidersContainerRef.insertAdjacentHTML('beforeend', galleryHTML);

      setTimeout(() => {
        gallerySwiper = new Swiper('.popup-construction-swiper', {
          slidesPerView: 1,
          speed: 1500,
          loop: false,
          navigation: {
            nextEl: '.popup-construction-swiper-button--next',
            prevEl: '.popup-construction-swiper-button--prev',
          },
          breakpoints: {
            360: {
              slidesPerView: 1,
            },
          },
          on: {
            init: function () {
              updateSlideNumbers(this);
            },
            slideChange: function () {
              updateSlideNumbers(this);
            },
          },
        });
      }, 100);
    }
  } catch (error) {
    console.warn(error);
  }
};

// tabsListRef.addEventListener('click', handleOpenConstructionGallery);
