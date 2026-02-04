export function getFiltersFromUrl() {
  const params = new URLSearchParams(window.location.search);

  const parseMulti = key => {
    const values = params.getAll(key); // ?rooms=1&rooms=2 або ?rooms=1,2
    if (values.length > 0) {
      return values
        .flatMap(v => String(v).split(','))
        .map(v => v.trim())
        .filter(Boolean);
    }

    const single = params.get(key);
    return single
      ? String(single)
          .split(',')
          .map(v => v.trim())
          .filter(Boolean)
      : [];
  };

  const parseNumberOrEmpty = key => {
    const v = params.get(key);
    if (v === null) return '';
    const n = Number(String(v).replace(',', '.'));
    return Number.isFinite(n) ? String(n) : '';
  };

  const parseIntOr = (key, fallback) => {
    const v = params.get(key);
    const n = Number.parseInt(v ?? '', 10);
    return Number.isFinite(n) && n > 0 ? n : fallback;
  };

  return {
    complex: parseMulti('complex'),
    // type: НЕ читаємо з URL. type визначається masterType один раз.
    rooms: parseMulti('rooms'),
    priceMin: parseNumberOrEmpty('priceMin'),
    priceMax: parseNumberOrEmpty('priceMax'),
    areaMin: parseNumberOrEmpty('areaMin'),
    areaMax: parseNumberOrEmpty('areaMax'),
    floorMin: parseNumberOrEmpty('floorMin'),
    floorMax: parseNumberOrEmpty('floorMax'),
    page: parseIntOr('page', 1),
    sort: params.get('sort') || '', // якщо у тебе є sort в URL — зручно одразу тут
  };
}
