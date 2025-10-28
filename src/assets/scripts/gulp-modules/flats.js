import axios from 'axios';

import { initPagination } from './helpers/pagination';
import { adresses, projectIds, colors } from './helpers/constants.js';
import { setUnits } from './helpers/setUnits.js';
import { updateHeight } from './helpers/updateHeight.js';
import { initFilterPopup } from './helpers/filterPopup.js';
import { getunits } from './helpers/getUnits.js';
import { initSelectedFilterFromURL } from './helpers/initSelectedFilterFromURL';
import { syncInputsWithSelectedFilter } from './helpers/syncInputsWithSelectedFilter';
import { countVisibleCards } from './helpers/countVisibleCards';
import { updateURLFromSelectedFilter } from './helpers/updateURLFromSelectedFilter';
import { initResetFilters } from './helpers/resetFilters';
import { populateFilter, populateSliderFilter } from './helpers/populateFilters';
import { chooseRightInputs } from './helpers/chooseRightInputs';
import { scrollToFilterResults } from './helpers/scrollToFilterResults.js';
import { createSizeFilterItem } from './helpers/createSizeFilterItem.js';
import { createFloorFilterItem } from './helpers/createFloorFilterItem.js';
import { createRangeFilterItem } from './helpers/createRangeFilterItem.js';
import { createFilterChip } from './helpers/createSelectedFilterItem.js';
import { renderSelectedFiltersOnLoad } from './helpers/renderSelectedFiltersOnLoad';

const wrapper = document.querySelector('.section_flats__filter_result_wrapper');
//Це секція в якій обрані значення з фільтру
const sectionFlatsSelected = document.querySelector('.section_flats__selected_wrapper');
//Видаляє всі фільтри
const btnDelete = document.querySelector('.btn_delete');
const filterPopupBtnDelete = document.querySelector('.filter_popup__btn_delete');
const popupFilter = document.querySelector('.filter_popup');
//Прелоадер
const preloader = document.querySelector('.preloader');

