// document.addEventListener('DOMContentLoaded', () => {
//   if (
//     !document.querySelector('.page-template-projects') ||
//     document.querySelector('.page-template-project_single')
//   ) {
//     return;
//   }
//   // ===== DOM =====
//   const sectionProjectsSelected = document.querySelector('.section_projects__selected_wrapper');
//   const btnDelete = document.querySelector('.btn_delete');

//   const btnOpenFilter = document.querySelector('.btn_filter_mob button');
//   const popupFilter = document.querySelector('.filter_popup');
//   const btnClose = document.querySelector('.filter_popup__close');
//   const filterPopupBtnDelete = document.querySelector('.filter_popup__btn_delete');
//   const applyBtn = document.querySelector('.filter_popup__btn_apply');

//   const projectCards = Array.from(document.querySelectorAll('.project_card'));

//   // ✅ РІВНО 2 БЛОКИ
//   const pageFilterRoot = document.querySelector('.section_projects__filter.filter');
//   const popupFilterRoot = popupFilter ? popupFilter.querySelector('.filter.filter_projects') : null;

//   const FILTER_ROOTS = [pageFilterRoot, popupFilterRoot].filter(Boolean);

//   // ===== LABELS =====
//   const STATUS_LABELS = {
//     status1: 'Останні квартири',
//     status2: 'Комерція в продажу',
//     status3: 'Комори в продажу',
//     status4: 'В продажу паркінги',
//     status5: 'В продажу комори',
//   };

//   const CITY_LABELS = {
//     kyiv: 'Київ',
//     lviv: 'Львів',
//   };

//   const CITY_ORDER = ['kyiv', 'lviv'];
//   const STATUS_ORDER = ['status1', 'status2', 'status3', 'status4', 'status5'];

//   // ===== STATE =====
//   let selectedFilter = initSelectedFilterFromURL();

//   // ===== INIT =====
//   FILTER_ROOTS.forEach(root => renderDynamicFiltersToRoot(root));
//   FILTER_ROOTS.forEach(root => bindFilterChange(root));

//   FILTER_ROOTS.forEach(root => syncInputsWithSelectedFilter(root));

//   renderSelectedChipsFromSelectedFilter();
//   filterCards();
//   updateBtnDeleteVisibility();
//   countVisibleCards();

//   // ===== FUNCTIONS =====

//   function initSelectedFilterFromURL() {
//     const params = new URLSearchParams(window.location.search);
//     const obj = {};

//     for (const [key, value] of params.entries()) {
//       obj[key] = value.includes(',') ? value.split(',') : [value];
//     }

//     if (obj.city) obj.city = obj.city.filter(v => CITY_LABELS[v]);
//     if (obj.status) obj.status = obj.status.filter(v => STATUS_LABELS[v]);

//     if (obj.city && obj.city.length === 0) delete obj.city;
//     if (obj.status && obj.status.length === 0) delete obj.status;

//     return obj;
//   }

//   function collectFilterValuesFromCards(cards) {
//     const cities = new Set();
//     const statuses = new Set();

//     cards.forEach(card => {
//       const city = card.dataset.city;
//       const status = card.dataset.status;

//       if (city && CITY_LABELS[city]) cities.add(city);
//       if (status && STATUS_LABELS[status]) statuses.add(status);
//     });

//     return {
//       cities: CITY_ORDER.filter(c => cities.has(c)),
//       statuses: STATUS_ORDER.filter(s => statuses.has(s)),
//     };
//   }

//   function renderCheckbox({ key, value, label, isChecked }) {
//     const id = `${key}-${value}`;
//     return `
//       <div class="checkbox">
//         <input
//           class="checkbox__input"
//           type="checkbox"
//           id="${id}"
//           data-filter="${key}-${value}"
//           data-name="${label}"
//           ${isChecked ? 'checked' : ''}
//         >
//         <label class="checkbox__label" for="${id}">${label}</label>
//       </div>
//     `;
//   }

//   // заповнюємо wrapper-и всередині 2-х filter__item (місто/статус)
//   function renderDynamicFiltersToRoot(rootEl) {
//     if (!rootEl) return;

//     const { cities, statuses } = collectFilterValuesFromCards(projectCards);

