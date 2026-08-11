import getMapTheme from './map-style';
import { createMarkersData } from './markersData';

function initMap() {
  try {
    const gmarkers1 = [];
    const center = { lat: 50.427712, lng: 30.5287506 };
    const choosedCategories = new Set();
    choosedCategories.add('main');
    const filterItems = document.querySelectorAll('[data-marker]');

    const map = new google.maps.Map(document.getElementById('map'), {
      zoom: 15,
      center,
      scrollwheel: false,
      navigationControl: false,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      draggable: true,
      language: 'ua',
      styles: getMapTheme(),
    });

    console.log('✅ Map created successfully');
    window.googleMap = map;

    const filterMarkers = function (category, categoriesArray) {
      gmarkers1.forEach((el) => {
        if (categoriesArray.has(el.category) || categoriesArray.size === 1) {
          el.setMap(map);
        } else {
          el.setMap(null);
        }
      });
    };

    filterItems.forEach((item) => {
      item.addEventListener('click', (evt) => {
        evt.stopImmediatePropagation();
        item.classList.toggle('active');
        if (item.classList.contains('active')) {
          choosedCategories.add(item.dataset.category);
        } else {
          choosedCategories.delete(item.dataset.category);
        }
        filterMarkers('main', choosedCategories);
      });
    });

    const infowindow = new google.maps.InfoWindow({
      text: '',
      maxWidth: 300,
    });

    const markersData = createMarkersData(google);
    console.log('📍 Markers data:', markersData.length);

    markersData.forEach((marker) => {
      const category = marker.type;
      const mapMarker = new google.maps.Marker({
        map,
        category,
        zIndex: marker.zIndex || 1,
        icon: marker.icon,
        cursor: 'grap',
        position: new google.maps.LatLng(marker.position.lat, marker.position.lng),
      });

      google.maps.event.addListener(mapMarker, 'click', function () {
        infowindow.setContent(marker.text);
        infowindow.open(map, mapMarker);
        map.panTo(this.getPosition());
      });

      mapMarker.name = marker.type;
      gmarkers1.push(mapMarker);
    });

    console.log('All markers created:', gmarkers1.length);
  } catch (error) {
    console.error('Error in initMap:', error);
  }
}

function loadGoogleMapsAPI() {
  console.log('Loading Google Maps API...');

  const script = document.createElement('script');
  const key = process.env.GOOGLE_MAPS_API_KEY;
  script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&callback=initMap&language=ua`;
  script.async = true;
  script.defer = true;

  script.onerror = () => {
    console.error('Failed to load Google Maps API');
  };

  script.onload = () => {
    console.log('Google Maps API script loaded');
  };

  document.head.appendChild(script);
}

const filterBtn = document.querySelector('#filter-button');
const filterNav = document.querySelector('.map-navigation');

if (filterBtn) {
  filterBtn.addEventListener('click', function () {
    filterNav.classList.toggle('oppened');
  });
}

function setupLazyLoadingMap() {
  const maps = document.querySelectorAll('.map');
  console.log('Map containers found:', maps.length);

  const options = {
    rootMargin: '0px',
    threshold: 0.1,
  };

  maps.forEach((image) => {
    const callback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          console.log('Map container is visible');
          const lazyImage = entry.target;
          lazyImage.src = lazyImage.dataset.src;
          observer.unobserve(image);

          loadGoogleMapsAPI();
        }
      });
    };

    const observer = new IntersectionObserver(callback, options);
    observer.observe(image);
  });
}

export default function googleMap() {
  console.log('googleMap() initialized');

  window.initMap = initMap;
  console.log('window.initMap set');

  setupLazyLoadingMap();
}
