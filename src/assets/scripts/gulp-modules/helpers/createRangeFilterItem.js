/**
 * Універсальна функція для створення елемента фільтра типу "мін-макс"
 * @param {string} fieldName - назва поля (наприклад: "Площа" або "Поверх")
 * @param {string} dataName - data-name для елемента (наприклад: "size", "floor")
 * @param {object} selectedFilter - об’єкт з активними фільтрами
 * @param {HTMLElement} sectionFlatsSelected - контейнер для вибраних фільтрів
 * @param {HTMLElement} btnDelete - кнопка "очистити всі"
 * @param {function} filterCards - функція фільтрації карток
 * @param {function} updateURLFromSelectedFilter - функція оновлення URL
 *
 */
import { createFilterChip } from './createSelectedFilterItem.js';
export function createRangeFilterItem(
  fieldName,
  dataName,
  selectedFilter,
  sectionFlatsSelected,
  btnDelete,
  filterCards,
  updateURLFromSelectedFilter,
) {
  // 1. Видаляємо попередній елемент цього типу, якщо він є
  document.querySelectorAll(`[data-name="${dataName}"]`).forEach(el => el.remove());

  // 2. Знаходимо мінімальне і максимальне значення
  const minInput = document.querySelector(`[data-filter="${fieldName}_min"]`);
  const maxInput = document.querySelector(`[data-filter="${fieldName}_max"]`);

  if (!minInput || !maxInput) return;

  const min = minInput.value;
  const max = maxInput.value;

  createFilterChip({
    id: `${min}-${max}`,
    label: `${min}–${max}`,
    dataName,
    sectionFlatsSelected,
    btnDelete,
    selectedFilter,
    onDelete: () => {
      let selectedFilter = JSON.parse(sessionStorage.getItem('selectedFilter'));
      minInput.value = minInput.min;
      maxInput.value = maxInput.max;
      minInput.dispatchEvent(new Event('input'));
      maxInput.dispatchEvent(new Event('input'));
      delete selectedFilter[`${fieldName}_min`];
      delete selectedFilter[`${fieldName}_max`];
      sessionStorage.setItem('selectedFilter', JSON.stringify(selectedFilter));
    },
    filterCards,
    updateURLFromSelectedFilter,
  });
  // 3. Створюємо елемент фільтра
  // const item = document.createElement('div');
  // item.classList.add('section_flats__selected_item');
  // item.dataset.id = `${min}-${max}`;
  // item.dataset.name = dataName;
  // item.innerHTML = `
  //   <span>${min}-${max}</span>
  //   <svg class="delete-item" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
  //     <path d="M2.02344 0.938965L6.02344 4.93994L9.97656 0.986816L11.0371 2.04736L7.08398 6.00049L11.0371 9.95264L9.97656 11.0132L6.02344 7.06103L2.02344 11.061L0.962891 9.99951L4.96289 6.00049L0.96289 1.99951L2.02344 0.938965Z" fill="#1D3541"/>
  //   </svg>
  // `;

  // 4. Обробка кліку по "delete"
  // const close = item.querySelector('.delete-item');
  // close.addEventListener('click', () => {
  //   item.remove();

  //   // Скидаємо інпути
  //   minInput.value = minInput.min;
  //   maxInput.value = maxInput.max;
  //   minInput.dispatchEvent(new Event('input'));
  //   maxInput.dispatchEvent(new Event('input'));

  //   // Видаляємо значення з selectedFilter
  //   delete selectedFilter[`${fieldName}_min`];
  //   delete selectedFilter[`${fieldName}_max`];
  //   sessionStorage.setItem('selectedFilter', JSON.stringify(selectedFilter));

  //   // Оновлюємо картки і URL
  //   filterCards();
  //   updateURLFromSelectedFilter(selectedFilter);

  //   // Ховаємо кнопку, якщо фільтрів більше нема
  //   if (Object.keys(selectedFilter).length === 0) {
  //     btnDelete.style.display = 'none';
  //   }
  // });

  // 5. Додаємо елемент у контейнер
  // sectionFlatsSelected.appendChild(item);
}
