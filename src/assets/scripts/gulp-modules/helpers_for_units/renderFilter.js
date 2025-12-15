import { extractFloorNumber } from './extractFloorNumber';
import { getUniqueValues } from './getUniqueValues';
import { populateFilter, populateSliderFilter } from './populateFilters';

// units = масив усіх приміщень
// filters = зібрані з URL / localStorage
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

  // Мапа ЖК: id → назва
  const projectMap = {};
  units.forEach(unit => {
    const proj = unit.project;
    const id = proj && proj.id != null ? proj.id : null;
    if (id && unit.project_name) {
      projectMap[id] = unit.project_name;
    }
  });

  // Базові units для інших фільтрів (тільки вибрані ЖК)
  let baseUnits = units;
  if (filters.complex && filters.complex.length) {
    const complexIds = Array.isArray(filters.complex) ? filters.complex : [filters.complex];
    baseUnits = units.filter(unit => {
      const proj = unit.project;
      const pid = proj && proj.id != null ? proj.id : null;
      return complexIds.some(c => String(c) === String(pid));
    });
  }

  // -------- ЧЕКБОКСИ --------

  // ЖК — всі, але інші фільтри рахуються по baseUnits
  populateFilter(
    units,
    unit => {
      const proj = unit.project;
      return proj && proj.id != null ? proj.id : null;
    },
    projectWrapper,
    'complex',
  );

  // Після populateFilter замінимо текст label на project_name
  projectWrapper.querySelectorAll('.checkbox__input').forEach(input => {
    const id = input.dataset.name;
    const labelEl = projectWrapper.querySelector(`label[for="${input.id}"]`);
    if (labelEl) {
      labelEl.textContent = projectMap[id] || `ЖК ${id}`;
    }

    const complexFilter = Array.isArray(filters.complex)
      ? filters.complex
      : filters.complex
      ? [filters.complex]
      : [];

    const selected = complexFilter.some(c => String(c) === String(id));
    input.checked = selected;
  });

  // Тип
  populateFilter(baseUnits, 'unit_type_name', typeWrapper, 'type');

  const typeFilter = Array.isArray(filters.type)
    ? filters.type
    : filters.type
    ? [filters.type]
    : [];

  typeWrapper.querySelectorAll('.checkbox__input').forEach(input => {
    const name = input.dataset.name;
    const isChecked = typeFilter.some(t => String(t) === String(name));
    input.checked = isChecked;
  });

  // Кількість кімнат
  populateFilter(baseUnits, 'room_count', roomsWrapper, 'rooms');

  const roomsFilter = Array.isArray(filters.rooms)
    ? filters.rooms
    : filters.rooms
    ? [filters.rooms]
    : [];

  roomsWrapper.querySelectorAll('.checkbox__input').forEach(input => {
    const name = input.dataset.name;
    const isChecked = roomsFilter.some(r => String(r) === String(name));
    input.checked = isChecked;
  });

  // -------- ПОВЗУНКИ --------

  // Ціна
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

  // Площа
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

  // Поверх
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
