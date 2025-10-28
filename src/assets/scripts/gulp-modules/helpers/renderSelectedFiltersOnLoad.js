/**
 * Відмальовує всі вибрані фільтри (чіпи) з sessionStorage при завантаженні сторінки
 * @param {function} filterCards – функція фільтрації карток
 * @param {function} updateURLFromSelectedFilter – функція оновлення URL
 */
export function renderSelectedFiltersOnLoad(
  filterCards,
  updateURLFromSelectedFilter,
  syncInputsWithSelectedFilter,
  unitsData,
) {
  const selectedFilter = JSON.parse(sessionStorage.getItem('selectedFilter')) || {};
  const sectionFlatsSelected = document.querySelector('.section_flats__selected_wrapper');
  const btnDelete = document.querySelector('.btn_delete');
  if (!sectionFlatsSelected) return;

  // 🔁 проходимо по кожному фільтру
  Object.entries(selectedFilter).forEach(([key, values]) => {
    if (key == 'project' || key == 'type' || key == 'room_count') {
      values.forEach(value => {
        if (
          sectionFlatsSelected.querySelector(
            `.section_flats__selected_item[data-id="${value}"][data-name="${key}"]`,
          )
        ) {
          return; // пропускаємо, якщо вже існує
        }
        const item = document.createElement('div');
        item.classList.add('section_flats__selected_item');
        item.dataset.id = value;
        item.dataset.name = key;
        item.innerHTML = `
        <span>${value}</span>
        <svg class="delete-item"  width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2.02344 0.938965L6.02344 4.93994L9.97656 0.986816L11.0371 2.04736L7.08398 6.00049L11.0371 9.95264L9.97656 11.0132L6.02344 7.06103L2.02344 11.061L0.962891 9.99951L4.96289 6.00049L0.96289 1.99951L2.02344 0.938965Z" fill="#1D3541"/>
        </svg>
      `;
        sectionFlatsSelected.prepend(item);
        const close = item.querySelector('.delete-item');
        close.addEventListener('click', () => {
          // видаляємо з DOM
          item.remove();

          if (selectedFilter[key]) {
            selectedFilter[key] = selectedFilter[key].filter(v => v !== value);
            if (selectedFilter[key].length === 0) delete selectedFilter[key];
          }

          // зберігаємо в sessionStorage
          sessionStorage.setItem('selectedFilter', JSON.stringify(selectedFilter));

          // якщо всі фільтри видалено — ховаємо кнопку
          if (Object.keys(selectedFilter).length === 0 && btnDelete) {
            btnDelete.style.display = 'none';
          }
          filterCards();
          updateURLFromSelectedFilter();
          syncInputsWithSelectedFilter(unitsData);
        });
      });
    }
  });
}
