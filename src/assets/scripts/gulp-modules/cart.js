import { getData } from './helpers_for_units/getData';
import { renderCartPopupUnits } from './renderCartPopupUnits';

async function loadUnits() {
  const cached = sessionStorage.getItem('units');
  if (cached) return JSON.parse(cached);

  const data = await getData();
  if (data) sessionStorage.setItem('units', JSON.stringify(data));
  return data || [];
}

let allPremisesCache = null;
async function getAllPremisesOnce() {
  if (allPremisesCache) return allPremisesCache;
  allPremisesCache = await loadUnits();
  return allPremisesCache;
}

function getCart() {
  try {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    return Array.isArray(cart) ? cart.map(String) : [];
  } catch {
    return [];
  }
}
function setCart(arr) {
  localStorage.setItem('cart', JSON.stringify(arr));
}

document.addEventListener('DOMContentLoaded', () => {
  const cartPopup = document.querySelector('.cart_popup');
  const headerCart = document.querySelector('.header__cart');
  const closePopUp = document.querySelector('.close_pop_up');

  if (cartPopup && headerCart) {
    headerCart.addEventListener('click', async e => {
      cartPopup.classList.add('active');
      document.querySelector('body').classList.add('no-scroll');
      const allPremises = await getAllPremisesOnce();
      const cartIds = getCart();

      renderCartPopupUnits(allPremises, cartIds);
      bindCartPopupDelete(allPremises);
      e.stopImmediatePropagation();
    });
  }
  if (closePopUp && cartPopup) {
    closePopUp.addEventListener('click', e => {
      const center = cartPopup.querySelector('.cart_popup__center');
      const right = cartPopup.querySelector('.cart_popup__right');

      if (window.innerWidth > 1300) {
        cartPopup.classList.remove('active');
        document.body.classList.remove('no-scroll');
        return;
      }

      if (center && right && center.classList.contains('non_active')) {
        // повертаємось з right → center
        center.classList.remove('non_active');
        right.classList.add('non_active');
      } else {
        // закриваємо popup
        cartPopup.classList.remove('active');
        document.body.classList.remove('no-scroll');
      }
    });
  }

  const cartPopupRight = document.querySelector('.cart_popup__right');

  function checkScreenWidth() {
    if (!cartPopupRight) return;

    if (window.innerWidth <= 1300) {
      cartPopupRight.classList.add('non_active');
    } else {
      cartPopupRight.classList.remove('non_active');
    }
  }

  // перевірка при завантаженні
  checkScreenWidth();

  // перевірка при зміні розміру вікна
  // window.addEventListener('resize', checkScreenWidth);

  function updateCartCount() {
    const counter = document.querySelector('.cart_count');

    if (!counter) return;

    let cart = [];
    try {
      cart = JSON.parse(localStorage.getItem('cart')) || [];
      if (!Array.isArray(cart)) cart = [];
    } catch {
      cart = [];
    }

    if (cart.length > 0) {
      counter.textContent = cart.length;
      counter.classList.add('active');
    } else {
      counter.textContent = '';
      counter.classList.remove('active');
    }
  }

  updateCartCount();

  function syncCartButtons() {
    let cart = [];
    try {
      cart = JSON.parse(localStorage.getItem('cart')) || [];
      if (!Array.isArray(cart)) cart = [];
    } catch {
      cart = [];
    }

    if (cart.length === 0) return;

    const cartSet = new Set(cart); // швидка перевірка

    document.querySelectorAll('.flat_card').forEach(card => {
      const id = String(card.dataset.id || '').trim();
      if (!id) return;

      const btn = card.querySelector('.flat_card__cart');
      if (!btn) return;

      if (cartSet.has(id)) {
        btn.classList.add('active');
        btn.querySelector('span').textContent = 'Видалити з кошика';
        btn.querySelector('span').dataset.title = 'Видалити з кошика';
      } else {
        btn.classList.remove('active');
        btn.querySelector('span').textContent = 'Додати в кошик';
        btn.querySelector('span').dataset.title = 'Додати в кошик';
      }
    });
  }

  syncCartButtons();

  document.addEventListener('click', e => {
    const cartBtn = e.target.closest('.flat_card__cart');
    if (!cartBtn) return;

    // щоб не переходило по <a href="...">
    e.preventDefault();
    e.stopPropagation();

    const card = cartBtn.closest('.flat_card');
    if (!card) return;

    const id = String(card.dataset.id || '').trim();
    if (!id) return;

    const KEY = 'cart';

    // читаємо масив з localStorage
    let cart = [];
    try {
      cart = JSON.parse(localStorage.getItem(KEY)) || [];
      if (!Array.isArray(cart)) cart = [];
    } catch {
      cart = [];
    }

    // toggle: якщо є — видаляємо, якщо нема — додаємо
    const idx = cart.indexOf(id);
    if (idx === -1) cart.push(id);
    else cart.splice(idx, 1);

    localStorage.setItem(KEY, JSON.stringify(cart));

    // (опціонально) можна підсвітити стан кнопки
    cartBtn.classList.toggle('active', idx === -1);
    if (cartBtn.classList.contains('active')) {
      cartBtn.querySelector('span').textContent = 'Видалити з кошика';
      cartBtn.querySelector('span').dataset.title = 'Видалити з кошика';
    } else {
      cartBtn.querySelector('span').textContent = 'Додати в кошик';
      cartBtn.querySelector('span').dataset.title = 'Додати в кошик';
    }
    updateCartCount();
  });

  // викликай один раз після того як є cartPopup
  function bindCartPopupDelete(allPremises) {
    const popup = document.querySelector('.cart_popup');
    if (!popup) return;

    if (popup.dataset.deleteBound === '1') return; // щоб не дублювати
    popup.dataset.deleteBound = '1';

    popup.addEventListener('click', e => {
      // 1) toggle active по кліку на іконку/блок delete
      const deleteBlock = e.target.closest('.unit_card__delete');
      if (deleteBlock) {
        // якщо клікнули саме в "меню" (innerDiv) — не треба вдруге тоглити
        const clickedInner = e.target.closest('.unit_card__delete > div');
        if (!clickedInner) {
          const innerDiv = deleteBlock.querySelector(':scope > div');
          if (innerDiv) innerDiv.classList.toggle('active');
        }
      }

      // 2) клік по innerDiv (де "Видалити") → видалення з cart + оновлення списку
      const actionBtn = e.target.closest('.unit_card__delete > div');
      if (!actionBtn) return;

      const unitCard = actionBtn.closest('.unit_card');
      if (!unitCard) return;

      const id = String(unitCard.dataset.id || '').trim();
      if (!id) return;

      let cart = getCart();
      cart = cart.filter(x => x !== id);
      setCart(cart);

      // оновлюємо popup список
      renderCartPopupUnits(allPremises, cart);

      // (опціонально) закриваємо всі меню
      popup
        .querySelectorAll('.unit_card__delete > div.active')
        .forEach(el => el.classList.remove('active'));

      // (опціонально) якщо є лічильник в хедері
      // updateCartCount?.();

      // (опціонально) синхронізувати active на карточках на сторінці
      document
        .querySelectorAll(`.flat_card[data-id="${CSS.escape(id)}"] .flat_card__cart`)
        .forEach(btn => btn.classList.remove('active'));
    });
  }

  document.addEventListener('click', e => {
    const btn = e.target.closest('.cart-next');
    if (!btn) return;

    if (window.innerWidth > 1300) return;

    const popup = btn.closest('.cart_popup');
    if (!popup) return;

    const center = popup.querySelector('.cart_popup__center');
    const right = popup.querySelector('.cart_popup__right');

    center?.classList.add('non_active');
    right?.classList.remove('non_active');
  });
});
