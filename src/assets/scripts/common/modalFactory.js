export const modalFactory = ref => ({
  element: typeof ref === 'string' ? document.querySelector(ref) : ref,
  open() {
    this.element.classList.add('active');
  },
  close() {
    this.element.classList.remove('active');
  },
  toggle() {
    this.element.classList.toggle('active');
  },
});
