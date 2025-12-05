/**
 * Рахує кількість видимих (відфільтрованих) карток квартир
 * і виводить це число у .btn_filter_mob .number span
 */
export function countVisibleCards() {
  const count = document.querySelectorAll('.flat_card[data-filtered="true"]').length;
  const counterEl = document.querySelector('.btn_filter_mob .number span');

  if (counterEl) {
    counterEl.textContent = count;
  }
}
