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
      'https://www.google.com/maps/search/Zhk+%22Ameryka%22+/@49.8099529,24.0085652,17z?hl=ru&entry=ttu&g_ep=EgoyMDI1MTAxNC4wIKXMDSoASAFQAw%3D%3D',
    Брама:
      'https://www.google.com/maps/place/Zhk+Mistechko+Pidzamche+-+Brama/@49.8543991,24.0449007,17z/data=!3m1!4b1!4m6!3m5!1s0x473add67de4b4973:0x36834adf22609713!8m2!3d49.8543957!4d24.047481!16s%2Fg%2F11hflhn04v?hl=ru&entry=ttu&g_ep=EgoyMDI1MTAxNC4wIKXMDSoASAFQAw%3D%3D',
    Вежа:
      'https://www.google.com/maps/place/Zhk+Pidzamche+Vezha/@49.8590424,24.043025,17z/data=!3m1!4b1!4m6!3m5!1s0x473adde333d1decb:0xe17fa5f12af322eb!8m2!3d49.859039!4d24.0478905!16s%2Fg%2F11rkl5bgy2?entry=ttu&g_ep=EgoyMDI1MTAxNC4wIKXMDSoASAFQAw%3D%3D',
    Компаньйон:
      'https://www.google.com/maps/place/Zhk+Kompan%CA%B9yon/@49.7914999,24.0062323,17z/data=!3m1!4b1!4m6!3m5!1s0x473ae7fd7e8e4951:0xcb390809b9b44bff!8m2!3d49.7914965!4d24.0088126!16s%2Fg%2F11h9gnth9r?hl=ru&entry=ttu&g_ep=EgoyMDI1MTAxNC4wIKXMDSoASAFQAw%3D%3D',
    'Ріел Сіті':
      'https://www.google.com/maps/place/%D0%96%D0%9A+Riel+City/@49.8361109,23.9699679,17z/data=!3m1!4b1!4m6!3m5!1s0x473ae71b89afed09:0x1591aa381d5922de!8m2!3d49.8361075!4d23.9725482!16s%2Fg%2F11qrqdx46w?hl=ru&entry=ttu&g_ep=EgoyMDI1MTAxNC4wIKXMDSoASAFQAw%3D%3D',
    Шенген:
      'https://www.google.com/maps/search/%D1%88%D0%B5%D0%BD%D0%B3%D0%B5%D0%BD+%D0%B6%D0%BA/@49.8468765,23.9912592,17z/data=!3m1!4b1?hl=ru&entry=ttu&g_ep=EgoyMDI1MTAxNC4wIKXMDSoASAFQAw%3D%3D',
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

  // 3. Заповнюємо хлібні крихти
  const unitNumber = document.querySelector('.section_breadcrumbs .unit-number');
  if (unitNumber && flat.unit_type_name && flat.number) {
    unitNumber.textContent = `${flat.unit_type_name} ${flat.number}`;
  }

  // 4. Центральний блок
  const unitRoom = document.querySelector('.section_flat_details__center_title .unit-room');
  const unitSize = document.querySelector('.section_flat_details__center_title .unit-size');

  if (unitRoom && flat.room_count) {
    unitRoom.textContent = `${flat.room_count}-K`;
  } else if (unitRoom) {
    unitRoom.textContent = '-';
  }

  if (unitSize && flat.real_size) {
    unitSize.textContent = `${flat.real_size} м²`;
  } else if (unitSize) {
    unitSize.textContent = '-';
  }

  // 5. Картинки
  if (flat.images && flat.images.length >= 3) {
    const mainImg = document.querySelector('#main img');
    const planningImg = document.querySelector('#planning img');
    const floorImg = document.querySelector('#floor img');

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
    unitSize2.textContent = flat.real_size ? `${flat.real_size} м²` : '-';
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
