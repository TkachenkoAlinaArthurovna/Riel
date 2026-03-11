const BASES = ['flats', 'apartments', 'offices', 'parking', 'komori', 'pidvali'];

// SEO rooms slug
const ROOMS_SLUG_TO_VALUE = {
  'odnokimnatni-kvartiru': '1',
  'dvokimnatni-kvartiru': '2',
  'trikimnatni-kvartiru': '3',
  '4-kimnatni-kvartiru': '4',
  '5-kimnatni-kvartiru': '5',

  // додали для апартаментів
  'odnokimnatni-apartamenti': '1',
  'dvokimnatni-apartamenti': '2',
  'trikimnatni-apartamenti': '3',
  '4-kimnatni-apartamenti': '4',
  '5-kimnatni-apartamenti': '5',
};

const ROOMS_SLUGS_BY_BASE = {
  flats: {
    '1': 'odnokimnatni-kvartiru',
    '2': 'dvokimnatni-kvartiru',
    '3': 'trikimnatni-kvartiru',
    '4': '4-kimnatni-kvartiru',
    '5': '5-kimnatni-kvartiru',
  },
  apartments: {
    '1': 'odnokimnatni-apartamenti',
    '2': 'dvokimnatni-apartamenti',
    '3': 'trikimnatni-apartamenti',
    '4': '4-kimnatni-apartamenti',
    '5': '5-kimnatni-apartamenti',
  },
};

// fallback якщо для base немає мапи
function getRoomSlugByBase(base, roomValue) {
  const v = String(roomValue ?? '');
  const map = ROOMS_SLUGS_BY_BASE[base] || null;
  if (!map) return null;
  return map[v] || null;
}

const ROOMS_VALUE_TO_SLUG = Object.fromEntries(
  Object.entries(ROOMS_SLUG_TO_VALUE).map(([slug, val]) => [val, slug]),
);

function getBaseFromPathname() {
  const parts = window.location.pathname.split('/').filter(Boolean);
  return parts.find(p => BASES.includes(p)) || null;
}

function buildSlashUrlFromFilters(base, filters) {
  const parts = [base];

  // ✅ rooms першим (і тільки один)
  if (filters.rooms?.length === 1) {
    const slug =
      getRoomSlugByBase(base, filters.rooms[0]) || ROOMS_VALUE_TO_SLUG[String(filters.rooms[0])]; // fallback на стару логіку
    if (slug) parts.push(slug);
  }

  // ✅ complex (може бути багато)
  if (Array.isArray(filters.complex) && filters.complex.length) {
    const ids = filters.complex.map(String).filter(Boolean);
    if (ids.length) parts.push('complex', encodeURIComponent(ids.join(',')));
  }

  // ✅ USD preset
  if (filters.pricePresetUsd) {
    parts.push('price-usd', encodeURIComponent(String(filters.pricePresetUsd)));
  }

  // ✅ UAH price пишемо ТІЛЬКИ якщо НЕ активний preset
  if (!filters.pricePresetUsd && (filters.priceMin || filters.priceMax)) {
    parts.push('price', `${filters.priceMin || ''}-${filters.priceMax || ''}`);
  }

  if (filters.areaMin || filters.areaMax) {
    parts.push('area', `${filters.areaMin || ''}-${filters.areaMax || ''}`);
  }

  if (filters.floorMin || filters.floorMax) {
    parts.push('floor', `${filters.floorMin || ''}-${filters.floorMax || ''}`);
  }

  if (filters.sort) {
    parts.push('sort', encodeURIComponent(String(filters.sort)));
  }

  return `/${parts.join('/')}/`;
}

export function updateUrl(filters) {
  const base = getBaseFromPathname();
  if (!base) return;

  const path = buildSlashUrlFromFilters(base, filters);
  const hash = window.location.hash || '';
  window.history.replaceState({}, '', path + hash);
}
