export function updateUrl(filters) {
  const params = new URLSearchParams();

  const appendMulti = (key, value) => {
    if (Array.isArray(value)) {
      value.filter(v => v !== '' && v != null).forEach(v => params.append(key, v));
    } else if (value !== '' && value != null) {
      params.append(key, value);
    }
  };

  // complex: масив ЖК
  appendMulti('complex', filters.complex);

  // type: тепер масив типів
  appendMulti('type', filters.type);

  // rooms: тепер масив кількостей кімнат
  appendMulti('rooms', filters.rooms);

  if (filters.priceMin) params.set('priceMin', filters.priceMin);
  if (filters.priceMax) params.set('priceMax', filters.priceMax);
  if (filters.areaMin) params.set('areaMin', filters.areaMin);
  if (filters.areaMax) params.set('areaMax', filters.areaMax);
  if (filters.floorMin) params.set('floorMin', filters.floorMin);
  if (filters.floorMax) params.set('floorMax', filters.floorMax);
  if (filters.page && filters.page !== 1) params.set('page', String(filters.page));
  if (filters.sort) params.set('sort', filters.sort);

  const query = params.toString();
  const newUrl = `${window.location.pathname}${query ? `?${query}` : ''}`;

  window.history.replaceState({}, '', newUrl);
}
