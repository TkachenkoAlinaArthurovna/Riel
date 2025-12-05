/**
 * Фільтрує масив unitsData згідно з об'єктом selectedFilter
 * @param {Array} unitsData - усі юніти
 * @param {Object} selectedFilter - об’єкт із поточними фільтрами
 * @returns {Array} - відфільтрований масив юнітів
 */
export function filterUnitsBySelectedFilter(unitsData) {
  const selectedFilter = JSON.parse(sessionStorage.getItem('selectedFilter'));
  // Якщо фільтр порожній — повертаємо всі юніти
  if (!selectedFilter || Object.keys(selectedFilter).length === 0) return unitsData;

  return unitsData.filter(unit => {
    // для кожного фільтра перевіряємо відповідність
    return Object.entries(selectedFilter).every(([key, values]) => {
      if (!values || values.length === 0) return true;

      switch (key) {
        // ✅ Проєкт (ЖК)
        case 'project':
          return values.includes(unit.project_name);

        // ✅ Тип (апартамент, квартира, офіс)
        // case 'type':
        //   return values.includes(unit.unit_type?.name);

        // ✅ Кімнатність
        case 'room_count':
          return values.includes(String(unit.room_count));

        // ✅ Ціна — мінімум
        case 'Ціна_min':
          return unit.total_price_uah >= parseFloat(values[0]);

        // ✅ Ціна — максимум
        case 'Ціна_max':
          return unit.total_price_uah <= parseFloat(values[0]);

        // ✅ Площа — мінімум
        case 'Площа_min':
          return unit.real_size >= parseFloat(values[0]);

        // ✅ Площа — максимум
        case 'Площа_max':
          return unit.real_size <= parseFloat(values[0]);

        // ✅ Поверх — мінімум
        case 'Поверх_min':
          return unit.floor_name >= parseInt(values[0]);

        // ✅ Поверх — максимум
        case 'Поверх_max':
          return unit.floor_name <= parseInt(values[0]);

        default:
          return true;
      }
    });
  });
}
