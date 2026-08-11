import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import lenis from '../lenisScroll';
import { lockDocument, unlockDocument } from '../lenis-stop-handlers';
import { contactForm } from '../contactForm';
import { contactPopup } from '../contactPopup';
import { contactFormFooter } from '../contactFormFooter';
import './headerAnimation';
import { modalMobile } from '../modal-mobile';

const headerRef = document.querySelector('.header');
const headerInnerRef = document.querySelector('.header-inner');
const popupRef = document.querySelector('.form-popup');

let lastScrollTop = 0;

if (popupRef && popupRef.classList.contains('active')) {
  console.log('Popup is active');
}

window.addEventListener('scroll', () => {
  scrollFunction();
});

function scrollFunction() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;

  if (scrollTop === 0) {
    headerRef.classList.remove('with-bg');
  } else {
    headerRef.classList.add('with-bg');
  }
}

const contactFormsRef = document.querySelectorAll('[data-form="contact"]');
contactFormsRef.forEach((el) => {
  contactForm(el);
});

const closeButtonsRef = document.querySelectorAll('[data-form-popup-close]');

closeButtonsRef.forEach((btn) => {
  btn.addEventListener('click', () => {
    if (contactPopup && typeof contactPopup.close === 'function') {
      contactPopup.close();
    }

    // The same overlay is also raised by the footer form to show its success
    // card, so release that key too — the button closes the overlay either way.
    unlockDocument('form-popup');
    unlockDocument('form-success');
  });
});

const contactFormRef = document.querySelectorAll('[data-form-contact]');
contactFormRef.forEach((el) => {
  contactFormFooter(el);
});

const requestMobilePopupRef = document.querySelectorAll('[data-open-mobile]');
requestMobilePopupRef.forEach((el) => {
  el.addEventListener('click', () => {
    modalMobile.open();
    lockDocument('mobile-modal');
  });
});

const openMenuBtnRef = document.querySelector('[data-header-menu-open]');
const menuIconOpen = openMenuBtnRef?.querySelector('svg:first-of-type');

const menuIconClose = openMenuBtnRef?.querySelector('svg:last-of-type');
if (menuIconClose) menuIconClose.style.display = 'none';

const headerMenuRef = document.querySelector('.header-menu');
const menuToggleRef = document.querySelector('.header-right-item--menu');
const menuNavWrapperRef = document.querySelector('.header-menu-nav-wrapper');
const menuImgWrapRef = document.querySelector('.menu-img-wrap');
const menuOrnamentRef = document.querySelector('.header-menu-ornament-wrap');
const menuItemsRef = gsap.utils.toArray('.header-menu-item');
const menuLinksRef = gsap.utils.toArray('.header-menu-link');

let menuTL = null;
let isMenuOpen = false;

const setMenuInitialState = () => {
  if (!headerMenuRef) return;

  gsap.set(headerMenuRef, { opacity: 0, clipPath: 'inset(0 0 100% 0)' });

  if (menuNavWrapperRef) {
    gsap.set(menuNavWrapperRef, { opacity: 0, y: 18 });
  }

  if (menuItemsRef.length) {
    gsap.set(menuItemsRef, { opacity: 0, y: 26, filter: 'blur(6px)' });
  }

  if (menuLinksRef.length) {
    gsap.set(menuLinksRef, { x: -18 });
  }

  if (menuImgWrapRef) {
    gsap.set(menuImgWrapRef, { opacity: 0, y: 28, scale: 1.03 });
  }

  if (menuOrnamentRef) {
    gsap.set(menuOrnamentRef, { opacity: 0, y: 14, scale: 0.94, rotation: -5 });
  }
};

setMenuInitialState();

const openMenu = () => {
  if (menuTL && menuTL.isActive()) return;
  if (isMenuOpen) return;

  isMenuOpen = true;

  headerMenuRef.classList.add('active');
  headerRef.classList.add('bg', 'on');
  headerInnerRef?.classList.add('active');
  headerRef.classList.remove('header-hidden');

  menuIconOpen.style.display = 'none';
  menuIconClose.style.display = 'block';
  openMenuBtnRef.setAttribute('data-header-menu-close', '');
  openMenuBtnRef.removeAttribute('data-header-menu-open');

  lockDocument('menu');

  setMenuInitialState();

  menuTL = gsap.timeline({
    defaults: {
      ease: 'power3.out',
    },
  });

  menuTL.to(headerMenuRef, {
    opacity: 1,
    clipPath: 'inset(0 0 0% 0)',
    duration: 0.78,
    ease: 'expo.out',
  });
  if (menuNavWrapperRef) {
    menuTL.to(
      menuNavWrapperRef,
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
      },
      0.14,
    );
  }

  if (menuItemsRef.length) {
    menuTL.to(
      menuItemsRef,
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.56,
        stagger: 0.06,
      },
      0.2,
    );
  }

  if (menuLinksRef.length) {
    menuTL.to(
      menuLinksRef,
      {
        x: 0,
        duration: 0.5,
        stagger: 0.05,
      },
      0.24,
    );
  }

  if (menuImgWrapRef) {
    menuTL.to(
      menuImgWrapRef,
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.68,
        ease: 'power4.out',
      },
      0.28,
    );
  }

  if (menuOrnamentRef) {
    menuTL.to(
      menuOrnamentRef,
      {
        opacity: 1,
        y: 0,
        scale: 1,
        rotation: 0,
        duration: 0.72,
      },
      0.24,
    );
  }

  const menuCloseBtn = document.querySelector('.header-menu-close');
  if (menuCloseBtn) {
    menuTL.to(
      '.header-menu-close',
      {
        scale: 1,
        opacity: 1,
        duration: 0.3,
        ease: 'back.out',
      },
      0,
    );
  }
};

