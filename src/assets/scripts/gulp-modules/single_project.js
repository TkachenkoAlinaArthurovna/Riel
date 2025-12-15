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
    Компаньон: 'вул. Проектована, 1',
    'Львівська Площа': 'вул. Кудрявська, 24а',
    'Львівський Квартал': 'вул. Глибочицька, 13',
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
    Компаньйон: 0,
    'Новий Форт': 230,
    'Велика Британія': 314,
    Вежа: 180,
    Шенген: 110,
    'Ріел Сіті': 26,
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

  const setUnits = units => {
    wrapper.innerHTML = '';
    let count = 0;

    const selectedUnits = units
      .filter(unit => unit.project_name === project) // юніти тільки цього ЖК
      .sort((a, b) => (a.room_count || 0) - (b.room_count || 0)) // від меншої кількості кімнат
      .slice(0, 5); // перші 5

    selectedUnits.forEach(unit => {
      projectId = unit.project.id;
      const link = `/flats?project_id=${projectsIds[unit.project_name]}&id=${unit.id}`;

      count++;

      const imgSrc = getUnitImageSrc(unit);

      const unitHTML = `
        <div class="swiper-slide">
          <a href="${link}"
              class="flat_card" data-filtered="true"  
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
              <div class="flat_card__center_left">
                <span> ${unit.unit_type_name ? unit.unit_type_name : 'Помешкання'} м²</span>
                ${unit.design_size ? `<span>${unit.design_size}</span>` : '<span>-</span>'}
              </div>
              <div class="flat_card__center_center">
                <span>/</span>
              </div>
              <div class="flat_card__center_right">
                <span>грн/м²</span>
                <span>${unit.price_m2 ? Number(unit.price_m2).toLocaleString('uk-UA') : '-'}</span>
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
        <a class="flat_card" href="/flats?complex=${projectId}" class="btn_more">
          <span>Дивитись всі помешкання</span>
        </a>
      </div>
    `;
    wrapper.insertAdjacentHTML('beforeend', lastSlideHTML);

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
