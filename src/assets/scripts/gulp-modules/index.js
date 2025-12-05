import '../modules/scroll/leniscroll';
import '../animations';
import './section_hot_deals';
import './section_news';
import '../modules/form';
import './filter';
import './news';
import './view';
import './section_benefits';
import './gallery';
import './section_more_projects';
import './section_flat';
import './news_single';
import './single_project';
import './single_flat';
import './units';

const vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

document.addEventListener('DOMContentLoaded', () => {
  const openBtn = document.querySelector('.header__open_popup');
  const popup = document.querySelector('.connect_popup');
  const closeBtn = document.querySelector('.connect_popup__close');

  if (openBtn && popup) {
    openBtn.addEventListener('click', () => {
      if (window.innerWidth < 1024) {
        popup.style.transform = 'translateY(0)';
      }
    });
  }

  if (closeBtn && popup) {
    closeBtn.addEventListener('click', () => {
      if (window.innerWidth < 1024) {
        popup.style.transform = 'translateY(100%)';
      }
    });
  }

  const goUpButton = document.querySelector('.footer__up');

  if (goUpButton) {
    goUpButton.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  }

  if (document.querySelector('.arrow_down')) {
    document.querySelector('.arrow_down').addEventListener('click', function() {
      const section = document.querySelector('.section_next');
      if (section) {
        section.scrollIntoView({
          behavior: 'smooth',
        });
      }
    });
  }

  document.querySelectorAll('input').forEach(el => {
    el.addEventListener('input', () => {
      el.setAttribute('value', el.value);
    });
  });
});
