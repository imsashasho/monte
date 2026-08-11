import axios from 'axios';
import { investmentMock, mapMock } from './mock';

//creating promises for your needs as a fake data you can use any objects in mock file

const baseUrl = '/wp-admin/admin-ajax.php';
const isDev =
  window.location.href.match('localhost') ||
  window.location.href.match('https://soul-park-verstka.smartorange.com.ua/');

export const getMarkers = () =>
  isDev ? Promise.resolve({ data: mapMock }) : axios.post(baseUrl, { action: 'map' });

export const getInvestment = id =>
  isDev
    ? Promise.resolve(investmentMock.find(item => item.id === id))
    : axios.post(baseUrl, { action: 'investment', id });
