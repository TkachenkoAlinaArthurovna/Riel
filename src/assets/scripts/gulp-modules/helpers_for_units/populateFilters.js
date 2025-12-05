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
        <input class="checkbox__input" type="checkbox" id="${id}" data-filter="${dataFilterPrefix}-${val}" data-name="${val}">
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
    .filter(v => typeof v === 'number');

  if (values.length === 0) return;

  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);

  wrapper.innerHTML = `
    <div class="slider-wrapper">
      <input data-filter="${label}_min" type="range" id="${label}-min" min="${minValue}" max="${maxValue}" step="${
    label == 'Площа' || label == 'Ціна' ? 0.01 : 0.1
  }" value="${minValue}">
      <input data-filter="${label}_max" type="range" id="${label}-max" min="${minValue}" max="${maxValue}" step="${
    label == 'Площа' || label == 'Ціна' ? 0.01 : 0.1
  }" value="${maxValue}">
      <div class="range-tooltip min-tooltip">${Math.ceil(minValue)}</div>
      <div class="range-tooltip max-tooltip">${Math.ceil(maxValue)}</div>
      <div class="slider-track"></div>
    </div>
  `;

  const sliderWrapper = wrapper.querySelector('.slider-wrapper');
  const sliderTrack = sliderWrapper.querySelector('.slider-track');
  const sliderMin = wrapper.querySelector(`#${label}-min`);
  const sliderMax = wrapper.querySelector(`#${label}-max`);
  const minValueSpan = wrapper.querySelector(`#${label}-min-value`);
  const maxValueSpan = wrapper.querySelector(`#${label}-max-value`);
  const tooltipMin = wrapper.querySelector('.min-tooltip');
  const tooltipMax = wrapper.querySelector('.max-tooltip');

  function positionTooltip(slider, tooltip) {
    const percent = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
    if (tooltip == tooltipMin) {
      tooltip.style.left = `calc(${percent}% + 4px)`;
    }
    if (tooltip == tooltipMax) {
      tooltip.style.left = `calc(${percent}% - 4px)`;
    }
    tooltip.textContent = slider.value;
  }

  function updateSlider() {
    if (Number(sliderMin.value) > Number(sliderMax.value)) sliderMin.value = sliderMax.value;
    // minValueSpan.textContent = sliderMin.value;
    // maxValueSpan.textContent = sliderMax.value;

    positionTooltip(sliderMin, tooltipMin);
    positionTooltip(sliderMax, tooltipMax);
  }

  sliderMin.addEventListener('input', updateSlider);
  sliderMax.addEventListener('input', updateSlider);
  setTimeout(updateSlider, 50);
}
