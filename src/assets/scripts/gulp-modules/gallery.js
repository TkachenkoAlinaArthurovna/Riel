import Swiper, { Navigation, Controller, Pagination } from 'swiper';
Swiper.use([Navigation, Pagination, Controller]);

document.addEventListener('DOMContentLoaded', function() {
  const swiperGallery = document.querySelector('.section_gallery .swiper');

  new Swiper(swiperGallery, {
    loop: false,
    slidesPerView: 1,
    spaceBetween: 20,
    speed: 600,
    navigation: {
      nextEl: '.section_gallery__arrow_right',
      prevEl: '.section_gallery__arrow_left',
    },
    breakpoints: {
      1024: {
        spaceBetween: 20,
      },
      768: {
        spaceBetween: 16,
      },
      0: {
        spaceBetween: 8,
      },
    },
  });
});
