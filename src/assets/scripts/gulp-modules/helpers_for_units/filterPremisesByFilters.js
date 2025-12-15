import { extractFloorNumber } from './extractFloorNumber';

export function filterPremisesByFilters(premises, f) {
  return premises.filter(item => {
    // ЖК: якщо масив не пустий — беремо тільки з цих ЖК
    if (f.complex && Array.isArray(f.complex) && f.complex.length) {
      const id = item.project && item.project.id != null ? String(item.project.id) : '';
      const matches = f.complex.some(c => String(c) === id);
      if (!matches) return false;
    }

    // Тип приміщення (офіс, квартира, комерційна тощо)
    if (
      f.type &&
      ((Array.isArray(f.type) && f.type.length) || (!Array.isArray(f.type) && f.type !== ''))
    ) {
      const typeFilters = Array.isArray(f.type) ? f.type : [f.type];
      const matchesType = typeFilters.some(t => String(t) === String(item.unit_type_name));

      if (!matchesType) return false;
    }

    // Кількість кімнат (може бути кілька варіантів)
    if (
      f.rooms &&
      ((Array.isArray(f.rooms) && f.rooms.length) || (!Array.isArray(f.rooms) && f.rooms !== ''))
    ) {
      const roomsFilters = Array.isArray(f.rooms) ? f.rooms : [f.rooms];
      const roomStr = String(item.room_count);
      const matchesRooms = roomsFilters.some(r => String(r) === roomStr);

      if (!matchesRooms) return false;
    }

    // Ціна
    const price = Number(item.total_price_uah) || 0;

    if (f.priceMin && price < Number(f.priceMin)) return false;
    if (f.priceMax && price > Number(f.priceMax)) return false;

    // Площа
    const area = Number(item.design_size) || 0;

    if (f.areaMin && area < Number(f.areaMin)) return false;
    if (f.areaMax && area > Number(f.areaMax)) return false;

    // Поверх
    const floor = extractFloorNumber(item.floor_name);

    if (f.floorMin && floor < Number(f.floorMin)) return false;
    if (f.floorMax && floor > Number(f.floorMax)) return false;

    return true;
  });
}
