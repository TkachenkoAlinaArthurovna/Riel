export function renderUnitsPortion(units, shownCount, portionSize = 12) {
  const wrapper = document.querySelector('.section_flats__filter_result_wrapper');
  const loadmoreBtn = document.querySelector('.section_flats__loadmore');

  //   projectsIds, colors, adresses

  const projectsIds = {
    Америка: 252,
    Компаньйон: 0,
    'Новий Форт': 230,
    'Велика Британія': 314,
    Вежа: 180,
    Шенген: 110,
    'Ріел Сіті': 26,
  };

  const colors = {
    'Big Ben': '#B22222',
    Brother: '#FFA500',
    Father: '#228B22',
    HARRY: '#C0C0C0',
    'Hyde Park': '#808080',
    'Maxima Residence': '#2F4F4F',
    'Nordica Residence': '#696969',
    Sister: '#0000FF',
    Америка: '#000080',
    Брама: '#CD853F',
    Вежа: '#FFE4E1',
    'Велика Британія': '#008080',
    'Голоські Кручі': '#00FF7F',
    'Доктор Ватсон': '#F0E68C',
    Залишки: '#8B0000',
    Канкріт: '#FFD700',
    Компаньйон: '#F4A460',
    'Львівська площа': '#FFE4C4',
    'Львівський квартал': '#DEB887',
    'Новий Форт': '#0000CD',
    'ОК Land': '#9932CC',
    'Поділ Град': '#6495ED',
    'Ріел Сіті': '#90EE90',
    Тополіс: '#FFE4B5',
    'Умовно вільні Львів': '#E6E6FA',
    Форвард: '#2F4F4F',
    Шенген: '#FFA500',
    Ярославенка: '#696969',
  };

  const adresses = {};

  if (!wrapper) return;

  const toShow = units.slice(0, shownCount);
  const htmlArr = [];

  function getUnitImageSrc(unit) {
    // 1. Пробуємо взяти з unit.images[1] → unit.images[0]
    let imgPath =
      unit.images?.[1]?.path ||
      unit.images?.[0]?.path ||
      unit.section_images?.images?.[0]?.path || // 2. fallback на section_images
      'https://stock.riel.ua/wp-content/themes/3d/assets/images/no_image.gif'; // 3. заглушка

    // Якщо це відносний шлях типу "/project/...", додаємо домен
    if (imgPath.startsWith('/')) {
      imgPath = `https://source-riel.propertymate.ai${imgPath}`;
    }

    return imgPath;
  }

  toShow.forEach(unit => {
    const link = `/flats?project_id=${projectsIds[unit.project_name] || '0'}&id=${unit.id}`;

    const imgSrc = getUnitImageSrc(unit);

    const html = `
      <a href="${link}"
        class="flat_card"
        data-id="${unit.id}"
      >
        <div class="flat_card__hover">
            <span style="background:${colors[unit.project_name] || '#68d23f'};"></span>
        </div>

        <div class="flat_card__top">
          <!--<span>Житловий комплекс</span>-->
          ${unit.project_name ? `<span>${unit.project_name}</span>` : ''}
        </div>

        <div class="flat_card__img">
            <img src="${imgSrc}" alt="planning" />
        </div>

        <div class="flat_card__center">
          <div class="flat_card__center_left">
            <span> ${unit.unit_type_name ? unit.unit_type_name : 'Помешкання'} м²</span>
            ${unit.design_size ? `<span>${unit.design_size}</span>` : '<span>-</span>'}
          </div>
          <div class="flat_card__center_center"><span>/</span></div>
          <div class="flat_card__center_right">
            <span>грн</span>
            ${
              unit.total_price_uah
                ? `<span>${Number(unit.total_price_uah).toLocaleString('uk-UA')}</span>`
                : '<span>-</span>'
            }
          </div>
        </div>

        <div class="flat_card__bottom">
          ${unit.section_name ? `<span>Секція: ${unit.section_name}</span>` : ''}
          ${unit.floor_name ? `<span>Поверх: ${unit.floor_name}</span>` : ''}
          ${unit.room_count ? `<span>Кімнат: ${unit.room_count}</span>` : ''}
        </div>

        ${
          adresses[unit.project_name]
            ? `<div class="flat_card__address">
                <svg width="11" height="16">
                  <path d="M5.5 0C8.1 0 10.48 1.66 10.48 4.83c0 .66-.35 1.63-.53 2.04L5.5 16 1.05 6.87c-.18-.4-.53-1.39-.53-2.04C.52 1.66 2.86 0 5.5 0zm0 2.84c-1.18 0-2.13.96-2.13 2.14 0 1.18.95 2.13 2.13 2.13s2.13-.95 2.13-2.13c0-1.18-.95-2.14-2.13-2.14z"/>
                </svg>
                <span>${adresses[unit.project_name]}</span>
              </div>`
            : ''
        }
      </a>
    `;

    htmlArr.push(html);
  });

  wrapper.innerHTML = htmlArr.join('');

  // керування кнопкою
  if (units.length > shownCount) {
    loadmoreBtn.style.display = 'block';
  } else {
    loadmoreBtn.style.display = 'none';
  }
}
