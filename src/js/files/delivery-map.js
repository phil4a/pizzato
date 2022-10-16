// import 'leaflet/dist/leaflet.css';
// import 'leaflet';

// const ivanova = [54.871155, 83.093283];
// const frunze = [55.039443, 82.960574];
// const michurina = [55.041942, 82.923735];

// const deliveryMap = L.map('map-delivery').setView(nskCoords, zoomLevel);

// L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {}).addTo(deliveryMap);

// L.marker(ivanova).addTo(deliveryMap).bindPopup('Иванова, 35Б').openPopup();
// L.marker(frunze).addTo(deliveryMap).bindPopup('Фрунзе, 238').openPopup();
// L.marker(michurina).addTo(deliveryMap).bindPopup('Мичурина, 12').openPopup();

const nskCoords = [54.981798, 83.007095];
const zoomLevel = 10;

ymaps.ready(initMap);
function initMap() {
	// Создание карты.
	const myMap = new ymaps.Map('map-delivery', {
		center: nskCoords,
		zoom: zoomLevel,
		controls: [],
	});
}

let data = JSON.parse(delivery);
