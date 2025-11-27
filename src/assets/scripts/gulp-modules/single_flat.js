import { getunits } from './helpers/getUnits.js';

document.addEventListener('DOMContentLoaded', function() {
  function formatPrice(value) {
    if (value == null) return ''; // якщо нема значення
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }
  if (
    document.querySelector('.page-template-flats') ||
    document.querySelector('.page-template-flat_single')
  ) {
    let flat = '';
    const urlParams = new URLSearchParams(window.location.search);

    // Перевіряємо наявність конкретного параметра "id"
    if (urlParams.has('id')) {
      // if (true) {
      // let idValue = 2384;
      let idValue = urlParams.get('id');

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
      document.body.classList.add('page-template-flat_single');
      console.log('Параметр id є, його значення:', idValue);

      let unitsData;
      (async () => {
        const unitsResponse = await getunits();

        if (unitsResponse?.data) {
          unitsData = unitsResponse.data.data;
          loadUnits();
        }
      })();

      async function loadUnits() {
        const data = unitsData;
        if (!data) return;
        console.log(data);
        flat = data.find(item => item.id === Number(idValue));
        // Заповнюємо хлібні крихти
        const unitNumber = document.querySelector('.section_breadcrumbs .unit-number');
        if (flat.unit_type_name && flat.number) {
          unitNumber.textContent = `${flat.unit_type_name} ${flat.number}`;
        }
        // Центральний блок
        // const unitNumber2 = document.querySelector(
        //   '.section_flat_details__center_title .unit-number',
        // );
        const unitRoom = document.querySelector('.section_flat_details__center_title .unit-room');
        const unitSize = document.querySelector('.section_flat_details__center_title .unit-size');

        // if (unitNumber2 && flat.number) {
        //   unitNumber2.textContent = flat.number;
        // } else {
        //   unitNumber2.textContent = '-';
        // }
        if (unitRoom && flat.room_count) {
          unitRoom.textContent = `${flat.room_count}-K`;
        } else {
          unitRoom.textContent = '-';
        }
        if (unitSize && flat.real_size) {
          unitSize.textContent = `${flat.real_size} м²`;
        } else {
          unitSize.textContent = '-';
        }
        if (flat.images.length == 3) {
          const mainImg = document.querySelector('#main img');
          mainImg.src = ` https://source-riel.propertymate.ai${flat.images[0].path}`;

          const planningImg = document.querySelector('#planning img');
          planningImg.src = ` https://source-riel.propertymate.ai${flat.images[1].path}`;

          const floorImg = document.querySelector('#floor img');
          floorImg.src = ` https://source-riel.propertymate.ai${flat.images[2].path}`;
        }
        // Лівий блок
        const unitComplex = document.querySelector(
          '.section_flat_details__flat_info .unit-complex',
        );
        if (unitComplex && flat.project_name) {
          unitComplex.textContent = `${flat.project_name}`;
          unitComplex.href = locations[flat.project_name];
        } else {
          unitComplex.textContent = '-';
          unitComplex.href = 'https://www.google.com/maps';
        }
        const unitLocation = document.querySelector('.unit-location');
        if (unitLocation && flat.project_name) {
          unitLocation.href = locations[flat.project_name];
        } else {
          unitLocation.href = 'https://www.google.com/maps';
        }
        const unitSection = document.querySelector(
          '.section_flat_details__flat_info .unit-section',
        );
        if (unitSection && flat.section_name) {
          unitSection.textContent = `${flat.section_name}`;
        } else {
          unitSection.textContent = '-';
        }
        const unitFloor = document.querySelector('.section_flat_details__flat_info .unit-floor');
        if (unitFloor && flat.floor_name != null) {
          // Витягуємо тільки число з рядка, навіть якщо воно від’ємне
          const match = flat.floor_name.match(/-?\d+/);
          const floorNumber = match ? match[0] : null;

          unitFloor.textContent = floorNumber ?? '-';
        } else {
          unitFloor.textContent = '-';
        }
        const unitNumber3 = document.querySelector('.flat_info__center .unit-number');
        if (unitNumber3 && flat.number) {
          unitNumber3.textContent = `${flat.number}`;
        } else {
          unitNumber3.textContent = '-';
        }
        const unitSize2 = document.querySelector('.flat_info__center .unit-size');
        if (unitSize2 && flat.real_size) {
          unitSize2.textContent = `${flat.real_size} м²`;
        } else {
          unitSize2.textContent = '-';
        }
        const unitFullPrice = document.querySelector('.flat_info__price .full-price');
        if (unitFullPrice && flat.total_price_uah) {
          unitFullPrice.textContent = `${formatPrice(flat.total_price_uah)} грн`;
        } else {
          unitFullPrice.textContent = '-';
        }
        const unitMPrice = document.querySelector('.flat_info__price .m-price');
        if (unitMPrice) {
          unitMPrice.textContent = `50 000 грн/м²`;
        } else {
          unitMPrice.textContent = '-';
        }
      }
    } else {
      console.log('Параметра id немає в URL');
    }
  }
});
