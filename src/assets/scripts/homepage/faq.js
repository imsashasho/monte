const faqRoot = document.querySelector('[data-faq]');

if (faqRoot) {
  const items = [...faqRoot.querySelectorAll('.faq-item')];

  const closeItem = (item) => {
    const trigger = item.querySelector('.faq-item__trigger');
    const content = item.querySelector('.faq-item__content');

    item.classList.remove('is-open');
    trigger?.setAttribute('aria-expanded', 'false');

    if (content) {
      content.style.maxHeight = '0px';
    }
  };

  const openItem = (item) => {
    const trigger = item.querySelector('.faq-item__trigger');
    const content = item.querySelector('.faq-item__content');

    item.classList.add('is-open');
    trigger?.setAttribute('aria-expanded', 'true');

    if (content) {
      content.style.maxHeight = `${content.scrollHeight}px`;
    }
  };

  items.forEach((item) => {
    const trigger = item.querySelector('.faq-item__trigger');
    if (!trigger) {
      return;
    }

    const isOpenByDefault = item.classList.contains('is-open');
    if (isOpenByDefault) {
      openItem(item);
    } else {
      closeItem(item);
    }

    trigger.addEventListener('click', () => {
      const alreadyOpen = item.classList.contains('is-open');

      items.forEach((otherItem) => {
        if (otherItem !== item) {
          closeItem(otherItem);
        }
      });

      if (alreadyOpen) {
        closeItem(item);
      } else {
        openItem(item);
      }
    });
  });

  window.addEventListener('resize', () => {
    items.forEach((item) => {
      if (item.classList.contains('is-open')) {
        const content = item.querySelector('.faq-item__content');
        if (content) {
          content.style.maxHeight = `${content.scrollHeight}px`;
        }
      }
    });
  });
}
