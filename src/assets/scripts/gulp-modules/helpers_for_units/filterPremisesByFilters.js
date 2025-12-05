import { extractFloorNumber } from './extractFloorNumber';

export function filterPremisesByFilters(premises, f) {
  return premises.filter(item => {
    // ЖК: якщо масив не пустий — беремо тільки з цих ЖК
    if (f.complex && f.complex.length) {
      const id = String(item.project?.id);
      const matches = f.complex.some(c => String(c) === id);
      if (!matches) return false;
    }

    // Тип приміщення (офіс, квартира...)
    if (f.type && item.unit_type_name !== f.type) {
      return false;
    }

    // Кількість кімнат
    if (f.rooms && String(item.room_count) !== String(f.rooms)) {
      return false;
    }

    // Ціна
    const price = Number(item.total_price_uah) || 0;

    if (f.priceMin && price < Number(f.priceMin)) return false;
    if (f.priceMax && price > Number(f.priceMax)) return false;

    // Площа
    const area = Number(item.design_size) || 0;

    if (f.areaMin && area < Number(f.areaMin)) return false;
    if (f.areaMax && area > Number(f.areaMax)) return false;

    // Поверх — найважливіше!
    const floor = extractFloorNumber(item.floor_name);

    if (f.floorMin && floor < Number(f.floorMin)) return false;
    if (f.floorMax && floor > Number(f.floorMax)) return false;

    return true;
  });
}
