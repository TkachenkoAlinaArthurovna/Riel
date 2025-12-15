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

  function runPipeline({ rerenderFilter = false, apply = true } = {}) {
    // 1. читаємо актуальні значення фільтрів з DOM
    const synced = syncFiltersFromControls(filters);

    // 2. оновлюємо існуючий об’єкт filters (НЕ створюємо новий!)
    Object.assign(filters, synced);

    if (apply) {
      // 3. оновлюємо URL (без sort)
      updateUrl(filters);

      // 4. фільтруємо allUnits → зберігаємо filteredPremises → малюємо першу порцію
      applyFiltersAndSave(allUnits, filters, portionSize);

      // 5. якщо є активне сортування — поверх щойно відфільтрованого масиву
      if (filters.sort) {
        sortFilteredPremises(filters.sort, portionSize);
      }

      updatePopupCount();
    }

    // 6. якщо змінювався список ЖК — переформувати чекбокси/слайдери під нові ЖК
    if (rerenderFilter) {
      renderFilter(allUnits, filters);
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
        }
      });
    }
  }
}
