import { extractFloorNumber } from './extractFloorNumber';

export function filterPremisesByFilters(premises, f) {
  const norm = v =>
    String(v ?? '')
      .trim()
      .toLowerCase();

  return (Array.isArray(premises) ? premises : []).filter(item => {
    // ЖК: якщо масив не пустий — беремо тільки з цих ЖК
    if (Array.isArray(f.complex) && f.complex.length) {
      const id = item?.project?.id != null ? String(item.project.id) : '';
      const matches = f.complex.some(c => String(c) === id);
      if (!matches) return false;
    }

    // Тип приміщення (MASTER): порівнюємо нормалізовано
    if (
      f.type &&
      ((Array.isArray(f.type) && f.type.length) || (!Array.isArray(f.type) && f.type !== ''))
    ) {
      const typeFilters = (Array.isArray(f.type) ? f.type : [f.type]).map(norm).filter(Boolean);
      const itemType = norm(item?.unit_type_name);

      const matchesType = typeFilters.some(t => t === itemType);
      if (!matchesType) return false;
    }

    // Кількість кімнат (може бути кілька варіантів)
    if (
      f.rooms &&
      ((Array.isArray(f.rooms) && f.rooms.length) || (!Array.isArray(f.rooms) && f.rooms !== ''))
    ) {
      const roomsFilters = (Array.isArray(f.rooms) ? f.rooms : [f.rooms])
        .map(v => String(v).trim())
        .filter(Boolean);

      const roomStr = String(item?.room_count ?? '').trim();
      const matchesRooms = roomsFilters.some(r => r === roomStr);

      if (!matchesRooms) return false;
    }

    // Ціна
    const price = Number(item?.total_price_uah) || 0;
    if (f.priceMin && price < Number(f.priceMin)) return false;
    if (f.priceMax && price > Number(f.priceMax)) return false;

    // Площа
    const area = Number(item?.design_size) || 0;
    if (f.areaMin && area < Number(f.areaMin)) return false;
    if (f.areaMax && area > Number(f.areaMax)) return false;

    // Поверх
    const floor = extractFloorNumber(item?.floor_name);
    if (f.floorMin && floor < Number(f.floorMin)) return false;
    if (f.floorMax && floor > Number(f.floorMax)) return false;

    return true;
  });
}