//     const items = rootEl.querySelectorAll('.filter__item');
//     const cityItem = items[0];
//     const statusItem = items[1];

//     if (cityItem) {
//       let wrapper = cityItem.querySelector('.filter__item_wrapper');
//       if (!wrapper) {
//         wrapper = document.createElement('div');
//         wrapper.className = 'filter__item_wrapper';
//         cityItem.appendChild(wrapper);
//       }

//       wrapper.innerHTML = cities
//         .map(city =>
//           renderCheckbox({
//             key: 'city',
//             value: city,
//             label: CITY_LABELS[city],
//             isChecked: !!selectedFilter.city?.includes(city),
//           }),
//         )
//         .join('');
//     }

//     if (statusItem) {
//       let wrapper = statusItem.querySelector('.filter__item_wrapper');
//       if (!wrapper) {
//         wrapper = document.createElement('div');
//         wrapper.className = 'filter__item_wrapper';
//         statusItem.appendChild(wrapper);
//       }

//       wrapper.innerHTML = statuses
//         .map(status =>
//           renderCheckbox({
//             key: 'status',
//             value: status,
//             label: STATUS_LABELS[status],
//             isChecked: !!selectedFilter.status?.includes(status),
//           }),
//         )
//         .join('');
//     }
//   }

//   function syncInputsWithSelectedFilter(rootEl) {
//     if (!rootEl) return;

//     rootEl.querySelectorAll('input[type="checkbox"][data-filter]').forEach(input => {
//       const [key, value] = input.dataset.filter.split('-');
//       input.checked = !!selectedFilter[key]?.includes(value);
//     });
//   }

//   function bindFilterChange(rootEl) {
//     if (!rootEl) return;

//     rootEl.addEventListener('change', e => {
//       const input = e.target;
//       if (!(input instanceof HTMLInputElement)) return;
//       if (input.type !== 'checkbox') return;
//       if (!input.dataset.filter) return;

//       const [key, value] = input.dataset.filter.split('-');

//       if (input.checked) {
//         if (!selectedFilter[key]) selectedFilter[key] = [];
//         if (!selectedFilter[key].includes(value)) selectedFilter[key].push(value);
//       } else {
//         if (selectedFilter[key]) {
//           selectedFilter[key] = selectedFilter[key].filter(v => v !== value);
//           if (selectedFilter[key].length === 0) delete selectedFilter[key];
//         }
//       }

//       // синхрон між 2 блоками
//       FILTER_ROOTS.forEach(root => syncInputsWithSelectedFilter(root));

//       renderSelectedChipsFromSelectedFilter();
//       filterCards();
//       updateURLFromSelectedFilter(selectedFilter);
//       updateBtnDeleteVisibility();
//       countVisibleCards();
//     });
//   }

//   function renderSelectedChipsFromSelectedFilter() {
//     if (!sectionProjectsSelected) return;
//     sectionProjectsSelected.innerHTML = '';

//     const addChip = ({ key, value, label }) => {
//       const item = document.createElement('div');
//       item.classList.add('section_projects__selected_item');
//       item.dataset.id = value;

//       item.innerHTML = `
//         <span>${label}</span>
//         <svg class="delete-item" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
//           <path d="M2.02344 0.938965L6.02344 4.93994L9.97656 0.986816L11.0371 2.04736L7.08398 6.00049L11.0371 9.95264L9.97656 11.0132L6.02344 7.06103L2.02344 11.061L0.962891 9.99951L4.96289 6.00049L0.96289 1.99951L2.02344 0.938965Z" fill="#1D3541"/>
//         </svg>
//       `;

//       item.querySelector('.delete-item').addEventListener('click', () => {
//         const selector = `input[type="checkbox"][data-filter="${key}-${value}"]`;

//         FILTER_ROOTS.forEach(root => {
//           const cb = root.querySelector(selector);
//           if (cb) cb.checked = false;
//         });

//         if (selectedFilter[key]) {
//           selectedFilter[key] = selectedFilter[key].filter(v => v !== value);
//           if (selectedFilter[key].length === 0) delete selectedFilter[key];
//         }

