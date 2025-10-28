export function scrollToFilterResults() {
  const targetElement = document.querySelector('.section_flats__selected');
  if (targetElement) {
    targetElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
}
