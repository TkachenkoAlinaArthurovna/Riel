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
import './cart';

import { gsap, ScrollTrigger, CustomEase } from 'gsap/all';

const vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

window.addEventListener('resize', () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
});

document.addEventListener('DOMContentLoaded', () => {
  // document.querySelectorAll('.lang').forEach(lang => {
  //   lang.addEventListener('click', () => {
  //     document.body.classList.remove('uah', 'usd');
  //     document.body.classList.add(lang.id);

  //     document.querySelectorAll('.lang').forEach(l => l.classList.remove('active'));
  //     lang.classList.add('active');
  //   });
  // });

  document.querySelectorAll('.lang').forEach(lang => {
    lang.addEventListener('click', () => {
      const currency = lang.id;

      document.body.classList.remove('uah', 'usd');
      document.body.classList.add(currency);

      document.querySelectorAll('.lang').forEach(l => l.classList.remove('active'));
      lang.classList.add('active');

      // 🔥 зберігаємо
      localStorage.setItem('currency', currency);
    });
  });

  // 🔄 відновлюємо при завантаженні
  const savedCurrency = localStorage.getItem('currency');
  if (savedCurrency) {
    document.body.classList.remove('uah', 'usd');
    document.body.classList.add(savedCurrency);

    document.querySelectorAll('.lang').forEach(l => {
      l.classList.toggle('active', l.id === savedCurrency);
    });
  }

  const header = document.querySelector('.header');
  let lastScroll = window.scrollY;

  gsap.set(header, { y: 0 });

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll > lastScroll) {
      // ⬇️ скрол вниз — ховаємо хедер
      gsap.to(header, {
        y: '-100%',
        duration: 0.2,
        ease: 'power2.out',
      });
    } else {
      // ⬆️ скрол вгору — показуємо хедер
      gsap.to(header, {
        y: 0,
        duration: 0.2,
        ease: 'power2.out',
      });
    }

    lastScroll = currentScroll;
  });

  // const openBtn = document.querySelector('.header__open_popup');
  // const popup = document.querySelector('.connect_popup');
  // const closeBtn = document.querySelector('.connect_popup__close');

  // if (openBtn && popup) {
  //   openBtn.addEventListener('click', () => {
  //     if (window.innerWidth < 1024) {
  //       popup.style.transform = 'translateY(0)';
  //     }
  //   });
  // }

  // if (closeBtn && popup) {
  //   closeBtn.addEventListener('click', () => {
  //     if (window.innerWidth < 1024) {
  //       popup.style.transform = 'translateY(100%)';
  //     }
  //   });
  // }

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

  const backBtn = document.querySelector('.section_flat_details__back');

  if (backBtn) {
    backBtn.addEventListener('click', e => {
      e.preventDefault();

      const fallback = 'https://stock.riel.ua/';
      const ref = document.referrer;

      // якщо прийшли з нашого сайту — тоді назад
      if (ref && new URL(ref).origin === window.location.origin) {
        window.history.back();
      } else {
        // якщо прийшли з Google/зовні/напряму — йдемо на головну
        window.location.href = fallback;
      }
    });
  }

  document.querySelectorAll('[data-acc]').forEach(item => {
    const btn = item.querySelector('.menu__row');
    const sub = item.querySelector('.menu__sub');
    if (!btn || !sub) return;

    btn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();

      const willOpen = !item.classList.contains('is-open');

      // ✅ закриваємо всі інші акордеони
      document.querySelectorAll('[data-acc].is-open').forEach(opened => {
        if (opened === item) return;

        opened.classList.remove('is-open');

        const openedBtn = opened.querySelector('.menu__toggle');
        const openedSub = opened.querySelector('.menu__sub');

        openedBtn?.setAttribute('aria-expanded', 'false');
        openedSub?.setAttribute('hidden', '');
      });

      // ✅ відкриваємо/закриваємо поточний
      item.classList.toggle('is-open', willOpen);
      btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');

      if (willOpen) sub.removeAttribute('hidden');
      else sub.setAttribute('hidden', '');
    });
  });
});
