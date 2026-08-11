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
  sales: `${baseFolder}sales.svg`,
};
export function createMarkersData(google) {
  // Sizes will be defined here using the google object
  const defaultMarkerSize = new google.maps.Size(37.4, 65);
  const buildLogoSize = new google.maps.Size(82, 82);
  return [
    {
      type: 'main',
      icon: { url: markersAdresses.main, scaledSize: buildLogoSize },
      position: { lat: 49.87716460095959, lng: 24.017357905477937 },
      text: 'ЖК Soul Park',
    },
    {
      type: 'sales',
      icon: { url: markersAdresses.sales, scaledSize: defaultMarkerSize },
      position: { lat: 49.86802710217604, lng: 24.001854367077378 },
      text: 'Відділ продажу - вул. Малоголосківська, 30, Львів, Львівська область, 79020',
    },

    {
      type: 'sales',
      icon: { url: markersAdresses.sales, scaledSize: defaultMarkerSize },
      position: { lat: 49.82209066692305, lng: 24.130588743617054 },
      text: 'Відділ продажу - Галицька вулиця, Винники, Львівська область, 79495',
    },

    {
      type: 'sales',
      icon: { url: markersAdresses.sales, scaledSize: defaultMarkerSize },
      position: { lat: 49.877966950959056, lng: 24.027219168757025 },
      text: 'Відділ продажу - вулиця Пилипа Орлика, Львів, Львівська область, 79059',
    },
  ];
}
