import { renderUnitsPortion } from './renderUnitsList';

export function sortFilteredPremises(sort, portionSize = 12) {
  const raw = localStorage.getItem('filteredPremises');
  const units = raw ? JSON.parse(raw) : [];

  if (!Array.isArray(units) || units.length === 0) {
    // нічого сортувати – просто прибиваємо кнопку
    renderUnitsPortion([], 0, portionSize);
    return;
  }

  const getPrice = u => Number(u.total_price_uah) || 0;
  const getArea = u => Number(u.real_size || u.design_size) || 0;

  if (sort === 'price-asc') {
    units.sort((a, b) => getPrice(a) - getPrice(b));
  } else if (sort === 'price-desc') {
    units.sort((a, b) => getPrice(b) - getPrice(a));
  } else if (sort === 'size-asc') {
    units.sort((a, b) => getArea(a) - getArea(b));
  } else if (sort === 'size-desc') {
    units.sort((a, b) => getArea(b) - getArea(a));
  } else {
    // sort == '' — нічого не робимо, лишаємо як є
  }

  // зберігаємо відсортований список назад
  localStorage.setItem('filteredPremises', JSON.stringify(units));

  // скидаємо показ до першої порції
  const shown = Math.min(portionSize, units.length);
  localStorage.setItem('shownCount', shown);

  renderUnitsPortion(units, shown, portionSize);
}
