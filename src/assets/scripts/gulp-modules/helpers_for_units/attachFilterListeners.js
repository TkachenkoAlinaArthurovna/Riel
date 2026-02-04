import { syncFiltersFromControls } from './syncFiltersFromControls';
import { updateUrl } from './updateUrl';
import { applyFiltersAndSave } from './applyFiltersAndSave';
import { sortFilteredPremises } from './sortFilteredPremises';
import { renderFilter } from './renderFilter';
import { updatePopupCount } from './updatePopupCount';

/**
 * @param {Array} allUnits      - всі приміщення (повний список з бекенду)
 * @param {Object} filters      - об’єкт фільтрів (той самий, що створили в units.js)
 * @param {number} portionSize  - скільки карток показувати за раз ("завантажити ще")
 */
export function attachFilterListeners(allUnits, filters, portionSize = 12) {
  let projectWrapper;
  let filterRoot;

  const isPopupMode = window.innerWidth <= 1500;

  if (window.innerWidth > 1500) {
    // DESKTOP
    projectWrapper = document.querySelector('.filter__item_wrapper.project');
    filterRoot = document.querySelector('.section_flats__filter');
  } else {
    // MOBILE / POPUP
    projectWrapper = document.querySelector('.filter_flats .filter_flats__project');
    filterRoot = document.querySelector('.filter_flats');
  }

  if (!projectWrapper && !filterRoot) return;

  const masterType = (window.RIEL_DEFAULT_TYPE ?? '')
    .toString()
    .trim()
    .toLowerCase();

  function runPipeline({ rerenderFilter = false, apply = true } = {}) {
    const synced = syncFiltersFromControls(filters);

    // не дозволяємо DOM/URL керувати type
    if ('type' in synced) delete synced.type;

    Object.assign(filters, synced);

    // type тільки master (і незмінний)
    filters.type = masterType ? [masterType] : [];

    // якщо для деяких типів не можна rooms/area/floor — ще раз “підчистити”
    // (опційно, але я раджу)
    // adaptFiltersByType(filters, masterType);

    if (apply) {
      // URL оновлюємо БЕЗ type
      const { type, ...urlFilters } = filters;
      updateUrl(urlFilters);

      applyFiltersAndSave(allUnits, filters, portionSize);

      if (filters.sort) {
        sortFilteredPremises(filters.sort, portionSize);
      }

      updatePopupCount();
    }
  }

  // Зміна ЖК (чекбокси в .filter__item_wrapper.project)
  if (projectWrapper) {
    projectWrapper.addEventListener('change', e => {
      const target = e.target;
      if (!(target instanceof HTMLInputElement)) return;
      if (!target.classList.contains('checkbox__input')) return;

      runPipeline({
        rerenderFilter: true,
        apply: !isPopupMode,
      });
    });
  }

  // Інші фільтри (тип, кімнати, повзунки)
  if (filterRoot) {
    // чекбокси, select-и тощо
    filterRoot.addEventListener('change', e => {
      const target = e.target;
      if (!(target instanceof HTMLInputElement) && !(target instanceof HTMLSelectElement)) {
        return;
      }

      runPipeline({
        apply: !isPopupMode,
      });
    });

    // повзунки (range) по input
    filterRoot.addEventListener('input', e => {
      const target = e.target;
      if (!(target instanceof HTMLInputElement)) return;
      if (target.type !== 'range') return;

      runPipeline({
        apply: !isPopupMode,
      });
    });
  }

  // POPUP: "Застосувати" + "Очистити"
  if (isPopupMode) {
    const applyBtn = document.querySelector('.filter_popup__btn_apply');
    const clearBtn = document.querySelector('.filter_popup__btn_delete');
    const popupFilter = document.querySelector('.filter_popup');

    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        runPipeline({
          apply: true,
          rerenderFilter: false,
        });

        if (popupFilter) {
          popupFilter.classList.remove('active');
          document.body.classList.remove('no-scroll');
        }
      });
    }

    if (clearBtn && filterRoot) {
      clearBtn.addEventListener('click', () => {
        const inputs = filterRoot.querySelectorAll('input');

        inputs.forEach(input => {
          if (input.type === 'checkbox' || input.type === 'radio') {
            input.checked = false;
          }

          if (input.type === 'range') {
            const isMin = input.dataset.filter && input.dataset.filter.endsWith('_min');
            const isMax = input.dataset.filter && input.dataset.filter.endsWith('_max');

            if (isMin && input.min !== '') {
              input.value = input.min;
            } else if (isMax && input.max !== '') {
              input.value = input.max;
            }

            input.dispatchEvent(new Event('input', { bubbles: true }));
          }
        });

        runPipeline({
          apply: true,
          rerenderFilter: false,
        });

        if (popupFilter) {
          popupFilter.classList.remove('active');
          document.body.classList.remove('no-scroll');
        }
      });
    }
  }
}
