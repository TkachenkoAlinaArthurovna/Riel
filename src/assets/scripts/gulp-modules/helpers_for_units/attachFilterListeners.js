import { syncFiltersFromControls } from './syncFiltersFromControls';
import { applyFiltersAndSave } from './applyFiltersAndSave';
import { sortFilteredPremises } from './sortFilteredPremises';
import { updatePopupCount } from './updatePopupCount';
import { updateUrl } from './updateUrl';

function setSingleRoom(filters, v) {
  if (!v) {
    filters.rooms = [];
    return;
  }
  filters.rooms = [String(v)];
}

function isRoomsControl(el) {
  if (!(el instanceof HTMLInputElement)) return false;
  if (el.type !== 'checkbox') return false;
  const df = String(el.dataset?.filter || '');
  return df.startsWith('rooms-'); // rooms-1, rooms-2...
}

function getRoomsValueFromInput(input) {
  const dn = String(input.dataset?.name || '').trim(); // data-name="1"
  if (/^\d+$/.test(dn)) return dn;

  const df = String(input.dataset?.filter || '').trim(); // data-filter="rooms-1"
  const m = df.match(/\d+/);
  return m ? m[0] : null;
}

// ✅ віджимає інші rooms-чекбокси тільки в цій групі
function uncheckOtherRoomsInSameGroup(changedInput) {
  const wrapper =
    changedInput.closest('.filter__item_wrapper.room_count') ||
    changedInput.closest('.filter__item_wrapper.room_count_popup') ||
    changedInput.closest('.room_count');

  if (!wrapper) return;

  wrapper.querySelectorAll('input.checkbox__input[type="checkbox"]').forEach(cb => {
    if (!(cb instanceof HTMLInputElement)) return;
    if (cb === changedInput) return;
    if (!isRoomsControl(cb)) return;
    cb.checked = false;
  });
}

function isUsdPresetRadio(el) {
  if (!(el instanceof HTMLInputElement)) return false;
  if (el.type !== 'radio') return false;
  return el.name === 'pricePresetPage' || el.name === 'pricePresetPopup';
}

function resetUahPriceSlidersToDefault(filterRoot) {
  if (!filterRoot) return;

  const wrappers = [
    filterRoot.querySelector('.filter__slider.price'),
    filterRoot.querySelector('.filter__slider.price_popup'),
  ].filter(Boolean);

  window.__RIEL_SYNCING_FILTERS__ = true;

  wrappers.forEach(wrap => {
    const minEl = wrap.querySelector('input[data-filter="Ціна_min"]');
    const maxEl = wrap.querySelector('input[data-filter="Ціна_max"]');
    if (!(minEl instanceof HTMLInputElement) || !(maxEl instanceof HTMLInputElement)) return;

    if (minEl.min !== '') minEl.value = minEl.min;
    if (maxEl.max !== '') maxEl.value = maxEl.max;

    minEl.dispatchEvent(new Event('input', { bubbles: true }));
    maxEl.dispatchEvent(new Event('input', { bubbles: true }));
  });

  window.__RIEL_SYNCING_FILTERS__ = false;
}

function uncheckUsdPresetRadios(filterRoot) {
  if (!filterRoot) return;

  filterRoot
    .querySelectorAll(
      'input[type="radio"][name="pricePresetPage"], input[type="radio"][name="pricePresetPopup"]',
    )
    .forEach(r => {
      if (r instanceof HTMLInputElement) r.checked = false;
    });
}

/**
 * @param {Array} allUnits
 * @param {Object} filters
 * @param {number} portionSize
 */