const closeMenu = (onCompleteCallback = null) => {
  if (menuTL && menuTL.isActive()) return;
  if (!isMenuOpen) return;

  isMenuOpen = false;

  menuTL = gsap.timeline({
    defaults: {
      ease: 'power2.inOut',
    },
  });

  if (menuItemsRef.length) {
    menuTL.to(
      menuItemsRef,
      {
        opacity: 0,
        y: 16,
        filter: 'blur(4px)',
        duration: 0.24,
        stagger: {
          each: 0.03,
          from: 'end',
        },
      },
      0,
    );
  }

  if (menuLinksRef.length) {
    menuTL.to(
      menuLinksRef,
      {
        x: -10,
        duration: 0.22,
        stagger: {
          each: 0.02,
          from: 'end',
        },
      },
      0,
    );
  }

  menuTL.to(
    ['.header-menu-close', menuImgWrapRef, menuOrnamentRef].filter(Boolean),
    {
      opacity: 0,
      y: 14,
      scale: (index, target) =>
        target.classList && target.classList.contains('header-menu-close') ? 0.85 : 0.98,
      duration: 0.24,
      ease: 'power2.in',
    },
    0.02,
  );

  if (menuNavWrapperRef) {
    menuTL.to(
      menuNavWrapperRef,
      {
        opacity: 0,
        y: 14,
        duration: 0.26,
      },
      0.04,
    );
  }

  menuTL.to(
    headerMenuRef,
    {
      opacity: 0,
      clipPath: 'inset(0 0 100% 0)',
      duration: 0.42,
      ease: 'expo.inOut',
    },
    0.16,
  );

  menuTL.add(() => {
    headerMenuRef.classList.remove('active');
    headerRef.classList.remove('bg', 'on');
    headerInnerRef?.classList.remove('active');
    setMenuInitialState();

    // Released only once the menu is actually gone. If another overlay (the form
    // popup) still holds the lock, the page stays locked.
    unlockDocument('menu');
  });

  if (onCompleteCallback) {
    menuTL.eventCallback('onComplete', onCompleteCallback);
  }

  menuIconOpen.style.display = 'block';
  menuIconClose.style.display = 'none';
  openMenuBtnRef.setAttribute('data-header-menu-open', '');
  openMenuBtnRef.removeAttribute('data-header-menu-close');
};

// The triggers live in three places: the desktop header, the mobile call modal
// and the burger menu. In the latter two the page is already locked, so the
// popup's own key is taken first and only then are the others released — that
// way the page is never unlocked between the two overlays.
const requestFormRef = document.querySelectorAll('[data-open-form]');
requestFormRef.forEach((el) => {
  el.addEventListener('click', () => {
    lockDocument('form-popup');

    contactPopup.open();
    headerRef.classList.add('bg', 'header-hidden');

    modalMobile.close();
    unlockDocument('mobile-modal');
    closeMenu();
  });
});

const handleMenuLinkClick = (e) => {
  e.preventDefault();

  const href = e.currentTarget.getAttribute('href');

  if (!href || href === '#' || href === '') {
    closeMenu();
    return;
  }

  if (!href.startsWith('#')) {
    closeMenu(() => {
      window.location.href = href;
    });
    return;
  }

  const targetElement = document.querySelector(href);

  if (!targetElement) {
    closeMenu();
    console.warn(`Element with id "${href.substring(1)}" not found`);
    return;
  }

  closeMenu(() => {
    if (lenis && typeof lenis.scrollTo === 'function') {
      lenis.scrollTo(targetElement, {
        duration: 1.5,
        easing: (t) => 1 - Math.pow(1 - t, 3),
      });
    } else {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  });
};

menuToggleRef.addEventListener('click', () => {
  if (isMenuOpen) {
    closeMenu();
  } else {
    openMenu();
  }
});

document.querySelectorAll('.header-menu-link').forEach((link) => {
  link.addEventListener('click', handleMenuLinkClick);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && isMenuOpen) {
    closeMenu();
  }
});
