import { renderUnitsPortion } from './renderUnitsList';

export function sortFilteredPremises(sort, portionSize = 12) {
  const raw = localStorage.getItem('filteredPremises');
  const units = raw ? JSON.parse(raw) : [];

  if (!Array.isArray(units) || units.length === 0) {
    renderUnitsPortion([], 0, portionSize);
    return;
  }

  const toNumber = v => {
    if (v == null) return 0;
    if (typeof v === 'number') return Number.isFinite(v) ? v : 0;
    const s = String(v)
      .trim()
      .replace(/\s+/g, '')
      .replace(',', '.');
    const n = Number(s);
    return Number.isFinite(n) ? n : 0;
  };

  const getPrice = u => toNumber(u.price_m2_uah);
  const getArea = u => toNumber(u.design_size);

  if (sort === 'price-asc') units.sort((a, b) => getPrice(a) - getPrice(b));
  else if (sort === 'price-desc') units.sort((a, b) => getPrice(b) - getPrice(a));
  else if (sort === 'size-asc') units.sort((a, b) => getArea(a) - getArea(b));
  else if (sort === 'size-desc') units.sort((a, b) => getArea(b) - getArea(a));

  localStorage.setItem('filteredPremises', JSON.stringify(units));

  const shown = Math.min(portionSize, units.length);
  localStorage.setItem('shownCount', shown);

  // ✅ ключове: очистити DOM, бо renderUnitsPortion тільки append-ить "хвіст"
  const wrapper = document.querySelector('.section_flats__filter_result_wrapper');
  if (wrapper) wrapper.innerHTML = '';

  renderUnitsPortion(units, shown, portionSize);
}
