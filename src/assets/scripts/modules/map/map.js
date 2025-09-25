import { swiperMap } from '../../gulp-modules';
import mapStyle from './map-style';

export default async function googleMap() {
  const mapContainers = document.querySelectorAll('.map');
  const mapSingle = document.querySelector('.map-simple');

  if (!mapContainers.length && !mapSingle) return;

  // 👇 Завантаження скрипта Google Maps
  async function loadGoogleMapsScript() {
    if (window.google && window.google.maps) return;

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
       const key = document.querySelector('.map').dataset.api; // 🔑 Підстав сюди свій ключ
      script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&language=ua`;
      script.async = true;
      script.defer = true;

      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Не вдалося завантажити Google Maps API'));
      document.head.appendChild(script);
    });
  }

  // 👇 Ініціалізація мапи після завантаження API
  async function initMaps() {
    await loadGoogleMapsScript();

    if (mapContainers.length) {
      mapContainers.forEach(container => {
        createMap(container);
      });
    }

    if (mapSingle) {
      createSingleMap(mapSingle);
    }
  }

  // 👇 IntersectionObserver для відкладеного завантаження
  const observerOptions = { rootMargin: '0px', threshold: 0.1 };

  const observerCallback = async (entries, observer) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        observer.disconnect(); // зупиняємо спостереження
        await initMaps();
        break;
      }
    }
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);
  const firstMap = mapContainers[0] || mapSingle;
  if (firstMap) {
    observer.observe(firstMap);
  }

  // 👇 Додатково — якщо карта вже в viewport
  if (isElementInViewport(firstMap)) {
    observer.disconnect();
    await initMaps();
  }
  if (isElementInViewport(mapSingle)) {
    observer.disconnect();
    await initMaps();
  }
  function isElementInViewport(el) {
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  // 👇 Основна карта з категоріями
  function createMap(container) {
    const gmarkers = [];
    const center = { lat: 50.4220083, lng: 30.6426015 };
    const choosedCategories = new Set(['main']);

    const filterItems = document.querySelectorAll('[data-marker]');
    const map = new google.maps.Map(container, {
      zoom: 14.5,
      center,
      scrollwheel: false,
      mapTypeControl: false,
      draggable: true,
      styles: mapStyle(),
    });

    const baseFolder = window.location.href.includes('localhost')
      ? './assets/images/map/'
      : '/wp-content/themes/3d/assets/images/map/';

    const defaultMarkerSize =
      document.documentElement.clientWidth < 1600
        ? new google.maps.Size(46, 80)
        : new google.maps.Size(56, 90);

    const buildLogoSize = new google.maps.Size(82, 82);

    const markersAdresses = {
      main: `${baseFolder}main.png`,
      school: `${baseFolder}school.svg`,
      pharmacy: `${baseFolder}pharmacy.svg`,
      garden: `${baseFolder}garden.svg`,
      sport: `${baseFolder}sport.svg`,
      restaurant: `${baseFolder}restaurant.svg`,
      activities: `${baseFolder}activities.svg`,
      supermarket: `${baseFolder}supermarket.svg`,
    };

    const markersData = [
    {
      type: 'school',
      icon: { url: markersAdresses.school, scaledSize: defaultMarkerSize },
      position: { lat: 50.41419350589122,  lng: 30.63948276530671 },
      text: 'Ліцей №303',
    },
    {
      type: 'school',
      icon: { url: markersAdresses.school, scaledSize: defaultMarkerSize },
      position: { lat: 50.4181183488088 , lng: 30.645339224477777 },
      text: 'Гімназія №290',
    },
    
    {
      type: 'pharmacy',
      icon: { url: markersAdresses.pharmacy, scaledSize: defaultMarkerSize },
      position: { lat: 50.42622539159608,  lng: 30.646540854361962 },
      text: 'Вузлова лікарня №1 станції "Дарниця"',
    },
    {
      type: 'pharmacy',
      icon: { url: markersAdresses.pharmacy, scaledSize: defaultMarkerSize },
      position: { lat: 50.4245849553108,   lng: 30.64242098176834 },
      text: 'Дніпролаб"',
    },
    {
      type: 'garden',
      icon: { url: markersAdresses.garden, scaledSize: defaultMarkerSize },
      position: { lat: 50.427937463283236,  lng: 30.645222184349088 },
      text: 'Заклад дошкільної освіти №787',
    },
    {
      type: 'garden',
      icon: { url: markersAdresses.garden, scaledSize: defaultMarkerSize },
      position: { lat: 50.42138313747107,  lng: 30.654802010174667 },
      text: 'Заклад дошкільної освіти № 133 "Радосинь"',
    },
    {
      type: 'garden',
      icon: { url: markersAdresses.garden, scaledSize: defaultMarkerSize },
      position: { lat: 50.42083054174973,  lng: 30.644353070903104 },
      text: 'Заклад дошкільної освіти комбінованого типу №138',
    },
    
    {
      type: 'sport',
      icon: { url: markersAdresses.sport, scaledSize: defaultMarkerSize },
      position: { lat: 50.405144485779225,  lng: 30.648642359423445},
      text:
        'АтлетіКо',
    },
    {
      type: 'sport',
      icon: { url: markersAdresses.sport, scaledSize: defaultMarkerSize },
      position: { lat: 50.405171527988955, lng: 30.648678188953394 },
      text: 'Басейн "Крокі"',
    },
    {
      type: 'restaurant',
      icon: { url: markersAdresses.restaurant, scaledSize: defaultMarkerSize },
      position: { lat: 50.42200837722877,  lng: 30.64260158395498 },
      text: 'GAGA',
    },
    {
      type: 'restaurant',
      icon: { url: markersAdresses.restaurant, scaledSize: defaultMarkerSize },
      position: { lat: 50.42146785446494,  lng: 30.63971493587432 },
      text: 'Dellini',
    },
    
    {
      type: 'activities',
      icon: { url: markersAdresses.activities, scaledSize: defaultMarkerSize },
      position: { lat: 50.41454471307626,  lng: 30.651119853809114 },
      text: 'New Way',
    },
    {
      type: 'activities',
      icon: { url: markersAdresses.activities, scaledSize: defaultMarkerSize },
      position: { lat: 50.42331357809371,  lng: 30.63860151668352 },
      text: 'Sport DOG Area',
    },
    {
      type: 'supermarket',
      icon: { url: markersAdresses.supermarket, scaledSize: defaultMarkerSize },
      position: { lat: 50.41942483649471,  lng: 30.631618935451538 },
      text: 'Ашан Рів Гош',
    },
    {
      type: 'main',
      icon: { url: markersAdresses.main, scaledSize: buildLogoSize },
      position: { lat: 50.425288565469636,  lng: 30.639686058688614 },
      text: 'ЖК Brother,  вул. Ревуцького, 1',
    },
  ];

  const infowindow = new google.maps.InfoWindow({ maxWidth: 300 });

  markersData.forEach(marker => {
    const mapMarker = new google.maps.Marker({
      map,
      position: marker.position,
      icon: marker.icon,
      category: marker.type,
      animation: google.maps.Animation.DROP,
    });

    mapMarker.addListener('click', () => {
      infowindow.setContent(marker.text);
      infowindow.open(map, mapMarker);
      map.panTo(marker.position);
    });

    gmarkers.push(mapMarker);
  });

  filterItems.forEach(item => {
    item.addEventListener('click', evt => {
      evt.preventDefault();
      item.classList.toggle('active');
      const category = item.dataset.category;
      if (item.classList.contains('active')) {
        choosedCategories.add(category);
      } else {
        choosedCategories.delete(category);
      }

      gmarkers.forEach(marker => {
        if (choosedCategories.has(marker.category) || choosedCategories.size === 1) {
          marker.setMap(map);
          marker.setAnimation(google.maps.Animation.DROP);
        } else {
          marker.setMap(null);
        }
      });

      swiperMap.update();
    });
  });
}

// 👇 Проста мапа для одного маркера
function createSingleMap(container) {
  const center = { lat: 50.4108375148184,  lng: 30.599973593881256 };
  const markerIcon = {
    url: window.location.href.includes('localhost')
      ? './assets/images/map/riel.svg'
      : '/wp-content/themes/3d/assets/images/map/riel.svg',
    scaledSize:
      document.documentElement.clientWidth < 1600
        ? new google.maps.Size(80, 80)
        : new google.maps.Size(90, 90),
  };

  const map = new google.maps.Map(container, {
    zoom: 15,
    center,
    scrollwheel: false,
    mapTypeControl: false,
    draggable: true,
    styles: mapStyle(),
  });

  const marker = new google.maps.Marker({
    position: center,
    map,
    icon: markerIcon,
    animation: google.maps.Animation.DROP,
  });

  const infowindow = new google.maps.InfoWindow({
    content: 'РІЕЛ – відділ продажу',
    maxWidth: 300,
  });

  marker.addListener('click', () => {
    infowindow.open(map, marker);
    map.panTo(center);
  });
}
}