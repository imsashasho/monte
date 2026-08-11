import { modalFactory } from './modalFactory';

export const contactPopup = modalFactory(document.querySelector('[data-form-popup]'));
const closeBtnRef = document.querySelector('[data-form-popup-close]');
const closeAllBtnRef = document.querySelector('[data-form-popup-close]');

if (closeBtnRef) {
  closeBtnRef.addEventListener('click', () => {
    contactPopup.close();
  });
}

if (closeBtnRef) {
  closeAllBtnRef.addEventListener('click', () => {
    contactPopup.close();
  });
}
