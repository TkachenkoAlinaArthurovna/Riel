// 🆕 Оновлення числа квартир у попапі
export function updatePopupCount() {
  // popup-режим — коли екран <= 1500
  const isPopupMode = window.innerWidth <= 1500;

  if (!isPopupMode) return;
  const numberSpan = document.querySelector('.number span');
  if (!numberSpan) return;

  const filtered = JSON.parse(localStorage.getItem('filteredPremises')) || [];
  numberSpan.textContent = filtered.length;
}
