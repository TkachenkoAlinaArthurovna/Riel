import { extractFloorNumber } from './extractFloorNumber';

export function filterPremisesByFilters(premises, f) {
  const norm = v =>
    String(v ?? '')
      .trim()
      .toLowerCase();

  const hasFloorFilter = Boolean(f.floorMin) || Boolean(f.floorMax);

  return (Array.isArray(premises) ? premises : []).filter(item => {
    if (Array.isArray(f.complex) && f.complex.length) {
      const id = item?.project?.id != null ? String(item.project.id) : '';
      const matches = f.complex.some(c => String(c) === id);
      if (!matches) return false;
    }

    if (
      f.type &&
      ((Array.isArray(f.type) && f.type.length) || (!Array.isArray(f.type) && f.type !== ''))
    ) {
      const typeFilters = (Array.isArray(f.type) ? f.type : [f.type]).map(norm).filter(Boolean);
      const itemType = norm(item?.unit_type_name);
      if (!typeFilters.some(t => t === itemType)) return false;
    }

    if (
      f.rooms &&
      ((Array.isArray(f.rooms) && f.rooms.length) || (!Array.isArray(f.rooms) && f.rooms !== ''))
    ) {
      const roomsFilters = (Array.isArray(f.rooms) ? f.rooms : [f.rooms])
        .map(v => String(v).trim())
        .filter(Boolean);

      const roomStr = String(item?.room_count ?? '').trim();
      if (!roomsFilters.some(r => r === roomStr)) return false;
    }

    const price = Number(item?.total_price_uah) || 0;
    if (f.priceMin && price < Number(f.priceMin)) return false;
    if (f.priceMax && price > Number(f.priceMax)) return false;

    const area = Number(item?.design_size) || 0;
    if (f.areaMin && area < Number(f.areaMin)) return false;
    if (f.areaMax && area > Number(f.areaMax)) return false;

    const floor = extractFloorNumber(item?.floor_name);

    // ✅ якщо фільтр по поверху є, але поверх не витягнувся — відсікаємо
    if (hasFloorFilter && floor == null) return false;

    if (f.floorMin && floor < Number(f.floorMin)) return false;
    if (f.floorMax && floor > Number(f.floorMax)) return false;

    return true;
  });
}
