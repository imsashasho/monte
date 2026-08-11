export const galleryView = (gallery) => {
  console.log(gallery);
  const slides = gallery
    .map(
      (image) => `
        <div class="swiper-slide gallery-homepage-slide">
            <img src="${image}" alt="Gallery Image">
        </div>
    `,
    )
    .join('');

  return `
    
        <div class="swiper-wrapper gallery-slider-wrapper">
            ${slides}
        </div>
       
    `;
};

export const constructionView = (gallery) => {
  console.log(gallery);
  const slides = gallery
    .map(
      (image) => `
        <div class="swiper-slide popup-construction-homepage-slide">
            <img src="${image}" alt="Gallery Image">
        </div>
    `,
    )
    .join('');

  return `
    
        <div class="swiper-wrapper popup-construction-slider-wrapper">
            ${slides}
        </div>
       
    `;
};
