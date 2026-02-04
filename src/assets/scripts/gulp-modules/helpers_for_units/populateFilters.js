/**
 * Формує чекбокси в фільтрі
 * @param {Array} units - масив квартир (units)
 * @param {string|function} field - шлях до поля (наприклад 'project.name') або функція
 * @param {HTMLElement} wrapper - контейнер, куди вставляються чекбокси
 * @param {string} dataFilterPrefix - префікс для data-filter (наприклад 'Проєкт')
 */
export function populateFilter(units, field, wrapper, dataFilterPrefix) {
  // отримуємо значення
  const values = units
    .map(unit => {
      if (typeof field === 'function') return field(unit);
      const keys = field.split('.');
      return keys.reduce((acc, key) => acc?.[key], unit);
    })
    .filter(Boolean);

  // унікальні та відсортовані
  const uniqueValues = [...new Set(values)].sort((a, b) => {
    if (typeof a === 'number' && typeof b === 'number') return a - b;
    return a.toString().localeCompare(b.toString());
  });

  // очищаємо wrapper
  wrapper.innerHTML = '';

  // формуємо чекбокси
  uniqueValues.forEach((val, index) => {
    const id = `${dataFilterPrefix}-${index}`;
    const checkboxHTML = `
      <div class="checkbox">
        <input class="checkbox__input"
               type="checkbox"
               id="${id}"
               data-filter="${dataFilterPrefix}-${val}"
               data-name="${val}">
        <label class="checkbox__label" for="${id}">${val}</label>
      </div>
    `;
    wrapper.insertAdjacentHTML('beforeend', checkboxHTML);
  });
}

/**
 * Формує повзунки (range) у фільтрі
 * @param {Array} units - масив квартир (units)
 * @param {string|function} field - шлях до поля (наприклад 'real_size') або функція
 * @param {HTMLElement} wrapper - контейнер для слайдера
 * @param {string} label - назва поля (наприклад 'Площа', 'Поверх')
 */
export function populateSliderFilter(units, field, wrapper, label) {
  const values = units
    .filter(unit => unit.project_name !== 'Залишки')
    .map(unit => {
      if (typeof field === 'function') return field(unit);
      const keys = field.split('.');
      return keys.reduce((acc, key) => acc?.[key], unit);
    })
    .filter(v => typeof v === 'number' && !Number.isNaN(v));

  if (values.length === 0) return;

  // step під різні типи
  const step = label === 'Поверх' ? 1 : label === 'Площа' ? 0.1 : label === 'Ціна' ? 1 : 1;

  // нормалізація для поверху
  const normalizedValues = label === 'Поверх' ? values.map(v => Math.round(v)) : values;

  // базові min/max
  const minValueRaw = Math.min(...normalizedValues);
  const maxValueRaw = Math.max(...normalizedValues);

  // округлення під step, щоб не було 139.0999999999 і т.п.
  const roundToStep = v => {
    const inv = 1 / step; // 0.1 -> 10
    return Math.round(Number(v) * inv) / inv;
  };

  // кількість знаків після коми для tooltip
  const decimals = step === 1 ? 0 : step === 0.1 ? 1 : 2;

  const formatThousandsSpaces = val => String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  // форматування для відображення (кома замість крапки)
  // const formatValue = v => {
  //   const n = roundToStep(v);
  //   const out = decimals > 0 ? n.toFixed(decimals) : String(n);
  //   return out.replace('.', ',');
  // };
  const formatValue = v => {
    const n = roundToStep(v);

    // для ціни — без десяткових + пробіли між тисячами
    if (label === 'Ціна') {
      return formatThousandsSpaces(Math.round(n));
    }

    // для інших — як було (десяткові + кома)
    const out = decimals > 0 ? n.toFixed(decimals) : String(n);
    return out.replace('.', ',');
  };

  // фінальні min/max для input (кратні step)
  const minValue = roundToStep(minValueRaw);
  const maxValue = roundToStep(maxValueRaw);

  wrapper.innerHTML = `
    <div class="slider-wrapper">
      <input data-filter="${label}_min"
             type="range"
             id="${label}-min"
             min="${minValue}"
             max="${maxValue}"
             step="${step}"
             value="${minValue}">
      <input data-filter="${label}_max"
             type="range"
             id="${label}-max"
             min="${minValue}"
             max="${maxValue}"
             step="${step}"
             value="${maxValue}">
      <div class="range-tooltip min-tooltip">${formatValue(minValue)}</div>
      <div class="range-tooltip max-tooltip">${formatValue(maxValue)}</div>
      <div class="slider-track"></div>
    </div>
  `;

  const sliderMin = wrapper.querySelector(`#${CSS.escape(label)}-min`);
  const sliderMax = wrapper.querySelector(`#${CSS.escape(label)}-max`);
  const tooltipMin = wrapper.querySelector('.min-tooltip');
  const tooltipMax = wrapper.querySelector('.max-tooltip');

  if (!sliderMin || !sliderMax || !tooltipMin || !tooltipMax) return;

  function positionTooltip(slider, tooltip) {
    // percent для позиції
    const percent =
      ((Number(slider.value) - Number(slider.min)) / (Number(slider.max) - Number(slider.min))) *
      100;

    tooltip.style.left =
      tooltip === tooltipMin ? `calc(${percent}% + 4px)` : `calc(${percent}% - 4px)`;

    // показуємо відформатоване значення (а не "сирий float")
    tooltip.textContent = formatValue(slider.value);
  }

  function updateSlider() {
    // не даємо min перейти за max
    if (Number(sliderMin.value) > Number(sliderMax.value)) {
      sliderMin.value = sliderMax.value;
    }

    // нормалізуємо значення під step, щоб range не "плив"
    sliderMin.value = String(roundToStep(sliderMin.value));
    sliderMax.value = String(roundToStep(sliderMax.value));

    positionTooltip(sliderMin, tooltipMin);
    positionTooltip(sliderMax, tooltipMax);
  }

  sliderMin.addEventListener('input', updateSlider);
  sliderMax.addEventListener('input', updateSlider);

  // первинна синхронізація
  setTimeout(updateSlider, 0);
}
