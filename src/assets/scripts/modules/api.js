import axios from "axios"

export default function requestData(action, dataObject) {
  const formData = new FormData();
  formData.append('action', action);
  for (let key in dataObject) formData.append(key, dataObject[key]);
  for (var pair of formData.entries()) {
    console.log(pair[0] + ', ' + pair[1]);
  }
  return axios.post('/wp-admin/admin-ajax.php', formData);
}