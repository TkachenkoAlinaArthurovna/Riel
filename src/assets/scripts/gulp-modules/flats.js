import axios from 'axios';
import data from './units_project.json'; // локальні дані

const unitsMock = () => data;

const baseUrl = window.location.origin;
const wrapper = document.querySelector('.section_flats__filter_result_wrapper');

document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.page-template-flats')) {
    //Це секція в якій обрані значення з фільтру
    const sectionFlatsSelected = document.querySelector('.section_flats__selected_wrapper');
    //Видаляє всі фільтри
    const btnDelete = document.querySelector('.btn_delete');
    const filterPopupBtnDelete = document.querySelector('.filter_popup__btn_delete');
    //Збираємо всі картки
    const flatCards = document.querySelectorAll('.flat_card');
    //Прелоадер
    const preloader = document.querySelector('.preloader');
    //Це об'єкт в якому ключ це назва фільтру, значення це масив з обраними значеннями цього фільтру
    let selectedFilter = {};

    function getFilterKeysCount(obj) {
      document.querySelector('.btn_filter_mob .number span').textContent = Object.keys(obj).length;
    }

    if (filterPopupBtnDelete) {
      filterPopupBtnDelete.addEventListener('click', () => {
        // знімаємо всі чекбокси

        const filterInputs = document.querySelectorAll('.filter_flats input');
        filterInputs.forEach(input => {
          if (input.type === 'checkbox') {
            // сбрасываем чекбоксы
            input.checked = false;
          } else if (input.type === 'range') {
            // если это диапазонный слайдер
            if (input.id.endsWith('-min')) {
              input.value = input.min; // вернуть в начало
            } else if (input.id.endsWith('-max')) {
              input.value = input.max; // вернуть в конец
            }

            // обновляем UI (чтобы цифры/линейка обновились)
            input.dispatchEvent(new Event('input'));
            input.dispatchEvent(new Event('change'));
          }
        });
        // очищаємо об’єкт selectedFilter
        selectedFilter = {};

        // оновлюємо відображення карток
        filterCards();
        popupFilter.classList.remove('active');
        getFilterKeysCount(selectedFilter);
      });
    }

    if (btnDelete) {
      btnDelete.addEventListener('click', () => {
        // знімаємо всі чекбокси
        const filterInputs = document.querySelectorAll('.section_flats input');
        filterInputs.forEach(input => {
          if (input.type === 'checkbox') {
            // сбрасываем чекбоксы
            input.checked = false;
          } else if (input.type === 'range') {
            // если это диапазонный слайдер
            if (input.id.endsWith('-min')) {
              input.value = input.min; // вернуть в начало
            } else if (input.id.endsWith('-max')) {
              input.value = input.max; // вернуть в конец
            }

            // обновляем UI (чтобы цифры/линейка обновились)
            input.dispatchEvent(new Event('input'));
            input.dispatchEvent(new Event('change'));
          }
        });

        // очищаємо об’єкт selectedFilter
        selectedFilter = {};

        // очищаємо контейнер обраних
        if (sectionFlatsSelected) {
          sectionFlatsSelected.innerHTML = '';
        }

        // оновлюємо відображення карток
        filterCards();

        btnDelete.style.display = 'none';
        getFilterKeysCount(selectedFilter);
      });
    }

    async function getunits() {
      const formData = new FormData();
      formData.append('action', 'units');
      const url = '/wp-admin/admin-ajax.php';

      // Локальний режим з мок-даними
      if (true) {
        return await new Promise(resolve => {
          resolve({
            data: unitsMock(),
          });
        });
      }

      //Запит на бекенд
      try {
        const response = await axios.post(url, formData);
        return response;
      } catch (error) {
        console.error('Помилка при завантаженні квартир:', error);
        return null;
      }
    }

    async function loadUnits() {
      const res = await getunits();
      if (!res) return;

      const data = res.data;

      setUnits(data.data);
      // Фільтр ЖК
      populateFilter(
        data.data,
        'project.name',
        document.querySelector('.filter__item_wrapper.project'),
        'project',
      );
      populateFilter(
        data.data,
        'project.name',
        document.querySelector('.filter_flats__project'),
        'project',
      );
      // Фільтр типу
      populateFilter(
        data.data,
        'unit_type.name',
        document.querySelector('.filter__item_wrapper.type'),
        'type',
      );
      populateFilter(
        data.data,
        'unit_type.name',
        document.querySelector('.filter_flats__type'),
        'type',
      );
      // Фільтр кімнат
      populateFilter(
        data.data,
        'room_count',
        document.querySelector('.filter__item_wrapper.room_count'),
        'room_count',
      );
      populateFilter(
        data.data,
        'room_count',
        document.querySelector('.filter_flats__room_count'),
        'room_count',
      );
      // Площа
      populateSliderFilter(
        data.data,
        'real_size',
        document.querySelector('.filter__slider.size'),
        'Площа',
      );
      populateSliderFilter(
        data.data,
        'real_size',
        document.querySelector('.filter_flats__size'),
        'Площа',
      );
      // Поверх (витягуємо цифру з floor.name)
      populateSliderFilter(
        data.data,
        unit => {
          const match = unit.floor?.name?.match(/-?\d+/); // враховуємо можливий знак "-"
          return match ? Number(match[0]) : null;
        },
        document.querySelector('.filter__slider.floor'),
        'Поверх',
      );
      populateSliderFilter(
        data.data,
        unit => {
          const match = unit.floor?.name?.match(/-?\d+/); // враховуємо можливий знак "-"
          return match ? Number(match[0]) : null;
        },
        document.querySelector('.filter_flats__floor'),
        'Поверх',
      );
      getFilterKeysCount(selectedFilter);
    }
    loadUnits();

    function filterCards(input, value) {
      preloader.style.opacity = '1';
      preloader.style.visibility = 'visible';

      const flatCards = document.querySelectorAll('.flat_card');

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

            if (cardValue !== null) {
              if (cardValue < currentMin || cardValue > currentMax) {
                show = false; // ❌ картка не підходить
              }
            }
            if (show == true) {
              //Показуємо кнопку, яка видаляє обрані фільтри
              btnDelete.style.display = 'block';
              document.querySelectorAll('[data-name="floor"]').forEach(el => el.remove());

              if ('Площа_min' in selectedFilter || 'Площа_max' in selectedFilter) {
                document.querySelectorAll('[data-name="size"]').forEach(el => el.remove());
                const min = document.querySelector('[data-filter="Площа_min"]').value;
                const max = document.querySelector('[data-filter="Площа_max"]').value;
                const item = document.createElement('div');
                item.classList.add('section_flats__selected_item');
                item.dataset.id = `${min}-${max}`;
                item.dataset.name = `size`;
                item.innerHTML = `
                      <span>${min}-${max}</span>
                      <svg class="delete-item" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.02344 0.938965L6.02344 4.93994L9.97656 0.986816L11.0371 2.04736L7.08398 6.00049L11.0371 9.95264L9.97656 11.0132L6.02344 7.06103L2.02344 11.061L0.962891 9.99951L4.96289 6.00049L0.96289 1.99951L2.02344 0.938965Z" fill="#1D3541"/>
                      </svg>
                  `;
                const close = item.querySelector('.delete-item');
                close.addEventListener('click', () => {
                  item.remove(); // видаляємо блок
                  const minInput = document.querySelector('[data-filter="Площа_min"]');
                  const maxInput = document.querySelector('[data-filter="Площа_max"]');

                  if (minInput && maxInput) {
                    // Скидаємо значення на початкові (min і max атрибути)
                    minInput.value = minInput.min;
                    maxInput.value = maxInput.max;

                    // Викликаємо подію input, щоб оновити слайдер і фільтр
                    minInput.dispatchEvent(new Event('input'));
                    maxInput.dispatchEvent(new Event('input'));
                  }

                  if (selectedFilter['Площа_min']) {
                    delete selectedFilter['Площа_min'];
                  }
                  if (selectedFilter['Площа_max']) {
                    delete selectedFilter['Площа_max'];
                  }

                  filterCards();
                  if (Object.keys(selectedFilter).length === 0) {
                    btnDelete.style.display = 'none';
                  }
                });
                sectionFlatsSelected.appendChild(item);
              }
              if ('Поверх_min' in selectedFilter || 'Поверх_max' in selectedFilter) {
                document.querySelectorAll('[data-name="floor"]').forEach(el => el.remove());
                const min = document.querySelector('[data-filter="Поверх_min"]').value;
                const max = document.querySelector('[data-filter="Поверх_max"]').value;
                const item = document.createElement('div');
                item.classList.add('section_flats__selected_item');
                item.dataset.id = `${min}-${max}`;
                item.dataset.name = `floor`;
                item.innerHTML = `
                      <span>${min}-${max}</span>
                      <svg class="delete-item" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.02344 0.938965L6.02344 4.93994L9.97656 0.986816L11.0371 2.04736L7.08398 6.00049L11.0371 9.95264L9.97656 11.0132L6.02344 7.06103L2.02344 11.061L0.962891 9.99951L4.96289 6.00049L0.96289 1.99951L2.02344 0.938965Z" fill="#1D3541"/>
                      </svg>
                  `;
                const close = item.querySelector('.delete-item');
                close.addEventListener('click', () => {
                  item.remove(); // видаляємо блок
                  const minInput = document.querySelector('[data-filter="Поверх_min"]');
                  const maxInput = document.querySelector('[data-filter="Поверх_max"]');

                  if (minInput && maxInput) {
                    // Скидаємо значення на початкові (min і max атрибути)
                    minInput.value = minInput.min;
                    maxInput.value = maxInput.max;

                    // Викликаємо подію input, щоб оновити слайдер і фільтр
                    minInput.dispatchEvent(new Event('input'));
                    maxInput.dispatchEvent(new Event('input'));
                  }

                  if (selectedFilter['Поверх_min']) {
                    delete selectedFilter['Поверх_min'];
                  }
                  if (selectedFilter['Поверх_max']) {
                    delete selectedFilter['Поверх_max'];
                  }

                  filterCards();
                  if (Object.keys(selectedFilter).length === 0) {
                    btnDelete.style.display = 'none';
                  }
                });
                sectionFlatsSelected.appendChild(item);
              }
            }
          });
        }

        // 🔹 застосовуємо результат
        card.dataset.filtered = show ? 'true' : 'false';
        card.style.display = show ? 'flex' : 'none';
      });
      setPagination();
      getFilterKeysCount(selectedFilter);
      setTimeout(() => {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
      }, 500);
    }

    // Функція для відмальовки карток

    const setUnits = units => {
      units.forEach(unit => {
        wrapper.innerHTML = ''; // очищаємо обгортку

        units.forEach(unit => {
          const unitHTML = `
      <a href="/" class="flat_card" data-filtered="true" data-project=${
        unit.project.name
      } data-room_count=${unit.room_count} data-type=${unit.unit_type.name} data-size=${
            unit.real_size
          } data-floor=${parseInt(unit.floor.name.replace(/[^-\d]/g, ''), 10)}>
        <div class="flat_card__hover">
          <span style="background:#68d23f;"></span>
        </div>
        <!--<div class="flat_card__note">Новинка</div>-->
        <div class="flat_card__top">
          <span>Житловий комплекс</span>
          <span>${unit.project.name}</span>
        </div>
        <div class="flat_card__img">
          <img src="${
            unit.images?.[1]?.path
              ? `https://source-riel.propertymate.ai/${unit.images[1].path}`
              : 'assets/images/no_image.gif'
          }"   alt="planning" />
        </div>
        <div class="flat_card__center">
          <div class="flat_card__center_left">
            <span>${unit.unit_type.name} м²</span>
            <span>${unit.real_size}</span>
          </div>
          <div class="flat_card__center_center">
            <span>/</span>
          </div>
          <div class="flat_card__center_right">
            <span>грн/м²</span>
            <span>${unit.price_m2}</span>
          </div>
        </div>
        <div class="flat_card__bottom">
          <span>Секція: ${unit.section.name}</span>
          <span>Поверх: ${parseInt(unit.floor.name.replace(/[^-\d]/g, ''), 10)}</span>
          <span>Кімнат: ${unit.room_count}</span>
        </div>
        <div class="flat_card__address">
          <svg width="11" height="16" viewBox="0 0 11 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.50073 0C8.14043 0 10.4782 1.66034 10.4783 4.83008C10.4783 5.49423 10.1269 6.46565 9.95093 6.86816L5.50073 16L1.05054 6.86816C0.874556 6.46565 0.523193 5.49423 0.523193 4.83008C0.523248 1.66034 2.86104 4.59894e-06 5.50073 0ZM5.50073 2.84375C4.32252 2.84375 3.36694 3.79933 3.36694 4.97754C3.36719 6.15554 4.32268 7.11035 5.50073 7.11035C6.67858 7.11011 7.6333 6.15539 7.63354 4.97754C7.63354 3.79948 6.67873 2.844 5.50073 2.84375Z" fill="#F4F5F9"/>
          </svg>
          <span>Адреса</span>
        </div>
      </a>
    `;

          wrapper.insertAdjacentHTML('beforeend', unitHTML);
        });
      });
      getFilterKeysCount(selectedFilter);
      setPagination();
    };

    //Функція для формування чекбоксів в фільтрі

    function populateFilter(units, field, wrapper, dataFilterPrefix) {
      // отримуємо значення
      const values = units
        .map(unit => {
          if (typeof field === 'function') return field(unit);
          const keys = field.split('.');
          return keys.reduce((acc, key) => acc?.[key], unit);
        })
        .filter(Boolean);

      // унікальні та відсортовані
      const uniqueValues = [...new Set(values)].sort((a, b) => {
        if (typeof a === 'number' && typeof b === 'number') return a - b;
        return a.toString().localeCompare(b.toString());
      });

      // очищаємо wrapper
      wrapper.innerHTML = '';

      // формуємо чекбокси
      uniqueValues.forEach((val, index) => {
        const id = `${dataFilterPrefix}-${index}`;
        const checkboxHTML = `
      <div class="checkbox">
        <input class="checkbox__input" type="checkbox" id="${id}" data-filter="${dataFilterPrefix}-${val}" data-name="${val}">
        <label class="checkbox__label" for="${id}">${val}</label>
      </div>
    `;
        wrapper.insertAdjacentHTML('beforeend', checkboxHTML);
      });
    }

    //Функція для формування повзунків в фільтрі

    function populateSliderFilter(units, field, wrapper, label) {
      // Отримуємо всі числові значення
      const values = units
        .map(unit => {
          if (typeof field === 'function') return field(unit);
          const keys = field.split('.');
          return keys.reduce((acc, key) => acc?.[key], unit);
        })
        .filter(v => typeof v === 'number');

      if (values.length === 0) return;

      const minValue = Math.min(...values);
      const maxValue = Math.max(...values);

      // Очищаємо контейнер
      wrapper.innerHTML = '';

      // HTML слайдера
      wrapper.innerHTML = `
    <div class="values">
      <span id="${label}-min-value">${minValue}</span>
      <span id="${label}-max-value">${maxValue}</span>
    </div>
    <div class="slider-wrapper">
      <input data-filter="${label}_min" type="range" id="${label}-min" min="${minValue}" max="${maxValue}" step="${
        label == 'Площа' ? 0.1 : 1
      }" value="${minValue}">
      <input data-filter="${label}_max" type="range" id="${label}-max" min="${minValue}" max="${maxValue}" step="${
        label == 'Площа' ? 0.1 : 1
      }" value="${maxValue}">
      <div class="slider-track"></div>
    </div>
  `;

      const sliderWrapper = wrapper.querySelector('.slider-wrapper');
      const sliderTrack = sliderWrapper.querySelector('.slider-track');
      const sliderMin = wrapper.querySelector(`#${label}-min`);
      const sliderMax = wrapper.querySelector(`#${label}-max`);
      const minValueSpan = wrapper.querySelector(`#${label}-min-value`);
      const maxValueSpan = wrapper.querySelector(`#${label}-max-value`);

      function updateSlider() {
        if (Number(sliderMin.value) > Number(sliderMax.value)) sliderMin.value = sliderMax.value;

        minValueSpan.textContent = sliderMin.value;
        maxValueSpan.textContent = sliderMax.value;

        const minPercent =
          ((sliderMin.value - sliderMin.min) / (sliderMin.max - sliderMin.min)) * 100;
        const maxPercent =
          ((sliderMax.value - sliderMax.min) / (sliderMax.max - sliderMax.min)) * 100;

        // sliderTrack.style.background = `linear-gradient(to right, #ddd ${minPercent}%, #FB6A46 ${minPercent}%, #FB6A46 ${maxPercent}%, #ddd ${maxPercent}%)`;
      }

      sliderMin.addEventListener('input', updateSlider);
      sliderMax.addEventListener('input', updateSlider);
      updateSlider();
    }

    // Збираємо всі інпути в блоці фільтра
    const filterContainer1 = document.querySelector('.section_flats__filter.filter');
    const filterContainer2 = document.querySelector('.filter_flats');

    [filterContainer1, filterContainer2].forEach((container, index) => {
      if (container) {
        container.addEventListener('change', e => {
          const input = e.target;
          if (input.tagName === 'INPUT') {
            let [key, value] = input.dataset.filter.split('-');
            if (input.type == 'range') {
              value = input.value;
              selectedFilter[key] = [value];
              index == 0 ? filterCards() : '';
              return;
            }

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
              if (sectionFlatsSelected) {
                //Додаєм обраний фільтр у верхній рядок обраних фільтрів
                if (
                  !sectionFlatsSelected.querySelector(
                    `.section_flats__selected_item[data-id="${value}"]`,
                  )
                ) {
                  const item = document.createElement('div');
                  item.classList.add('section_flats__selected_item');
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
                    if (Object.keys(selectedFilter).length === 0) {
                      btnDelete.style.display = 'none';
                    }
                    filterCards();
                  });
                  // вставляємо в контейнер
                  sectionFlatsSelected.appendChild(item);
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
            index == 0 ? filterCards() : '';
          }
        });
      }
    });

    const applyBtn = document.querySelector('.filter_popup__btn_apply');

    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        preloader.style.opacity = '1';
        preloader.style.visibility = 'visible';
        filterCards();
        popupFilter.classList.remove('active');
        getFilterKeysCount(selectedFilter);
        setTimeout(() => {
          preloader.style.opacity = '0';
          preloader.style.visibility = 'hidden';
        }, 1000);
      });
    }

    //Пагінація

    const leftArrow = document.querySelector('.section_flats__pagination_arrow_left');
    const rightArrow = document.querySelector('.section_flats__pagination_arrow_right');
    const currentPageEl = document.querySelector('.section_flats__current_pages');
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
      const paginationWrapper = document.querySelector('.section_flats__pagination.pagination');
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

      setTimeout(() => {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
      }, 1000);
    });

    rightArrow.addEventListener('click', () => {
      preloader.style.opacity = '1';
      preloader.style.visibility = 'visible';

      showPage(currentPage + 1);

      setTimeout(() => {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
      }, 1000);
    });

    setPagination();

    //Висота блока з картками, щоб не скакав

    function updateHeight() {
      const filterResult = document.querySelector('.section_flats__filter_result');
      if (filterResult) {
        filterResult.style.minHheight = 'auto'; // скидаємо стару висоту
        const height = filterResult.offsetHeight; // поточна висота
        filterResult.style.minHheighteight = height + 'px';
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
    const filterPopUpWrapper = document.querySelector('.filter_popup__wrapper');

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
    if (filterPopUpWrapper && popupFilter) {
      popupFilter.addEventListener('click', e => {
        if (e.target === popupFilter) {
          // клик именно на фон, а не на содержимое
          popupFilter.classList.remove('active');
        }
      });
    }
  }
});
