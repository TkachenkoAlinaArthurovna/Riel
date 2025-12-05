export function loadFiltersFromStorage(defaultFilters) {
  const raw = localStorage.getItem('filters');

  if (!raw) {
    return { ...defaultFilters };
  }

  try {
    const parsed = JSON.parse(raw);
    return { ...defaultFilters, ...parsed };
  } catch (e) {
    console.warn('Failed to parse filters from localStorage', e);
    return { ...defaultFilters };
  }
}

export function saveFiltersToStorage(filters) {
  try {
    localStorage.setItem('filters', JSON.stringify(filters));
  } catch (e) {
    console.warn('Failed to save filters to localStorage', e);
  }
}
