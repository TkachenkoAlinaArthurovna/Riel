// import { syncFiltersFromControls } from './syncFiltersFromControls';
// import { updateUrl } from './updateUrl';
// import { applyFiltersAndSave } from './applyFiltersAndSave';
// import { sortFilteredPremises } from './sortFilteredPremises';
// import { renderFilter } from './renderFilter';

// /**
//  * @param {Array} allUnits      - всі приміщення (повний список з бекенду)
//  * @param {Object} filters      - об’єкт фільтрів (той самий, що створили в units.js)
//  * @param {number} portionSize  - скільки карток показувати за раз ("завантажити ще")
//  */
// export function attachFilterListeners(allUnits, filters, portionSize = 12) {
//   const isPopupMode = window.innerWidth <= 1500;
//   let projectWrapper;
//   let filterRoot;

//   if (window.innerWidth > 1500) {
//     projectWrapper = document.querySelector('.filter__item_wrapper.project');
//     filterRoot = document.querySelector('.section_flats__filter');
//   } else {
//     projectWrapper = document.querySelector('.filter_flats .filter_flats__project');
//     filterRoot = document.querySelector('.filter_flats');
//   }

//   if (!projectWrapper && !filterRoot) return;

//   // спільний пайплайн для оновлення фільтрів
//   function runPipeline({ rerenderFilter = false } = {}) {
//     // 1. читаємо актуальні значення фільтрів з DOM
//     const synced = syncFiltersFromControls(filters);

//     // 2. оновлюємо існуючий об’єкт filters (НЕ створюємо новий!)
//     Object.assign(filters, synced);

//     // 3. оновлюємо URL (без sort)
//     updateUrl(filters);

//     // 4. фільтруємо allUnits → зберігаємо filteredPremises в localStorage → малюємо першу порцію
//     applyFiltersAndSave(allUnits, filters, portionSize);

//     // 5. якщо є активне сортування — ПОВЕРХ щойно відфільтрованого масиву
//     if (filters.sort) {
//       console.log(filters.sort);
//       sortFilteredPremises(filters.sort, portionSize);
//     }

//     // 6. якщо змінювався список ЖК — переформувати чекбокси/слайдери під нові ЖК
//     if (rerenderFilter) {
//       renderFilter(allUnits, filters);
//     }
//   }

//   // 🔹 Зміна ЖК (чекбокси в .filter__item_wrapper.project)
//   if (projectWrapper) {
//     projectWrapper.addEventListener('change', e => {
//       const target = e.target;
//       if (!(target instanceof HTMLInputElement)) return;
//       if (!target.classList.contains('checkbox__input')) return;

//       // при зміні ЖК ще й оновлюємо сам фільтр (тип/кімнати/слайдери)
//       runPipeline({ rerenderFilter: true });
//     });
//   }

//   // 🔹 Інші фільтри всередині .section_flats__filter (тип, кімнати, повзунки)
//   if (filterRoot) {
//     // чекбокси, select-и тощо
//     filterRoot.addEventListener('change', e => {
//       const target = e.target;
//       if (!(target instanceof HTMLInputElement)) return;
//       runPipeline();
//     });

//     // повзунки (range) по input
//     filterRoot.addEventListener('input', e => {
//       const target = e.target;
//       if (!(target instanceof HTMLInputElement)) return;
//       if (target.type !== 'range') return;
//       runPipeline();
//     });
//   }
// }
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

  // popup-режим — коли екран <= 1500
  const isPopupMode = window.innerWidth <= 1500;

  if (window.innerWidth > 1500) {
    // 🔵 DESKTOP
    projectWrapper = document.querySelector('.filter__item_wrapper.project');
    filterRoot = document.querySelector('.section_flats__filter');
  } else {
    // 🟢 MOBILE / POPUP
    projectWrapper = document.querySelector('.filter_flats .filter_flats__project');
    filterRoot = document.querySelector('.filter_flats');
  }

  if (!projectWrapper && !filterRoot) return;

  // спільний пайплайн для оновлення фільтрів
  function runPipeline({ rerenderFilter = false, apply = true } = {}) {
    // 1. читаємо актуальні значення фільтрів з DOM
    const synced = syncFiltersFromControls(filters);

    // 2. оновлюємо існуючий об’єкт filters (НЕ створюємо новий!)
    Object.assign(filters, synced);

    // 3–5. тільки якщо реально "застосовуємо"
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

  // 🔹 Зміна ЖК (чекбокси в .filter__item_wrapper.project)
  if (projectWrapper) {
    projectWrapper.addEventListener('change', e => {
      const target = e.target;
      if (!(target instanceof HTMLInputElement)) return;
      if (!target.classList.contains('checkbox__input')) return;

      // DESKTOP: змінюємо ЖК + одразу застосовуємо
      // POPUP: змінюємо ЖК + перерендеримо контролли, але список ще НЕ чіпаємо
      runPipeline({
        rerenderFilter: true,
        apply: !isPopupMode,
      });
    });
  }

  // 🔹 Інші фільтри (тип, кімнати, повзунки)
  if (filterRoot) {
    // чекбокси, select-и тощо
    filterRoot.addEventListener('change', e => {
      const target = e.target;
      if (!(target instanceof HTMLInputElement)) return;

      runPipeline({
        apply: !isPopupMode, // у попапі тільки оновлюємо filters, але не перераховуємо список
      });
    });

    // повзунки (range) по input
    filterRoot.addEventListener('input', e => {
      const target = e.target;
      if (!(target instanceof HTMLInputElement)) return;
      if (target.type !== 'range') return;

      runPipeline({
        apply: !isPopupMode, // у попапі не чіпаємо список на кожен рух повзунка
      });
    });
  }

  // 🟢 POPUP: "Застосувати" + "Очистити"
  if (isPopupMode) {
    const applyBtn = document.querySelector('.filter_popup__btn_apply');
    const clearBtn = document.querySelector('.filter_popup__btn_delete');
    const popupFilter = document.querySelector('.filter_popup');

    // ✅ "Застосувати" — застосовує фільтри і закриває попап
    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        runPipeline({
          apply: true,
          rerenderFilter: false, // контролли вже в актуальному стані
        });

        if (popupFilter) {
          popupFilter.classList.remove('active');
        }
      });
    }

    // 🧹 "Очистити" — очищає фільтри, ЗАСТОСОВУЄ одразу і закриває попап
    if (clearBtn && filterRoot) {
      clearBtn.addEventListener('click', () => {
        // 1. Скидаємо всі інпути всередині попап-фільтра
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

            // щоб оновились тултіпи/слайдер-трек
            input.dispatchEvent(new Event('input', { bubbles: true }));
          }
        });

        // 2. Синхронізуємо filters з очищеними контролами і ОДРАЗУ застосовуємо
        runPipeline({
          apply: true,
          rerenderFilter: false,
        });

        // 3. Закриваємо попап
        if (popupFilter) {
          popupFilter.classList.remove('active');
        }
      });
    }
  }
}
