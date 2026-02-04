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
import { sanitizeUrlFiltersByType } from './helpers_for_units/sanitizeUrlFiltersByType.js';

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

// ====== TYPE MASTER ======
function getMasterType() {
  return (window.RIEL_DEFAULT_TYPE ?? '')
    .toString()
    .trim()
    .toLowerCase();
}

/**
 * Головне правило:
 * - У URL ЗАВЖДИ є type
 * - ТІЛЬКИ type керує всіма іншими фільтрами
 *   (тобто ми НЕ читаємо інші параметри з URL взагалі)
 *
 * Тут задаєш бізнес-правила: що скидати/ховати/фіксувати під кожен type.
 */
function adaptFiltersByType(filters, type) {
  // примусово робимо type єдиним активним
  filters.type = type ? [type] : [];

  // типові приклади правил — підкоригуй під вашу реальну логіку:
  switch (type) {
    case 'паркінг':
      filters.rooms = [];
      filters.areaMin = '';
      filters.areaMax = '';
      filters.floorMin = '';
      filters.floorMax = '';
      break;

    case 'комора':
      filters.rooms = [];
      break;

    case 'офіс':
      filters.rooms = [];
      break;

    case 'апартамент':
    case 'квартира':
      // залишаємо rooms/area/floor як є
      break;

    default:
      break;
  }

  // якщо потрібно, можна скидати сортування/пейдж при зміні type
  filters.page = 1;

  return filters;
}

