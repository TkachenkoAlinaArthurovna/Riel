export function syncInputsWithSelectedFilter(unitsData) {
  const selectedFilter = JSON.parse(sessionStorage.getItem('selectedFilter'));
  const allInputs = document.querySelectorAll('.section_flats__filter input, .filter_flats input');

  allInputs.forEach(input => {
    const filterKey = input.dataset.filter?.split('-')[0];
    if (!filterKey) return;

    // --- чекбокси ---
    if (input.type === 'checkbox') {
      const value = input.dataset.filter.split('-')[1];

      input.checked = selectedFilter[filterKey]?.includes(value) || false;

      if (selectedFilter[filterKey]?.includes(value)) {
        input.setAttribute('checked', 'checked');
        // input.dispatchEvent(new Event('change', { bubbles: true }));
      } else {
        input.removeAttribute('checked');
      }
    }

    // --- слайдери ---
    if (input.type === 'range') {
      if (selectedFilter[`${filterKey}`]) {
        input.value = selectedFilter[`${filterKey}`];
        input.setAttribute('value', selectedFilter[`${filterKey}`]);
      }
      // input.dispatchEvent(new Event('input'));
    }
  });
}
