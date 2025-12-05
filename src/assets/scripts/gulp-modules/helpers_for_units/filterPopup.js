// filterPopup.js

export function initFilterPopup() {
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

  // Закрити попап по кліку на фон
  if (filterPopUpWrapper && popupFilter) {
    popupFilter.addEventListener('click', e => {
      if (e.target === popupFilter) {
        popupFilter.classList.remove('active');
      }
    });
  }
}
