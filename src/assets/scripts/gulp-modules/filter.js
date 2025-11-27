document.addEventListener('DOMContentLoaded', () => {
  if (
    document.querySelector('.page-template-projects') &&
    !document.querySelector('.page-template-project_single')
  ) {
    const sectionProjectsSelected = document.querySelector('.section_projects__selected_wrapper');
    const btnDelete = document.querySelector('.btn_delete');
    const filterPopupBtnDelete = document.querySelector('.filter_popup__btn_delete');
    const projectCards = document.querySelectorAll('.project_card');
    const preloader = document.querySelector('.preloader');

    // ✅ ВИПРАВЛЕНО - Видалено дублювання
    function syncInputsWithSelectedFilter() {
      const allInputs = document.querySelectorAll(
        '.section_projects__filter input, .filter_projects input',
      );

      allInputs.forEach(input => {
        const filterKey = input.dataset.filter?.split('-')[0];

        if (!filterKey) return;

        if (input.type === 'checkbox') {
          const value = input.dataset.filter.split('-')[1];

          input.checked = selectedFilter[filterKey]?.includes(value) || false;
          if (selectedFilter[filterKey]?.includes(value)) {
            input.setAttribute('checked', 'checked');
            input.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }

        // ✅ ВИПРАВЛЕНО - Єдиний блок для range без дублювання
        if (input.type === 'range') {
          if (selectedFilter[filterKey]) {
            input.value = selectedFilter[filterKey];
            input.setAttribute('value', selectedFilter[filterKey]);
            // оновлюємо UI слайдера
            input.dispatchEvent(new Event('input'));
          }
        }
      });
    }

    //Пагінація
    const leftArrow = document.querySelector('.section_projects__pagination_arrow_left');
    const rightArrow = document.querySelector('.section_projects__pagination_arrow_right');
    const currentPageEl = document.querySelector('.section_projects__current_pages');
    const allPagesEl = document.querySelector('.all_pages');

    const itemsPerPage = 6;

    let currentPage = 1;
    let totalPages = 1;

    function showPage(page) {
      const filteredElements = getFilteredElements();
      totalPages = Math.ceil(filteredElements.length / itemsPerPage) || 1;

      if (page < 1) page = 1;
      if (page > totalPages) page = totalPages;
      currentPage = page;
      currentPageEl.textContent = currentPage.toString().padStart(2, '0');
      allPagesEl.textContent = totalPages;

      filteredElements.forEach((card, index) => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = currentPage * itemsPerPage;

        card.style.display = index >= start && index < end ? 'flex' : 'none';
      });

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
      totalPages = Math.ceil(filteredElements.length / itemsPerPage) || 1;
      currentPage = 1;

      currentPageEl.textContent = currentPage.toString().padStart(2, '0');
      allPagesEl.textContent = totalPages;

      showPage(currentPage);
    };

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

    function initSelectedFilterFromURL() {
      const params = new URLSearchParams(window.location.search);
      const selectedFilter = {};

      for (const [key, value] of params.entries()) {
        selectedFilter[key] = value.includes(',') ? value.split(',') : [value];
      }

      return selectedFilter;
    }

    let selectedFilter = initSelectedFilterFromURL();

    syncInputsWithSelectedFilter();
    filterCards();

    function updateURLFromSelectedFilter(selectedFilter) {
      const url = new URL(window.location);

      url.search = '';

      for (const key in selectedFilter) {
        if (selectedFilter[key] && selectedFilter[key].length > 0) {
          url.searchParams.set(key, selectedFilter[key].join(','));
        }
      }

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
      const numberSpan = document.querySelector('.btn_filter_mob .number span');
      if (numberSpan) {
        numberSpan.textContent = document.querySelectorAll(
          '.project_card[data-filtered="true"]',
        ).length;
      }
    }

    if (filterPopupBtnDelete) {
      filterPopupBtnDelete.addEventListener('click', () => {
        const filterPopUpInputs = document.querySelectorAll('.filter input[type="checkbox"]');
        filterPopUpInputs.forEach(input => {
          input.checked = false;
        });
        selectedFilter = {};

        if (sectionProjectsSelected) {
          sectionProjectsSelected.innerHTML = '';
        }

        filterCards();
        updateURLFromSelectedFilter(selectedFilter);
        countVisibleCards();
      });
    }

    if (btnDelete) {
      btnDelete.addEventListener('click', () => {
        const filterInputs = document.querySelectorAll('.section_projects input[type="checkbox"]');
        filterInputs.forEach(input => (input.checked = false));

        selectedFilter = {};

        if (sectionProjectsSelected) {
          sectionProjectsSelected.innerHTML = '';
        }

        filterCards();
        updateURLFromSelectedFilter(selectedFilter);
        countVisibleCards();
        btnDelete.style.display = 'none';
      });
    }

    // ✅ ВИПРАВЛЕНО

    function filterCards() {
      // ✅ Перевір чи preloader існує
      if (!preloader) {
        console.warn('⚠️ Preloader не знайдено');
        return;
      }

      preloader.style.opacity = '1';
      preloader.style.visibility = 'visible';

      projectCards.forEach(card => {
        let show = true;

        for (let key in selectedFilter) {
          const cardValue = card.dataset[key];
          const filterValues = selectedFilter[key];

          if (!filterValues.includes(cardValue)) {
            show = false;
            break;
          }
        }

        if (show) {
          card.dataset.filtered = 'true';
        } else {
          card.dataset.filtered = 'false';
        }
        card.style.display = show ? 'flex' : 'none';
      });

      // setPagination();
      countVisibleCards();

      setTimeout(() => {
        // ✅ Перевір ще раз перед змінами
        if (preloader) {
          preloader.style.opacity = '0';
          preloader.style.visibility = 'hidden';
        }
      }, 500);
    }

    const filterInputs = document.querySelectorAll('.section_projects input[type="checkbox"]');

    filterInputs.forEach(input => {
      input.addEventListener('change', () => {
        const [key, value] = input.dataset.filter.split('-');

        if (input.checked) {
          btnDelete.style.display = 'block';

          if (!selectedFilter[key]) {
            selectedFilter[key] = [];
          }
          if (!selectedFilter[key].includes(value)) {
            selectedFilter[key].push(value);
          }
          if (sectionProjectsSelected) {
            if (
              !sectionProjectsSelected.querySelector(
                `.section_projects__selected_item[data-id="${value}"]`,
              )
            ) {
              const item = document.createElement('div');
              item.classList.add('section_projects__selected_item');
              item.dataset.id = value;
              item.innerHTML = `
            <span>${input.dataset.name}</span>
            <svg class="delete-item" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.02344 0.938965L6.02344 4.93994L9.97656 0.986816L11.0371 2.04736L7.08398 6.00049L11.0371 9.95264L9.97656 11.0132L6.02344 7.06103L2.02344 11.061L0.962891 9.99951L4.96289 6.00049L0.96289 1.99951L2.02344 0.938965Z" fill="#1D3541"/>
            </svg>
        `;
              const close = item.querySelector('.delete-item');
              close.addEventListener('click', () => {
                item.remove();
                input.checked = false;
                input.dispatchEvent(new Event('change'));

                if (selectedFilter[key]) {
                  selectedFilter[key] = selectedFilter[key].filter(v => v !== value);
                  if (selectedFilter[key].length === 0) delete selectedFilter[key];
                }
                filterCards();
                updateURLFromSelectedFilter(selectedFilter);
                countVisibleCards();
              });
              sectionProjectsSelected.appendChild(item);
            }
          }
        } else {
          if (selectedFilter[key]) {
            selectedFilter[key] = selectedFilter[key].filter(v => v !== value);
            if (selectedFilter[key].length === 0) {
              delete selectedFilter[key];
            }
          }

          if (sectionProjectsSelected) {
            const itemToRemove = sectionProjectsSelected.querySelector(
              `.section_projects__selected_item[data-id="${value}"]`,
            );
            if (itemToRemove) {
              itemToRemove.remove();
            }
          }

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
        const popupFilter = document.querySelector('.filter_popup');
        if (popupFilter) {
          popupFilter.classList.remove('active');
        }
        scrollToFilterResults();
        setTimeout(() => {
          preloader.style.opacity = '0';
          preloader.style.visibility = 'hidden';
        }, 1000);
      });
    }

    function updateHeight() {
      const filterResult = document.querySelector('.section_projects__filter_result');
      if (filterResult) {
        filterResult.style.minHeight = 'auto';
        const height = filterResult.offsetHeight;
        filterResult.style.minHeight = height + 'px';
      }
    }

    updateHeight();
    window.addEventListener('resize', () => {
      updateHeight();
    });

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

    if (wrapper && popupFilter) {
      popupFilter.addEventListener('click', e => {
        if (e.target === popupFilter) {
          popupFilter.classList.remove('active');
        }
      });
    }
  }
});
