export function createSizeFilterItem(
  selectedFilter,
  sectionFlatsSelected,
  btnDelete,
  filterCards,
  updateURLFromSelectedFilter,
) {
  // 1. Видаляємо попередній елемент розміру, якщо він є
  document.querySelectorAll('[data-name="size"]').forEach(el => el.remove());

  // 2. Отримуємо значення мін/макс площі
  const min = document.querySelector('[data-filter="Площа_min"]').value;
  const max = document.querySelector('[data-filter="Площа_max"]').value;

  // 3. Створюємо елемент фільтра
  const item = document.createElement('div');
  item.classList.add('section_flats__selected_item');
  item.dataset.id = `${min}-${max}`;
  item.dataset.name = `size`;
  item.innerHTML = `
    <span>${min}-${max}</span>
    <svg class="delete-item" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.02344 0.938965L6.02344 4.93994L9.97656 0.986816L11.0371 2.04736L7.08398 6.00049L11.0371 9.95264L9.97656 11.0132L6.02344 7.06103L2.02344 11.061L0.962891 9.99951L4.96289 6.00049L0.96289 1.99951L2.02344 0.938965Z" fill="#1D3541"/>
    </svg>
  `;

  // 4. Обробка видалення фільтра
  const close = item.querySelector('.delete-item');
  close.addEventListener('click', () => {
    item.remove(); // видаляємо блок

    const minInput = document.querySelector('[data-filter="Площа_min"]');
    const maxInput = document.querySelector('[data-filter="Площа_max"]');

    if (minInput && maxInput) {
      // Скидаємо значення на початкові
      minInput.value = minInput.min;
      maxInput.value = maxInput.max;
      minInput.dispatchEvent(new Event('input'));
      maxInput.dispatchEvent(new Event('input'));
    }

    // 5. Очищаємо selectedFilter
    if (selectedFilter['Площа_min']) delete selectedFilter['Площа_min'];
    if (selectedFilter['Площа_max']) delete selectedFilter['Площа_max'];
    sessionStorage.setItem('selectedFilter', JSON.stringify(selectedFilter));

    // 6. Оновлюємо фільтрацію
    filterCards();
    updateURLFromSelectedFilter(selectedFilter);

    // 7. Ховаємо кнопку видалення, якщо фільтрів не залишилось
    if (Object.keys(selectedFilter).length === 0) {
      btnDelete.style.display = 'none';
    }
  });

  // 8. Додаємо елемент у контейнер вибраних фільтрів
  sectionFlatsSelected.appendChild(item);
}
