export function updateUrl(filters) {
  const params = new URLSearchParams();

  // complex: масив ЖК
  if (Array.isArray(filters.complex)) {
    filters.complex.forEach(id => {
      if (id !== '' && id != null) {
        params.append('complex', id);
      }
    });
  } else if (filters.complex) {
    params.append('complex', filters.complex);
  }

  if (filters.type) params.set('type', filters.type);
  if (filters.rooms) params.set('rooms', filters.rooms);
  if (filters.priceMin) params.set('priceMin', filters.priceMin);
  if (filters.priceMax) params.set('priceMax', filters.priceMax);
  if (filters.areaMin) params.set('areaMin', filters.areaMin);
  if (filters.areaMax) params.set('areaMax', filters.areaMax);
  if (filters.floorMin) params.set('floorMin', filters.floorMin);
  if (filters.floorMax) params.set('floorMax', filters.floorMax);
  if (filters.page && filters.page !== 1) params.set('page', String(filters.page));

  const query = params.toString();
  const newUrl = `${window.location.pathname}${query ? `?${query}` : ''}`;

  window.history.replaceState({}, '', newUrl);
}
