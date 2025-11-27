import '../modules/scroll/leniscroll';
import '../animations';
import './section_hot_deals';
import './section_news';
import './section_video';
import '../modules/form';
import './filter';
import './news';
import './flats';
import './view';
import './section_benefits';
import './gallery';
import './section_more_projects';
import './section_flat';
import './news_single';
import './single_project';
import './single_flat';

// import axios from 'axios';
import data from './units.json'; // локальні дані

const unitsMock = () => data;

const vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.page-template-home')) {
<<<<<<< HEAD
    // const adresses = {
    //   Америка: 'вул. Володимира Великого, 10',
    //   Вежа: 'вул. Б. Хмельницького, 207',
    //   Компаньйон: 'вул. Проектована, 1',
    //   'Ріел Сіті': 'вул. Рудненська, 8',
    //   Шенген: 'вул. Залізнична, 7',
    //   'Велика Британія': 'вул. Шевченка, 31',
    //   'Новий Форт': 'вул. Волинська 9',
    // };
    // const colors = {};
    // function loadUnits() {
    //   const res = unitsMock();
    //   if (!res) return;
    //   const data = res;
    //   console.log(data);
    //   setUnits(data);
    // }
    // const section = document.querySelector('.section_hot_deals');
    // const project = section.getAttribute('data-project');
    // const wrapper = section.querySelector('.swiper-wrapper');
    // const setUnits = units => {
    //   console.log(units);
    //   wrapper.innerHTML = ''; // очищаємо обгортку
    //   let count = 0;
    //   const selectedUnits = units
    //     .filter(
    //       unit => unit.total_price_uah && unit.total_price_uah > 0, // ← ДОДАНО виключення
    //     )
    //     .sort((a, b) => a.total_price_uah - b.total_price_uah)
    //     // .reduce((acc, unit) => {
    //     //   const projectExists = acc.some(item => item.project_id === unit.project_id);
    //     //   if (!projectExists) {
    //     //     acc.push(unit);
    //     //   }
    //     //   return acc;
    //     // }, [])
    //     .slice(0, 5);
    //   console.log('🏆 5 найдешевших (без "Залишків"):', selectedUnits);
    //   function transliterateUkrainian(text, removeSpaces = true) {
    //     const ukrainianMap = {
    //       а: 'a',
    //       б: 'b',
    //       в: 'v',
    //       г: 'g',
    //       ґ: 'g',
    //       д: 'd',
    //       е: 'e',
    //       є: 'ye',
    //       ж: 'zh',
    //       з: 'z',
    //       и: 'y',
    //       і: 'i',
    //       ї: 'yi',
    //       й: 'y',
    //       к: 'k',
    //       л: 'l',
    //       м: 'm',
    //       н: 'n',
    //       о: 'o',
    //       п: 'p',
    //       р: 'r',
    //       с: 's',
    //       т: 't',
    //       у: 'u',
    //       ф: 'f',
    //       х: 'kh',
    //       ц: 'ts',
    //       ч: 'ch',
    //       ш: 'sh',
    //       щ: 'sch',
    //       ь: 'y',
    //       ю: 'yu',
    //       я: 'ya',
    //       А: 'A',
    //       Б: 'B',
    //       В: 'V',
    //       Г: 'G',
    //       Ґ: 'G',
    //       Д: 'D',
    //       Е: 'E',
    //       Є: 'Ye',
    //       Ж: 'Zh',
    //       З: 'Z',
    //       И: 'Y',
    //       І: 'I',
    //       Ї: 'Yi',
    //       Й: 'Y',
    //       К: 'K',
    //       Л: 'L',
    //       М: 'M',
    //       Н: 'N',
    //       О: 'O',
    //       П: 'P',
    //       Р: 'R',
    //       С: 'S',
    //       Т: 'T',
    //       У: 'U',
    //       Ф: 'F',
    //       Х: 'Kh',
    //       Ц: 'Ts',
    //       Ч: 'Ch',
    //       Ш: 'Sh',
    //       Щ: 'Sch',
    //       Ь: 'Y',
    //       Ю: 'Yu',
    //       Я: 'Ya',
    //     };
    //     const hasCyrillic = /[а-яєіїґА-ЯЄІЇҐ]/.test(text);
    //     let result;
    //     if (hasCyrillic) {
    //       // ✅ КИРИЛИЦЯ - конвертуй
    //       result = text
    //         .split('')
    //         .map(char => ukrainianMap[char] || char)
    //         .join('')
    //         .toLowerCase();
    //     } else {
    //       // ✅ ЛАТИНИЦЯ - не конвертуй, просто обробляй
    //       result = text.toLowerCase();
    //     }
    //     // ✅ ВИДАЛИ ПРОБІЛИ ДЛЯ ОБОХ (якщо removeSpaces = true)
    //     if (removeSpaces) {
    //       result = result.replace(/\s+/g, '');
    //     }
    //     return result;
    //   }
    //   const projectsIds = {
    //     Америка: 252,
    //     Компаньйон: 0,
    //     'Новий Форт': 230,
    //     'Велика Британія': 314,
    //     Вежа: 180,
    //     Шенген: 110,
    //     'Ріел Сіті': 26,
    //   };
    //   selectedUnits.forEach(unit => {
    //     console.log(unit);
    //     const link = `/flats?project_id=${projectsIds[unit.project_name]}&id=${unit.id}`;
    //     count++;
    //     const unitHTML = `
    //       <div class="swiper-slide">
    //         <a href=${link}
    //             class="flat_card" data-filtered="true"
    //             data-project="${unit.project_name || null}"
    //             data-room_count="${unit.room_count || null}"
    //             data-type="${unit.unit_type_name || 'Помешкання'}"
    //             data-size="${unit.real_size || null}"
    //             data-floor="${unit.floor_name ? unit.floor_name.match(/-?\d+/)?.[0] || null : null}"
    //             data-id=${unit.id}
    //         >
    //     <div class="flat_card__hover">
    //       <span style="background:${colors[unit.id] ||
    //         '#DCDCDC'};"  data-color="${transliterateUkrainian(unit.project_name) || ''}"></span>
    //     </div>
    //     <!--<div class="flat_card__note">Новинка</div>-->
    //     <div class="flat_card__top">
    //       <span>Житловий комплекс</span>
    //       <span>${unit.project_name || null}</span>
    //     </div>
    //     <div class="flat_card__img">
    //       <img src="${
    //         unit.images?.[1]?.path
    //           ? `https://source-riel.propertymate.ai/${unit.images[1].path}`
    //           : 'assets/images/no_image.gif'
    //       }"   alt="planning" />
    //     </div>
    //     <div class="flat_card__center">
    //       <div class="flat_card__center_left">
    //         ${true ? `<span>Помешкання м²</span>` : `<span>м²</span>`}
    //         ${
    //           unit.real_size && unit.real_size !== 0
    //             ? `<span>${unit.real_size}</span>`
    //             : '<span>-</span>'
    //         }
    //       </div>
    //       <div class="flat_card__center_center">
    //         <span>/</span>
    //       </div>
    //       <div class="flat_card__center_right">
    //         <span>грн/м²</span>
    //         <span>${
    //           unit.total_price_uah && unit.total_price_uah !== 0
    //             ? Number(unit.total_price_uah).toLocaleString('uk-UA')
    //             : '-'
    //         }</span>
    //       </div>
    //     </div>
    //     <div class="flat_card__bottom">
    //       ${unit.section_name ? `<span>Секція: ${unit.section_name}</span>` : ''}
    //       ${
    //         unit.floor_name && unit.floor_name !== 0
    //           ? `<span>Поверх: ${unit.floor_name}</span>`
    //           : ''
    //       }
    //       ${
    //         unit.room_count && unit.room_count !== 0
    //           ? `<span>Кімнат: ${unit.room_count}</span>`
    //           : ''
    //       }
    //     </div>
    //     ${
    //       adresses[unit.project_name]
    //         ? `<div class="flat_card__address">
    //   <svg width="11" height="16" viewBox="0 0 11 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    //     <path d="M5.50073 0C8.14043 0 10.4782 1.66034 10.4783 4.83008C10.4783 5.49423 10.1269 6.46565 9.95093 6.86816L5.50073 16L1.05054 6.86816C0.874556 6.46565 0.523193 5.49423 0.523193 4.83008C0.523248 1.66034 2.86104 4.59894e-06 5.50073 0ZM5.50073 2.84375C4.32252 2.84375 3.36694 3.79933 3.36694 4.97754C3.36719 6.15554 4.32268 7.11035 5.50073 7.11035C6.67858 7.11011 7.6333 6.15539 7.63354 4.97754C7.63354 3.79948 6.67873 2.844 5.50073 2.84375Z" fill="#F4F5F9"/>
    //   </svg>
    //   <span>${adresses[unit.project_name]}</span>
    // </div>`
    //         : ''
    //     }
    //   </a>
    //   </div>
    // `;
    //     wrapper.insertAdjacentHTML('beforeend', unitHTML);
    //   });
    //   const lastSlideHTML = `
    //       <div class="swiper-slide last-slide">
    //         <a class="flat_card" href="/flats"
    //             class="btn_more"
    //         >
    //           <span>Дивитись всі помешкання</span>
    //         </a>
    //   </div>
    // `;
    //   wrapper.insertAdjacentHTML('beforeend', lastSlideHTML);
    //   // Якщо не додано жодної картки — ховаємо секцію
    //   if (count === 0) {
    //     section.style.display = 'none';
    //   }
    // };
    // loadUnits();
