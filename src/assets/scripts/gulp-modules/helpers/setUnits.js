// setUnits.js
import { adresses, projectIds, colors } from './constants.js'; // якщо constants.js є

export function setUnits(units, wrapper, pagination, filterCards, countVisibleCards) {
  wrapper.innerHTML = ''; // очищаємо обгортку

  units.forEach(unit => {
    if (unit.project_name != 'Залишки') {
      const link =
        unit.id && projectIds?.[unit.id]
          ? `/flats?id=${unit.id}&project=${projectIds[unit.id]}`
          : `/flats?id=${unit.id}`;
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
      const unitHTML = `
        <a href=${link}
          class="flat_card" data-filtered="true"
          data-project="${unit.project_name}" 
          data-room_count="${unit.room_count}" 
          data-type="Помешкання" 
          data-total_price="${unit.total_price_uah}"
          data-size="${unit.real_size}" 
          data-floor="${unit.floor_name ? unit.floor_name.match(/-?\d+/)?.[0] || null : null}"
          data-id=${unit.id}
        >
          <div class="flat_card__hover">
            
            <span style="background:${colors[unit.id] ||
              '#DCDCDC'};"  data-color="${transliterateUkrainian(unit.project_name) || ''}"></span>
          </div>
          <div class="flat_card__top">
            <span>Житловий комплекс</span>
            ${unit.project_name ? `<span>${unit.project_name}</span>` : ''}
          </div>
          <div class="flat_card__img">
            <img src="${
              unit.images?.[1]?.path
                ? `https://source-riel.propertymate.ai${unit.images[1].path}`
                : '/wp-content/themes/3d/assets/images/no_image.gif'
            }" alt="planning" />
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
            <div class="flat_card__center_center"><span>/</span></div>
            <div class="flat_card__center_right">
              <span>грн</span>
              <span>${
                unit.total_price_uah && unit.total_price_uah !== 0
                  ? Number(unit.total_price_uah).toLocaleString('uk-UA')
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
      `;

      wrapper.insertAdjacentHTML('beforeend', unitHTML);
    }
  });

  filterCards();
  countVisibleCards();
  pagination.setPagination();
}
