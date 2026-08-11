import '../common/animation/scaleImages';

import { paginationInit } from '../common/pagination/pagination';

document.addEventListener('DOMContentLoaded', () => {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.news-page-list-item');

  const newsCount = Array.from(cards).filter((card) => card.dataset.category === 'news').length;
  const promoCount = Array.from(cards).filter(
    (card) => card.dataset.category === 'promotions',
  ).length;

  document.querySelector('[data-count="news"]').textContent = `Новини (${newsCount})`;
  document.querySelector('[data-count="promotions"]').textContent = `Акції (${promoCount})`;

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelector('.filter-btn.is-active')?.classList.remove('is-active');
      button.classList.add('is-active');

      const filterValue = button.dataset.filter;

      cards.forEach((card) => {
        if (filterValue === 'all' || card.dataset.category === filterValue) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  paginationInit('.news-page-list ', '.news-page-list-item');
});
