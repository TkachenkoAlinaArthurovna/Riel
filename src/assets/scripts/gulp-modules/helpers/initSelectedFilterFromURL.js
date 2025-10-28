/**
 * Зчитує параметри з URL і формує об'єкт selectedFilter
 * @returns {Object} selectedFilter
 */
export function initSelectedFilterFromURL() {
  const params = new URLSearchParams(window.location.search);
  const selectedFilter = {};

  // пробігаємось по всіх параметрах у URL
  for (const [key, value] of params.entries()) {
    // якщо значення містить коми – робимо масив, інакше обертаємо в масив
    selectedFilter[key] = value.includes(',') ? value.split(',') : [value];
  }
  sessionStorage.setItem('selectedFilter', JSON.stringify(selectedFilter));

  return selectedFilter;
}
