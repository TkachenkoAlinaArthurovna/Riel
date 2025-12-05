import { scrollToFilterResults } from './scrollToFilterResults.js';

export function initPagination() {
  // const leftArrow = document.querySelector('.section_flats__pagination_arrow_left');
  // const rightArrow = document.querySelector('.section_flats__pagination_arrow_right');
  // const currentPageEl = document.querySelector('.section_flats__current_pages');
  // const allPagesEl = document.querySelector('.all_pages');
  // const preloader = document.querySelector('.preloader');
  // const itemsPerPage = 6;
  // let currentPage = 1;
  // let totalPages = 1;
  // function getFilteredElements() {
  //   return Array.from(document.querySelectorAll('[data-filtered="true"]'));
  // }
  // function showPage(page) {
  //   const filteredElements = getFilteredElements();
  //   totalPages = Math.ceil(filteredElements.length / itemsPerPage) || 1;
  //   if (page < 1) page = 1;
  //   if (page > totalPages) page = totalPages;
  //   currentPage = page;
  //   currentPageEl.textContent = currentPage.toString().padStart(2, '0');
  //   allPagesEl.textContent = totalPages;
  //   filteredElements.forEach((card, index) => {
  //     const start = (currentPage - 1) * itemsPerPage;
  //     const end = currentPage * itemsPerPage;
  //     card.style.display = index >= start && index < end ? 'flex' : 'none';
  //   });
  //   // Кнопки
  //   leftArrow.classList.toggle('disabled', currentPage === 1);
  //   rightArrow.classList.toggle('disabled', currentPage === totalPages);
  //   // Приховати, якщо лише одна сторінка
  //   const paginationWrapper = document.querySelector('.section_flats__pagination.pagination');
  //   if (paginationWrapper) {
  //     paginationWrapper.style.display = totalPages > 1 ? 'flex' : 'none';
  //   }
  // }
  // const setPagination = () => {
  //   const filteredElements = getFilteredElements();
  //   totalPages = Math.ceil(filteredElements.length / itemsPerPage) || 1;
  //   currentPage = 1;
  //   currentPageEl.textContent = currentPage.toString().padStart(2, '0');
  //   allPagesEl.textContent = totalPages;
  //   showPage(currentPage);
  // };
  // // Стрілки
  // leftArrow?.addEventListener('click', () => {
  //   preloader.style.opacity = '1';
  //   preloader.style.visibility = 'visible';
  //   showPage(currentPage - 1);
  //   scrollToFilterResults();
  //   setTimeout(() => {
  //     preloader.style.opacity = '0';
  //     preloader.style.visibility = 'hidden';
  //   }, 1000);
  // });
  // rightArrow?.addEventListener('click', () => {
  //   preloader.style.opacity = '1';
  //   preloader.style.visibility = 'visible';
  //   showPage(currentPage + 1);
  //   scrollToFilterResults();
  //   setTimeout(() => {
  //     preloader.style.opacity = '0';
  //     preloader.style.visibility = 'hidden';
  //   }, 1000);
  // });
  // // Запуск при завантаженні
  // // setPagination();
  // // Повертаємо функцію, щоб можна було оновити після фільтрації
  // return { setPagination, showPage };
}
