export function syncFiltersFromControls(prevFilters) {
  const next = { ...prevFilters };

  const isPopupMode = window.innerWidth <= 1500;

  // helper: safe number parsing (handles spaces, commas, etc.)
  const toNum = v => {
    const s = String(v ?? '')
      .trim()
      .replace(/\s+/g, '') // "1 200 000" -> "1200000"
      .replace(',', '.'); // "12,5" -> "12.5"
    const n = Number(s);
    return Number.isFinite(n) ? n : null;
  };

  let projectWrapper;
  let filterRoot;

  if (window.innerWidth > 1500) {
    projectWrapper = document.querySelector('.filter__item_wrapper.project');
    filterRoot = document.querySelector('.section_flats__filter'); // desktop filters
  } else {
    // ✅ робимо селектор таким самим як у listeners, щоб не зчитати "не той" блок
    projectWrapper = document.querySelector('.filter_flats .filter_flats__project');
    filterRoot = document.querySelector('.filter_flats'); // popup filters
  }

  // ===== COMPLEX (ЖК) =====
  if (projectWrapper) {
    const complexInputs = projectWrapper.querySelectorAll('.checkbox__input');
    next.complex = Array.from(complexInputs)
      .filter(input => input instanceof HTMLInputElement && input.checked)
      .map(input => String(input.dataset.name || '').trim())
      .filter(Boolean);
  } else {
    next.complex = [];
  }

  // якщо фільтрів нема — повертаємо хоча б нормалізовані поля
  if (!filterRoot) {
    next.rooms = Array.isArray(next.rooms) ? next.rooms : [];
    next.pricePresetUsd = String(next.pricePresetUsd || '').trim();
    next.priceMin = String(next.priceMin || '').trim();
    next.priceMax = String(next.priceMax || '').trim();
    next.areaMin = String(next.areaMin || '').trim();
    next.areaMax = String(next.areaMax || '').trim();
    next.floorMin = String(next.floorMin || '').trim();
    next.floorMax = String(next.floorMax || '').trim();
    return next;
  }

  // ❌ TYPE НЕ ЧИТАЄМО З DOM

  // ===== ROOMS (single) =====
  // ✅ толерантний селектор: інколи popup/desktop класи можуть відрізнятись
  const roomsInputs = isPopupMode
    ? filterRoot.querySelectorAll(
        '.filter__item_wrapper.room_count_popup .checkbox__input, .filter__item_wrapper.room_count .checkbox__input, .room_count .checkbox__input',
      )
    : filterRoot.querySelectorAll(
        '.filter__item_wrapper.room_count .checkbox__input, .room_count .checkbox__input',
      );

  const pickedRooms = Array.from(roomsInputs)
    .filter(input => input instanceof HTMLInputElement && input.checked)
    .map(input => {
      const dn = String(input.dataset.name || '').trim(); // data-name="1"
      if (/^\d+$/.test(dn)) return dn;

      const df = String(input.dataset.filter || '').trim(); // data-filter="rooms-1"
      const m = df.match(/\d+/);
      return m ? m[0] : '';
    })
    .filter(Boolean);

  next.rooms = pickedRooms.length ? [String(pickedRooms[0]).trim()] : [];

  // ===== PRICE USD PRESET (radio) =====
  // беремо radio тільки з поточного режиму (page або popup)
  const presetSelector = isPopupMode
    ? 'input[type="radio"][name="pricePresetPopup"]:checked'
    : 'input[type="radio"][name="pricePresetPage"]:checked';

  const presetRadio = filterRoot.querySelector(presetSelector);
  next.pricePresetUsd = presetRadio ? String(presetRadio.value || '').trim() : '';

  // ===== PRICE (UAH range) =====
  const priceWrapper = isPopupMode
    ? filterRoot.querySelector('.filter__slider.price_popup, .filter_flats__price')
    : filterRoot.querySelector('.filter__slider.price');

  // ✅ якщо активний preset — range (грн) НЕ зчитуємо, тримаємо пустим
  if (next.pricePresetUsd) {
    next.priceMin = '';
    next.priceMax = '';
  } else if (priceWrapper) {
    const priceMinInput = priceWrapper.querySelector('input[data-filter="Ціна_min"]');
    const priceMaxInput = priceWrapper.querySelector('input[data-filter="Ціна_max"]');

    if (priceMinInput instanceof HTMLInputElement && priceMaxInput instanceof HTMLInputElement) {
      const sMin = toNum(priceMinInput.min);
      const sMax = toNum(priceMaxInput.max);
      const vMin = toNum(priceMinInput.value);
      const vMax = toNum(priceMaxInput.value);

      if (sMin == null || sMax == null || vMin == null || vMax == null) {
        // якщо щось не парситься — не ламаємо фільтр "NaN"
        next.priceMin = '';
        next.priceMax = '';
      } else {
        next.priceMin = vMin > sMin ? String(vMin) : '';
        next.priceMax = vMax < sMax ? String(vMax) : '';
      }
    } else {
      next.priceMin = '';
      next.priceMax = '';
    }
  } else {
    next.priceMin = '';
    next.priceMax = '';
  }

  // ===== AREA =====
  const sizeWrapper = isPopupMode
    ? filterRoot.querySelector('.filter__slider.size_popup, .filter_flats__size')
    : filterRoot.querySelector('.filter__slider.size');

  if (sizeWrapper) {
    const areaMinInput = sizeWrapper.querySelector('input[data-filter="Площа_min"]');
    const areaMaxInput = sizeWrapper.querySelector('input[data-filter="Площа_max"]');

    if (areaMinInput instanceof HTMLInputElement && areaMaxInput instanceof HTMLInputElement) {
      const sMin = toNum(areaMinInput.min);
      const sMax = toNum(areaMaxInput.max);
      const vMin = toNum(areaMinInput.value);
      const vMax = toNum(areaMaxInput.value);

      if (sMin == null || sMax == null || vMin == null || vMax == null) {
        next.areaMin = '';
        next.areaMax = '';
      } else {
        next.areaMin = vMin > sMin ? String(vMin) : '';
        next.areaMax = vMax < sMax ? String(vMax) : '';
      }
    } else {
      next.areaMin = '';
      next.areaMax = '';
    }
  } else {
    next.areaMin = '';
    next.areaMax = '';
  }

  // ===== FLOOR =====
  const floorWrapper = isPopupMode
    ? filterRoot.querySelector('.filter__slider.floor_popup, .filter_flats__floor')
    : filterRoot.querySelector('.filter__slider.floor');

  if (floorWrapper) {
    const floorMinInput = floorWrapper.querySelector('input[data-filter="Поверх_min"]');
    const floorMaxInput = floorWrapper.querySelector('input[data-filter="Поверх_max"]');

    if (floorMinInput instanceof HTMLInputElement && floorMaxInput instanceof HTMLInputElement) {
      const sMin = toNum(floorMinInput.min);
      const sMax = toNum(floorMaxInput.max);
      const vMin = toNum(floorMinInput.value);
      const vMax = toNum(floorMaxInput.value);

      if (sMin == null || sMax == null || vMin == null || vMax == null) {
        next.floorMin = '';
        next.floorMax = '';
      } else {
        next.floorMin = vMin > sMin ? String(vMin) : '';
        next.floorMax = vMax < sMax ? String(vMax) : '';
      }
    } else {
      next.floorMin = '';
      next.floorMax = '';
    }
  } else {
    next.floorMin = '';
    next.floorMax = '';
  }

  // ✅ фінальна нормалізація рядків
  next.pricePresetUsd = String(next.pricePresetUsd || '').trim();
  next.priceMin = String(next.priceMin || '').trim();
  next.priceMax = String(next.priceMax || '').trim();
  next.areaMin = String(next.areaMin || '').trim();
  next.areaMax = String(next.areaMax || '').trim();
  next.floorMin = String(next.floorMin || '').trim();
  next.floorMax = String(next.floorMax || '').trim();

  // ✅ rooms single
  if (Array.isArray(next.rooms) && next.rooms.length > 1) next.rooms = [next.rooms[0]];

  return next;
}
