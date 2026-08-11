import { gsap } from 'gsap/all';

export function animateHeaderSVG() {
  const paths = Array.from(document.querySelectorAll('.header-deco-wrap path'));
  const menuLinks = Array.from(document.querySelectorAll('.header-menu-nav-item'));

  // Ensure links are hidden initially
  menuLinks.forEach(link => {
    gsap.set(link, { opacity: 0, y: 100 }); // Start with a small offset for animation
  });

  // Shuffle paths array to get a random order
  paths.sort(() => Math.random() - 0.5);

  const tl = gsap.timeline({
    paused: true, // Pause the timeline initially
  });

  // Animate menu links after paths animation is complete
  tl.fromTo(
    menuLinks,
    { opacity: 0, y: 100 },
    {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'sine.inOut',
      stagger: {
        amount: 1,
        each: 0.2,
      },
    },
  );

  // Play the animation when the menu opens
  const openMenu = () => {
    tl.play();
  };

  // Reverse the animation when the menu closes, or simply remove classes
  const closeMenu = () => {
    tl.reverse();
  };

  const toggleBtnRef = document.querySelector('.header-burger');
  toggleBtnRef.addEventListener('click', () => {
    if (toggleBtnRef.classList.contains('on')) {
      closeMenu();
    } else {
      openMenu();
    }
  });
}
