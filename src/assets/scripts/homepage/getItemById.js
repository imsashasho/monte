import axios from 'axios';

const data = {
  1: {
    id: 1,
    data: {
      gallery: ['./assets/images/const-card-1.png', './assets/images/const-card-2.png'],
    },
  },
  2: {
    id: 1,
    data: {
      gallery: ['./assets/images/const-card-1.png', './assets/images/const-card-2.png'],
    },
  },
  3: {
    id: 1,
    data: {
      gallery: ['./assets/images/const-popup.png'],
    },
  },
  4: {
    id: 1,
    data: {
      gallery: ['./assets/images/const-popup.png'],
    },
  },
};

const isDev =
  window.location.href.match('localhost') ||
  window.location.href.match('https://soul-park-verstka.smartorange.com.ua/');
const baseUrl = '/wp-admin/admin-ajax.php';

export const getItemById = (id) => {
  if (isDev) return Promise.resolve({ data: data[id] });

  const formData = new FormData();
  formData.append('action', 'gallery');
  formData.append('id', id);

  return axios.post(baseUrl, formData);
};

export const getConstructionById = (id) => {
  if (isDev) return Promise.resolve({ data: data[id] });
  const formData = new FormData();
  formData.append('action', 'construction');
  formData.append('id', id);

  return axios.post('/wp-admin/admin-ajax.php', formData);
};
