// helpers_for_units/filtersStorage.js

export function loadFiltersFromStorage(defaultFilters) {
  const raw = localStorage.getItem('filters');

  if (!raw) {
    return { ...defaultFilters };
  }

  try {
    const parsed = JSON.parse(raw);

    // type зі storage ігноруємо завжди
    if (parsed && typeof parsed === 'object' && 'type' in parsed) {
      delete parsed.type;
    }

    const merged = { ...defaultFilters, ...parsed };

    // НОРМАЛІЗАЦІЯ ДЛЯ МУЛЬТИ-ФІЛЬТРІВ
    merged.complex = Array.isArray(merged.complex)
      ? merged.complex
      : merged.complex
      ? [merged.complex]
      : [];

    merged.rooms = Array.isArray(merged.rooms) ? merged.rooms : merged.rooms ? [merged.rooms] : [];

    // На всяк випадок (якщо defaultFilters містить type)
    // але значення тут не важливе — masterType потім перезапише
    merged.type = [];

    return merged;
  } catch (e) {
    console.warn('Failed to parse filters from localStorage', e);
    return { ...defaultFilters, type: [] };
  }
}

export function saveFiltersToStorage(filters) {
  try {
    // type в localStorage не зберігаємо
    const { type, ...toStore } = filters || {};
    localStorage.setItem('filters', JSON.stringify(toStore));
  } catch (e) {
    console.warn('Failed to save filters to localStorage', e);
  }
}