=======
    const adresses = {
      Америка: 'вул. Володимира Великого, 10',
      Вежа: 'вул. Б. Хмельницького, 207',
      Компаньйон: 'вул. Проектована, 1',
      'Ріел Сіті': 'вул. Рудненська, 8',
      Шенген: 'вул. Залізнична, 7',
      'Велика Британія': 'вул. Шевченка, 31',
      'Новий Форт': 'вул. Волинська 9',
    };
    const colors = {};
    async function getunits() {
      const formData = new FormData();
      formData.append('action', 'units');
      const url = '/wp-admin/admin-ajax.php';

      // Локальний режим з мок-даними
      if (true) {
        return await new Promise(resolve => {
          resolve({
            data: unitsMock(),
          });
        });
      }

      //Запит на бекенд
      try {
        const response = await axios.post(url, formData);
        return response;
      } catch (error) {
        console.error('Помилка при завантаженні квартир:', error);
        return null;
      }
    }
    async function loadUnits() {
      const res = await getunits();
      if (!res) return;

      const data = res.data;
      setUnits(data.data);
    }
    const section = document.querySelector('.section_hot_deals');
    const project = section.getAttribute('data-project');
    const wrapper = section.querySelector('.swiper-wrapper');

    const setUnits = units => {
      console.log(units.length);
      wrapper.innerHTML = ''; // очищаємо обгортку
      let count = 0;
      const selectedUnits = units
        .filter(
          unit => unit.total_price && unit.total_price > 0 && unit.project.name !== 'Залишки', // ← ДОДАНО виключення
        )
        .sort((a, b) => a.total_price - b.total_price)
        .reduce((acc, unit) => {
          const projectExists = acc.some(item => item.project_id === unit.project_id);
          if (!projectExists) {
            acc.push(unit);
          }
          return acc;
        }, [])
        .slice(0, 5);

      console.log('🏆 5 найдешевших (без "Залишків"):', selectedUnits);

      function transliterateUkrainian(text, removeSpaces = true) {
        const ukrainianMap = {
          а: 'a',
          б: 'b',
          в: 'v',
          г: 'g',
          ґ: 'g',
          д: 'd',
          е: 'e',
          є: 'ye',
          ж: 'zh',
          з: 'z',
          и: 'y',
          і: 'i',
          ї: 'yi',
          й: 'y',
          к: 'k',
          л: 'l',
          м: 'm',
          н: 'n',
          о: 'o',
          п: 'p',
          р: 'r',
          с: 's',
          т: 't',
          у: 'u',
          ф: 'f',
          х: 'kh',
          ц: 'ts',
          ч: 'ch',
          ш: 'sh',
          щ: 'sch',
          ь: 'y',
          ю: 'yu',
          я: 'ya',
          А: 'A',
          Б: 'B',
          В: 'V',
          Г: 'G',
          Ґ: 'G',
          Д: 'D',
          Е: 'E',
          Є: 'Ye',
          Ж: 'Zh',
          З: 'Z',
          И: 'Y',
          І: 'I',
          Ї: 'Yi',
          Й: 'Y',
          К: 'K',
          Л: 'L',
          М: 'M',
          Н: 'N',
          О: 'O',
          П: 'P',
          Р: 'R',
          С: 'S',
          Т: 'T',
          У: 'U',
          Ф: 'F',
          Х: 'Kh',
          Ц: 'Ts',
          Ч: 'Ch',
          Ш: 'Sh',
          Щ: 'Sch',
          Ь: 'Y',
          Ю: 'Yu',
          Я: 'Ya',
        };

        const hasCyrillic = /[а-яєіїґА-ЯЄІЇҐ]/.test(text);

        let result;

        if (hasCyrillic) {
          // ✅ КИРИЛИЦЯ - конвертуй
          result = text
            .split('')
            .map(char => ukrainianMap[char] || char)
            .join('')
            .toLowerCase();
        } else {
          // ✅ ЛАТИНИЦЯ - не конвертуй, просто обробляй
          result = text.toLowerCase();
        }

        // ✅ ВИДАЛИ ПРОБІЛИ ДЛЯ ОБОХ (якщо removeSpaces = true)
        if (removeSpaces) {
          result = result.replace(/\s+/g, '');
        }

        return result;
      }

      selectedUnits.forEach(unit => {
        console.log(unit);
        count++;
        const unitHTML = `
          <div class="swiper-slide">
            <a href="/flats?id=${unit.id}" 
                class="flat_card" data-filtered="true"  
                data-project="${unit.project.name || null}" 
                data-room_count="${unit.room_count || null}" 
                data-type="${unit.unit_type?.name || 'Помешкання'}" 
                data-size="${unit.real_size || null}" 
                data-floor="${unit.floor.name ? unit.floor.name.match(/-?\d+/)?.[0] || null : null}"
                data-id=${unit.id}
            >
        <div class="flat_card__hover">
          <span style="background:${colors[unit.id] ||
            '#DCDCDC'};"  data-color="${transliterateUkrainian(unit.project.name) || ''}"></span>
        </div>
        <!--<div class="flat_card__note">Новинка</div>-->
        <div class="flat_card__top">
          <span>Житловий комплекс</span>
          <span>${unit.project.name || null}</span>
        </div>
        <div class="flat_card__img">
          <img src="${
            unit.images?.[1]?.path
              ? `https://source-riel.propertymate.ai/${unit.images[1].path}`
              : '/wp-content/themes/3d/assets/images/no_image.gif'
          }"   alt="planning" />
        </div>
        <div class="flat_card__center">
          <div class="flat_card__center_left">
            ${true ? `<span>Помешкання м²</span>` : `<span>м²</span>`}
            ${
              unit.real_size && unit.real_size !== 0
                ? `<span>${unit.real_size}</span>`
                : '<span>-</span>'
            }
          </div>
          <div class="flat_card__center_center">
            <span>/</span>
          </div>
          <div class="flat_card__center_right">
            <span>грн/м²</span>
            <span>${
              unit.total_price && unit.total_price !== 0
                ? Number(unit.total_price).toLocaleString('uk-UA')
                : '-'
            }</span>
          </div>
        </div>
        <div class="flat_card__bottom">
          ${unit.section_name ? `<span>Секція: ${unit.section_name}</span>` : ''}
          ${
            unit.floor_name && unit.floor_name !== 0
              ? `<span>Поверх: ${unit.floor_name}</span>`
              : ''
          }
          ${
            unit.room_count && unit.room_count !== 0
              ? `<span>Кімнат: ${unit.room_count}</span>`
              : ''
          }
        </div>
        ${
          adresses[unit.project_name]
            ? `<div class="flat_card__address">
      <svg width="11" height="16" viewBox="0 0 11 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.50073 0C8.14043 0 10.4782 1.66034 10.4783 4.83008C10.4783 5.49423 10.1269 6.46565 9.95093 6.86816L5.50073 16L1.05054 6.86816C0.874556 6.46565 0.523193 5.49423 0.523193 4.83008C0.523248 1.66034 2.86104 4.59894e-06 5.50073 0ZM5.50073 2.84375C4.32252 2.84375 3.36694 3.79933 3.36694 4.97754C3.36719 6.15554 4.32268 7.11035 5.50073 7.11035C6.67858 7.11011 7.6333 6.15539 7.63354 4.97754C7.63354 3.79948 6.67873 2.844 5.50073 2.84375Z" fill="#F4F5F9"/>
      </svg>
      <span>${adresses[unit.project_name]}</span>
    </div>`
            : ''
        }

      </a>
      </div>
    `;
        wrapper.insertAdjacentHTML('beforeend', unitHTML);
      });
      const lastSlideHTML = `
          <div class="swiper-slide last-slide">
            <a class="flat_card" href="/flats" 
                class="btn_more"
            >
              <span>Дивитись всі помешкання</span>
            </a>
      </div>
    `;
      wrapper.insertAdjacentHTML('beforeend', lastSlideHTML);
      // Якщо не додано жодної картки — ховаємо секцію
      if (count === 0) {
        section.style.display = 'none';
      }
    };
    loadUnits();
>>>>>>> 3213fd333ccd40fd5161ae3b874e26c606430d12
  }

  const openBtn = document.querySelector('.header__open_popup');
  const popup = document.querySelector('.connect_popup');
  const closeBtn = document.querySelector('.connect_popup__close');

  if (openBtn && popup) {
    openBtn.addEventListener('click', () => {
      if (window.innerWidth < 1024) {
        popup.style.transform = 'translateY(0)';
      }
    });
  }

  if (closeBtn && popup) {
    closeBtn.addEventListener('click', () => {
      if (window.innerWidth < 1024) {
        popup.style.transform = 'translateY(100%)';
      }
    });
  }

  const goUpButton = document.querySelector('.footer__up');

  if (goUpButton) {
    goUpButton.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  }

  if (document.querySelector('.arrow_down')) {
    document.querySelector('.arrow_down').addEventListener('click', function() {
      const section = document.querySelector('.section_next');
      if (section) {
        section.scrollIntoView({
          behavior: 'smooth',
        });
      }
    });
  }

  document.querySelectorAll('input').forEach(el => {
    el.addEventListener('input', () => {
      el.setAttribute('value', el.value);
    });
  });
});
