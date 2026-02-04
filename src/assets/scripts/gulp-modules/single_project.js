import { getData } from './helpers_for_units/getData';

// форматування ціни, якщо раптом знадобиться
function formatPrice(value) {
  if (value == null) return '';
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

document.addEventListener('DOMContentLoaded', async function() {
  if (!document.querySelector('.page-template-project_single')) {
    return;
  }

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

  const section = document.querySelector('.section_hot_deals');
  if (!section) return;

  const project = section.getAttribute('data-project');
  const wrapper = section.querySelector('.swiper-wrapper');
  let projectId = '';
  if (!wrapper) return;

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

  // 🔁 ТУТ ТА САМА ЛОГІКА, ЩО Й У SINGLE-FLAT:
  // спочатку беремо юніти з sessionStorage, якщо немає — запит getData()
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

  function syncCartButtonsIn(root = document) {
    let cart = [];
    try {
      cart = JSON.parse(localStorage.getItem('cart')) || [];
      if (!Array.isArray(cart)) cart = [];
    } catch {
      cart = [];
    }

    const cartSet = new Set(cart);

    root.querySelectorAll('.flat_card').forEach(card => {
      const id = String(card.dataset.id || '').trim();
      const btn = card.querySelector('.flat_card__cart');
      if (!id || !btn) return;

      btn.classList.toggle('active', cartSet.has(id));
    });
  }

  const setUnits = units => {
    wrapper.innerHTML = '';
    let count = 0;

    // беремо юніти тільки цього ЖК
    const projectUnits = units.filter(unit => unit.project_name === project);

    // список типів у потрібному порядку
    // const priorityTypes = ['квартира', 'апартамент', 'офіс', 'комора', 'підвал', 'паркінг'];

    // // рахуємо кількість кожного типу
    // const typeCounts = projectUnits.reduce((acc, unit) => {
    //   const type = unit.unit_type_name;
    //   if (!type) return acc;

    //   acc[type] = (acc[type] || 0) + 1;
    //   console.log(acc);
    //   return acc;
    // }, {});

    // // знаходимо перший тип зі списку, у якого >= 1 юнітів

    // // якщо жоден тип не підходить — нічого не виводимо
    // if (!selectedType) {
    //   console.log('Немає типу з мінімум 10 юнітами');
    //   return;
    // }

    // // беремо перші 10 юнітів цього типу
    // const selectedUnits = units
    //   .filter(unit => unit.project_name === project && unit.unit_type_name === selectedType)
    //   .sort((a, b) => (a.room_count || 0) - (b.room_count || 0))
    //   .slice(0, 10);

    // рахуємо кількість кожного типу
    // const typeCounts = projectUnits.reduce((acc, unit) => {
    //   const type = unit.unit_type_name;
    //   if (!type) return acc;

    //   acc[type] = (acc[type] || 0) + 1;
    //   return acc;
    // }, {});

    // // знаходимо тип з максимальною кількістю
    // const mostCommonUnitType = Object.keys(typeCounts).reduce((a, b) =>
    //   typeCounts[a] > typeCounts[b] ? a : b,
    // );

    // const selectedUnits = units
    //   .filter(unit => unit.project_name === project && unit.unit_type_name === mostCommonUnitType)
    //   .sort((a, b) => (a.room_count || 0) - (b.room_count || 0)) // від меншої кількості кімнат
    //   .slice(0, 5); // перші 5

    const priorityTypes = ['квартира', 'апартамент', 'офіс', 'комора', 'підвал', 'паркінг'];

    // рахуємо кількість кожного типу (нормалізовано)
    const typeCounts = projectUnits.reduce((acc, unit) => {
      const t = norm(unit.unit_type_name);
      if (!t) return acc;
      acc[t] = (acc[t] || 0) + 1;
      return acc;
    }, {});

    // перший доступний тип за пріоритетом
    const selectedType = priorityTypes.find(t => (typeCounts[t] || 0) >= 1) || priorityTypes[0];

    // беремо перші 10 карток у пріоритетному порядку
    const selectedUnits = priorityTypes
      .flatMap(t =>
        projectUnits
          .filter(u => norm(u.unit_type_name) === t)
          .sort((a, b) => (a.room_count || 0) - (b.room_count || 0)),
      )
      .slice(0, 10);

    selectedUnits.forEach(unit => {
      projectId = unit.project.id;
      const link = `/flats?project_id=${projectsIds[unit.project_name]}&id=${unit.id}`;

      count++;

      const imgSrc = getUnitImageSrc(unit);

      const unitHTML = `
        <div class="swiper-slide">
          <a href="${link}"
              class="flat_card " data-filtered="true"  
              data-project="${unit.project_name || ''}" 
              data-room_count="${unit.room_count || ''}" 
              data-type="${unit.unit_type_name || ''}" 
              data-size="${unit.design_size || ''}" 
              data-floor="${unit.floor_name ? unit.floor_name.match(/-?\d+/)?.[0] || '' : ''}"
              data-id="${unit.id}"
          >
            <div class="flat_card__hover">
             <span style="background:${colors[unit.project_name] || '#68d23f'};"></span>
            </div>
            <!--<div class="flat_card__note">Новинка</div>-->
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
                     ? `<span class="price_m2_uah">${Number(unit.price_m2_uah).toLocaleString(
                         'uk-UA',
                       )}</span><span class="price_m2">${Number(unit.price_m2).toLocaleString(
                         'uk-UA',
                       )}</span>`
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
            <div class="flat_card__cart">
                <span data-title="Додати в кошик">Додати в кошик</span>
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M16 16C14.89 16 14 16.89 14 18C14 18.5304 14.2107 19.0391 14.5858 19.4142C14.9609 19.7893 15.4696 20 16 20C16.5304 20 17.0391 19.7893 17.4142 19.4142C17.7893 19.0391 18 18.5304 18 18C18 17.4696 17.7893 16.9609 17.4142 16.5858C17.0391 16.2107 16.5304 16 16 16ZM0 0V2H2L5.6 9.59L4.24 12.04C4.09 12.32 4 12.65 4 13C4 13.5304 4.21071 14.0391 4.58579 14.4142C4.96086 14.7893 5.46957 15 6 15H18V13H6.42C6.3537 13 6.29011 12.9737 6.24322 12.9268C6.19634 12.8799 6.17 12.8163 6.17 12.75C6.17 12.7 6.18 12.66 6.2 12.63L7.1 11H14.55C15.3 11 15.96 10.58 16.3 9.97L19.88 3.5C19.95 3.34 20 3.17 20 3C20 2.73478 19.8946 2.48043 19.7071 2.29289C19.5196 2.10536 19.2652 2 19 2H4.21L3.27 0M6 16C4.89 16 4 16.89 4 18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20C6.53043 20 7.03914 19.7893 7.41421 19.4142C7.78929 19.0391 8 18.5304 8 18C8 17.4696 7.78929 16.9609 7.41421 16.5858C7.03914 16.2107 6.53043 16 6 16Z" fill="#1D3541"/>
                    </svg>
                </div>
            </div>
          </a>
        </div>
      `;

      wrapper.insertAdjacentHTML('beforeend', unitHTML);
    });

    const selectedSlug = TYPE_SLUG[selectedType] || 'flats';

    // complex у вас працює як project.id (саме його читає фільтр)
    const complexId = String(projectId);

    const lastSlideHTML = `
  <div class="swiper-slide last-slide">
    <a class="flat_card" href="/${selectedSlug}/?complex=${encodeURIComponent(
      complexId,
    )}" class="btn_more">
      <span>Дивитись більше</span>
    </a>
  </div>
`;
    wrapper.insertAdjacentHTML('beforeend', lastSlideHTML);

    syncCartButtonsIn(wrapper);

    if (count === 0) {
      section.style.display = 'none';
    }
  };

  // 🔹 1. Тягнемо юніти ТАК САМО, як у single flat
  const allUnits = await loadUnits();
  const safeUnits = Array.isArray(allUnits) ? allUnits : [];

  // 🔹 2. Рендеримо картки
  setUnits(safeUnits);
});
