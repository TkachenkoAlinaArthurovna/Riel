export function loadFiltersFromStorage(defaultFilters) {
  const raw = localStorage.getItem('filters');

  if (!raw) {
    return { ...defaultFilters };
  }

  try {
    const parsed = JSON.parse(raw);
    const merged = { ...defaultFilters, ...parsed };

    // НОРМАЛІЗАЦІЯ ДЛЯ МУЛЬТИ-ФІЛЬТРІВ
    merged.complex = Array.isArray(merged.complex)
      ? merged.complex
      : merged.complex
      ? [merged.complex]
      : [];

    merged.type = Array.isArray(merged.type) ? merged.type : merged.type ? [merged.type] : [];

    merged.rooms = Array.isArray(merged.rooms) ? merged.rooms : merged.rooms ? [merged.rooms] : [];

    return merged;
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
