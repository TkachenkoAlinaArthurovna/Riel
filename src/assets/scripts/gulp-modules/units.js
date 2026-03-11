import { getData } from './helpers_for_units/getData';
import { renderFilter } from './helpers_for_units/renderFilter';
import { applyFiltersAndSave } from './helpers_for_units/applyFiltersAndSave';
import { attachFilterListeners } from './helpers_for_units/attachFilterListeners';
import { loadFiltersFromStorage, saveFiltersToStorage } from './helpers_for_units/filtersStorage';
import { attachLoadMore } from './helpers_for_units/attachLoadMore';
import { initSortSelect } from './helpers_for_units/initSortSelect';
import { initFilterPopup } from './helpers_for_units/filterPopup.js';
import { updatePopupCount } from './helpers_for_units/updatePopupCount';
import { updateUrl } from './helpers_for_units/updateUrl.js';

// ===== Cache loader =====
async function loadUnits() {
  const cached = sessionStorage.getItem('units');
  if (cached) return JSON.parse(cached);

  const data = await getData();
  if (data) sessionStorage.setItem('units', JSON.stringify(data));
  return data || [];
}

async function initUnits() {
  return await loadUnits();
}

// ===== MASTER TYPE =====
function getMasterType() {
  return (window.RIEL_DEFAULT_TYPE ?? '')
    .toString()
    .trim()
    .toLowerCase();
}

function adaptFiltersByType(filters, type) {
  filters.type = type ? [type] : [];

  switch (type) {
    case 'паркінг':
      filters.rooms = [];
      filters.areaMin = '';
      filters.areaMax = '';
      filters.floorMin = '';
      filters.floorMax = '';
      break;

    case 'комора':
    case 'офіс':
      filters.rooms = [];
      break;

    case 'апартамент':
    case 'квартира':
    default:
      break;
  }

  return filters;
}

// ===== SLASH URL parsing =====
const BASES = ['flats', 'apartments', 'offices', 'parking', 'komori', 'pidvali'];

const ROOMS_SLUG_TO_VALUE = {
  'odnokimnatni-kvartiru': '1',
  'dvokimnatni-kvartiru': '2',
  'trikimnatni-kvartiru': '3',
  '4-kimnatni-kvartiru': '4',
  '5-kimnatni-kvartiru': '5',

  // додали для апартаментів
  'odnokimnatni-apartamenti': '1',
  'dvokimnatni-apartamenti': '2',
  'trikimnatni-apartamenti': '3',
  '4-kimnatni-apartamenti': '4',
  '5-kimnatni-apartamenti': '5',
};

const ROOMS_BY_BASE = {
  flats: {
    '1': 'odnokimnatni-kvartiru',
    '2': 'dvokimnatni-kvartiru',
    '3': 'trikimnatni-kvartiru',
    '4': '4-kimnatni-kvartiru',
    '5': '5-kimnatni-kvartiru',
  },
  apartments: {
    '1': 'odnokimnatni-apartamenti',
    '2': 'dvokimnatni-apartamenti',
    '3': 'trikimnatni-apartamenti',
    '4': '4-kimnatni-apartamenti',
    '5': '5-kimnatni-apartamenti',
  },
};

function getRoomsMapsForBase(base) {
  const valueToSlug = ROOMS_BY_BASE[base] || {};
  const slugToValue = Object.fromEntries(
    Object.entries(valueToSlug).map(([value, slug]) => [slug, value]),
  );
  return { valueToSlug, slugToValue };
}

const ROOMS_VALUE_TO_SLUG = Object.fromEntries(
  Object.entries(ROOMS_SLUG_TO_VALUE).map(([slug, val]) => [val, slug]),
);

function getBaseFromPathname() {
  const parts = window.location.pathname.split('/').filter(Boolean);
  return parts.find(p => BASES.includes(p)) || null;
}

function setSingleRoom(filters, v) {
  if (!v) {
    filters.rooms = [];
    return;
  }
  filters.rooms = [String(v)];
}

