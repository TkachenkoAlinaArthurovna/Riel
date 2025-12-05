import { extractFloorNumber } from './extractFloorNumber';
import { getUniqueValues } from './getUniqueValues';

import { populateFilter, populateSliderFilter } from './populateFilters';

// units = масив усіх приміщень
// filters = зібрані з URL

export function renderFilter(units, filters) {
  let projectWrapper;
  let typeWrapper;
  let roomsWrapper;
  let priceWrapper;
  let sizeWrapper;
  let floorWrapper;

  if (window.innerWidth > 1500) {
    projectWrapper = document.querySelector('.filter__item_wrapper.project');
    typeWrapper = document.querySelector('.filter__item_wrapper.type');
    roomsWrapper = document.querySelector('.filter__item_wrapper.room_count');

    priceWrapper = document.querySelector('.filter__slider.price');
    sizeWrapper = document.querySelector('.filter__slider.size');
    floorWrapper = document.querySelector('.filter__slider.floor');
  } else {
    projectWrapper = document.querySelector('.filter_flats__project');
    typeWrapper = document.querySelector('.filter_flats__type');
    roomsWrapper = document.querySelector('.filter_flats__room_count');

    priceWrapper = document.querySelector('.filter_flats__price');
    sizeWrapper = document.querySelector('.filter_flats__size');
    floorWrapper = document.querySelector('.filter_flats__floor');
  }

  if (
    !projectWrapper ||
    !typeWrapper ||
    !roomsWrapper ||
    !priceWrapper ||
    !sizeWrapper ||
    !floorWrapper
  ) {
    console.warn('Filter wrappers not found');
    return;
  }

  // 1️⃣ Мапа ЖК: id → назва
  const projectMap = {};
  units.forEach(unit => {
    const id = unit.project?.id;
    if (id && unit.project_name) {
      projectMap[id] = unit.project_name;
    }
  });

  // 2️⃣ Базові units для інших фільтрів (тільки вибрані ЖК)
  let baseUnits = units;
  if (filters.complex && filters.complex.length) {
    const complexIds = Array.isArray(filters.complex) ? filters.complex : [filters.complex];
    baseUnits = units.filter(unit => complexIds.some(c => String(c) === String(unit.project?.id)));
  }

  // -------- ЧЕКБОКСИ --------

  // ЖК — всі, але інші фільтри рахуються по baseUnits
  populateFilter(units, unit => unit.project?.id, projectWrapper, 'complex');

  // Після populateFilter замінимо текст label на project_name
  projectWrapper.querySelectorAll('.checkbox__input').forEach(input => {
    const id = input.dataset.name; // тут лежить project.id як val
    const labelEl = projectWrapper.querySelector(`label[for="${input.id}"]`);
    if (labelEl) {
      labelEl.textContent = projectMap[id] || `ЖК ${id}`;
    }
    // проставляємо checked із filters.complex
    const selected = Array.isArray(filters.complex)
      ? filters.complex.some(c => String(c) === String(id))
      : String(filters.complex) === String(id);
    if (selected) input.checked = true;
  });

  // Тип
  populateFilter(baseUnits, 'unit_type_name', typeWrapper, 'type');
  typeWrapper.querySelectorAll('.checkbox__input').forEach(input => {
    if (filters.type && input.dataset.name === filters.type) {
      input.checked = true;
    }
  });

  // Кількість кімнат
  populateFilter(baseUnits, 'room_count', roomsWrapper, 'rooms');
  roomsWrapper.querySelectorAll('.checkbox__input').forEach(input => {
    if (filters.rooms && String(input.dataset.name) === String(filters.rooms)) {
      input.checked = true;
    }
  });

  // -------- ПОВЗУНКИ --------

  // Ціна: total_price_uah, label = 'Ціна'
  populateSliderFilter(baseUnits, unit => Number(unit.total_price_uah), priceWrapper, 'Ціна');
  const priceMinInput = priceWrapper.querySelector('input[data-filter="Ціна_min"]');
  const priceMaxInput = priceWrapper.querySelector('input[data-filter="Ціна_max"]');
  if (priceMinInput && filters.priceMin) {
    priceMinInput.value = filters.priceMin;
    priceMinInput.dispatchEvent(new Event('input', { bubbles: true }));
  }
  if (priceMaxInput && filters.priceMax) {
    priceMaxInput.value = filters.priceMax;
    priceMaxInput.dispatchEvent(new Event('input', { bubbles: true }));
  }

  // Площа: design_size, label = 'Площа'
  populateSliderFilter(baseUnits, unit => Number(unit.design_size), sizeWrapper, 'Площа');
  const areaMinInput = sizeWrapper.querySelector('input[data-filter="Площа_min"]');
  const areaMaxInput = sizeWrapper.querySelector('input[data-filter="Площа_max"]');
  if (areaMinInput && filters.areaMin) {
    areaMinInput.value = filters.areaMin;
    areaMinInput.dispatchEvent(new Event('input', { bubbles: true }));
  }
  if (areaMaxInput && filters.areaMax) {
    areaMaxInput.value = filters.areaMax;
    areaMaxInput.dispatchEvent(new Event('input', { bubbles: true }));
  }

  // Поверх: floor_name → extractFloorNumber, label = 'Поверх'
  populateSliderFilter(
    baseUnits,
    unit => extractFloorNumber(unit.floor_name),
    floorWrapper,
    'Поверх',
  );
  const floorMinInput = floorWrapper.querySelector('input[data-filter="Поверх_min"]');
  const floorMaxInput = floorWrapper.querySelector('input[data-filter="Поверх_max"]');
  if (floorMinInput && filters.floorMin) {
    floorMinInput.value = filters.floorMin;
    floorMinInput.dispatchEvent(new Event('input', { bubbles: true }));
  }
  if (floorMaxInput && filters.floorMax) {
    floorMaxInput.value = filters.floorMax;
    floorMaxInput.dispatchEvent(new Event('input', { bubbles: true }));
  }
}
