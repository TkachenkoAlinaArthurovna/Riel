export function getFiltersFromUrl() {
  // ✅ GET більше не використовуємо взагалі
  return {
    complex: [],
    rooms: [],
    priceMin: '',
    priceMax: '',
    areaMin: '',
    areaMax: '',
    floorMin: '',
    floorMax: '',
    page: 1, // сторінок нема, але хай буде стабільно
    sort: '',
  };
}
