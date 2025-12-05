import { renderUnitsPortion } from './renderUnitsList';

export function attachLoadMore(portionSize = 12) {
  const btn = document.querySelector('.section_flats__loadmore');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const filtered = JSON.parse(localStorage.getItem('filteredPremises')) || [];
    let shown = Number(localStorage.getItem('shownCount')) || portionSize;

    shown += portionSize;
    localStorage.setItem('shownCount', shown);

    renderUnitsPortion(filtered, shown, portionSize);
  });
}