function parseFiltersFromSlashUrl(defaultFilters, base) {
  const out = { ...defaultFilters };

  const parts = window.location.pathname.split('/').filter(Boolean);
  const baseIndex = parts.indexOf(base);
  if (baseIndex === -1) return out;

  const { slugToValue } = getRoomsMapsForBase(base);

  let i = baseIndex + 1;

  // 1) rooms slug
  const first = parts[i];
  if (first && slugToValue[first]) {
    setSingleRoom(out, slugToValue[first]);
    i += 1;
  }

  // 2) key/value pairs
  let hasUsdPreset = false;

  for (; i < parts.length; i += 2) {
    const key = parts[i];
    const val = parts[i + 1];
    if (!key || !val) break;

    switch (key) {
      case 'price-usd':
        out.pricePresetUsd = decodeURIComponent(val);
        hasUsdPreset = true;
        out.priceMin = '';
        out.priceMax = '';
        break;

      case 'price':
        if (hasUsdPreset) break;
        {
          const [min, max] = decodeURIComponent(val).split('-');
          out.priceMin = min || '';
          out.priceMax = max || '';
        }
        break;

      case 'area': {
        const [min, max] = decodeURIComponent(val).split('-');
        out.areaMin = min || '';
        out.areaMax = max || '';
        break;
      }

      case 'floor': {
        const [min, max] = decodeURIComponent(val).split('-');
        out.floorMin = min || '';
        out.floorMax = max || '';
        break;
      }

      case 'complex':
        out.complex = decodeURIComponent(val)
          .split(',')
          .map(s => s.trim())
          .filter(Boolean);
        break;

      default:
        break;
    }
  }

  return out;
}

document.addEventListener('DOMContentLoaded', async () => {
  if (!document.querySelector('.section_flats')) return;

  const PAGE_SIZE = 12;

  const defaultFilters = {
    complex: [],
    type: [],
    rooms: [],
    priceMin: '',
    priceMax: '',
    pricePresetUsd: '',
    areaMin: '',
    areaMax: '',
    floorMin: '',
    floorMax: '',
    sort: '',
  };

  const masterType = getMasterType();

  const base = getBaseFromPathname();
  if (!base) return;

  const allPremises = await initUnits();
  const safePremises = Array.isArray(allPremises) ? allPremises : [];

  const storedFilters = loadFiltersFromStorage(defaultFilters);
  const pathFilters = parseFiltersFromSlashUrl(defaultFilters, base);

  const merged = {
    ...storedFilters,
    ...pathFilters,
  };

  const filters = adaptFiltersByType(merged, masterType);

  // rooms safety
  if (filters.rooms?.length > 1) {
    setSingleRoom(filters, filters.rooms[0]);
  }

  // якщо type не дозволяє rooms — прибираємо
  if (['паркінг', 'комора', 'офіс', 'підвал'].includes(masterType)) {
    filters.rooms = [];
  }

  // ✅ storage: якщо є USD preset — не зберігаємо priceMin/priceMax
  const { type, ...toStoreRaw } = filters;
  const toStore = { ...toStoreRaw };

  if (toStore.pricePresetUsd) {
    toStore.priceMin = '';
    toStore.priceMax = '';
  }

  saveFiltersToStorage(toStore);

  // ✅ URL
  const filtersForUrl = { ...filters, sort: '' };
  updateUrl(filtersForUrl);

  // ✅ Render + apply
  renderFilter(safePremises, filters);
  applyFiltersAndSave(safePremises, filters, PAGE_SIZE);

  // ✅ listeners
  initSortSelect(filters, PAGE_SIZE);
  attachFilterListeners(safePremises, filters, PAGE_SIZE);
  attachLoadMore(PAGE_SIZE);
  initFilterPopup();
  updatePopupCount();

  // ===== TOP BG + TITLE =====
  const normalizedType = masterType;
  if (!normalizedType) return;

  const baseURL = window.location.origin;
  const screenWidth = window.innerWidth;
  const baseImagePath = '/wp-content/themes/3d/assets/images/bg/';

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
    офіс: { desktop: 'bg_of.png', tablet: 'bg_of_tablet.png', mobile: 'bg_of_mob.png' },
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
  if (screenWidth < 480) fileName = images[normalizedType].mobile;
  else if (screenWidth <= 1024) fileName = images[normalizedType].tablet;
  else fileName = images[normalizedType].desktop;

  const finalSrc = baseURL + baseImagePath + fileName;

  const bgEl = document.querySelector('.section_top_subpage__bg');
  if (bgEl) bgEl.setAttribute('src', finalSrc);

  const titleEl = document.querySelector('.section_top_subpage__title');
  const breadcrumbs = document.querySelector('.section_top_subpage__breadcrumbs_type');
  if (titleEl && titleMap[normalizedType] && breadcrumbs) {
    titleEl.textContent = titleMap[normalizedType];
    breadcrumbs.textContent = titleMap[normalizedType];
  }

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
