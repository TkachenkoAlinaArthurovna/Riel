/**
 * Оновлює URL сторінки на основі поточного стану selectedFilter
 * без перезавантаження сторінки
 *
 * @param {Object} selectedFilter - об’єкт із поточними фільтрами
 */
export function updateURLFromSelectedFilter() {
  const selectedFilter = JSON.parse(sessionStorage.getItem('selectedFilter'));
  const url = new URL(window.location);

  // спершу очищаємо старі параметри
  url.search = '';

  // додаємо актуальні параметри
  for (const key in selectedFilter) {
    if (selectedFilter[key] && selectedFilter[key].length > 0) {
      url.searchParams.set(key, selectedFilter[key].join(','));
    }
  }
  sessionStorage.setItem('selectedFilter', JSON.stringify(selectedFilter));

  // оновлюємо адресний рядок без перезавантаження
  window.history.replaceState({}, '', url);
}
