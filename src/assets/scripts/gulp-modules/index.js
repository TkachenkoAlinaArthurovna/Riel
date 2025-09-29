import '../modules/scroll/leniscroll';
import '../animations';
import './section_hot_deals';
import './section_news';
import './section_video';
import '../modules/form';
import './filter';
import './news';

const vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

document.addEventListener('DOMContentLoaded', () => {
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
      const section = document.querySelector('.section_hot_deals');
      if (section) {
        section.scrollIntoView({
          behavior: 'smooth',
        });
      }
    });
  }
});
