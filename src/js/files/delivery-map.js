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

const deliveryForm = document.querySelector('.info-delivery__form');
const inputAddress = document.querySelector('.info-delivery__input');
const nskCoords = [54.981798, 83.007095];
const zoomLevel = 10;
//Url KML-файла объектов карты
const mapObjLink =
	'https://raw.githubusercontent.com/phil4a/pizzato/master/src/delivery.kml';

ymaps.ready(initMap);

function initMap() {
	//прикрепляем поиск к input
	let suggestView = new ymaps.SuggestView('info-delivery__input');
	// Создание карты.
	const myMap = new ymaps.Map('map-delivery', {
		center: nskCoords,
		zoom: zoomLevel,
		controls: [],
	});
	deliveryForm.addEventListener('submit', function (e) {
		e.preventDefault();
		let inputRequest = inputAddress.value;
		ymaps.geocode(inputRequest).then(function (res) {
			let obj = res.geoObjects.get(0).geometry.getCoordinates();
			console.log(obj);
			let newPlacemark = new ymaps.Placemark(obj);
			myMap.geoObjects.add(newPlacemark);
		});
	});
	//Отрисовываем полигоны зоны доставки
	let dataDelivery = ymaps.geoXml.load(mapObjLink);
	dataDelivery.then(function (res) {
		myMap.geoObjects.add(res.geoObjects);
	});
}
