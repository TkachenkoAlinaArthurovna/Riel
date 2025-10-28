// getUnits.js
import axios from 'axios';
import data from '../units.json'; // якщо є локальний json-файл із моками

// локальна функція для мок-даних
const unitsMock = () => data;

export async function getunits() {
  const formData = new FormData();
  formData.append('action', 'units');
  const url = '/wp-admin/admin-ajax.php';

  // 🔧 Якщо хочеш перемикатися між режимами:
  const isLocalMode = true; // змінюй на false для реального бекенду

  if (isLocalMode) {
    return await new Promise(resolve => {
      resolve({
        data: unitsMock(),
      });
    });
  }

  try {
    const response = await axios.post(url, formData);
    return response;
  } catch (error) {
    console.error('Помилка при завантаженні квартир:', error);
    return null;
  }
}
