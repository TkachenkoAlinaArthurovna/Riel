// import { renderUnitsPortion } from './renderUnitsList';

// export function attachLoadMore(portionSize = 12) {
//   const btn = document.querySelector('.section_flats__loadmore');
//   if (!btn) return;

//   btn.addEventListener('click', () => {
//     const filtered = JSON.parse(localStorage.getItem('filteredPremises')) || [];
//     let shown = Number(localStorage.getItem('shownCount')) || portionSize;

//     shown += portionSize;
//     localStorage.setItem('shownCount', shown);

//     renderUnitsPortion(filtered, shown, portionSize);
//   });
// }
import { renderUnitsPortion } from './renderUnitsList';

function lockScroll() {
  const y = window.scrollY;
  document.body.dataset.scrollY = String(y);

  // фіксуємо body на місці
  document.body.style.position = 'fixed';
  document.body.style.top = `-${y}px`;
  document.body.style.left = '0';
  document.body.style.right = '0';
  document.body.style.width = '100%';
}

function unlockScroll() {
  const y = Number(document.body.dataset.scrollY || '0');

  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.left = '';
  document.body.style.right = '';
  document.body.style.width = '';

  window.scrollTo(0, y);
  delete document.body.dataset.scrollY;
}

export function attachLoadMore(portionSize = 12) {
  const btn = document.querySelector('.section_flats__loadmore');
  if (!btn) return;

  btn.addEventListener('click', async () => {
    const filtered = JSON.parse(localStorage.getItem('filteredPremises')) || [];
    const prevShown = Number(localStorage.getItem('shownCount')) || portionSize;
    const nextShown = prevShown + portionSize;

    // 🔒 блокуємо і кнопку, і скрол
    btn.disabled = true;
    lockScroll();

    localStorage.setItem('shownCount', nextShown);

    // якщо renderUnitsPortion НЕ async — await не завадить (просто одразу продовжить)
    await renderUnitsPortion(filtered, nextShown, portionSize);

    // даємо DOM “осісти”
    requestAnimationFrame(() => {
      unlockScroll();
      btn.disabled = false;
    });
  });
}