document.addEventListener('DOMContentLoaded', () => {
  if (
    document.querySelector('.page-template-flats') &&
    document.querySelector('.section_flats__pagination')
  ) {
    const pagination = initPagination();

    // Виклик при завантаженні сторінки
    //Це об'єкт в якому ключ це назва фільтру, значення це масив з обраними значеннями цього фільтру
    let selectedFilter = initSelectedFilterFromURL();
    sessionStorage.setItem('selectedFilter', JSON.stringify(selectedFilter));
    let unitsData;
    //----------//

    (async () => {
      const unitsResponse = await getunits();
      if (unitsResponse?.data) {
        unitsData = unitsResponse.data.data;

        setUnits(unitsData, wrapper, pagination, filterCards, countVisibleCards);
        //Кнопки очищення
        initResetFilters({
          filterCards,
          popupFilter: popupFilter,
          sectionFlatsSelected: sectionFlatsSelected,
          btnDelete: btnDelete,
          filterPopupBtnDelete: filterPopupBtnDelete,
          unitsData,
        });
      }
    })();

    async function loadUnits() {
      const res = await getunits();
      if (!res) return;

      const data = res.data;

      // Фільтр ЖК
      if (window.innerWidth > 1500) {
        populateFilter(
          data.data,
          'project.name',
          document.querySelector('.filter__item_wrapper.project'),
          'project',
        );
      } else {
        populateFilter(
          data.data,
          'project.name',
          document.querySelector('.filter_flats__project'),
          'project',
        );
      }

      // Фільтр типу
      if (window.innerWidth > 1500) {
        populateFilter(
          data.data,
          'unit_type.name',
          document.querySelector('.filter__item_wrapper.type'),
          'type',
        );
      } else {
        populateFilter(
          data.data,
          'unit_type.name',
          document.querySelector('.filter_flats__type'),
          'type',
        );
      }
      // Фільтр кімнат
      if (window.innerWidth > 1500) {
        populateFilter(
          data.data,
          'room_count',
          document.querySelector('.filter__item_wrapper.room_count'),
          'room_count',
        );
      } else {
        populateFilter(
          data.data,
          'room_count',
          document.querySelector('.filter_flats__room_count'),
          'room_count',
        );
      }
      // Ціна

      if (window.innerWidth > 1500) {
        populateSliderFilter(
          data.data,
          'total_price',
          document.querySelector('.filter__slider.price'),
          'Ціна',
        );
      } else {
        populateSliderFilter(
          data.data,
          'total_price',
          document.querySelector('.filter_flats__price'),
          'Ціна',
        );
      }
      // Площа
      if (window.innerWidth > 1500) {
        populateSliderFilter(
          data.data,
          'real_size',
          document.querySelector('.filter__slider.size'),
          'Площа',
        );
      } else {
        populateSliderFilter(
          data.data,
          'real_size',
          document.querySelector('.filter_flats__size'),
          'Площа',
        );
      }
      // Поверх (витягуємо цифру з floor.name)
      if (window.innerWidth > 1500) {
        populateSliderFilter(
          data.data,
          unit => {
            const match = unit.floor?.name?.match(/-?\d+/); // враховуємо можливий знак "-"
            return match ? Number(match[0]) : null;
          },
          document.querySelector('.filter__slider.floor'),
          'Поверх',
        );
      } else {
        populateSliderFilter(
          data.data,
          unit => {
            const match = unit.floor?.name?.match(/-?\d+/); // враховуємо можливий знак "-"
            return match ? Number(match[0]) : null;
          },
          document.querySelector('.filter_flats__floor'),
          'Поверх',
        );
      }

      unitsData = data.data;
      if (
        selectedFilter.project &&
        selectedFilter.project.length > 0 &&
        Object.keys(selectedFilter).length === 1
      ) {
        console.log('Підлаштовуєм фільтр під ЖК');
        chooseRightInputs(unitsData, true);
      }
      if (Object.keys(selectedFilter).length > 1 && selectedFilter.project) {
        // 1️⃣ Зберігаємо повну копію
        const originalFilter = { ...selectedFilter };

        // 2️⃣ Створюємо версію тільки з проектом
        const projectOnlyFilter = { project: selectedFilter.project };

        // 3️⃣ Замінюємо у sessionStorage тимчасово
        sessionStorage.setItem('selectedFilter', JSON.stringify(projectOnlyFilter));

        // 4️⃣ Будуємо фільтри тільки по ЖК
        chooseRightInputs(unitsData, true);

        // 5️⃣ Відновлюємо повний selectedFilter назад
        sessionStorage.setItem('selectedFilter', JSON.stringify(originalFilter));

        // 6️⃣ Синхронізуємо інпути з відновленим фільтром
        syncInputsWithSelectedFilter(originalFilter, unitsData);
      }

      renderSelectedFiltersOnLoad(
        filterCards,
        updateURLFromSelectedFilter,
        syncInputsWithSelectedFilter,
        unitsData,
      );

      syncInputsWithSelectedFilter(unitsData);
      setUnits(unitsData, wrapper, pagination, filterCards, countVisibleCards);
      countVisibleCards();
    }
    loadUnits();

    function filterCards(input, value) {
      const selectedFilter = JSON.parse(sessionStorage.getItem('selectedFilter'));
      preloader.style.opacity = '1';
      preloader.style.visibility = 'visible';

      const flatCards = document.querySelectorAll('.flat_card');

      // 🟢 Якщо selectedFilter порожній — показуємо всі картки і виходимо
      if (!selectedFilter || Object.keys(selectedFilter).length === 0) {
        flatCards.forEach(card => {
          card.dataset.filtered = 'true';
          card.style.display = 'flex';
        });

        pagination.setPagination();
        countVisibleCards();

        setTimeout(() => {
          preloader.style.opacity = '0';
          preloader.style.visibility = 'hidden';
        }, 300);

        return; // ⛔ виходимо з функції
      }

      flatCards.forEach(card => {
        let show = true;

        // 🔹 1. Чекбокси
        for (let key in selectedFilter) {
          const cardValue = card.dataset[key];
          const filterValues = selectedFilter[key];

          if (!filterValues.includes(cardValue) && cardValue != undefined) {
            show = false;
            break;
          }
        }

        // 🔹 2. Слайдери (перевіряємо всі одразу)
        if (show) {
          document.querySelectorAll('.slider-wrapper').forEach(wrapper => {
            if (!show) return; // якщо вже не підходить, далі не перевіряємо

            const minInput = wrapper.querySelector('input[id$="-min"]');
            const maxInput = wrapper.querySelector('input[id$="-max"]');
            if (!minInput || !maxInput) return;

            const filterName = (minInput.dataset.filter || '').replace(/_(min|max)$/, '');
            const currentMin = parseFloat(minInput.value);
            const currentMax = parseFloat(maxInput.value);

            // вибираємо значення картки для перевірки
            let cardValue = null;
            if (filterName === 'Площа') cardValue = parseFloat(card.dataset.size);
            if (filterName === 'Поверх') cardValue = parseFloat(card.dataset.floor);
            if (filterName === 'Ціна') cardValue = parseFloat(card.dataset.total_price);

            if (cardValue < currentMin || cardValue > currentMax || isNaN(cardValue)) {
              show = false; // ❌ картка не підходить
            }

            if (show == true) {
              //Показуємо кнопку, яка видаляє обрані фільтри
              btnDelete.style.display = 'block';
              document.querySelectorAll('[data-name="floor"]').forEach(el => el.remove());

              if ('Ціна_min' in selectedFilter || 'Ціна_max' in selectedFilter) {
                createRangeFilterItem(
                  'Ціна',
                  'total_price',
                  selectedFilter,
                  sectionFlatsSelected,
                  btnDelete,
                  filterCards,
                  updateURLFromSelectedFilter,
                );
              }

              if ('Площа_min' in selectedFilter || 'Площа_max' in selectedFilter) {
                createRangeFilterItem(
                  'Площа',
                  'size',
                  selectedFilter,
                  sectionFlatsSelected,
                  btnDelete,
                  filterCards,
                  updateURLFromSelectedFilter,
                );
              }
              if ('Поверх_min' in selectedFilter || 'Поверх_max' in selectedFilter) {
                createRangeFilterItem(
                  'Поверх',
                  'floor',
                  selectedFilter,
                  sectionFlatsSelected,
                  btnDelete,
                  filterCards,
                  updateURLFromSelectedFilter,
                );
              }
            }
          });
        }

        // 🔹 застосовуємо результат
        card.dataset.filtered = show ? 'true' : 'false';
        card.style.display = show ? 'flex' : 'none';
      });
      const cards = document.querySelectorAll('.flat_card');
      const emptyBlock = document.querySelector('.empty');

      // перевіряємо, чи є хоча б одна видима картка
      const hasVisible = Array.from(cards).some(card => card.style.display !== 'none');

      // додаємо або прибираємо клас
      if (!hasVisible) {
        emptyBlock.classList.add('active');
      } else {
        emptyBlock.classList.remove('active');
      }
      pagination.setPagination();
      countVisibleCards();
      setTimeout(() => {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
      }, 500);
    }

    // Збираємо всі інпути в блоці фільтра і вішаєм слухач
    let containerToUse;
    if (window.innerWidth > 1500) {
      containerToUse = document.querySelector('.section_flats__filter.filter');
    } else {
      containerToUse = document.querySelector('.filter_flats');
    }
    let isSyncing = false;
    if (containerToUse) {
      // окремо ловимо подію тільки для проектів
      containerToUse.addEventListener('change', e => {
        if (e.target.matches('[data-filter^="project-"]')) {
          const input = e.target;
          console.log('Підлаштовуєм фільтр під ЖК');
          const selectedFilter = JSON.parse(sessionStorage.getItem('selectedFilter'));

          chooseRightInputs(unitsData);

          // 🟢 Ідея: «Користувач зняв усі ЖК → показуємо всі можливості фільтрації знову».
          if (!selectedFilter.project) {
            for (const key in selectedFilter) {
              delete selectedFilter[key];
            }
            sessionStorage.setItem('selectedFilter', JSON.stringify(selectedFilter));

            if (sectionFlatsSelected) sectionFlatsSelected.innerHTML = '';

            if (Object.keys(selectedFilter).length === 0) {
              btnDelete.style.display = 'none';
            }
            chooseRightInputs(unitsData, false);
          }
          // 🔹 Якщо користувач ЗНІМАЄ АБО СТАВИТЬ галочку на проекті, але інші проекти ще є
          if (selectedFilter.project && selectedFilter.project.length > 0) {
            console.log('TYT');
            //  Створюємо копію оригінального фільтра
            const originalFilter = { ...selectedFilter };
            // Створюємо версію, де залишаємо тільки проекти
            const projectOnlyFilter = { project: [...selectedFilter.project] };
            // Зберігаємо тимчасовий варіант у sessionStorage
            sessionStorage.setItem('selectedFilter', JSON.stringify(projectOnlyFilter));
            // Відмальовуємо фільтр під залишкові ЖК
            chooseRightInputs(unitsData, true);
            //Повертаємо тимчасову версію з усіма іншими фільтрами
            sessionStorage.setItem('selectedFilter', JSON.stringify(originalFilter));
            //  Синхронізуємо інпути назад
            syncInputsWithSelectedFilter(unitsData);
          }
        }
      });
      containerToUse.addEventListener('change', e => {
        if (isSyncing) return; // 🚫 пропускаємо, якщо зараз синхронізація
        const input = e.target;
        if (input.tagName === 'INPUT') {
          let [key, value] = input.dataset.filter.split('-');

          if (input.type == 'range') {
            const selectedFilter = JSON.parse(sessionStorage.getItem('selectedFilter'));
            value = input.value;
            input.setAttribute('value', value);
            selectedFilter[key] = [value];

            const minAttr = parseFloat(input.min);
            const maxAttr = parseFloat(input.max);
            const val = parseFloat(input.value);

            if (val === minAttr || val === maxAttr) {
              delete selectedFilter[key];
              if (sectionFlatsSelected) {
                let type;
                if (input.id.includes('Ціна')) {
                  type = 'total_price';
                }
                if (input.id.includes('Площа')) {
                  type = 'size';
                }
                if (input.id.includes('Поверх')) {
                  type = 'floor';
                }
                const itemToRemove = sectionFlatsSelected.querySelector(
                  `.section_flats__selected_item[data-name="${type}"]`,
                );
                if (itemToRemove) {
                  itemToRemove.remove();
                }
              }
            }

            sessionStorage.setItem('selectedFilter', JSON.stringify(selectedFilter));

            // if (window.innerWidth > 1500) {
            filterCards();
            updateURLFromSelectedFilter(selectedFilter);
            isSyncing = true;
            syncInputsWithSelectedFilter(selectedFilter, unitsData);
            isSyncing = false;
            // }
            return;
          }

          if (input.checked) {
            let selectedFilter = JSON.parse(sessionStorage.getItem('selectedFilter'));
            //Показуємо кнопку, яка видаляє обрані фільтри
            btnDelete.style.display = 'block';
            // якщо ключа ще немає – створюємо масив
            if (!selectedFilter[key]) {
              selectedFilter[key] = [];
              sessionStorage.setItem('selectedFilter', JSON.stringify(selectedFilter));
            }
            // додаємо значення, якщо ще немає
            if (!selectedFilter[key].includes(value)) {
              selectedFilter[key].push(value);
              sessionStorage.setItem('selectedFilter', JSON.stringify(selectedFilter));
            }

            if (sectionFlatsSelected) {
              createFilterChip({
                id: value,
                label: input.dataset.name,
                dataName: key,
                sectionFlatsSelected,
                btnDelete,
                selectedFilter,
                onDelete: () => {
                  let selectedFilter = JSON.parse(sessionStorage.getItem('selectedFilter'));
                  input.checked = false;
                  // input.dispatchEvent(new Event('input'));
                  // input.dispatchEvent(new Event('change'));
                  console.log(selectedFilter[key]);
                  selectedFilter[key] = selectedFilter[key]?.filter(v => v !== value) || [];
                  console.log(selectedFilter[key]);
                  if (selectedFilter[key].length === 0) delete selectedFilter[key];
                  sessionStorage.setItem('selectedFilter', JSON.stringify(selectedFilter));
                  isSyncing = true;
                  syncInputsWithSelectedFilter(unitsData);
                  isSyncing = false;
                },
                filterCards,
                updateURLFromSelectedFilter,
              });
            }
          } else {
            const selectedFilter = JSON.parse(sessionStorage.getItem('selectedFilter'));
            // видаляємо значення
            if (selectedFilter[key]) {
              selectedFilter[key] = selectedFilter[key].filter(v => v !== value);
              sessionStorage.setItem('selectedFilter', JSON.stringify(selectedFilter));
              // якщо масив порожній – видаляємо ключ
              if (selectedFilter[key].length === 0) {
                delete selectedFilter[key];
                sessionStorage.setItem('selectedFilter', JSON.stringify(selectedFilter));
              }
            }

            // видаляємо відповідний блок із sectionFlatsSelected
            if (sectionFlatsSelected) {
              const itemToRemove = sectionFlatsSelected.querySelector(
                `.section_flats__selected_item[data-id="${value}"]`,
              );
              if (itemToRemove) {
                itemToRemove.remove();
              }
            }

            //після того як ми видалили значення з selectedFilter

            if (Object.keys(selectedFilter).length === 0) {
              btnDelete.style.display = 'none';
            }
          }

          // if (window.innerWidth > 1500) {
          filterCards();
          updateURLFromSelectedFilter();

          isSyncing = true;
          syncInputsWithSelectedFilter(unitsData);
          isSyncing = false;
          // }
        }
      });
    }

    // Кнопка в попапі "Застосувати"
    const applyBtn = document.querySelector('.filter_popup__btn_apply');

    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        // const selectedFilter = JSON.parse(sessionStorage.getItem('selectedFilter'));
        preloader.style.opacity = '1';
        preloader.style.visibility = 'visible';
        // filterCards();
        // updateURLFromSelectedFilter(selectedFilter);
        popupFilter.classList.remove('active');
        countVisibleCards();
        scrollToFilterResults();
        // chooseRightInputs(unitsData);
        // isSyncing = true;
        // syncInputsWithSelectedFilter(unitsData);
        // isSyncing = false;
        setTimeout(() => {
          preloader.style.opacity = '0';
          preloader.style.visibility = 'hidden';
        }, 1000);
      });
    }

    //Висота блока з картками, щоб не скакав
    updateHeight();
    window.addEventListener('resize', () => {
      updateHeight();
    });
    //Попап фільтру
    initFilterPopup();

    //Сортування
    const customSelect = document.querySelector('.section_flats__custom-select');
    const trigger = customSelect.querySelector('.section_flats__custom-select-trigger');
    const optionsContainer = customSelect.querySelector('.section_flats__custom-select-options');
    const options = optionsContainer.querySelectorAll('.custom-option');
    const selectedText = trigger.querySelector('span');

    const cardsWrapper = document.querySelector('.section_flats__filter_result_wrapper');
    const cards = Array.from(cardsWrapper.querySelectorAll('.flat_card'));

    // Відкрити/закрити селект
    trigger.addEventListener('click', e => {
      e.stopPropagation(); // 🚫 не даємо події піти далі
      e.stopImmediatePropagation();

      if (customSelect.classList.contains('open')) {
        customSelect.classList.remove('open');
      } else {
        customSelect.classList.add('open');
      }
    });

    // Вибір опції
    options.forEach(option => {
      option.addEventListener('click', e => {
        e.stopPropagation(); // 🚫 не даємо закрити одразу після вибору

        options.forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
        selectedText.textContent = option.textContent;
        customSelect.classList.remove('open');

        const sortValue = option.dataset.value;

        sortCards(sortValue);
      });
    });

    // Закриття при кліку поза селектом
    document.addEventListener('click', e => {
      if (!e.target.closest('.section_flats__custom-select')) {
        customSelect.classList.remove('open');
      }
    });

    function sortCards(type) {
      const sorted = [...cards];

      if (type === 'price-asc') {
        sorted.sort((a, b) => +a.dataset.total_price - +b.dataset.total_price);
      } else if (type === 'price-desc') {
        sorted.sort((a, b) => +b.dataset.total_price - +a.dataset.total_price);
      } else if (type === 'size-asc') {
        sorted.sort((a, b) => +a.dataset.size - +b.dataset.size);
      } else if (type === 'size-desc') {
        sorted.sort((a, b) => +b.dataset.size - +a.dataset.size);
      }

      // Оновлюємо DOM
      cardsWrapper.innerHTML = '';
      sorted.forEach(card => cardsWrapper.appendChild(card));
      pagination.setPagination();
    }
  }
});
