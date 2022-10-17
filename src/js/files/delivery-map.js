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
	// Создание карты.
	const myMap = new ymaps.Map('map-delivery', {
		center: nskCoords,
		zoom: zoomLevel,
		controls: [],
	});
	const deliveryPoint = new ymaps.GeoObject(
		{
			geometry: { type: 'Point' },
			properties: { iconCaption: 'Адрес' },
		},
		{
			preset: 'islands#blackDotIconWithCaption',
			draggable: true,
			iconCaptionMaxWidth: '215',
		}
	);

	//Отрисовываем полигоны зоны доставки
	let dataDelivery = ymaps.geoXml.load(mapObjLink);
	//прикрепляем поиск к input
	let suggestView = new ymaps.SuggestView('info-delivery__input');
	dataDelivery.then(function (res) {
		let deliveryZones = ymaps.geoQuery(res.geoObjects).addToMap(myMap);
		deliveryZones.each(function (obj) {
			obj.options.set({
				fillColor: obj.properties.get('fill'),
				fillOpacity: obj.properties.get('fill-opacity'),
				strokeColor: obj.properties.get('stroke'),
				strokeWidth: obj.properties.get('stroke-width'),
				strokeOpacity: obj.properties.get('stroke-opacity'),
			});
			obj.properties.set('balloonContent', obj.properties.get('description'));
		});
		//Событие заполнение формы
		deliveryForm.addEventListener('submit', function (e) {
			e.preventDefault();
			let inputRequest = inputAddress.value;
			addressGeocode(inputRequest);
		});
		//Геокодируем и размещаем метку
		function addressGeocode(inputRequest) {
			ymaps.geocode(inputRequest).then(function (res) {
				let obj = res.geoObjects.get(0);
				let coords = obj.geometry.getCoordinates();

				let bounds = obj.properties.get('boundedBy');
				obj.options.set('preset', 'islands#darkBlueDotIconWithCaption');
				obj.properties.set('iconCaption', obj.getAddressLine());
				myMap.geoObjects.add(obj);
				myMap.setBounds(bounds, {
					// Проверяем наличие тайлов на данном масштабе.
					checkZoomRange: true,
				});
				const polygon = deliveryZones.searchContaining(coords).get(0);
				if (polygon) {
					deliveryZones.setOptions('fillOpacity', 0.4);
					polygon.options.set('fillOpacity', 0.8);
				}
			});
		}
	});
}
