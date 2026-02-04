export function renderUnitsPortion(units, shownCount, portionSize = 12) {
  const wrapper = document.querySelector('.section_flats__filter_result_wrapper');
  const loadmoreBtn = document.querySelector('.section_flats__loadmore');

  //   projectsIds, colors, adresses

  const projectsIds = {
    Америка: 252,
    Компаньйон: 682,
    'Новий Форт': 230,
    'Велика Британія': 314,
    Вежа: 180,
    Шенген: 110,
    'Ріел Сіті': 26,
    'Nordica Residence': 728,
    'Maxima Residence': 720,
    Brother: 708,
    Father: 698,
    Тополіс: 292,
    Брама: 203,
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
    Вежа: '#fdcec8ff',
    'Велика Британія': '#008080',
    'Голоські Кручі': '#00FF7F',
    'Доктор Ватсон': '#F0E68C',
    Залишки: '#8B0000',
    Канкріт: '#FFD700',
    Компаньйон: '#F4A460',
    'Львівська площа': '#ffdaadff',
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

  const adresses = {
    Америка: 'вулиця Володимира Великого, 10',
    Вежа: 'вул. Б. Хмельницького, 207',
    Брама: 'вул. Б. Хмельницького, 116',
    'Велика Британія': 'вул. Шевченка, 31',
    'Голоські Кручі': 'вул. Під Голоском',
    'Доктор Ватсон': 'вулиця Пекарська, 57',
    Компаньйон: 'вул. Проектована, 1',
    'Львівська площа': 'вул. Кудрявська, 24а',
    'Львівський квартал': 'вул. Глибочицька, 13',
    'Новий Форт': 'вул. Волинська, 9',
    'ОК Land': 'просп. Повітряних сил, 56',
    Тополіс: 'вул. Гетьмана Мазепи, 25а, 25б',
    'Ріел Сіті': 'вул. Рудненська, 8',
    'Шерлок Холмс': 'вул. Пекарська, 30',
    Ярославенка: 'вул. Ярославенка, 30',
    Шенген: 'вул. Залізнична, 7',
    'Берег Дніпра': 'Дніпровська набережна, 17-К',
    Форвард: 'вул. Ростиславська, 5а',
    'Поділ Град': 'вулиця Дегтярна, 6',
    'Nordica Residence': 'Залізничне шосе, 45а',
    'Maxima Residence': 'вул. Коновальця, 30',
    'Hyde Park': 'вул. Мучна, 32',
    Канкріт: 'Дніпровська набережна, 17',
    BigBen: 'вул. Стрийська (Персенківка, 2)',
    Brother: 'вул. Ревуцького, 1',
    Father: 'вул. Промислова, 50/52',
    Sister: 'вул. Клеманська, 3',
    Harry: 'вулиця Стороженка, 25А',
  };

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
        class="flat_card "
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
          ${
            unit.unit_type_name !== 'паркінг'
              ? `
     ${
       unit.design_size > 0
         ? `
            <div class="flat_card__center_left">
              <span>${unit.unit_type_name} м²</span>
              <span>${unit.design_size}</span>
            </div>
            <div class="flat_card__center_center"><span>/</span></div>
          `
         : ''
     }
      
    `
              : ''
          }
           
          <div class="flat_card__center_right">
           ${
             unit.unit_type_name !== 'паркінг'
               ? `<span class="price_m2_uah">грн/м²</span>
            <span class="price_m2">$/м²</span>
            `
               : ''
           }
                
                 ${
                   unit.price_m2 && unit.price_m2_uah
                     ? `<span class="price_m2_uah number">${Number(
                         unit.price_m2_uah,
                       ).toLocaleString('uk-UA')}</span><span class="price_m2 number">${Number(
                         unit.price_m2,
                       ).toLocaleString('uk-UA')}</span>`
                     : '<span>-</span>'
                 }
          </div>
        </div>

        <div class="flat_card__bottom">
          ${unit.section_name ? `<span>Секція: ${unit.section_name}</span>` : ''}
          ${
            unit.floor_name
              ? `<span>Поверх: ${unit.floor_name.toString().match(/-?\d+/)?.[0] || ''}</span>`
              : ''
          }
          ${unit.room_count ? `<span>Кімнат: ${unit.room_count}</span>` : ''}
        </div>

        ${
          adresses[unit.project_name]
            ? `<div class="flat_card__address">
                <svg width="11" height="16">
                  <path fill="#F4F5F9" d="M5.5 0C8.1 0 10.48 1.66 10.48 4.83c0 .66-.35 1.63-.53 2.04L5.5 16 1.05 6.87c-.18-.4-.53-1.39-.53-2.04C.52 1.66 2.86 0 5.5 0zm0 2.84c-1.18 0-2.13.96-2.13 2.14 0 1.18.95 2.13 2.13 2.13s2.13-.95 2.13-2.13c0-1.18-.95-2.14-2.13-2.14z"/>
                </svg>
                <span>${adresses[unit.project_name]}</span>
              </div>`
            : ''
        }
        <div class="flat_card__cart">
            <span data-title="Додати в кошик">Додати в кошик</span>
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M16 16C14.89 16 14 16.89 14 18C14 18.5304 14.2107 19.0391 14.5858 19.4142C14.9609 19.7893 15.4696 20 16 20C16.5304 20 17.0391 19.7893 17.4142 19.4142C17.7893 19.0391 18 18.5304 18 18C18 17.4696 17.7893 16.9609 17.4142 16.5858C17.0391 16.2107 16.5304 16 16 16ZM0 0V2H2L5.6 9.59L4.24 12.04C4.09 12.32 4 12.65 4 13C4 13.5304 4.21071 14.0391 4.58579 14.4142C4.96086 14.7893 5.46957 15 6 15H18V13H6.42C6.3537 13 6.29011 12.9737 6.24322 12.9268C6.19634 12.8799 6.17 12.8163 6.17 12.75C6.17 12.7 6.18 12.66 6.2 12.63L7.1 11H14.55C15.3 11 15.96 10.58 16.3 9.97L19.88 3.5C19.95 3.34 20 3.17 20 3C20 2.73478 19.8946 2.48043 19.7071 2.29289C19.5196 2.10536 19.2652 2 19 2H4.21L3.27 0M6 16C4.89 16 4 16.89 4 18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20C6.53043 20 7.03914 19.7893 7.41421 19.4142C7.78929 19.0391 8 18.5304 8 18C8 17.4696 7.78929 16.9609 7.41421 16.5858C7.03914 16.2107 6.53043 16 6 16Z" fill="#1D3541"/>
                </svg>
            </div>
        </div>
      </a>
    `;

    htmlArr.push(html);
  });

  wrapper.innerHTML = htmlArr.join('');

  // ✅ СИНХРОНІЗАЦІЯ ACTIVE ПО CART ПІСЛЯ РЕНДЕРУ
  let cart = [];
  try {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (!Array.isArray(cart)) cart = [];
  } catch {
    cart = [];
  }

  const cartSet = new Set(cart);

  wrapper.querySelectorAll('.flat_card').forEach(card => {
    const id = String(card.dataset.id || '').trim();
    const btn = card.querySelector('.flat_card__cart');
    if (!id || !btn) return;

    btn.classList.toggle('active', cartSet.has(id));
  });

  // керування кнопкою
  if (units.length > shownCount) {
    loadmoreBtn.style.display = 'block';
  } else {
    loadmoreBtn.style.display = 'none';
  }
}
