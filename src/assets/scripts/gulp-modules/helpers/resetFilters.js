import { updateURLFromSelectedFilter } from './updateURLFromSelectedFilter';
import { chooseRightInputs } from './chooseRightInputs';
import { syncInputsWithSelectedFilter } from './syncInputsWithSelectedFilter';
import { countVisibleCards } from './countVisibleCards';

/**
 * Додає обробники подій для кнопок очищення фільтрів
 *
 * @param {Object} config - конфігураційний об'єкт
 * @param {Function} filterCards - функція, що оновлює картки після фільтрації
 * @param {HTMLElement|null} popupFilter - елемент попапа (може бути null)
 * @param {HTMLElement|null} sectionFlatsSelected - контейнер вибраних фільтрів (може бути null)
 * @param {HTMLElement|null} btnDelete - кнопка очищення фільтра у головному фільтрі
 * @param {HTMLElement|null} filterPopupBtnDelete - кнопка очищення фільтра у попапі
 */
export function initResetFilters({
  filterCards,
  popupFilter = null,
  sectionFlatsSelected = null,
  btnDelete = null,
  filterPopupBtnDelete = null,
  unitsData,
}) {
  const selectedFilter = JSON.parse(sessionStorage.getItem('selectedFilter'));
  // --- Обробник для попапа ---
  if (filterPopupBtnDelete) {
    filterPopupBtnDelete.addEventListener('click', () => {
      for (const key in selectedFilter) delete selectedFilter[key];
      sessionStorage.setItem('selectedFilter', JSON.stringify(selectedFilter));

      const filterInputs = document.querySelectorAll('.filter_flats input');

      filterInputs.forEach(input => {
        if (input.type === 'checkbox') {
          input.checked = false;
        } else if (input.type === 'range') {
          if (input.id.endsWith('-min')) {
            input.value = input.min;
          } else if (input.id.endsWith('-max')) {
            input.value = input.max;
          }
          input.dispatchEvent(new Event('input'));
          input.dispatchEvent(new Event('change'));
        }
      });

      filterCards();
      chooseRightInputs(unitsData);
      syncInputsWithSelectedFilter(unitsData);
      updateURLFromSelectedFilter();

      if (popupFilter) popupFilter.classList.remove('active');

      countVisibleCards();
    });
  }

  // --- Обробник для основного фільтра ---
  if (btnDelete) {
    btnDelete.addEventListener('click', () => {
      // очищаємо об’єкт selectedFilter, не створюючи новий
      for (const key in selectedFilter) delete selectedFilter[key];
      sessionStorage.setItem('selectedFilter', JSON.stringify(selectedFilter));

      const filterInputs = document.querySelectorAll('.section_flats input');

      filterInputs.forEach(input => {
        if (input.type === 'checkbox') {
          input.checked = false;
        } else if (input.type === 'range') {
          if (input.id.endsWith('-min')) {
            input.value = input.min;
          } else if (input.id.endsWith('-max')) {
            input.value = input.max;
          }
          input.dispatchEvent(new Event('input'));
          input.dispatchEvent(new Event('change'));
        }
      });

      if (sectionFlatsSelected) sectionFlatsSelected.innerHTML = '';

      filterCards();
      chooseRightInputs(unitsData);
      syncInputsWithSelectedFilter(unitsData);
      updateURLFromSelectedFilter();

      if (btnDelete) btnDelete.style.display = 'none';

      countVisibleCards();
    });
  }
}
