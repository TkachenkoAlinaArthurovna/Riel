export function updateHeight() {
  const filterResult = document.querySelector('.section_flats__filter_result');
  if (filterResult) {
    filterResult.style.minHeight = 'auto'; // скидаємо стару висоту
    const height = filterResult.offsetHeight; // поточна висота
    filterResult.style.minHeight = height + 'px';
  }
}
