import { gsap, ScrollTrigger } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger);

const footer = document.querySelector('footer');

const initFooter = () => {
  const scrollToTopBtn = document.querySelector('.footer-sales-list-item-arrow');
  const rootElement = document.documentElement;
  function scrollToTop() {
    rootElement.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
  scrollToTopBtn.addEventListener('click', scrollToTop);
};

if (footer) {
  initFooter();
}
