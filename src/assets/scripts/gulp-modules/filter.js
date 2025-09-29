document.addEventListener('DOMContentLoaded', () => {
  const projectCards = document.querySelectorAll('.project_card');
  let selectedFilter = {};

  function filterCards() {
    projectCards.forEach(card => {
      let show = true;

      // перебираємо всі ключі у selectedFilter
      for (let key in selectedFilter) {
        const cardValue = card.dataset[key]; // значення картки, напр. data-status, data-project
        const filterValues = selectedFilter[key]; // масив допустимих значень

        // якщо значення картки не в масиві – ховаємо картку
        if (!filterValues.includes(cardValue)) {
          show = false;
          break; // немає сенсу перевіряти інші ключі
        }
      }

      card.style.display = show ? 'flex' : 'none';
    });
  }

  // Збираємо всі інпути в блоці фільтра
  const filterInputs = document.querySelectorAll(
    '.section_projects__filter input[type="checkbox"]',
  );

  filterInputs.forEach(input => {
    input.addEventListener('change', () => {
      const [key, value] = input.dataset.filter.split('-');

      if (input.checked) {
        // якщо ключа ще немає – створюємо масив
        if (!selectedFilter[key]) {
          selectedFilter[key] = [];
        }
        // додаємо значення, якщо ще немає
        if (!selectedFilter[key].includes(value)) {
          selectedFilter[key].push(value);
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
      }
      filterCards();
      console.log(selectedFilter);
    });
  });
});
