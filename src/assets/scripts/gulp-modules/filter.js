document.addEventListener('DOMContentLoaded', () => {
  if (
    document.querySelector('.page-template-projects') &&
    !document.querySelector('.page-template-project_single')
  ) {
    //Це секція в якій обрані значення з фільтру
    const sectionProjectsSelected = document.querySelector('.section_projects__selected_wrapper');
    //Видаляє всі фільтри
    const btnDelete = document.querySelector('.btn_delete');
    const filterPopupBtnDelete = document.querySelector('.filter_popup__btn_delete');
    //Збираємо всі картки
    const projectCards = document.querySelectorAll('.project_card');
    //Прелоадер
    const preloader = document.querySelector('.preloader');

    function syncInputsWithSelectedFilter() {
      const allInputs = document.querySelectorAll(
        '.section_projects__filter input, .filter_projects input',
      );

      allInputs.forEach(input => {
        const filterKey = input.dataset.filter?.split('-')[0]; // для слайдерів буде 'Площа' або 'Поверх'

        if (!filterKey) return;

        if (input.type === 'checkbox') {
          const value = input.dataset.filter.split('-')[1];

          input.checked = selectedFilter[filterKey]?.includes(value) || false;
          if (selectedFilter[filterKey]?.includes(value)) {
            input.setAttribute('checked', 'checked');
            input.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }

        if (input.type === 'range') {
          if (selectedFilter[`${filterKey}`]) {
            input.value = selectedFilter[`${filterKey}`];

            input.setAttribute('value', selectedFilter[`${filterKey}`]);
          }
          if (selectedFilter[`${filterKey}`]) {
            input.value = selectedFilter[`${filterKey}`];

            input.setAttribute('value', selectedFilter[`${filterKey}`]);
          }

          // filterCards();
          // оновлюємо UI слайдера
          input.dispatchEvent(new Event('input'));
        }
      });
    }

    //Пагінація

    const leftArrow = document.querySelector('.section_projects__pagination_arrow_left');
    const rightArrow = document.querySelector('.section_projects__pagination_arrow_right');
    const currentPageEl = document.querySelector('.section_projects__current_pages');
    const allPagesEl = document.querySelector('.all_pages');

    const itemsPerPage = 6; // кількість карток на сторінку

    let currentPage = 1;
    let totalPages = 1;

    function showPage(page) {
      const filteredElements = getFilteredElements();
      totalPages = Math.ceil(filteredElements.length / itemsPerPage) || 1;

      // обмежуємо номер сторінки
      if (page < 1) page = 1;
      if (page > totalPages) page = totalPages;
      currentPage = page;
      currentPageEl.textContent = currentPage.toString().padStart(2, '0');
      allPagesEl.textContent = totalPages;

      // показуємо/ховаємо картки
      filteredElements.forEach((card, index) => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = currentPage * itemsPerPage;

        card.style.display = index >= start && index < end ? 'flex' : 'none';
      });

      // Деактивація кнопок
      if (currentPage === 1) {
        leftArrow.classList.add('disabled');
      } else {
        leftArrow.classList.remove('disabled');
      }
      if (currentPage === totalPages) {
        rightArrow.classList.add('disabled');
      } else {
        rightArrow.classList.remove('disabled');
      }

      // Приховуємо пагінацію, якщо сторінка одна
      const paginationWrapper = document.querySelector('.section_projects__pagination.pagination');
      if (paginationWrapper) {
        paginationWrapper.style.display = totalPages > 1 ? 'flex' : 'none';
      }
    }

    function getFilteredElements() {
      return Array.from(document.querySelectorAll('[data-filtered="true"]'));
    }

    const setPagination = () => {
      const filteredElements = getFilteredElements();
      totalPages = Math.ceil(filteredElements.length / itemsPerPage) || 1; // перерахунок сторінок
      currentPage = 1;

      currentPageEl.textContent = currentPage.toString().padStart(2, '0');
      allPagesEl.textContent = totalPages;

      showPage(currentPage); // показуємо першу сторінку
    };

    // обробники кнопок
    leftArrow.addEventListener('click', () => {
      preloader.style.opacity = '1';
      preloader.style.visibility = 'visible';

      showPage(currentPage - 1);
      scrollToFilterResults();
      setTimeout(() => {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
      }, 1000);
    });

    rightArrow.addEventListener('click', () => {
      preloader.style.opacity = '1';
      preloader.style.visibility = 'visible';

      showPage(currentPage + 1);
      scrollToFilterResults();
      setTimeout(() => {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
      }, 1000);
    });

    //Зчитуємо з url параметри для фільтрації і встановлюємо в selectedFilter
    function initSelectedFilterFromURL() {
      const params = new URLSearchParams(window.location.search);
      const selectedFilter = {};

      // пробігаємось по всіх параметрах у URL
      for (const [key, value] of params.entries()) {
        // якщо значення містить коми – робимо масив, інакше обертаємо в масив
        selectedFilter[key] = value.includes(',') ? value.split(',') : [value];
      }

      return selectedFilter;
    }

    // Виклик при завантаженні сторінки
    //Це об'єкт в якому ключ це назва фільтру, значення це масив з обраними значеннями цього фільтру
    let selectedFilter = initSelectedFilterFromURL();

    syncInputsWithSelectedFilter();
    filterCards();

    function updateURLFromSelectedFilter(selectedFilter) {
      const url = new URL(window.location);

      // спершу видаляємо всі старі параметри
      url.search = '';

      // пробігаємось по selectedFilter
      for (const key in selectedFilter) {
        if (selectedFilter[key] && selectedFilter[key].length > 0) {
          // якщо значень кілька – об'єднуємо через кому
          url.searchParams.set(key, selectedFilter[key].join(','));
        }
      }

      // змінюємо URL без перезавантаження
      window.history.replaceState({}, '', url);
    }

    function scrollToFilterResults() {
      const targetElement = document.querySelector('.section_projects__selected');
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }

    function countVisibleCards() {
      document.querySelector(
        '.btn_filter_mob .number span',
      ).textContent = document.querySelectorAll('.project_card[data-filtered="true"]').length;
    }

    if (filterPopupBtnDelete) {
      filterPopupBtnDelete.addEventListener('click', () => {
        // знімаємо всі чекбокси

        filterPopUpInputs.forEach(input => {
          input.checked = false;
        });
        // очищаємо об’єкт selectedFilter
        selectedFilter = {};

        // очищаємо контейнер обраних
        if (sectionProjectsSelected) {
          sectionProjectsSelected.innerHTML = '';
        }

        // оновлюємо відображення карток
        filterCards();
        updateURLFromSelectedFilter(selectedFilter);
        countVisibleCards();
      });
    }

    if (btnDelete) {
      btnDelete.addEventListener('click', () => {
        // знімаємо всі чекбокси
        filterInputs.forEach(input => (input.checked = false));

        // очищаємо об’єкт selectedFilter
        selectedFilter = {};

        // очищаємо контейнер обраних
        if (sectionProjectsSelected) {
          sectionProjectsSelected.innerHTML = '';
        }

        // оновлюємо відображення карток
        filterCards();
        updateURLFromSelectedFilter(selectedFilter);
        countVisibleCards();
        btnDelete.style.display = 'none';
      });
    }

    // setPagination();

    //Ця функція відповідає за те які картки показувати
    function filterCards() {
      preloader.style.opacity = '1';
      preloader.style.visibility = 'visible';
      projectCards.forEach(card => {
        let show = true;

        // перебираємо всі ключі у selectedFilter
        for (let key in selectedFilter) {
          const cardValue = card.dataset[key]; // значення картки, напр. data-status, data-project
          const filterValues = selectedFilter[key]; // масив допустимих значень
          //Якщо ми не заходимо в if то всі картки залишаться з show = true
          //Якщо значення картки не в масиві – ховаємо картку

          if (!filterValues.includes(cardValue)) {
            show = false;
            break; // немає сенсу перевіряти інші ключі
          }
        }
        if (show) {
          card.dataset.filtered = 'true';
        } else {
          card.dataset.filtered = 'false';
        }
        card.style.display = show ? 'flex' : 'none';
      });
      setPagination();
      countVisibleCards();
      setTimeout(() => {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
      }, 500);
    }

    // Збираємо всі інпути в блоці фільтра
    const filterInputs = document.querySelectorAll('.section_projects input[type="checkbox"]');

    filterInputs.forEach(input => {
      input.addEventListener('change', () => {
        const [key, value] = input.dataset.filter.split('-');

        if (input.checked) {
          //Показуємо кнопку, яка видаляє обрані фільтри
          btnDelete.style.display = 'block';

          // якщо ключа ще немає – створюємо масив
          if (!selectedFilter[key]) {
            selectedFilter[key] = [];
          }
          // додаємо значення, якщо ще немає
          if (!selectedFilter[key].includes(value)) {
            selectedFilter[key].push(value);
          }
          if (sectionProjectsSelected) {
            //Додаєм обраний фільтр у верхній рядок обраних фільтрів
            if (
              !sectionProjectsSelected.querySelector(
                `.section_projects__selected_item[data-id="${value}"]`,
              )
            ) {
              const item = document.createElement('div');
              item.classList.add('section_projects__selected_item');
              item.dataset.id = value; // додаємо data-id
              item.innerHTML = `
            <span>${input.dataset.name}</span>
            <svg class="delete-item" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.02344 0.938965L6.02344 4.93994L9.97656 0.986816L11.0371 2.04736L7.08398 6.00049L11.0371 9.95264L9.97656 11.0132L6.02344 7.06103L2.02344 11.061L0.962891 9.99951L4.96289 6.00049L0.96289 1.99951L2.02344 0.938965Z" fill="#1D3541"/>
            </svg>
        `;
              const close = item.querySelector('.delete-item');
              close.addEventListener('click', () => {
                item.remove(); // видаляємо блок
                input.checked = false; // знімаємо чекбокс
                input.dispatchEvent(new Event('change'));

                // оновлюємо фільтр
                if (selectedFilter[key]) {
                  selectedFilter[key] = selectedFilter[key].filter(v => v !== value);
                  if (selectedFilter[key].length === 0) delete selectedFilter[key];
                }
                filterCards();
                updateURLFromSelectedFilter(selectedFilter);
                countVisibleCards();
              });
              // вставляємо в контейнер
              sectionProjectsSelected.appendChild(item);
            }
          }
        } else {
          // видаляємо значення
          if (selectedFilter[key]) {
            selectedFilter[key] = selectedFilter[key].filter(v => v !== value);
            // якщо масив порожній – видаляємо ключ
            if (selectedFilter[key].length === 0) {
              delete selectedFilter[key];
            }
          }

          // видаляємо відповідний блок із sectionProjectsSelected
          if (sectionProjectsSelected) {
            const itemToRemove = sectionProjectsSelected.querySelector(
              `.section_projects__selected_item[data-id="${value}"]`,
            );
            if (itemToRemove) {
              itemToRemove.remove();
            }
          }

          // після того як ми видалили значення з selectedFilter
          if (Object.keys(selectedFilter).length === 0) {
            btnDelete.style.display = 'none';
          }
        }
        filterCards();
        updateURLFromSelectedFilter(selectedFilter);
        countVisibleCards();
      });
    });

    const filterPopUpInputs = document.querySelectorAll('.filter input[type="checkbox"]');
    const applyBtn = document.querySelector('.filter_popup__btn_apply');

    filterPopUpInputs.forEach(input => {
      input.addEventListener('change', () => {
        const [key, value] = input.dataset.filter.split('-');

        if (input.checked) {
          if (!selectedFilter[key]) selectedFilter[key] = [];
          if (!selectedFilter[key].includes(value)) selectedFilter[key].push(value);
        } else {
          if (selectedFilter[key]) {
            selectedFilter[key] = selectedFilter[key].filter(v => v !== value);
            if (selectedFilter[key].length === 0) delete selectedFilter[key];
          }
        }
      });
    });

    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        preloader.style.opacity = '1';
        preloader.style.visibility = 'visible';
        filterCards();
        updateURLFromSelectedFilter(selectedFilter);
        countVisibleCards();
        popupFilter.classList.remove('active');
        scrollToFilterResults();
        setTimeout(() => {
          preloader.style.opacity = '0';
          preloader.style.visibility = 'hidden';
        }, 1000);
      });
    }

    //Висота блока з картками, щоб не скакав

    function updateHeight() {
      const filterResult = document.querySelector('.section_projects__filter_result');
      if (filterResult) {
        filterResult.style.minHeight = 'auto'; // скидаємо стару висоту
        const height = filterResult.offsetHeight; // поточна висота
        filterResult.style.minHeight = height + 'px';
      }
    }

    updateHeight();
    window.addEventListener('resize', () => {
      updateHeight();
    });

    //Попап фільтр
    const btnOpenFilter = document.querySelector('.btn_filter_mob button');
    const popupFilter = document.querySelector('.filter_popup');
    const btnClose = document.querySelector('.filter_popup__close');
    const wrapper = document.querySelector('.filter_popup__wrapper');

    if (btnOpenFilter && popupFilter) {
      btnOpenFilter.addEventListener('click', () => {
        popupFilter.classList.add('active');
      });
    }

    if (btnClose && popupFilter) {
      btnClose.addEventListener('click', () => {
        popupFilter.classList.remove('active');
      });
    }

    // закрыть попап по клику на wrapper (оверлей)
    if (wrapper && popupFilter) {
      popupFilter.addEventListener('click', e => {
        if (e.target === popupFilter) {
          // клик именно на фон, а не на содержимое
          popupFilter.classList.remove('active');
        }
      });
    }
  }
});
