export function getFiltersFromUrl() {
  const params = new URLSearchParams(window.location.search);

  // const complexes = params.getAll('complex'); // ['42', '43'] або []

  const parseMulti = key => {
    const values = params.getAll(key); // збире всі ?type=x&type=y
    if (values.length > 0) {
      return values
        .flatMap(v => v.split(','))
        .map(v => v.trim())
        .filter(Boolean);
    }

    // якщо ?type=1,2
    const single = params.get(key);
    return single
      ? single
          .split(',')
          .map(v => v.trim())
          .filter(Boolean)
      : [];
  };

  return {
    complex: parseMulti('complex'),
    type: parseMulti('type'),
    rooms: parseMulti('rooms'),
    priceMin: params.get('priceMin') || '',
    priceMax: params.get('priceMax') || '',
    areaMin: params.get('areaMin') || '',
    areaMax: params.get('areaMax') || '',
    floorMin: params.get('floorMin') || '',
    floorMax: params.get('floorMax') || '',
    page: Number(params.get('page')) || 1,
  };
}