export function attachFilterListeners(allUnits, filters, portionSize = 12) {
  let projectWrapper;
  let filterRoot;

  const isPopupMode = window.innerWidth <= 1500;

  if (window.innerWidth > 1500) {
    projectWrapper = document.querySelector('.filter__item_wrapper.project');
    filterRoot = document.querySelector('.section_flats__filter');
  } else {
    projectWrapper = document.querySelector('.filter_flats .filter_flats__project');
    filterRoot = document.querySelector('.filter_flats');
  }

  if (!projectWrapper && !filterRoot) return;

  const masterType = (window.RIEL_DEFAULT_TYPE ?? '')
    .toString()
    .trim()
    .toLowerCase();

  function runPipeline({
    apply = true,
    lastRoomsValue = undefined,
    priceTouched = false,
    usdPresetChanged = false,
  } = {}) {
    const synced = syncFiltersFromControls(filters);

    // type не беремо з DOM/URL
    if ('type' in synced) delete synced.type;

    Object.assign(filters, synced);

    // ✅ якщо користувач вручну чіпав ціну (грн) — скидаємо USD preset
    if (priceTouched) {
      filters.pricePresetUsd = '';
      // ✅ і в UI теж знімаємо radio
      uncheckUsdPresetRadios(filterRoot);
    }

    // ✅ якщо вибрали USD preset — чистимо ручний діапазон грн + скидаємо range UI
    if (usdPresetChanged && filters.pricePresetUsd) {
      filters.priceMin = '';
      filters.priceMax = '';
      resetUahPriceSlidersToDefault(filterRoot);
    }

    // type тільки master
    filters.type = masterType ? [masterType] : [];

    // ✅ rooms single-select
    if (lastRoomsValue === null) {
      filters.rooms = [];
    } else if (typeof lastRoomsValue === 'string' && lastRoomsValue) {
      setSingleRoom(filters, lastRoomsValue);
    } else if (filters.rooms?.length > 1) {
      setSingleRoom(filters, filters.rooms[0]);
    }

    // якщо тип не дозволяє rooms — прибираємо
    if (['паркінг', 'комора', 'офіс', 'підвал'].includes(masterType)) {
      filters.rooms = [];
    }

    if (apply) {
      updateUrl(filters);
      applyFiltersAndSave(allUnits, filters, portionSize);

      if (filters.sort) {
        sortFilteredPremises(filters.sort, portionSize);
      }

      updatePopupCount();
    }
  }

  function normalizeTarget(t) {
    // Text node -> parent element
    if (t && t.nodeType === 3) return t.parentElement;
    return t instanceof Element ? t : null;
  }

  function getRadioFromTarget(rawTarget) {
    const target = normalizeTarget(rawTarget);
    if (!target) return null;

    // якщо клікнули прямо по input
    if (target instanceof HTMLInputElement && target.type === 'radio') return target;

    // якщо клікнули по span/тексту всередині label
    const label = target.closest('label');
    if (!label) return null;

    const input = label.querySelector('input[type="radio"]');
    return input instanceof HTMLInputElement ? input : null;
  }

  function initUsdPresetRadioToggle(filterRoot) {
    if (!filterRoot) return;

    let lastDownRadio = null;

    filterRoot.addEventListener(
      'pointerdown',
      e => {
        if (window.__RIEL_SYNCING_FILTERS__) return;

        const radio = getRadioFromTarget(e.target);
        if (!radio) return;

        if (!isUsdPresetRadio(radio)) return;

        lastDownRadio = radio.checked ? radio : null;
      },
      true, // capture — щоб зловити “до” стандартної поведінки
    );

    filterRoot.addEventListener('click', e => {
      if (window.__RIEL_SYNCING_FILTERS__) return;

      const radio = getRadioFromTarget(e.target);

      if (!radio) return;
      if (!isUsdPresetRadio(radio)) return;

      if (lastDownRadio === radio) {
        window.__RIEL_SYNCING_FILTERS__ = true;
        radio.checked = false;
        filters.pricePresetUsd = '';
        window.__RIEL_SYNCING_FILTERS__ = false;

        runPipeline({ apply: !isPopupMode, usdPresetChanged: true });
      }

      lastDownRadio = null;
    });
  }

  initUsdPresetRadioToggle(filterRoot);

  // ЖК
  if (projectWrapper) {
    projectWrapper.addEventListener('change', e => {
      if (window.__RIEL_SYNCING_FILTERS__) return;
      const target = e.target;
      if (!(target instanceof HTMLInputElement)) return;
      if (!target.classList.contains('checkbox__input')) return;

      runPipeline({ apply: !isPopupMode });
    });
  }

  // Інші фільтри
  if (filterRoot) {
    filterRoot.addEventListener('change', e => {
      if (window.__RIEL_SYNCING_FILTERS__) return;

      const target = e.target;

      if (!(target instanceof HTMLInputElement) && !(target instanceof HTMLSelectElement)) return;

      let lastRoomsValue = undefined;
      let priceTouched = false;
      let usdPresetChanged = false;

      // ✅ rooms: single-select
      if (target instanceof HTMLInputElement && isRoomsControl(target)) {
        if (target.checked) {
          uncheckOtherRoomsInSameGroup(target);
          lastRoomsValue = getRoomsValueFromInput(target) || null;
        } else {
          lastRoomsValue = null;
        }
      }

      // ✅ USD preset (radio)
      if (isUsdPresetRadio(target)) {
        usdPresetChanged = true;
      }

      // ✅ якщо change прилетів від range (інколи буває)
      if (target instanceof HTMLInputElement && target.type === 'range') {
        const df = String(target.dataset?.filter || '');
        priceTouched = df === 'Ціна_min' || df === 'Ціна_max';
      }

      runPipeline({
        apply: !isPopupMode,
        lastRoomsValue,
        priceTouched,
        usdPresetChanged,
      });
    });

    // range (під час руху)
    filterRoot.addEventListener('input', e => {
      if (window.__RIEL_SYNCING_FILTERS__) return;
      const target = e.target;
      if (!(target instanceof HTMLInputElement)) return;
      if (target.type !== 'range') return;

      const df = String(target.dataset?.filter || '');
      const isPriceRange = df === 'Ціна_min' || df === 'Ціна_max';

      runPipeline({ apply: !isPopupMode, priceTouched: isPriceRange });
    });
  }

  // POPUP кнопки
  if (isPopupMode) {
    const applyBtn = document.querySelector('.filter_popup__btn_apply');
    const clearBtn = document.querySelector('.filter_popup__btn_delete');
    const popupFilter = document.querySelector('.filter_popup');

    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        runPipeline({ apply: true });

        if (popupFilter) {
          popupFilter.classList.remove('active');
          document.body.classList.remove('no-scroll');
        }
      });
    }

    if (clearBtn && filterRoot) {
      clearBtn.addEventListener('click', () => {
        // ✅ щоб change/input не робили runPipeline() багато разів
        window.__RIEL_SYNCING_FILTERS__ = true;

        const inputs = filterRoot.querySelectorAll('input');

        inputs.forEach(input => {
          if (!(input instanceof HTMLInputElement)) return;

          if (input.type === 'checkbox' || input.type === 'radio') {
            input.checked = false;
          }

          if (input.type === 'range') {
            const isMin = input.dataset.filter && input.dataset.filter.endsWith('_min');
            const isMax = input.dataset.filter && input.dataset.filter.endsWith('_max');

            if (isMin && input.min !== '') input.value = input.min;
            else if (isMax && input.max !== '') input.value = input.max;

            input.dispatchEvent(new Event('input', { bubbles: true }));
          }
        });

        // ✅ скидаємо стани у filters
        filters.sort = '';
        filters.complex = [];
        filters.areaMin = '';
        filters.areaMax = '';
        filters.floorMin = '';
        filters.floorMax = '';

        window.__RIEL_SYNCING_FILTERS__ = false;

        runPipeline({ apply: true });

        if (popupFilter) {
          popupFilter.classList.remove('active');
          document.body.classList.remove('no-scroll');
        }
      });
    }
  }
}
