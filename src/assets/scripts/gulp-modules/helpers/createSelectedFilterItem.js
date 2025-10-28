/**
 * Створює універсальний елемент вибраного фільтра (чіп)
 * @param {object} options - налаштування
 * @param {string} options.id - унікальний id для data-id
 * @param {string} options.label - текст усередині чіпа
 * @param {string} options.dataName - значення для data-name
 * @param {HTMLElement} options.sectionFlatsSelected - контейнер для чіпів
 * @param {HTMLElement} options.btnDelete - кнопка "очистити всі"
 * @param {object} options.selectedFilter - об’єкт активних фільтрів
 * @param {function} options.onDelete - колбек при видаленні (наприклад скидання інпутів)
 * @param {function} options.filterCards - фільтрація карток
 * @param {function} options.updateURLFromSelectedFilter - оновлення URL
 */
export function createFilterChip({
  id,
  label,
  dataName,
  sectionFlatsSelected,
  btnDelete,
  selectedFilter,
  onDelete,
  filterCards,
  updateURLFromSelectedFilter,
}) {
  // уникаємо дублікатів

  if (sectionFlatsSelected.querySelector(`[data-id="${label}"]`)) return;

  const item = document.createElement('div');
  item.classList.add('section_flats__selected_item');
  item.dataset.id = id;
  item.dataset.name = dataName;
  item.innerHTML = `
    <span>${label}</span>
    <svg class="delete-item" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.02344 0.938965L6.02344 4.93994L9.97656 0.986816L11.0371 2.04736L7.08398 6.00049L11.0371 9.95264L9.97656 11.0132L6.02344 7.06103L2.02344 11.061L0.962891 9.99951L4.96289 6.00049L0.96289 1.99951L2.02344 0.938965Z" fill="#1D3541"/>
    </svg>
  `;

  const close = item.querySelector('.delete-item');
  close.addEventListener('click', () => {
    item.remove();

    // колбек при видаленні (скидає значення)
    if (typeof onDelete === 'function') onDelete();

    // якщо фільтрів більше немає — ховаємо кнопку
    if (Object.keys(selectedFilter).length === 0) {
      btnDelete.style.display = 'none';
    }

    filterCards();
    updateURLFromSelectedFilter(selectedFilter);
  });

  sectionFlatsSelected.appendChild(item);
}
