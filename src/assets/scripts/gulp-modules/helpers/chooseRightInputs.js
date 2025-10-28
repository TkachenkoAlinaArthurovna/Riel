import { populateFilter, populateSliderFilter } from './populateFilters';
import { filterUnitsBySelectedFilter } from './filterUnitsBySelectedFilter';

export function chooseRightInputs(unitsData, projects = true) {
  // Фільтр ЖК
  if (window.innerWidth > 1500) {
    populateFilter(
      unitsData,
      'project.name',
      document.querySelector('.filter__item_wrapper.project'),
      'project',
    );
  } else {
    populateFilter(
      unitsData,
      'project.name',
      document.querySelector('.filter_flats__project'),
      'project',
    );
  }
  let units = unitsData;
  if (projects) {
    units = filterUnitsBySelectedFilter(unitsData);
  }

  // Фільтр типу
  if (window.innerWidth > 1500) {
    populateFilter(
      units,
      'unit_type.name',
      document.querySelector('.filter__item_wrapper.type'),
      'type',
    );
  } else {
    populateFilter(units, 'unit_type.name', document.querySelector('.filter_flats__type'), 'type');
  }
  // Фільтр кімнат
  if (window.innerWidth > 1500) {
    populateFilter(
      units,
      'room_count',
      document.querySelector('.filter__item_wrapper.room_count'),
      'room_count',
    );
  } else {
    populateFilter(
      units,
      'room_count',
      document.querySelector('.filter_flats__room_count'),
      'room_count',
    );
  }
  // Ціна
  if (window.innerWidth > 1500) {
    populateSliderFilter(
      units,
      'total_price',
      document.querySelector('.filter__slider.price'),
      'Ціна',
    );
  } else {
    populateSliderFilter(
      units,
      'total_price',
      document.querySelector('.filter_flats__price'),
      'Ціна',
    );
  }
  // Площа
  if (window.innerWidth > 1500) {
    populateSliderFilter(
      units,
      'real_size',
      document.querySelector('.filter__slider.size'),
      'Площа',
    );
  } else {
    populateSliderFilter(
      units,
      'real_size',
      document.querySelector('.filter_flats__size'),
      'Площа',
    );
  }
  // Поверх (витягуємо цифру з floor.name)
  if (window.innerWidth > 1500) {
    populateSliderFilter(
      units,
      unit => {
        const match = unit.floor?.name?.match(/-?\d+/); // враховуємо можливий знак "-"
        return match ? Number(match[0]) : null;
      },
      document.querySelector('.filter__slider.floor'),
      'Поверх',
    );
  } else {
    populateSliderFilter(
      units,
      unit => {
        const match = unit.floor?.name?.match(/-?\d+/); // враховуємо можливий знак "-"
        return match ? Number(match[0]) : null;
      },
      document.querySelector('.filter_flats__floor'),
      'Поверх',
    );
  }
}
