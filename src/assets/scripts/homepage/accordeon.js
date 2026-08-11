document.addEventListener('DOMContentLoaded', () => {
  const faqItems = document.querySelectorAll('.faq-item');

  if (faqItems) {
    faqItems.forEach((item) => {
      const header = item.querySelector('.faq-item-header');
      header.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        faqItems.forEach((i) => i.classList.remove('active'));

        if (!isActive) {
          item.classList.add('active');
        }
      });
    });
  }
});
