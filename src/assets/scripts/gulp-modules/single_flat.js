import { getData } from './helpers_for_units/getData';

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

    Компаньон:
      'https://www.google.com/maps/search/?api=1&query=Компаньон,+вул.+Проектована,+1,+Україна',

    'Львівська Площа':
      'https://www.google.com/maps/search/?api=1&query=Львівська+Площа,+вул.+Кудрявська,+24а,+Україна',

    'Львівський Квартал':
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
    backLink.href = `./flats/?type=${flat.unit_type_name}`;
  }

  const typeLink = document.querySelector('.link_type');

  if (typeLink && flat?.unit_type_name) {
    typeLink.href = `./flats/?type=${flat.unit_type_name}`;
  }

  // 3. Заповнюємо хлібні крихти
  const unitNumber = document.querySelector('.section_breadcrumbs .unit-number');
  if (unitNumber && flat.unit_type_name && flat.number) {
    unitNumber.textContent = `${flat.unit_type_name} ${flat.number}`;
  }

  // 4. Центральний блок
  const unitRoom = document.querySelector('.section_flat_details__center_title .unit-room');
  const unitSize = document.querySelector('.section_flat_details__center_title .unit-size');

  if (unitRoom) {
    unitRoom.textContent = `${flat.room_count}-K`;
  } else if (unitRoom) {
    unitRoom.textContent = '-';
  }

  if (unitSize && flat.design_size) {
    unitSize.textContent = `${flat.design_size} м²`;
  } else if (unitSize) {
    unitSize.textContent = '-';
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
    unitSize2.textContent = flat.design_size ? `${flat.design_size} м²` : '-';
  }

  const unitFullPrice = document.querySelector('.flat_info__price .full-price');
  if (unitFullPrice) {
    unitFullPrice.textContent = flat.total_price_uah
      ? `${formatPrice(flat.total_price_uah)} грн`
      : '-';
  }

  const unitMPrice = document.querySelector('.flat_info__price .m-price');
  if (unitMPrice) {
    unitMPrice.textContent = flat.price_m2 ? `${formatPrice(flat.price_m2)} грн` : '-';
  }
});
