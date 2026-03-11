import { sortFilteredPremises } from './sortFilteredPremises';

export function initSortSelect(filters, portionSize = 12) {
  const root = document.getElementById('sortSelect');
  if (!root) return;

  const trigger = root.querySelector('.section_flats__custom-select-trigger');
  const triggerLabel = trigger.querySelector('span');
  const options = root.querySelectorAll('.custom-option');

  // початковий стан із filters.sort (якщо ти його зберігаєш)
  const currentSort = filters.sort || '';
  let currentOption = Array.from(options).find(o => o.dataset.value === currentSort) || options[0];

  options.forEach(o => o.classList.remove('selected'));
  currentOption.classList.add('selected');
  triggerLabel.textContent = currentOption.textContent;

  // відкривання/закривання
  trigger.addEventListener('click', () => {
    root.classList.toggle('open');
  });

  document.addEventListener('click', e => {
    if (!root.contains(e.target)) {
      root.classList.remove('open');
    }
  });

  // клік по опції (ОСНОВНЕ МІСЦЕ)
  options.forEach(option => {
    option.addEventListener('click', () => {
      options.forEach(o => o.classList.remove('selected'));
      option.classList.add('selected');

      const value = option.dataset.value || '';

      triggerLabel.textContent = option.textContent;
      root.classList.remove('open');

      // оновлюємо filters.sort (щоб стан був у памʼяті)
      filters.sort = value;

      //сортуємо саме filteredPremises з localStorage
      sortFilteredPremises(value, portionSize);
    });
  });
}
