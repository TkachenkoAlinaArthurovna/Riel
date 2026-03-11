import { extractFloorNumber } from './extractFloorNumber';
import { populateFilter, populateSliderFilter } from './populateFilters';

// units = масив усіх приміщень
// filters = зібрані з URL / localStorage (+ master type вже в filters.type)
export function renderFilter(units, filters) {
  let projectWrapper;
  let roomsWrapper;
  let priceWrapper;
  let sizeWrapper;
  let floorWrapper;

  const isDesktop = window.innerWidth > 1500;

  if (isDesktop) {
    projectWrapper = document.querySelector('.filter__item_wrapper.project');
    roomsWrapper = document.querySelector('.filter__item_wrapper.room_count');

    priceWrapper = document.querySelector('.filter__slider.price');
    sizeWrapper = document.querySelector('.filter__slider.size');
    floorWrapper = document.querySelector('.filter__slider.floor');
  } else {
    projectWrapper = document.querySelector('.filter_flats__project');
    roomsWrapper = document.querySelector('.filter_flats__room_count');

    priceWrapper = document.querySelector('.filter_flats__price');
    sizeWrapper = document.querySelector('.filter_flats__size');
    floorWrapper = document.querySelector('.filter_flats__floor');
  }

  // ✅ roomsWrapper може не бути (для типів де кімнатність не потрібна)
  if (!projectWrapper || !priceWrapper || !sizeWrapper || !floorWrapper) {
    console.warn('Filter wrappers not found');
    return;
  }

  const norm = v =>
    String(v ?? '')
      .trim()
      .toLowerCase();

  // Мапа ЖК: id → назва
  const projectMap = {};
  (Array.isArray(units) ? units : []).forEach(unit => {
    const id = unit?.project?.id != null ? String(unit.project.id) : null;
    if (id && unit?.project_name) {
      projectMap[id] = unit.project_name;
    }
  });

  // Базові units для інших фільтрів (ТІЛЬКИ master type)
  let baseUnits = Array.isArray(units) ? units : [];

  const typeFilter = Array.isArray(filters.type)
    ? filters.type.map(norm).filter(Boolean)
    : filters.type
    ? [norm(filters.type)].filter(Boolean)
    : [];

  if (typeFilter.length) {
    baseUnits = baseUnits.filter(unit => typeFilter.includes(norm(unit?.unit_type_name)));
  }

  // -------- ЧЕКБОКСИ --------

  // ЖК — рахуються по baseUnits (щоб показувати тільки ЖК, де є цей type)
  populateFilter(
    baseUnits,
    unit => {
      const id = unit?.project?.id != null ? unit.project.id : null;
      return id != null ? String(id) : null;
    },
    projectWrapper,
    'complex',
  );

  // Після populateFilter замінимо текст label на project_name + виставимо checked
  const complexFilter = Array.isArray(filters.complex)
    ? filters.complex.map(String)
    : filters.complex
    ? [String(filters.complex)]
    : [];

  projectWrapper.querySelectorAll('.checkbox__input').forEach(input => {
    const id = String(input.dataset.name ?? '');
    const labelEl = projectWrapper.querySelector(`label[for="${input.id}"]`);
    if (labelEl) labelEl.textContent = projectMap[id] || `ЖК ${id}`;

    input.checked = complexFilter.some(c => c === id);
  });

  // ===== ROOMS (✅ тільки один чекбокс) =====
  if (roomsWrapper) {
    populateFilter(
      baseUnits,
      u => {
        const v = String(u?.room_count ?? '').trim();
        return v ? v : null; // ✅ не рендеримо пусті
      },
      roomsWrapper,
      'rooms',
    );

    const roomsValue = Array.isArray(filters.rooms)
      ? filters.rooms[0] != null
        ? String(filters.rooms[0]).trim()
        : ''
      : filters.rooms != null
      ? String(filters.rooms).trim()
      : '';

    roomsWrapper.querySelectorAll('.checkbox__input').forEach(input => {
      const name = String(input.dataset.name ?? '').trim();
      input.checked = roomsValue !== '' && roomsValue === name;
    });
  }

  // ===== PRICE USD PRESET (radio) =====
  // ✅ синхронізуємо radio по filters.pricePresetUsd тільки в поточному режимі
  const preset = String(filters.pricePresetUsd || '').trim();
  const presetSelector = isDesktop
    ? 'input[type="radio"][name="pricePresetPage"]'
    : 'input[type="radio"][name="pricePresetPopup"]';

  const radios = document.querySelectorAll(presetSelector);

  // ✅ якщо вже є checked radio і preset порожній — не скидаємо під час ререндеру
  const hasChecked = Array.from(radios).some(r => r instanceof HTMLInputElement && r.checked);

  if (!(hasChecked && !preset)) {
    radios.forEach(r => {
      if (!(r instanceof HTMLInputElement)) return;
      r.checked = preset ? String(r.value) === preset : false;
    });
  }

  // -------- ПОВЗУНКИ --------

  // ✅ ВАЖЛИВО: під час ініціалізації не даємо listener-ам скидати preset
  window.__RIEL_SYNCING_FILTERS__ = true;

  try {
    // Ціна (UAH)
    populateSliderFilter(
      baseUnits,
      unit => Number(unit?.total_price_uah) || 0,
      priceWrapper,
      'Ціна',
    );

    const priceMinInput = priceWrapper.querySelector('input[data-filter="Ціна_min"]');
    const priceMaxInput = priceWrapper.querySelector('input[data-filter="Ціна_max"]');

    // ✅ якщо є USD preset — range UI тримаємо "повний" (min/max)
    const setPriceToDefault = Boolean(preset);

    if (priceMinInput) {
      priceMinInput.value = setPriceToDefault
        ? priceMinInput.min || ''
        : filters.priceMin || priceMinInput.min || '';
      priceMinInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
    if (priceMaxInput) {
      priceMaxInput.value = setPriceToDefault
        ? priceMaxInput.max || ''
        : filters.priceMax || priceMaxInput.max || '';
      priceMaxInput.dispatchEvent(new Event('input', { bubbles: true }));
    }

    // Площа
    populateSliderFilter(baseUnits, unit => Number(unit?.design_size) || 0, sizeWrapper, 'Площа');
    const areaMinInput = sizeWrapper.querySelector('input[data-filter="Площа_min"]');
    const areaMaxInput = sizeWrapper.querySelector('input[data-filter="Площа_max"]');

    if (areaMinInput) {
      areaMinInput.value = filters.areaMin || areaMinInput.min || '';
      areaMinInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
    if (areaMaxInput) {
      areaMaxInput.value = filters.areaMax || areaMaxInput.max || '';
      areaMaxInput.dispatchEvent(new Event('input', { bubbles: true }));
    }

    // Поверх
    populateSliderFilter(
      baseUnits,
      unit => extractFloorNumber(unit?.floor_name),
      floorWrapper,
      'Поверх',
    );
    const floorMinInput = floorWrapper.querySelector('input[data-filter="Поверх_min"]');
    const floorMaxInput = floorWrapper.querySelector('input[data-filter="Поверх_max"]');

    if (floorMinInput) {
      floorMinInput.value = filters.floorMin || floorMinInput.min || '';
      floorMinInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
    if (floorMaxInput) {
      floorMaxInput.value = filters.floorMax || floorMaxInput.max || '';
      floorMaxInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
  } finally {
    window.__RIEL_SYNCING_FILTERS__ = false;
  }
}
