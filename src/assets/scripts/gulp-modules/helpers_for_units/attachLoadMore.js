import { renderUnitsPortion } from './renderUnitsList';

function lockScroll() {
  const y = window.scrollY;
  document.body.dataset.scrollY = String(y);

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

  delete document.body.dataset.scrollY;
  return y;
}

export function attachLoadMore(portionSize = 12) {
  const btn = document.querySelector('.section_flats__loadmore');
  if (!btn) return;

  // ✅ якщо це button в form — щоб не було submit
  if (btn.tagName === 'BUTTON') btn.type = 'button';

  btn.addEventListener('click', async e => {
    // ✅ якщо це <a> — прибираємо “якір/навігацію”
    e.preventDefault();

    // ✅ прибираємо фокус (фокус часто і є причиною автоскролу)
    btn.blur();

    const filtered = JSON.parse(localStorage.getItem('filteredPremises')) || [];
    const prevShown = Number(localStorage.getItem('shownCount')) || portionSize;
    const nextShown = prevShown + portionSize;

    btn.disabled = true;
    lockScroll();

    localStorage.setItem('shownCount', nextShown);

    await renderUnitsPortion(filtered, nextShown, portionSize);

    // ✅ важливо: відновлюємо скрол ПІСЛЯ того, як браузер “доскролить”
    const y = unlockScroll();

    // 2 кадри підряд — щоб перебити пізній автоскрол
    requestAnimationFrame(() => {
      window.scrollTo(0, y);
      requestAnimationFrame(() => {
        window.scrollTo(0, y);
        btn.disabled = false;
      });
    });
  });
}
