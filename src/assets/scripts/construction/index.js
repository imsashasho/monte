import '../homepage/popupConstruction';
import '../common/animation/scaleImages';
import { paginationInit } from '../common/pagination/pagination';

document.addEventListener('DOMContentLoaded', () => {
  paginationInit('.construction-page-list ', '.construction-page-list-item');
});
