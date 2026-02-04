import { getData } from './helpers_for_units/getData';

const TYPE_SLUG = {
  квартира: 'flats',
  апартамент: 'apartments',
  офіс: 'offices',
  паркінг: 'parking',
  комора: 'komori',
  підвал: 'pidvali',
};

const norm = v =>
  String(v ?? '')
    .trim()
    .toLowerCase();

// Форматування ціни
function formatPrice(value) {
  if (value == null) return '';
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

document.addEventListener('DOMContentLoaded', async function() {
  // Працюємо тільки на потрібних шаблонах
  if (
    !document.querySelector('.page-template-flats') &&
    !document.querySelector('.page-template-flat_single')
  ) {
    return;
  }

  // Функція для завантаження квартир із sessionStorage або сервера
  async function loadUnits() {
    const cached = sessionStorage.getItem('units');

    if (cached) {
      return JSON.parse(cached);
    }

    const data = await getData();

    if (data) {
      sessionStorage.setItem('units', JSON.stringify(data));
    }

    return data || [];
  }

  // Отримуємо id з URL
  const urlParams = new URLSearchParams(window.location.search);

  if (!urlParams.has('id')) {
    console.log('Параметра id немає в URL');
    return;
  }

  const idValue = urlParams.get('id');
  document.body.classList.add('page-template-flat_single');
  console.log('Параметр id є, його значення:', idValue);

  const locations = {
    Америка:
      'https://www.google.com/maps/search/?api=1&query=Америка,+вулиця+Володимира+Великого,+10,+Україна',

    Вежа:
      'https://www.google.com/maps/search/?api=1&query=Вежа,+вул.+Б.+Хмельницького,+207,+Україна',

    Брама:
      'https://www.google.com/maps/search/?api=1&query=Брама,+вул.+Б.+Хмельницького,+116,+Україна',

    'Велика Британія':
      'https://www.google.com/maps/search/?api=1&query=Велика+Британія,+вул.+Шевченка,+31,+Україна',

    'Голоські Кручі':
      'https://www.google.com/maps/search/?api=1&query=Голоські+Кручі,+вул.+Під+Голоском,+Україна',

    'Доктор Ватсон':
      'https://www.google.com/maps/search/?api=1&query=Доктор+Ватсон,+вулиця+Пекарська,+57,+Україна',

    Компаньйон:
      'https://www.google.com/maps/search/?api=1&query=Компаньйон,+вул.+Проектована,+1,+Україна',

    'Львівська площа':
      'https://www.google.com/maps/search/?api=1&query=Львівська+Площа,+вул.+Кудрявська,+24а,+Україна',

    'Львівський квартал':
      'https://www.google.com/maps/search/?api=1&query=Львівський+Квартал,+вул.+Глибочицька,+13,+Україна',

    'Новий Форт':
      'https://www.google.com/maps/search/?api=1&query=Новий+Форт,+вул.+Волинська,+9,+Україна',

    'ОК Land':
      'https://www.google.com/maps/search/?api=1&query=OK+Land,+просп.+Повітряних+сил,+56,+Україна',

    Тополіс:
      'https://www.google.com/maps/search/?api=1&query=Тополіс,+вул.+Гетьмана+Мазепи,+25а,+Україна',

    'Ріел Сіті':
      'https://www.google.com/maps/search/?api=1&query=Ріел+Сіті,+вул.+Рудненська,+8,+Україна',

    'Шерлок Холмс':
      'https://www.google.com/maps/search/?api=1&query=Шерлок+Холмс,+вул.+Пекарська,+30,+Україна',

    Ярославенка:
      'https://www.google.com/maps/search/?api=1&query=Ярославенка,+вул.+Ярославенка,+30,+Україна',

    Шенген: 'https://www.google.com/maps/search/?api=1&query=Шенген,+вул.+Залізнична,+7,+Україна',

    'Берег Дніпра':
      'https://www.google.com/maps/search/?api=1&query=Берег+Дніпра,+Дніпровська+набережна,+17-К,+Україна',

    Форвард:
      'https://www.google.com/maps/search/?api=1&query=Форвард,+вул.+Ростиславська,+5а,+Україна',

    'Поділ Град':
      'https://www.google.com/maps/search/?api=1&query=Поділ+Град,+вулиця+Дегтярна,+6,+Україна',

    'Nordica Residence':
      'https://www.google.com/maps/search/?api=1&query=Nordica+Residence,+Залізничне+шосе,+45а,+Україна',

    'Maxima Residence':
      'https://www.google.com/maps/search/?api=1&query=Maxima+Residence,+вул.+Коновальця,+30,+Україна',

    'Hyde Park':
      'https://www.google.com/maps/search/?api=1&query=Hyde+Park,+вул.+Мучна,+32,+Україна',

    Канкріт:
      'https://www.google.com/maps/search/?api=1&query=Канкріт,+Дніпровська+набережна,+17,+Україна',

    'Big Ben': 'https://www.google.com/maps/search/?api=1&query=BigBen,+вул.+Стрийська,+Україна',

    Brother: 'https://www.google.com/maps/search/?api=1&query=Brother,+вул.+Ревуцького,+1,+Україна',

    Father:
      'https://www.google.com/maps/search/?api=1&query=Father,+вул.+Промислова,+50/52,+Україна',

    Sister: 'https://www.google.com/maps/search/?api=1&query=Sister,+вул.+Клеманська,+3,+Україна',

    Harry: 'https://www.google.com/maps/search/?api=1&query=Harry,+вулиця+Стороженка,+25А,+Україна',
  };

  // 1. Завантажуємо всі квартири
  const allPremises = await loadUnits();
  const safePremises = Array.isArray(allPremises) ? allPremises : [];

  // 2. Знаходимо потрібну квартиру
  const flat = safePremises.find(item => item.id === Number(idValue));

  if (!flat) {
    console.warn('Квартиру з таким id не знайдено');
    return;
  }

  const backLink = document.querySelector('.section_flat_details__back');

  if (backLink && flat?.unit_type_name) {
    const type = norm(flat?.unit_type_name);
    const slug = TYPE_SLUG[type] || 'flats';

    // ✅ повертаємось на сторінку типу
    backLink.href = `/${slug}/`;
  }

  const titleMap = {
    квартира: 'квартири',
    апартамент: 'апартаменти',
    офіс: 'офіси',
    комора: 'комори',
    паркінг: 'паркінги',
    підвал: 'підвали',
  };

  const typeLink = document.querySelector('.link_type');

  if (typeLink && flat?.unit_type_name) {
    const type = norm(flat?.unit_type_name);
    const slug = TYPE_SLUG[type] || 'flats';

    typeLink.href = `/${slug}/`;
    typeLink.textContent = titleMap[type] || type;
  }

  // 3. Заповнюємо хлібні крихти
  const unitNumber = document.querySelector('.section_breadcrumbs .unit-number');
  const unitNumber2 = document.querySelector('.section_flat_details__title_number');
  if (unitNumber && flat.unit_type_name && flat.number) {
    unitNumber.textContent = `${flat.unit_type_name} ${flat.number}`;
  }
  if (unitNumber2 && flat.number) {
    unitNumber2.textContent = `№ ${flat.number}`;
  }

  // 4. Центральний блок
  const unitRoom = document.querySelector('.section_flat_details__center_title .unit-room');
  const unitRoom2 = document.querySelector('.section_flat_details__title_rooms');
  const unitSize = document.querySelector('.section_flat_details__center_title .unit-size');
  const unitSizeMob = document.querySelector('.section_flat_details__title_size');

  if (unitRoom) {
    unitRoom.textContent = `${flat.room_count}-K`;
  } else if (unitRoom) {
    unitRoom.textContent = '-';
  }
  if (unitRoom2) {
    unitRoom2.textContent = `${flat.room_count}-K`;
  }

  if (unitSize) {
    const design = Number(flat.design_size);
    const real = Number(flat.real_size);

    const size = design > 0 ? design : real > 0 ? real : null;

    unitSize.textContent = size !== null ? `${size} м²` : '-';
  }

  if (unitSizeMob) {
    const design = Number(flat.design_size);
    const real = Number(flat.real_size);

    const size = design > 0 ? design : real > 0 ? real : null;

    unitSizeMob.textContent = size !== null ? `${size} м²` : '-';
  }

  // 5. Картинки
  const mainImg = document.querySelector('#main img');
  const planningImg = document.querySelector('#planning img');
  const floorImg = document.querySelector('#floor img');
  if (flat.images && flat.images.length >= 3) {
    if (mainImg) {
      mainImg.src = `https://source-riel.propertymate.ai${flat.images[0].path}`;
    }
    if (planningImg) {
      planningImg.src = `https://source-riel.propertymate.ai${flat.images[1].path}`;
    }
    if (floorImg) {
      floorImg.src = `https://source-riel.propertymate.ai${flat.images[2].path}`;
    }
  }

  if (
    flat.images &&
    flat.images.length == 0 &&
    flat.section_images &&
    flat.section_images.images &&
    flat.section_images.images.length > 0
  ) {
    const firstSectionImagePath = flat.section_images.images[0].path;
    mainImg.src = `https://source-riel.propertymate.ai${firstSectionImagePath}`;
  }

  // 6. Лівий блок
  const unitComplex = document.querySelector('.section_flat_details__flat_info .unit-complex');
  if (unitComplex) {
    if (flat.project_name) {
      unitComplex.textContent = flat.project_name;
      unitComplex.href = locations[flat.project_name] || 'https://www.google.com/maps';
    } else {
      unitComplex.textContent = '-';
      unitComplex.href = 'https://www.google.com/maps';
    }
  }

  const unitLocation = document.querySelector('.unit-location');
  if (unitLocation) {
    if (flat.project_name && locations[flat.project_name]) {
      unitLocation.href = locations[flat.project_name];
    } else {
      unitLocation.href = 'https://www.google.com/maps';
    }
  }

  const unitSection = document.querySelector('.section_flat_details__flat_info .unit-section');
  if (unitSection) {
    unitSection.textContent = flat.section_name || '-';
  }

  const unitFloor = document.querySelector('.section_flat_details__flat_info .unit-floor');
  if (unitFloor) {
    if (flat.floor_name != null) {
      const match = flat.floor_name.match(/-?\d+/);
      const floorNumber = match ? match[0] : null;
      unitFloor.textContent = floorNumber ?? '-';
    } else {
      unitFloor.textContent = '-';
    }
  }

  const unitNumber3 = document.querySelector('.flat_info__center .unit-number');
  if (unitNumber3) {
    unitNumber3.textContent = flat.number || '-';
  }

  const unitSize2 = document.querySelector('.flat_info__center .unit-size');
  if (unitSize2) {
    const design = Number(flat.design_size);
    const real = Number(flat.real_size);

    const size = design > 0 ? design : real > 0 ? real : null;

    unitSize2.textContent = size !== null ? `${size} м²` : '-';
  }

  const unitFullPriceUah = document.querySelector('.flat_info__price .full-price.uah');
  if (unitFullPriceUah) {
    unitFullPriceUah.textContent = flat.total_price_uah
      ? `${formatPrice(flat.total_price_uah)} грн`
      : '-';
  }

  const unitFullPriceUsd = document.querySelector('.flat_info__price .full-price.usd');
  if (unitFullPriceUsd) {
    unitFullPriceUsd.textContent = flat.total_price ? `${formatPrice(flat.total_price)} $` : '-';
  }

  const unitMPriceUah = document.querySelector('.flat_info__price .m-price.uah');
  if (unitMPriceUah) {
    unitMPriceUah.textContent = flat.price_m2_uah ? `${formatPrice(flat.price_m2_uah)} грн` : '-';
  }

  const unitMPriceUsd = document.querySelector('.flat_info__price .m-price.usd');
  if (unitMPriceUsd) {
    unitMPriceUsd.textContent = flat.price_m2 ? `${formatPrice(flat.price_m2)} $` : '-';
  }
});
