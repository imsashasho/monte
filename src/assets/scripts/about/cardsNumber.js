// Select all the cards and the number container
const cards = document.querySelectorAll('.values-list-card');
const currentNumber = document.querySelector('.values-list-numbers-current .text-28.text-pantone2');

// Create an intersection observer
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Get the index of the currently visible card
        const index = Array.from(cards).indexOf(entry.target) + 1;

        // Update the current number
        currentNumber.textContent = `0${index}`; // Format as "01", "02", etc.
      }
    });
  },
  {
    threshold: 0.5, // Adjust the threshold to trigger when the card is 50% visible
  },
);

// Observe each card
cards.forEach((card) => observer.observe(card));
