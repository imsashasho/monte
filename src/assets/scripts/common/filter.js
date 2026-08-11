import { gsap, ScrollTrigger } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger);

export const filterCards = (button, card) => {
  const buttons = document.querySelectorAll(button);
  const cards = document.querySelectorAll(card);
  let activeButton = null;

  buttons.forEach(button => {
    button.addEventListener('click', event => {
      const targetButton = event.currentTarget;
      ScrollTrigger.update();
      ScrollTrigger.refresh();

      if (activeButton === targetButton) {
        // If the button was already active, deactivate it and show all cards
        activeButton = null;
        targetButton.classList.remove('active');
        cards.forEach(card => {
          card.style.display = 'block';
        });
      } else {
        // If the button was not active, activate it and filter the cards
        if (activeButton) {
          activeButton.classList.remove('active');
        }
        activeButton = targetButton;
        targetButton.classList.add('active');

        const filterValue = targetButton.getAttribute('data-filter');
        cards.forEach(card => {
          if (card.getAttribute('data-filter') === filterValue) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      }

      console.log('Updating ScrollTrigger');
      ScrollTrigger.update();
      ScrollTrigger.refresh();
    });
  });
};