document.addEventListener('DOMContentLoaded', async () => {
  if (!document.querySelector('.section_flats')) return;

  const PAGE_SIZE = 12;

  const defaultFilters = {
    complex: [], // житловий комплекс (id або slug)
    type: [], // тип приміщення
    rooms: [], // кількість кімнат
    priceMin: '',
    priceMax: '',
    areaMin: '',
    areaMax: '',
    floorMin: '',
    floorMax: '',
    page: 1,
    sort: '',
  };

  // 1) MASTER TYPE з URL (він завжди є)
  const masterType = getMasterType();
  console.log('masterType', masterType);

  // 2) Дані
  const allPremises = await initUnits();
  const safePremises = Array.isArray(allPremises) ? allPremises : [];

  // 3) Базові фільтри зі storage (або дефолт)
  // const storedFilters = loadFiltersFromStorage(defaultFilters);

  // 4) Формуємо filters ТІЛЬКИ від type (інші URL-параметри ігноруємо)
  // const filters = adaptFiltersByType({ ...storedFilters }, masterType);

  // 5) Зберігаємо актуальні фільтри
  // saveFiltersToStorage(filters);

  const storedFilters = loadFiltersFromStorage(defaultFilters);

  // фільтри з URL (rooms/price/area/...)
  const urlFilters = getFiltersFromUrl();

  // лишаємо тільки те, що дозволено для поточного type
  const safeUrlFilters = sanitizeUrlFiltersByType(urlFilters, masterType);

  // пріоритет: URL (дозволені поля) > storage
  const merged = {
    ...storedFilters,
    ...safeUrlFilters,
  };

  // фінально застосовуємо правила master type
  const filters = adaptFiltersByType(merged, masterType);

  // зберігаємо актуальні фільтри (БЕЗ sort)
  const { type, ...toStore } = filters;
  saveFiltersToStorage(toStore);

  // 6) Верхній блок (фон/заголовок) + UI-видимість фільтрів
  // applyTopBgAndTitleByType(masterType);
  // applyUiVisibilityByType(masterType);

  // 7) Малюємо фільтри та застосовуємо їх
  renderFilter(safePremises, filters);
  applyFiltersAndSave(safePremises, filters);

  // 8) Сортування/слухачі/пагінація/попап
  initSortSelect(filters, PAGE_SIZE);
  attachFilterListeners(safePremises, filters, PAGE_SIZE);
  attachLoadMore(PAGE_SIZE);
  initFilterPopup();
  updatePopupCount();

  // // Чекаємо дані
  // const allPremises = await initUnits(); // ← тепер тут саме масив, а не Promise

  // // На всякий випадок, якщо щось пішло не так
  // const safePremises = Array.isArray(allPremises) ? allPremises : [];

  // // фільтри з URL
  // const urlFilters = getFiltersFromUrl();

  // // фільтри з localStorage (якщо були)
  // const storedFilters = loadFiltersFromStorage(defaultFilters);

  // // пріоритет: URL > localStorage > default
  // const filters = {
  //   ...storedFilters,
  //   ...urlFilters,
  // };

  // // зберігаємо актуальний filters у localStorage
  // saveFiltersToStorage(filters);

  // // малюємо фільтр
  // renderFilter(safePremises, filters);

  // // рахуємо й зберігаємо відфільтрований масив
  // applyFiltersAndSave(safePremises, filters);

  // initSortSelect(filters, PAGE_SIZE);

  // // підключаємо слухачі – тепер вони будуть читати/писати filters через localStorage
  // attachFilterListeners(safePremises, filters, PAGE_SIZE);

  // attachLoadMore(PAGE_SIZE);

  // initFilterPopup();

  // updatePopupCount();

  // Зчитуємо GET-параметр type
  const normalizedType = masterType;
  if (!normalizedType) return;

  // Динамічний базовий URL
  const baseURL = window.location.origin;
  // Наприклад дасть: https://stock.riel.ua

  // Ширина екрану
  const screenWidth = window.innerWidth;

  // Статичний шлях до картинки (змінюється тільки файл)
  const baseImagePath = '/wp-content/themes/3d/assets/images/bg/';

  // Мапа файлів для кожного типу
  const images = {
    квартира: {
      desktop: 'bg_flats.png',
      tablet: 'bg_flats_tablet.png',
      mobile: 'bg_flats_mob.png',
    },
    апартамент: {
      desktop: 'bg_apart.png',
      tablet: 'bg_apart_tablet.png',
      mobile: 'bg_apart_mob.png',
    },
    офіс: {
      desktop: 'bg_of.png',
      tablet: 'bg_of_tablet.png',
      mobile: 'bg_of_mob.png',
    },
    комора: {
      desktop: 'bg_komora.png',
      tablet: 'bg_komora_tablet.png',
      mobile: 'bg_komora_mob.png',
    },
    паркінг: {
      desktop: 'bg_parking.png',
      tablet: 'bg_parking_tablet.png',
      mobile: 'bg_parking_mob.png',
    },
    підвал: {
      desktop: 'bg_komora.png',
      tablet: 'bg_komora_tablet.png',
      mobile: 'bg_komora_mob.png',
    },
  };

  // Мапа для заміни заголовка
  const titleMap = {
    квартира: 'квартири',
    апартамент: 'апартаменти',
    офіс: 'офіси',
    комора: 'комори',
    паркінг: 'паркінги',
    підвал: 'підвали',
  };

  if (!images[normalizedType]) return;

  let fileName = '';

  if (screenWidth < 480) {
    fileName = images[normalizedType].mobile;
  } else if (screenWidth <= 1024) {
    fileName = images[normalizedType].tablet;
  } else {
    fileName = images[normalizedType].desktop;
  }

  // Складаємо повний URL до картинки
  const finalSrc = baseURL + baseImagePath + fileName;

  // Присвоюємо src елементу
  const bgEl = document.querySelector('.section_top_subpage__bg');
  if (bgEl) {
    bgEl.setAttribute('src', finalSrc);
  }

  // Оновлюємо заголовок
  const titleEl = document.querySelector('.section_top_subpage__title');
  const breadcrumbs = document.querySelector('.section_top_subpage__breadcrumbs_type');
  if (titleEl && titleMap[normalizedType] && breadcrumbs) {
    titleEl.textContent = titleMap[normalizedType];
    breadcrumbs.textContent = titleMap[normalizedType];
  }

  // що ховаємо для кожного type
  const HIDE_RULES = {
    паркінг: ['.filter__item.size', '.filter__item.room_count'],
    комора: ['.filter__item.room_count'],
    офіс: ['.filter__item.room_count'],
    підвал: ['.filter__item.room_count'],
  };

  if (HIDE_RULES[normalizedType]) {
    HIDE_RULES[normalizedType].forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        el.style.display = 'none';
      });
    });
  }
});