//         FILTER_ROOTS.forEach(root => syncInputsWithSelectedFilter(root));
//         renderSelectedChipsFromSelectedFilter();
//         filterCards();
//         updateURLFromSelectedFilter(selectedFilter);
//         updateBtnDeleteVisibility();
//         countVisibleCards();
//       });

//       sectionProjectsSelected.appendChild(item);
//     };

//     (selectedFilter.city || []).forEach(city => {
//       if (!CITY_LABELS[city]) return;
//       addChip({ key: 'city', value: city, label: CITY_LABELS[city] });
//     });

//     (selectedFilter.status || []).forEach(status => {
//       if (!STATUS_LABELS[status]) return;
//       addChip({ key: 'status', value: status, label: STATUS_LABELS[status] });
//     });
//   }

//   function updateURLFromSelectedFilter(obj) {
//     const url = new URL(window.location);
//     url.search = '';

//     for (const key in obj) {
//       if (obj[key] && obj[key].length) {
//         url.searchParams.set(key, obj[key].join(','));
//       }
//     }

//     window.history.replaceState({}, '', url);
//   }

//   function filterCards() {
//     projectCards.forEach(card => {
//       let show = true;

//       for (const key in selectedFilter) {
//         const cardValue = card.dataset[key];
//         const filterValues = selectedFilter[key];

//         if (!filterValues.includes(cardValue)) {
//           show = false;
//           break;
//         }
//       }

//       card.dataset.filtered = show ? 'true' : 'false';
//       card.style.display = show ? 'flex' : 'none';
//     });
//   }

//   function countVisibleCards() {
//     const numberSpan = document.querySelector('.btn_filter_mob .number span');
//     if (!numberSpan) return;
//     numberSpan.textContent = document.querySelectorAll(
//       '.project_card[data-filtered="true"]',
//     ).length;
//   }

//   function updateBtnDeleteVisibility() {
//     if (!btnDelete) return;
//     btnDelete.style.display = Object.keys(selectedFilter).length ? 'block' : 'none';
//   }

//   function scrollToFilterResults() {
//     const targetElement = document.querySelector('.section_projects__selected');
//     if (!targetElement) return;
//     targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
//   }

//   function clearAllFilters() {
//     selectedFilter = {};

//     FILTER_ROOTS.forEach(root => {
//       root.querySelectorAll('input[type="checkbox"]').forEach(i => (i.checked = false));
//     });

//     if (sectionProjectsSelected) sectionProjectsSelected.innerHTML = '';

//     filterCards();
//     updateURLFromSelectedFilter(selectedFilter);
//     updateBtnDeleteVisibility();
//     countVisibleCards();
//   }

//   // ===== BUTTONS =====
//   if (btnDelete) btnDelete.addEventListener('click', clearAllFilters);
//   if (filterPopupBtnDelete) filterPopupBtnDelete.addEventListener('click', clearAllFilters);

//   if (applyBtn) {
//     applyBtn.addEventListener('click', () => {
//       if (popupFilter) {
//         popupFilter.classList.remove('active');
//         document.body.classList.remove('no-scroll');
//       }
//       scrollToFilterResults();
//     });
//   }

//   // ===== POPUP OPEN/CLOSE =====
//   if (btnOpenFilter && popupFilter) {
//     btnOpenFilter.addEventListener('click', () => {
//       popupFilter.classList.add('active');
//       document.body.classList.add('no-scroll');
//     });
//   }

//   if (btnClose && popupFilter) {
//     btnClose.addEventListener('click', () => {
//       popupFilter.classList.remove('active');
//       document.body.classList.remove('no-scroll');
//     });
//   }

