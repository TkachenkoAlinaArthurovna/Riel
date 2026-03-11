export function renderCartPopupUnits(allPremises, cartIds) {
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
  const container = document.querySelector('.cart_popup .wrapper_for_units');
  if (!container) return;

  const checkedEl = document.querySelector('.cart_popup .check .checked');
  const allEl = document.querySelector('.cart_popup .check .all');

  const cartSet = new Set((cartIds || []).map(String));

  const unitsInCart = (Array.isArray(allPremises) ? allPremises : []).filter(u =>
    cartSet.has(String(u.id)),
  );

  if (allEl) allEl.textContent = String(unitsInCart.length);
  if (checkedEl) checkedEl.textContent = String(unitsInCart.length);

  if (unitsInCart.length === 0) {
    if (document.querySelector('.cart_count')) {
      document.querySelector('.cart_count').classList.remove('active');
    }
    container.innerHTML = `<div class="cart_empty">Кошик порожній</div>`;
    return;
  }

  function getUnitImageSrc(unit) {
    let imgPath =
      unit.images?.[1]?.path ||
      unit.images?.[0]?.path ||
      unit.section_images?.images?.[0]?.path ||
      'https://stock.riel.ua/wp-content/themes/3d/assets/images/no_image.gif';

    if (typeof imgPath === 'string' && imgPath.startsWith('/')) {
      imgPath = `https://source-riel.propertymate.ai${imgPath}`;
    }
    return imgPath;
  }

  container.innerHTML = unitsInCart
    .map(unit => {
      const imgSrc = getUnitImageSrc(unit);
      const projectName = unit.project_name || '';
      const color = colors[projectName] || '#68d23f';
      const address = adresses[projectName] || '';

      return `
      <div class="unit_card" data-id="${
        unit.id
      }" data-url="https://stock.riel.ua/flats/?project_id=${projectsIds[unit.project_name] ||
        '0'}&id=${unit.id}">
        <div class="unit_card__input">
          <input type="checkbox" class="checkbox" checked />
        </div>

        <div class="unit_card__img">
          <img src="${imgSrc}" alt="planning" />
        </div>

        <div class="unit_card__info">
          <div class="unit_card__center">
            <div class="unit_card__title" style="color:${color};">ЖК ${projectName}</div>

            ${
              address
                ? `
              <div class="unit_card__address">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8.00098 0C10.6407 0 12.9785 1.66034 12.9785 4.83008C12.9785 5.49423 12.6272 6.46565 12.4512 6.86816L8.00098 16L3.55078 6.86816C3.3748 6.46565 3.02344 5.49423 3.02344 4.83008C3.02349 1.66034 5.36129 0 8.00098 0ZM8.00098 2.84375C6.82277 2.84375 5.86719 3.79933 5.86719 4.97754C5.86743 6.15554 6.82292 7.11035 8.00098 7.11035C9.17882 7.11011 10.1335 6.15539 10.1338 4.97754C10.1338 3.79948 9.17897 2.844 8.00098 2.84375Z" fill="#F4F5F9"/>
                </svg>
                <span>${address}</span>
              </div>
            `
                : ''
            }
          </div>

          <div class="unit_card__right">
            <div class="unit_card__right_top">
              ${
                unit.design_size > 0 && unit.unit_type_name !== 'паркінг'
                  ? `
                    <span class="size">${unit.design_size} м²</span>
                    <span>/</span>
                  `
                  : ''
              }
              <span class="price uah">${
                unit.price_m2_uah
                  ? Number(unit.price_m2_uah).toLocaleString('uk-UA') +
                    (unit.unit_type_name !== 'паркінг' ? ' грн/м²' : '')
                  : ''
              }</span>
              <span class="price usd">${
                unit.price_m2
                  ? Number(unit.price_m2).toLocaleString('uk-UA') +
                    (unit.unit_type_name !== 'паркінг' ? ' $/м²' : '')
                  : ''
              }</span>
            </div>

            <div class="unit_card__right_bottom">
              ${
                unit.section_name ? `<span class="section">Секція: ${unit.section_name}</span>` : ''
              }
              ${unit.floor_name ? `<span class="floor">Поверх: ${unit.floor_name}</span>` : ''}
              ${unit.room_count ? `<span class="room">Кімнат: ${unit.room_count}</span>` : ''}
            </div>
          </div>
        </div>

          <div class="unit_card__delete">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5.92C12.2546 5.92 12.4988 5.81886 12.6789 5.63882C12.8589 5.45879 12.96 5.21461 12.96 4.96C12.96 4.70539 12.8589 4.46121 12.6789 4.28118C12.4988 4.10114 12.2546 4 12 4C11.7454 4 11.5013 4.10114 11.3212 4.28118C11.1412 4.46121 11.04 4.70539 11.04 4.96C11.04 5.21461 11.1412 5.45879 11.3212 5.63882C11.5013 5.81886 11.7454 5.92 12 5.92ZM12 12.96C12.2546 12.96 12.4988 12.8589 12.6789 12.6788C12.8589 12.4988 12.96 12.2546 12.96 12C12.96 11.7454 12.8589 11.5012 12.6789 11.3212C12.4988 11.1411 12.2546 11.04 12 11.04C11.7454 11.04 11.5013 11.1411 11.3212 11.3212C11.1412 11.5012 11.04 11.7454 11.04 12C11.04 12.2546 11.1412 12.4988 11.3212 12.6788C11.5013 12.8589 11.7454 12.96 12 12.96ZM12 20C12.2546 20 12.4988 19.8989 12.6789 19.7188C12.8589 19.5388 12.96 19.2946 12.96 19.04C12.96 18.7854 12.8589 18.5412 12.6789 18.3612C12.4988 18.1811 12.2546 18.08 12 18.08C11.7454 18.08 11.5013 18.1811 11.3212 18.3612C11.1412 18.5412 11.04 18.7854 11.04 19.04C11.04 19.2946 11.1412 19.5388 11.3212 19.7188C11.5013 19.8989 11.7454 20 12 20Z" stroke="#F4F5F9" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M17 5V4C17 3.46957 16.7893 2.96086 16.4142 2.58579C16.0391 2.21071 15.5304 2 15 2H9C8.46957 2 7.96086 2.21071 7.58579 2.58579C7.21071 2.96086 7 3.46957 7 4V5H4C3.73478 5 3.48043 5.10536 3.29289 5.29289C3.10536 5.48043 3 5.73478 3 6C3 6.26522 3.10536 6.51957 3.29289 6.70711C3.48043 6.89464 3.73478 7 4 7H5V18C5 18.7956 5.31607 19.5587 5.87868 20.1213C6.44129 20.6839 7.20435 21 8 21H16C16.7956 21 17.5587 20.6839 18.1213 20.1213C18.6839 19.5587 19 18.7956 19 18V7H20C20.2652 7 20.5196 6.89464 20.7071 6.70711C20.8946 6.51957 21 6.26522 21 6C21 5.73478 20.8946 5.48043 20.7071 5.29289C20.5196 5.10536 20.2652 5 20 5H17ZM15 4H9V5H15V4ZM17 7H7V18C7 18.2652 7.10536 18.5196 7.29289 18.7071C7.48043 18.8946 7.73478 19 8 19H16C16.2652 19 16.5196 18.8946 16.7071 18.7071C16.8946 18.5196 17 18.2652 17 18V7Z" fill="#1D3541" />
                      <path d="M9 9H11V17H9V9ZM13 9H15V17H13V9Z" fill="#1D3541" />
                  </svg><span>Видалити</span>
              </div>
          </div>
      </div>
    `;
    })
    .join('');

  // ====== COUNT CHECKED интеграція ======
  function updateCheckedCount() {
    const all = container.querySelectorAll('.checkbox').length;
    const checked = container.querySelectorAll('.checkbox:checked').length;

    if (allEl) allEl.textContent = String(all);
    if (checkedEl) checkedEl.textContent = String(checked);
  }

  // початково
  updateCheckedCount();

  // щоб не навішувати багато разів при повторному рендері
  if (!container.dataset.checkedListener) {
    container.addEventListener('change', e => {
      if (e.target && e.target.classList.contains('checkbox')) {
        updateCheckedCount();
      }
    });
    container.dataset.checkedListener = '1';
  }
}
