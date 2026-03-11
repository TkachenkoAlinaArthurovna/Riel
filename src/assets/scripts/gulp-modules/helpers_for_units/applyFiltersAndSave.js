import { filterPremisesByFilters } from './filterPremisesByFilters';
import { renderUnitsPortion } from './renderUnitsList';

function getUsdToUahRate(units) {
  const u = (Array.isArray(units) ? units : []).find(
    x => Number(x?.total_price) > 0 && Number(x?.total_price_uah) > 0,
  );

  // fallback якщо раптом не знайдемо пару (краще ніж NaN)
  if (!u) return 40;

  return Number(u.total_price_uah) / Number(u.total_price);
}

/**
 * Синхронізує range-слайдер "Ціна (грн)" з filters.priceMin/priceMax
 * IMPORTANT: ставимо флаг window.__RIEL_SYNCING_FILTERS__ щоб не ловити цикли в listeners
 */
function syncPriceSliderFromFilters(filters) {
  const isPopupMode = window.innerWidth <= 1500;

  const priceWrapper = isPopupMode
    ? document.querySelector(
        '.filter_flats__price.filter__slider.price_popup, .filter__slider.price_popup',
      )
    : document.querySelector('.filter__slider.price');

  if (!priceWrapper) return;

  const minInput = priceWrapper.querySelector('input[data-filter="Ціна_min"]');
  const maxInput = priceWrapper.querySelector('input[data-filter="Ціна_max"]');
  if (!minInput || !maxInput) return;

  // якщо фільтр пустий — ставимо крайні значення слайдера
  const nextMin = filters.priceMin ? String(filters.priceMin) : String(minInput.min ?? '');
  const nextMax = filters.priceMax ? String(filters.priceMax) : String(maxInput.max ?? '');

  // блокуємо реакцію listeners
  window.__RIEL_SYNCING_FILTERS__ = true;

  // проставляємо значення
  if (nextMin !== '') minInput.value = nextMin;
  if (nextMax !== '') maxInput.value = nextMax;

  // оновлюємо тултіпи/трек (у тебе це сидить на input)
  minInput.dispatchEvent(new Event('input', { bubbles: true }));
  maxInput.dispatchEvent(new Event('input', { bubbles: true }));

  window.__RIEL_SYNCING_FILTERS__ = false;
}

function applyUsdPresetToUah(filters, allUnits) {
  const preset = String(filters?.pricePresetUsd || '').trim();
  if (!preset) return;

  const rate = getUsdToUahRate(allUnits);
  const toUah = usd => String(Math.round(Number(usd) * rate));

  // якщо активний preset — ручну ціну (грн) не тримаємо
  filters.priceMin = '';
  filters.priceMax = '';

  switch (preset) {
    case '0-80k':
      filters.priceMin = '';
      filters.priceMax = toUah(80000);
      break;

    case '80-100k':
      filters.priceMin = toUah(80000);
      filters.priceMax = toUah(100000);
      break;

    case '100-120k':
      filters.priceMin = toUah(100000);
      filters.priceMax = toUah(120000);
      break;

    case '120-150k':
      filters.priceMin = toUah(120000);
      filters.priceMax = toUah(150000);
      break;

    case '150k+':
      filters.priceMin = toUah(150000);
      filters.priceMax = '';
      break;

    default:
      filters.pricePresetUsd = '';
      filters.priceMin = '';
      filters.priceMax = '';
      break;
  }

  // ✅ синхронізуємо UI-слайдер "Ціна (грн)" під preset
  syncPriceSliderFromFilters(filters);
}

export function applyFiltersAndSave(allUnits, filters, portionSize = 12) {
  // ✅ якщо вибраний USD preset — конвертуємо його у грн (priceMin/priceMax)
  applyUsdPresetToUah(filters, allUnits);

  const filtered = filterPremisesByFilters(allUnits, filters);

  localStorage.setItem('filteredPremises', JSON.stringify(filtered));

  const shown = portionSize;
  localStorage.setItem('shownCount', shown);

  const wrapper = document.querySelector('.section_flats__filter_result_wrapper');
  if (wrapper) wrapper.innerHTML = '';

  renderUnitsPortion(filtered, shown, portionSize);
}
