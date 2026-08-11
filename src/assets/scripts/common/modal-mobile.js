import { modalFactory } from './modalFactory';
import { unlockDocument } from './lenis-stop-handlers';

export const modalMobile = modalFactory(document.querySelector('[data-modal-mobile]'));
const closeBtnRef = document.querySelector('[data-close-mobile]');

if (closeBtnRef) {
  closeBtnRef.addEventListener('click', () => {
    modalMobile.close();
    unlockDocument('mobile-modal');
  });
}