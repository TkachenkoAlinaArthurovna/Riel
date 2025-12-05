import { getData } from './helpers_for_units/getData';
import { getFiltersFromUrl } from './helpers_for_units/getFiltersFromUrl';
import { filterPremisesByFilters } from './helpers_for_units/filterPremisesByFilters';
import { renderFilter } from './helpers_for_units/renderFilter';
import { applyFiltersAndSave } from './helpers_for_units/applyFiltersAndSave';
import { attachFilterListeners } from './helpers_for_units/attachFilterListeners';
import { loadFiltersFromStorage, saveFiltersToStorage } from './helpers_for_units/filtersStorage';
import { attachLoadMore } from './helpers_for_units/attachLoadMore';
import { initSortSelect } from './helpers_for_units/initSortSelect';
import { initFilterPopup } from './helpers_for_units/filterPopup.js';
import { updatePopupCount } from './helpers_for_units/updatePopupCount';

// Функція для отримання квартир із sessionStorage або сервера
async function loadUnits() {
  const cached = sessionStorage.getItem('units');

  if (cached) {
    return JSON.parse(cached);
  }

  const data = await getData();

  if (data) {
    sessionStorage.setItem('units', JSON.stringify(data));
  }

  return data || []; // щоб не повернути undefined
}

// Ініціалізація на головній
async function initUnits() {
  return await loadUnits();
}

document.addEventListener('DOMContentLoaded', async () => {
  if (!document.querySelector('.section_flats')) return;

  const PAGE_SIZE = 12;

  const defaultFilters = {
    complex: [], // житловий комплекс (id або slug)
    type: '', // тип приміщення
    rooms: '', // кількість кімнат
    priceMin: '',
    priceMax: '',
    areaMin: '',
    areaMax: '',
    floorMin: '',
    floorMax: '',
    page: 1,
    sort: '',
  };

  // Чекаємо дані
  const allPremises = await initUnits(); // ← тепер тут саме масив, а не Promise

  // На всякий випадок, якщо щось пішло не так
  const safePremises = Array.isArray(allPremises) ? allPremises : [];

  // фільтри з URL
  const urlFilters = getFiltersFromUrl();

  // фільтри з localStorage (якщо були)
  const storedFilters = loadFiltersFromStorage(defaultFilters);

  // пріоритет: URL > localStorage > default
  const filters = {
    ...storedFilters,
    ...urlFilters,
  };

  // зберігаємо актуальний filters у localStorage
  saveFiltersToStorage(filters);

  // малюємо фільтр
  renderFilter(safePremises, filters);

  // рахуємо й зберігаємо відфільтрований масив
  applyFiltersAndSave(safePremises, filters);

  initSortSelect(filters, PAGE_SIZE);

  // підключаємо слухачі – тепер вони будуть читати/писати filters через localStorage
  attachFilterListeners(safePremises, filters, PAGE_SIZE);

  attachLoadMore(PAGE_SIZE);

  initFilterPopup();

  updatePopupCount();
});
