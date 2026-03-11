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

    const merged = { ...defaultFilters, ...(parsed && typeof parsed === 'object' ? parsed : {}) };

    // complex -> масив
    merged.complex = Array.isArray(merged.complex)
      ? merged.complex
      : merged.complex
      ? [merged.complex]
      : [];

    // rooms -> ✅ або [], або [one]
    const roomsArr = Array.isArray(merged.rooms)
      ? merged.rooms
      : merged.rooms
      ? [merged.rooms]
      : [];
    merged.rooms = roomsArr.length ? [String(roomsArr[0]).trim()].filter(Boolean) : [];

    // ✅ USD preset (НОВЕ)
    merged.pricePresetUsd = String(merged.pricePresetUsd || '').trim();

    // ✅ якщо активний preset — ручну ціну (грн) з storage ігноруємо
    if (merged.pricePresetUsd) {
      merged.priceMin = '';
      merged.priceMax = '';
    }

    // сторінок нема
    merged.page = 1;

    return merged;
  } catch (e) {
    console.warn('Failed to parse filters from localStorage', e);
    return {
      ...defaultFilters,
      rooms: [],
      complex: [],
      pricePresetUsd: '',
      priceMin: '',
      priceMax: '',
      page: 1,
    };
  }
}

export function saveFiltersToStorage(filters) {
  try {
    // type в localStorage не зберігаємо
    const { type, ...toStore } = filters || {};

    // ✅ rooms single
    if (Array.isArray(toStore.rooms) && toStore.rooms.length > 1) {
      toStore.rooms = [toStore.rooms[0]];
    }

    // ✅ USD preset single + trim
    toStore.pricePresetUsd = String(toStore.pricePresetUsd || '').trim();

    // ✅ якщо активний preset — не зберігаємо ручний діапазон грн
    if (toStore.pricePresetUsd) {
      toStore.priceMin = '';
      toStore.priceMax = '';
    }

    // ✅ сторінок нема
    toStore.page = 1;

    localStorage.setItem('filters', JSON.stringify(toStore));
  } catch (e) {
    console.warn('Failed to save filters to localStorage', e);
  }
}
