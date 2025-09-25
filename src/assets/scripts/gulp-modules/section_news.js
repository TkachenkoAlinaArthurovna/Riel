import Swiper, { Navigation, Controller, Pagination } from 'swiper';
Swiper.use([Navigation, Pagination, Controller]);

document.addEventListener('DOMContentLoaded', function() {
  const swiperNews = document.querySelector('.section_news .swiper');

  new Swiper(swiperNews, {
    loop: false,
    slidesPerView: 3,
    spaceBetween: 20,
    speed: 600,
    navigation: {
      nextEl: '.section_news .swiper_navigation__right',
      prevEl: '.section_news .swiper_navigation__left',
    },
    breakpoints: {
      1024: {
        slidesPerView: 3,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 16,
      },
      0: {
        slidesPerView: 'auto',
        spaceBetween: 8,
      },
    },
  });
});