//   if (popupFilter) {
//     popupFilter.addEventListener('click', e => {
//       if (e.target === popupFilter) {
//         popupFilter.classList.remove('active');
//         document.body.classList.remove('no-scroll');
//       }
//     });
//   }
// });
document.addEventListener('DOMContentLoaded', () => {
  // ✅ працюємо тільки на /projects і не на single
  const isProjects = document.querySelector('.page-template-projects');
  const isSingle = document.querySelector('.page-template-project_single');
  if (!isProjects || isSingle) return;

  // ===== DOM =====
  const sectionProjectsSelected = document.querySelector('.section_projects__selected_wrapper');
  const btnDelete = document.querySelector('.btn_delete');

  const btnOpenFilter = document.querySelector('.btn_filter_mob button');
  const popupFilter = document.querySelector('.filter_popup');
  const btnClose = document.querySelector('.filter_popup__close');
  const filterPopupBtnDelete = document.querySelector('.filter_popup__btn_delete');
  const applyBtn = document.querySelector('.filter_popup__btn_apply');

  const projectCards = Array.from(document.querySelectorAll('.project_card'));

  // ✅ РІВНО 2 БЛОКИ
  const pageFilterRoot = document.querySelector('.section_projects__filter.filter');
  const popupFilterRoot = popupFilter ? popupFilter.querySelector('.filter.filter_projects') : null;

  const FILTER_ROOTS = [pageFilterRoot, popupFilterRoot].filter(Boolean);

  // ===== LABELS =====
  const STATUS_LABELS = {
    status1: 'Останні квартири',
    status2: 'Комерція в продажу',
    status3: 'Комори в продажу',
    status4: 'В продажу паркінги',
    status5: 'В продажу комори',
  };

  const CITY_LABELS = {
    kyiv: 'Київ',
    lviv: 'Львів',
  };

  const CITY_ORDER = ['kyiv', 'lviv'];
  const STATUS_ORDER = ['status1', 'status2', 'status3', 'status4', 'status5'];

  // ===== URL BASE =====
  // якщо slug сторінки інший — зміни тут
  const BASE_PATH = '/projects';

  // ===== STATE =====
  let selectedFilter = initSelectedFilterFromURL();

  // ===== INIT =====
  FILTER_ROOTS.forEach(root => renderDynamicFiltersToRoot(root));
  FILTER_ROOTS.forEach(root => bindFilterChange(root));
  FILTER_ROOTS.forEach(root => syncInputsWithSelectedFilter(root));

  renderSelectedChipsFromSelectedFilter();
  filterCards();
  updateBtnDeleteVisibility();
  countVisibleCards();

  // ===== FUNCTIONS =====

  // ✅ підтримує:
  // /projects
  // /projects/kyiv
  // /projects/status/status1,status3
  // /projects/kyiv/status/status1,status3
  function initSelectedFilterFromURL() {
    const parts = window.location.pathname.split('/').filter(Boolean);
    const obj = {};

    if (!parts.length) return obj;

    // знаходимо "projects" у шляху (на випадок /uk/projects/...)
    const projectsIndex = parts.indexOf('projects');
    if (projectsIndex === -1) return obj;

    let i = projectsIndex + 1;

    // 2-й сегмент після projects: або CITY, або ключ (status)
    const second = parts[i];

    if (CITY_LABELS[second]) {
      obj.city = [second]; // ✅ тільки одне місто
      i++;
    }

    // решта як key/value
    while (i < parts.length) {
      const key = parts[i];
      const value = parts[i + 1];
      if (!value) break;

      if (key === 'status') {
        obj.status = value.split(',').filter(v => STATUS_LABELS[v]);
        if (obj.status.length === 0) delete obj.status;
      }

      i += 2;
    }

    return obj;
  }

  function collectFilterValuesFromCards(cards) {
    const cities = new Set();
    const statuses = new Set();

    cards.forEach(card => {
      const city = card.dataset.city;
      const status = card.dataset.status;

      if (city && CITY_LABELS[city]) cities.add(city);
      if (status && STATUS_LABELS[status]) statuses.add(status);
    });

    return {
      cities: CITY_ORDER.filter(c => cities.has(c)),
      statuses: STATUS_ORDER.filter(s => statuses.has(s)),
    };
  }

  function renderCheckbox({ key, value, label, isChecked }) {
    const id = `${key}-${value}`;
    return `
      <div class="checkbox">
        <input
          class="checkbox__input"
          type="checkbox"
          id="${id}"
          data-filter="${key}-${value}"
          data-name="${label}"
          ${isChecked ? 'checked' : ''}
        >
        <label class="checkbox__label" for="${id}">${label}</label>
      </div>
    `;
  }

  // заповнюємо wrapper-и всередині 2-х filter__item (місто/статус)
  function renderDynamicFiltersToRoot(rootEl) {
    if (!rootEl) return;

    const { cities, statuses } = collectFilterValuesFromCards(projectCards);

    const items = rootEl.querySelectorAll('.filter__item');
    const cityItem = items[0];
    const statusItem = items[1];

    if (cityItem) {
      let wrapper = cityItem.querySelector('.filter__item_wrapper');
      if (!wrapper) {
        wrapper = document.createElement('div');
        wrapper.className = 'filter__item_wrapper';
        cityItem.appendChild(wrapper);
      }

      wrapper.innerHTML = cities
        .map(city =>
          renderCheckbox({
            key: 'city',
            value: city,
            label: CITY_LABELS[city],
            isChecked: !!selectedFilter.city?.includes(city),
          }),
        )
        .join('');
    }

    if (statusItem) {
      let wrapper = statusItem.querySelector('.filter__item_wrapper');
      if (!wrapper) {
        wrapper = document.createElement('div');
        wrapper.className = 'filter__item_wrapper';
        statusItem.appendChild(wrapper);
      }

      wrapper.innerHTML = statuses
        .map(status =>
          renderCheckbox({
            key: 'status',
            value: status,
            label: STATUS_LABELS[status],
            isChecked: !!selectedFilter.status?.includes(status),
          }),
        )
        .join('');
    }
  }

  function syncInputsWithSelectedFilter(rootEl) {
    if (!rootEl) return;

    rootEl.querySelectorAll('input[type="checkbox"][data-filter]').forEach(input => {
      const [key, value] = input.dataset.filter.split('-');
      input.checked = !!selectedFilter[key]?.includes(value);
    });
  }

  function bindFilterChange(rootEl) {
    if (!rootEl) return;

    rootEl.addEventListener('change', e => {
      const input = e.target;
      if (!(input instanceof HTMLInputElement)) return;
      if (input.type !== 'checkbox') return;
      if (!input.dataset.filter) return;

      const [key, value] = input.dataset.filter.split('-');

      if (input.checked) {
        // ✅ CITY — тільки одне (перезапис)
        if (key === 'city') {
          FILTER_ROOTS.forEach(root => {
            root.querySelectorAll('input[type="checkbox"][data-filter^="city-"]').forEach(cb => {
              cb.checked = cb === input;
            });
          });

          selectedFilter.city = [value];
        } else {
          if (!selectedFilter[key]) selectedFilter[key] = [];
          if (!selectedFilter[key].includes(value)) selectedFilter[key].push(value);
        }
      } else {
        if (selectedFilter[key]) {
          selectedFilter[key] = selectedFilter[key].filter(v => v !== value);
          if (selectedFilter[key].length === 0) delete selectedFilter[key];
        }
      }

      // синхрон між 2 блоками
      FILTER_ROOTS.forEach(root => syncInputsWithSelectedFilter(root));

      renderSelectedChipsFromSelectedFilter();
      filterCards();
      updateURLFromSelectedFilter(selectedFilter);
      updateBtnDeleteVisibility();
      countVisibleCards();
    });
  }

  function renderSelectedChipsFromSelectedFilter() {
    if (!sectionProjectsSelected) return;
    sectionProjectsSelected.innerHTML = '';

    const addChip = ({ key, value, label }) => {
      const item = document.createElement('div');
      item.classList.add('section_projects__selected_item');
      item.dataset.id = value;

      item.innerHTML = `
        <span>${label}</span>
        <svg class="delete-item" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2.02344 0.938965L6.02344 4.93994L9.97656 0.986816L11.0371 2.04736L7.08398 6.00049L11.0371 9.95264L9.97656 11.0132L6.02344 7.06103L2.02344 11.061L0.962891 9.99951L4.96289 6.00049L0.96289 1.99951L2.02344 0.938965Z" fill="#1D3541"/>
        </svg>
      `;

      item.querySelector('.delete-item').addEventListener('click', () => {
        const selector = `input[type="checkbox"][data-filter="${key}-${value}"]`;

        FILTER_ROOTS.forEach(root => {
          const cb = root.querySelector(selector);
          if (cb) cb.checked = false;
        });

        if (selectedFilter[key]) {
          selectedFilter[key] = selectedFilter[key].filter(v => v !== value);
          if (selectedFilter[key].length === 0) delete selectedFilter[key];
        }

        FILTER_ROOTS.forEach(root => syncInputsWithSelectedFilter(root));
        renderSelectedChipsFromSelectedFilter();
        filterCards();
        updateURLFromSelectedFilter(selectedFilter);
        updateBtnDeleteVisibility();
        countVisibleCards();
      });

      sectionProjectsSelected.appendChild(item);
    };

    // ✅ місто одне, але залишаю форич щоб не ламати структуру
    (selectedFilter.city || []).forEach(city => {
      if (!CITY_LABELS[city]) return;
      addChip({ key: 'city', value: city, label: CITY_LABELS[city] });
    });

    (selectedFilter.status || []).forEach(status => {
      if (!STATUS_LABELS[status]) return;
      addChip({ key: 'status', value: status, label: STATUS_LABELS[status] });
    });
  }

  // ✅ Формуємо ЧПУ:
  // /projects
  // /projects/kyiv
  // /projects/status/status1,status3
  // /projects/kyiv/status/status1,status3
  function updateURLFromSelectedFilter(obj) {
    const parts = [];

    if (obj.city?.length) {
      parts.push(obj.city[0]);
    }

    if (obj.status?.length) {
      parts.push('status', obj.status.join(','));
    }

    const newPath = parts.length ? `${BASE_PATH}/${parts.join('/')}` : BASE_PATH;

    // зберігаємо hash, якщо є
    const hash = window.location.hash || '';
    window.history.replaceState({}, '', newPath + hash);
  }

  function filterCards() {
    projectCards.forEach(card => {
      let show = true;

      for (const key in selectedFilter) {
        const cardValue = card.dataset[key];
        const filterValues = selectedFilter[key];

        if (!filterValues.includes(cardValue)) {
          show = false;
          break;
        }
      }

      card.dataset.filtered = show ? 'true' : 'false';
      card.style.display = show ? 'flex' : 'none';
    });
  }

  function countVisibleCards() {
    const numberSpan = document.querySelector('.btn_filter_mob .number span');
    if (!numberSpan) return;
    numberSpan.textContent = document.querySelectorAll(
      '.project_card[data-filtered="true"]',
    ).length;
  }

  function updateBtnDeleteVisibility() {
    if (!btnDelete) return;
    btnDelete.style.display = Object.keys(selectedFilter).length ? 'block' : 'none';
  }

  function scrollToFilterResults() {
    const targetElement = document.querySelector('.section_projects__selected');
    if (!targetElement) return;
    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function clearAllFilters() {
    selectedFilter = {};

    FILTER_ROOTS.forEach(root => {
      root.querySelectorAll('input[type="checkbox"]').forEach(i => (i.checked = false));
    });

    if (sectionProjectsSelected) sectionProjectsSelected.innerHTML = '';

    filterCards();
    updateURLFromSelectedFilter(selectedFilter);
    updateBtnDeleteVisibility();
    countVisibleCards();
  }

  // ===== BUTTONS =====
  if (btnDelete) btnDelete.addEventListener('click', clearAllFilters);
  if (filterPopupBtnDelete) filterPopupBtnDelete.addEventListener('click', clearAllFilters);

  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      if (popupFilter) {
        popupFilter.classList.remove('active');
        document.body.classList.remove('no-scroll');
      }
      scrollToFilterResults();
    });
  }

  // ===== POPUP OPEN/CLOSE =====
  if (btnOpenFilter && popupFilter) {
    btnOpenFilter.addEventListener('click', () => {
      popupFilter.classList.add('active');
      document.body.classList.add('no-scroll');
    });
  }

  if (btnClose && popupFilter) {
    btnClose.addEventListener('click', () => {
      popupFilter.classList.remove('active');
      document.body.classList.remove('no-scroll');
    });
  }

  if (popupFilter) {
    popupFilter.addEventListener('click', e => {
      if (e.target === popupFilter) {
        popupFilter.classList.remove('active');
        document.body.classList.remove('no-scroll');
      }
    });
  }
});
