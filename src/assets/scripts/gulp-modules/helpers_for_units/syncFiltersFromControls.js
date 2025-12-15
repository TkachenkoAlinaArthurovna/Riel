// helpers_for_units/syncFiltersFromControls.js
export function syncFiltersFromControls(prevFilters) {
  const next = { ...prevFilters };

  let projectWrapper;
  let filterRoot;

  // АДАПТИВНА ЛОГІКА
  if (window.innerWidth > 1500) {
    projectWrapper = document.querySelector('.filter__item_wrapper.project');
    filterRoot = document.querySelector('.section_flats__filter');
  } else {
    projectWrapper = document.querySelector('.filter_flats__project');
    filterRoot = document.querySelector('.filter_flats');
  }

  // 🔹 ЖК (масив id/slug з data-name)
  if (projectWrapper) {
    const complexInputs = projectWrapper.querySelectorAll('.checkbox__input');
    next.complex = Array.from(complexInputs)
      .filter(input => input.checked)
      .map(input => input.dataset.name);
  } else {
    next.complex = [];
  }

  if (!filterRoot) {
    // на всяк випадок гарантуємо масиви
    next.type = Array.isArray(next.type) ? next.type : [];
    next.rooms = Array.isArray(next.rooms) ? next.rooms : [];
    return next;
  }

  // Тип (ТЕПЕР: кілька чекбоксів → масив)
  const typeInputs = filterRoot.querySelectorAll('.filter__item_wrapper.type .checkbox__input');

  next.type = Array.from(typeInputs)
    .filter(input => input.checked)
    .map(input => input.dataset.name);

  // Кімнати (ТЕПЕР: теж масив)
  const roomsInputs = filterRoot.querySelectorAll(
    '.filter__item_wrapper.room_count .checkbox__input',
  );

  next.rooms = Array.from(roomsInputs)
    .filter(input => input.checked)
    .map(input => input.dataset.name);

  // Ціна
  const priceWrapper = filterRoot.querySelector('.filter__slider.price');
  if (priceWrapper) {
    const priceMinInput = priceWrapper.querySelector('input[data-filter="Ціна_min"]');
    const priceMaxInput = priceWrapper.querySelector('input[data-filter="Ціна_max"]');
    if (priceMinInput && priceMaxInput) {
      const sMin = Number(priceMinInput.min);
      const sMax = Number(priceMaxInput.max);
      const vMin = Number(priceMinInput.value);
      const vMax = Number(priceMaxInput.value);

      next.priceMin = vMin > sMin ? String(vMin) : '';
      next.priceMax = vMax < sMax ? String(vMax) : '';
    }
  }

  // Площа
  const sizeWrapper = filterRoot.querySelector('.filter__slider.size');
  if (sizeWrapper) {
    const areaMinInput = sizeWrapper.querySelector('input[data-filter="Площа_min"]');
    const areaMaxInput = sizeWrapper.querySelector('input[data-filter="Площа_max"]');

    if (areaMinInput && areaMaxInput) {
      const sliderMin = Number(areaMinInput.min);
      const sliderMax = Number(areaMaxInput.max);
      const valMin = Number(areaMinInput.value);
      const valMax = Number(areaMaxInput.value);

      next.areaMin = valMin > sliderMin ? String(valMin) : '';
      next.areaMax = valMax < sliderMax ? String(valMax) : '';
    } else {
      next.areaMin = '';
      next.areaMax = '';
    }
  } else {
    next.areaMin = '';
    next.areaMax = '';
  }

  // Поверх
  const floorWrapper = filterRoot.querySelector('.filter__slider.floor');
  if (floorWrapper) {
    const floorMinInput = floorWrapper.querySelector('input[data-filter="Поверх_min"]');
    const floorMaxInput = floorWrapper.querySelector('input[data-filter="Поверх_max"]');
    if (floorMinInput && floorMaxInput) {
      const sMin = Number(floorMinInput.min);
      const sMax = Number(floorMaxInput.max);
      const vMin = Number(floorMinInput.value);
      const vMax = Number(floorMaxInput.value);

      next.floorMin = vMin > sMin ? String(vMin) : '';
      next.floorMax = vMax < sMax ? String(vMax) : '';
    }
  }

  // при зміні фільтрів — завжди з першої сторінки
  next.page = 1;

  return next;
}
