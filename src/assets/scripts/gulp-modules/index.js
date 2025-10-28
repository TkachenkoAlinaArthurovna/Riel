import '../modules/scroll/leniscroll';
import '../animations';
import './section_hot_deals';
import './section_news';
import './section_video';
import '../modules/form';
import './filter';
import './news';
import './flats';
import './view';
import './section_benefits';
import './gallery';
import './section_more_projects';
import './section_flat';
import './news_single';
import './single_project';
import './single_flat';

import axios from 'axios';
import data from './units.json'; // локальні дані

const unitsMock = () => data;

const vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.page-template-home')) {
    const adresses = {
      '2': 'вул. Володимира Великого, 10',
      '3': 'вул. Б. Хмельницького, 116',
      '4': 'вул. Б. Хмельницького, 207',
      '8': 'вул. Проектована, 1',
      '17': 'вул. Рудненська, 8',
      '22': 'вул. Залізнична, 7',
    };
    const colors = {
      '2': '#696969',
      '3': '#40E0D0',
      '4': '#696969',
      '8': '#e6e621ff',
      '17': '#e6e621ff',
      '22': '#696969',
    };
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
    }
    const section = document.querySelector('.section_hot_deals');
    const project = section.getAttribute('data-project');
    const wrapper = section.querySelector('.swiper-wrapper');

    const setUnits = units => {
      wrapper.innerHTML = ''; // очищаємо обгортку
      let count = 0;
      const selectedUnits = units
        .filter(unit => unit.total_price && unit.total_price > 0) // залишаємо тільки з ціною
        .sort((a, b) => a.total_price - b.total_price) // сортуємо за зростанням ціни
        .slice(0, 5); // беремо 5 найдешевших

      selectedUnits.forEach(unit => {
        count++;
        const unitHTML = `
          <div class="swiper-slide">
            <a href="/flats?id=${unit.id}" 
                class="flat_card" data-filtered="true"  
                data-project="${unit.project?.name || null}" 
                data-room_count="${unit.room_count || null}" 
                data-type="${unit.unit_type?.name || null}" 
                data-size="${unit.real_size || null}" 
                data-floor="${unit.floor?.order_number || null}" 
                data-id=${unit.id}
            >
        <div class="flat_card__hover">
          <span style="background:${colors[unit.project.id] || '#DCDCDC'};"></span>
        </div>
        <!--<div class="flat_card__note">Новинка</div>-->
        <div class="flat_card__top">
          <span>Житловий комплекс</span>
          ${unit.project?.name ? `<span>${unit.project.name}</span>` : ''}
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
            ${unit.unit_type?.name ? `<span>${unit.unit_type.name} м²</span>` : `<span>м²</span>`}
            ${
              unit.real_size && unit.real_size !== 0
                ? `<span>${unit.real_size}</span>`
                : '<span>-</span>'
            }
          </div>
          <div class="flat_card__center_center">
            <span>/</span>
          </div>
          <div class="flat_card__center_right">
            <span>грн/м²</span>
            <span>${
              unit.total_price && unit.total_price !== 0
                ? Number(unit.total_price).toLocaleString('uk-UA')
                : '-'
            }</span>
          </div>
        </div>
        <div class="flat_card__bottom">
          ${unit.section?.name ? `<span>Секція: ${unit.section.name}</span>` : ''}
          ${
            unit.floor?.order_number && unit.floor.order_number !== 0
              ? `<span>Поверх: ${unit.floor.order_number}</span>`
              : ''
          }
          ${
            unit.room_count && unit.room_count !== 0
              ? `<span>Кімнат: ${unit.room_count}</span>`
              : ''
          }
        </div>
        ${
          adresses[unit.project.id]
            ? `<div class="flat_card__address">
      <svg width="11" height="16" viewBox="0 0 11 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.50073 0C8.14043 0 10.4782 1.66034 10.4783 4.83008C10.4783 5.49423 10.1269 6.46565 9.95093 6.86816L5.50073 16L1.05054 6.86816C0.874556 6.46565 0.523193 5.49423 0.523193 4.83008C0.523248 1.66034 2.86104 4.59894e-06 5.50073 0ZM5.50073 2.84375C4.32252 2.84375 3.36694 3.79933 3.36694 4.97754C3.36719 6.15554 4.32268 7.11035 5.50073 7.11035C6.67858 7.11011 7.6333 6.15539 7.63354 4.97754C7.63354 3.79948 6.67873 2.844 5.50073 2.84375Z" fill="#F4F5F9"/>
      </svg>
      <span>${adresses[unit.project.id]}</span>
    </div>`
            : ''
        }

      </a>
      </div>
    `;
        wrapper.insertAdjacentHTML('beforeend', unitHTML);
      });
      const lastSlideHTML = `
          <div class="swiper-slide last-slide">
            <a class="flat_card" href="/flats" 
                class="btn_more"
            >
              <span>Дивитись всі квартири</span>
            </a>
      </div>
    `;
      wrapper.insertAdjacentHTML('beforeend', lastSlideHTML);
      // Якщо не додано жодної картки — ховаємо секцію
      if (count === 0) {
        section.style.display = 'none';
      }
    };
    loadUnits();
  }

  const openBtn = document.querySelector('.header__open_popup');
  const popup = document.querySelector('.connect_popup');
  const closeBtn = document.querySelector('.connect_popup__close');

  if (openBtn && popup) {
    openBtn.addEventListener('click', () => {
      if (window.innerWidth < 1024) {
        popup.style.transform = 'translateY(0)';
      }
    });
  }

  if (closeBtn && popup) {
    closeBtn.addEventListener('click', () => {
      if (window.innerWidth < 1024) {
        popup.style.transform = 'translateY(100%)';
      }
    });
  }

  const goUpButton = document.querySelector('.footer__up');

  if (goUpButton) {
    goUpButton.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  }

  if (document.querySelector('.arrow_down')) {
    document.querySelector('.arrow_down').addEventListener('click', function() {
      const section = document.querySelector('.section_next');
      if (section) {
        section.scrollIntoView({
          behavior: 'smooth',
        });
      }
    });
  }
});
