import Swiper, { Navigation, Controller, Pagination } from 'swiper';
Swiper.use([Navigation, Pagination, Controller]);

document.addEventListener('DOMContentLoaded', function() {
  const swiperHotDeals = document.querySelector('#section_hot_deals .swiper');

  new Swiper(swiperHotDeals, {
    loop: false,
    slidesPerView: 'auto',
    spaceBetween: 20,
    speed: 600,
    navigation: {
      nextEl: '#section_hot_deals .swiper_navigation__right',
      prevEl: '#section_hot_deals .swiper_navigation__left',
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

  const swiperKomertsiinaPloshcha = document.querySelector('#section_komertsiina_ploshcha .swiper');

  new Swiper(swiperKomertsiinaPloshcha, {
    loop: false,
    slidesPerView: 'auto',
    spaceBetween: 20,
    speed: 600,
    navigation: {
      nextEl: '#section_komertsiina_ploshcha .swiper_navigation__right',
      prevEl: '#section_komertsiina_ploshcha .swiper_navigation__left',
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

  const swiperParkingKomora = document.querySelector('.parking_komora .swiper');

  new Swiper(swiperParkingKomora, {
    loop: false,
    slidesPerView: 'auto',
    spaceBetween: 20,
    speed: 600,
    navigation: {
      nextEl: '.parking_komora .swiper_navigation__right',
      prevEl: '.parking_komora .swiper_navigation__left',
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
