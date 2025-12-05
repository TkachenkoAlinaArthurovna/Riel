import axios from 'axios';

export async function getData() {
  const formData = new FormData();
  formData.append('action', 'getFlats');

  try {
    const { data } = await axios.post('/wp-admin/admin-ajax.php', formData);
    return data.data;
  } catch (error) {
    console.error('Помилка при завантаженні квартир:', error);
    return null;
  }
}
