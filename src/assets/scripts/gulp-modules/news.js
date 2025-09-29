document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.page-template-news')) {
    // Пагінація
    const leftArrow = document.querySelector('.pagination_arrow_left');
    const rightArrow = document.querySelector('.pagination_arrow_right');
    const currentPageEl = document.querySelector('.pagination__current_pages');
    const allPagesEl = document.querySelector('.all_pages');
    const preloader = document.querySelector('.preloader');

    const itemsPerPage = 6; // кількість карток на сторінку
    let currentPage = 1;
    let totalPages = 1;

    // Всі картки
    const allCards = Array.from(document.querySelectorAll('.news_card'));
    console.log(allCards);

    function showPage(page) {
      totalPages = Math.ceil(allCards.length / itemsPerPage) || 1;

      // обмежуємо номер сторінки
      if (page < 1) page = 1;
      if (page > totalPages) page = totalPages;
      currentPage = page;

      // оновлюємо номери
      currentPageEl.textContent = currentPage.toString().padStart(2, '0');
      allPagesEl.textContent = totalPages;

      // показуємо/ховаємо картки
      allCards.forEach((card, index) => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = currentPage * itemsPerPage;
        card.style.display = index >= start && index < end ? 'flex' : 'none';
      });

      // Деактивація кнопок
      leftArrow.classList.toggle('disabled', currentPage === 1);
      rightArrow.classList.toggle('disabled', currentPage === totalPages);

      // Приховуємо пагінацію, якщо сторінка одна
      const paginationWrapper = document.querySelector('.pagination');
      if (paginationWrapper) {
        paginationWrapper.style.display = totalPages > 1 ? 'flex' : 'none';
      }
    }

    // обробники кнопок
    leftArrow.addEventListener('click', () => {
      preloader.style.opacity = '1';
      preloader.style.visibility = 'visible';
      showPage(currentPage - 1);
      setTimeout(() => {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
      }, 500);
    });

    rightArrow.addEventListener('click', () => {
      preloader.style.opacity = '1';
      preloader.style.visibility = 'visible';
      showPage(currentPage + 1);
      setTimeout(() => {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
      }, 500);
    });

    // Запуск
    showPage(1);

    // Висота блока з картками, щоб не скакав
    function updateHeight() {
      const filterResult = document.querySelector('.section_news_for_page__wrapper');
      if (filterResult) {
        filterResult.style.minHeight = 'auto'; // скидаємо стару висоту
        const height = filterResult.offsetHeight; // поточна висота
        filterResult.style.minHeight = height + 'px';
      }
    }

    updateHeight();
    window.addEventListener('resize', updateHeight);
  }
});
