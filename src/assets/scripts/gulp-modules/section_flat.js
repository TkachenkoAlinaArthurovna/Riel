document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.section_flat_details__center_wrapper_for_btn button');
  const wrapper = document.querySelector('.section_flat_details__center_wrapper_for_img');

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const id = button.dataset.id;

      // Знімаємо клас .active з усіх кнопок
      buttons.forEach(btn => btn.classList.remove('active'));
      // Додаємо активний до натиснутої
      button.classList.add('active');

      // Визначаємо зсув
      let translateValue = '0';
      if (id === 'main') translateValue = '-33.333%';
      if (id === 'floor') translateValue = '-66.666%';

      wrapper.style.transform = `translateX(${translateValue})`;
      wrapper.style.transition = 'transform 0.4s ease';
    });
  });
});
