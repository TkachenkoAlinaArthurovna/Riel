export function updateUrl(filters) {
  const params = new URLSearchParams(window.location.search);

  // очищаємо все, що перезаписуємо (type НЕ чіпаємо і НЕ додаємо)
  params.delete('complex');
  params.delete('rooms');
  params.delete('priceMin');
  params.delete('priceMax');
  params.delete('areaMin');
  params.delete('areaMax');
  params.delete('floorMin');
  params.delete('floorMax');
  params.delete('page');
  params.delete('sort');
  params.delete('type'); // на всяк випадок прибираємо старі лінки виду ?type=...

  // helper: додає масив БЕЗ дублікатів
  const appendUnique = (key, value) => {
    const arr = Array.isArray(value) ? value : value != null && value !== '' ? [value] : [];

    [...new Set(arr.map(v => String(v).trim()).filter(v => v !== ''))].forEach(v =>
      params.append(key, v),
    );
  };

  appendUnique('complex', filters.complex);
  appendUnique('rooms', filters.rooms);

  if (filters.priceMin) params.set('priceMin', String(filters.priceMin));
  if (filters.priceMax) params.set('priceMax', String(filters.priceMax));
  if (filters.areaMin) params.set('areaMin', String(filters.areaMin));
  if (filters.areaMax) params.set('areaMax', String(filters.areaMax));
  if (filters.floorMin) params.set('floorMin', String(filters.floorMin));
  if (filters.floorMax) params.set('floorMax', String(filters.floorMax));

  if (filters.page && Number(filters.page) !== 1) params.set('page', String(filters.page));
  if (filters.sort) params.set('sort', String(filters.sort));

  const query = params.toString();
  const newUrl = `${window.location.pathname}${query ? `?${query}` : ''}`;

  window.history.replaceState({}, '', newUrl);
}
