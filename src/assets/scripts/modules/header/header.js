import { gsap, ScrollTrigger, CustomEase } from 'gsap/all';
import device from 'current-device';
if (device.iphone()) {
  document.querySelector('html').style.overscrollBehavior = 'none';
}

const loader = document.querySelector('.loader-wrap');
const percentSpan = document.querySelector('.loader_center__percent span:first-child');
const video0 = document.getElementById('video0');

document.addEventListener('DOMContentLoaded', () => {
  //   if (document.querySelector('.page-template-home')) {
  //     // if (!sessionStorage.getItem('loaderShown')) {
  //     // sessionStorage.setItem('loaderShown', 'true');
  //     window.onload = function() {
  //       let duration = 3000;
  //       let start = null;

  //       function animate(timestamp) {
  //         if (!start) start = timestamp;
  //         let progress = timestamp - start;
  //         let rawPercent = (progress / duration) * 100;
  //         let percent = Math.min(Math.floor(rawPercent / 4) * 4, 100);

  //         percentSpan.textContent = percent;

  //         if (progress < duration) {
  //           requestAnimationFrame(animate);
  //         } else {
  //           percentSpan.textContent = '100';

  //           gsap
  //             .timeline({ defaults: { force3D: true } })
  //             .to(loader, {
  //               y: -window.innerHeight,
  //               duration: 1,
  //               ease: 'power2.out',
  //             })
  //             .fromTo(
  //               video0,
  //               {
  //                 scale: 1.2,
  //                 opacity: 0,
  //               },
  //               {
  //                 scale: 1,
  //                 opacity: 1,
  //                 duration: 1,
  //                 ease: 'power2.out',
  //               },
  //               '<',
  //             )
  //             .to(loader, {
  //               display: 'none',
  //             });
  //         }
  //       }

  //       requestAnimationFrame(animate);
  //     };
  //     // } else {
  //     //   // Якщо лоадер вже показували — просто ховаємо його
  //     //   document.querySelector('.loader-wrap').style.display = 'none';
  //     // }
  //   }

  //BURGER
  const burger = document.querySelector('.header__burger_menu');
  const header = document.querySelector('.header');
  const menuWrapper = document.querySelector('.menu__wrapper');

  if (burger && header) {
    burger.addEventListener('click', () => {
      header.classList.toggle('active-menu');
      menuWrapper.scrollTop = -500;
      document.body.classList.toggle('no-scroll', header.classList.contains('active-menu'));
    });
  }

  //BG - Y
  //   let lastScroll = window.scrollY;

  //   gsap.set(header, { y: 0 }); // початкове положення

  //   window.addEventListener('scroll', () => {
  //     const currentScroll = window.scrollY;

  //     if (currentScroll > lastScroll && currentScroll > 50) {
  //       // Скролимо вниз
  //       gsap.to(header, { y: '-100%', duration: 0.4, ease: 'power2.out' });
  //     } else {
  //       // Скролимо вверх
  //       gsap.to(header, { y: 0, duration: 0.4, ease: 'power2.out' });
  //       header.classList.add('header-bg');
  //     }

  //     // Якщо на самому верху — прибираємо клас
  //     if (currentScroll === 0) {
  //       header.classList.remove('header-bg');
  //     }

  //     lastScroll = currentScroll;
  //   });
});

// document.addEventListener('DOMContentLoaded', function() {
//   const scrollToPropositionsItems = document.querySelectorAll('.to_propositions');
//   const header = document.querySelector('.header');
//   const targetSection = document.querySelector('.propositions');

//   if (scrollToPropositionsItems && targetSection) {
//     scrollToPropositionsItems.forEach(function(item) {
//       item.addEventListener('click', function(event) {
//         event.preventDefault();
//         header.classList.remove('active-menu');
//         document.body.classList.remove('no-scroll');
//         targetSection.scrollIntoView({ behavior: 'smooth' });
//       });
//     });
//   }
// });
document.addEventListener('DOMContentLoaded', function() {
  // const scrollToPropositionsItems = document.querySelectorAll('.to_propositions');
  // const header = document.querySelector('.header');
  // const targetSection = document.querySelector('.propositions');
  // scrollToPropositionsItems.forEach(function(item) {
  //   item.addEventListener('click', function(event) {
  //     event.preventDefault();
  //     const isHomePage = window.location.pathname === '/';
  //     const isGalleryPage = window.location.pathname === '/gallery/';
  //     if ((isHomePage && targetSection) || (isGalleryPage && targetSection)) {
  //       header.classList.remove('active-menu');
  //       document.body.classList.remove('no-scroll');
  //       targetSection.scrollIntoView({ behavior: 'smooth' });
  //     } else {
  //       // переходим на главную с якорем
  //       window.location.href = '/#propositions';
  //     }
  //   });
  // });
  // // Если есть хеш #propositions — скроллим после загрузки
  // if (window.location.hash === '#propositions' && targetSection) {
  //   setTimeout(function() {
  //     targetSection.scrollIntoView({ behavior: 'smooth' });
  //   }, 300); // подождём немного, если вдруг элементы ещё рендерятся
  // }
});
