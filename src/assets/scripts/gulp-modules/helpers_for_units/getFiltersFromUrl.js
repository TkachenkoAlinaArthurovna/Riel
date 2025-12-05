export function getFiltersFromUrl() {
  const params = new URLSearchParams(window.location.search);

  const complexes = params.getAll('complex'); // ['42', '43'] або []

  return {
    complex: complexes, // масив
    type: params.get('type') || '',
    rooms: params.get('rooms') || '',
    priceMin: params.get('priceMin') || '',
    priceMax: params.get('priceMax') || '',
    areaMin: params.get('areaMin') || '',
    areaMax: params.get('areaMax') || '',
    floorMin: params.get('floorMin') || '',
    floorMax: params.get('floorMax') || '',
    page: Number(params.get('page')) || 1,
  };
}
