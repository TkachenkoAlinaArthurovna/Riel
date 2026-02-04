export function sanitizeUrlFiltersByType(urlFilters, masterType) {
  const t = (masterType || '').trim().toLowerCase();

  // дозволені ключі з URL для кожного type
  const ALLOW = {
    паркінг: ['complex', 'priceMin', 'priceMax', 'page'],
    комора: ['complex', 'areaMin', 'areaMax', 'priceMin', 'priceMax', 'page'],
    підвал: ['complex', 'areaMin', 'areaMax', 'priceMin', 'priceMax', 'page'],
    офіс: ['complex', 'areaMin', 'areaMax', 'floorMin', 'floorMax', 'priceMin', 'priceMax', 'page'],
    квартира: [
      'complex',
      'rooms',
      'areaMin',
      'areaMax',
      'floorMin',
      'floorMax',
      'priceMin',
      'priceMax',
      'page',
    ],
    апартамент: [
      'complex',
      'rooms',
      'areaMin',
      'areaMax',
      'floorMin',
      'floorMax',
      'priceMin',
      'priceMax',
      'page',
    ],
  };

  const allowedKeys = ALLOW[t] || [];
  const cleaned = {};

  for (const key of allowedKeys) {
    if (key in urlFilters) {
      cleaned[key] = urlFilters[key];
    }
  }

  return cleaned;
}
