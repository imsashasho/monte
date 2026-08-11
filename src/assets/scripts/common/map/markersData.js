const windowPath = window.location.origin + window.location.pathname;

const isDev =
  window.location.href.match('localhost') ||
  window.location.href.match('https://soul-park-verstka.smartorange.com.ua/');

const prepareBaseFolder = isDev
  ? './assets/images/map/'
  : `${window.location.origin}/wp-content/themes/3d/assets/images/map/`;

// Set the base folder dynamically
const baseFolder = prepareBaseFolder;

export const markersAdresses = {
  main: `${baseFolder}main.png`,
  school: `${baseFolder}school.png`,
  // mall: `${baseFolder}mall.svg`,
  // park: `${baseFolder}park.svg`,
  // pharmacy: `${baseFolder}pharmacy.svg`,
  restaurant: `${baseFolder}restaurant.png`,
  sport: `${baseFolder}gym.png`,
  // gas: `${baseFolder}gas.svg`,
  // bank: `${baseFolder}bank.svg`,
};
export function createMarkersData(google) {
  // Sizes will be defined here using the google object
  const defaultMarkerSize = new google.maps.Size(37.4, 65);
  const buildLogoSize = new google.maps.Size(100, 170);
  return [
    // MAIN

    // PARK
    // {
    //   type: 'park',
    //   icon: { url: markersAdresses.park, scaledSize: defaultMarkerSize },
    //   position: { lat: 50.4295, lng: 30.5278 },
    //   text: 'Парк біля Дніпра',
    // },
    // {
    //   type: 'park',
    //   icon: { url: markersAdresses.park, scaledSize: defaultMarkerSize },
    //   position: { lat: 50.4263, lng: 30.5311 },
    //   text: 'Сквер на Оболонській',
    // },

    // GAS
    // {
    //   type: 'gas',
    //   icon: { url: markersAdresses.gas, scaledSize: defaultMarkerSize },
    //   position: { lat: 50.4248, lng: 30.5332 },
    //   text: 'OKKO — проспект Героїв Сталінграда',
    // },
    // {
    //   type: 'gas',
    //   icon: { url: markersAdresses.gas, scaledSize: defaultMarkerSize },
    //   position: { lat: 50.4309, lng: 30.5247 },
    //   text: 'WOG — вул. Маршала Тимошенка',
    // },

    // BANK
    // {
    //   type: 'bank',
    //   icon: { url: markersAdresses.bank, scaledSize: defaultMarkerSize },
    //   position: { lat: 50.4281, lng: 30.526 },
    //   text: 'Ощадбанк — вул. Оболонська',
    // },
    // {
    //   type: 'bank',
    //   icon: { url: markersAdresses.bank, scaledSize: defaultMarkerSize },
    //   position: { lat: 50.4257, lng: 30.5301 },
    //   text: 'ПриватБанк — просп. Бандери',
    // },

    // SCHOOL
    {
      type: 'school',
      icon: { url: markersAdresses.school, scaledSize: defaultMarkerSize },
      position: { lat: 50.4291, lng: 30.5299 },
      text: 'Школа №210',
    },
    {
      type: 'school',
      icon: { url: markersAdresses.school, scaledSize: defaultMarkerSize },
      position: { lat: 50.4268, lng: 30.5266 },
      text: 'Дитячий садок №120',
    },

    // PHARMACY
    // {
    //   type: 'pharmacy',
    //   icon: { url: markersAdresses.pharmacy, scaledSize: defaultMarkerSize },
    //   position: { lat: 50.4255, lng: 30.5281 },
    //   text: 'Аптека "Добрий День"',
    // },
    // {
    //   type: 'pharmacy',
    //   icon: { url: markersAdresses.pharmacy, scaledSize: defaultMarkerSize },
    //   position: { lat: 50.4287, lng: 30.5315 },
    //   text: 'Аптека "Shafa+"',
    // },

    // MALL
    // {
    //   type: 'mall',
    //   icon: { url: markersAdresses.mall, scaledSize: defaultMarkerSize },
    //   position: { lat: 50.4313, lng: 30.5268 },
    //   text: 'ТЦ "Obolon Mall"',
    // },
    // {
    //   type: 'mall',
    //   icon: { url: markersAdresses.mall, scaledSize: defaultMarkerSize },
    //   position: { lat: 50.4244, lng: 30.5319 },
    //   text: 'ТРЦ "Riviera"',
    // },

    // RESTAURANT
    {
      type: 'restaurant',
      icon: { url: markersAdresses.restaurant, scaledSize: defaultMarkerSize },
      position: { lat: 50.4279, lng: 30.5292 },
      text: 'Ресторан "River Side"',
    },
    {
      type: 'restaurant',
      icon: { url: markersAdresses.restaurant, scaledSize: defaultMarkerSize },
      position: { lat: 50.426, lng: 30.5273 },
      text: 'Кафе "Daily Roast"',
    },

    // SPORT
    {
      type: 'sport',
      icon: { url: markersAdresses.sport, scaledSize: defaultMarkerSize },
      position: { lat: 50.4251, lng: 30.5289 },
      text: 'Sport Life — Оболонь',
    },
    {
      type: 'sport',
      icon: { url: markersAdresses.sport, scaledSize: defaultMarkerSize },
      position: { lat: 50.4294, lng: 30.5324 },
      text: 'Fitness Stadium',
    },
    {
      type: 'main',
      icon: { url: markersAdresses.main, scaledSize: buildLogoSize },
      position: { lat: 50.427712, lng: 30.5287506 },
      text: 'ЖК Maxima Residence',
    },
  ];
}
