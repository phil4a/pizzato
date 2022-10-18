import $ from 'jquery';

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
const nskCoords = [83.007095, 54.981798];
const zoomLevel = 10;
//Url KML-файла объектов карт

//! GEOJSON (lat и long меняется местами, параметром запроса api coordorder)

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
			properties: {},
		},
		{
			preset: 'islands#blackDotIconWithCaption',
		}
	);

	//создаем метку адреса
	myMap.geoObjects.add(deliveryPoint);

	//Получаем полигоны зоны доставки

	//прикрепляем поиск к input
	let suggestView = new ymaps.SuggestView('info-delivery__input');
	//Добавляем зоны доставки на карту
	function onZonesLoad(json) {
		const deliveryZones = ymaps.geoQuery(json).addToMap(myMap);
		console.log(deliveryZones);
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
		//Геокодируем координаты адреса
		function addressGeocode(inputRequest) {
			ymaps.geocode(inputRequest).then(function (res) {
				let obj = res.geoObjects.get(0);
				let coords = obj.geometry.getCoordinates();

				let bounds = obj.properties.get('boundedBy');
				// obj.options.set('preset', 'islands#darkBlueDotIconWithCaption');
				// obj.properties.set('iconCaption', obj.getAddressLine());
				// myMap.geoObjects.add(obj);
				// myMap.setBounds(bounds, {
				// 	// Проверяем наличие тайлов на данном масштабе.
				// 	checkZoomRange: true,
				// });
				let polygon = deliveryZones.searchContaining(coords).get(0);

				if (polygon) {
					deliveryZones.setOptions('fillOpacity', 0.2);
					deliveryZones.setOptions('strokeWidth', 3);
					polygon.options.set('fillOpacity', 0.8);
					polygon.options.set('strokeWidth', 10);

					deliveryPoint.geometry.setCoordinates(coords);
					deliveryPoint.options.set(
						'iconColor',
						polygon.properties.get('fill')
					);
					myMap.setBounds(bounds, {
						// Проверяем наличие тайлов на данном масштабе.
						checkZoomRange: true,
					});
				} else {
					deliveryZones.setOptions('fillOpacity', 0.4);
					deliveryPoint.geometry.setCoordinates(coords);
					deliveryPoint.properties.set({
						iconCaption: 'Уточните у оператора',
					});
					// Перекрашиваем метку в чёрный цвет.
					deliveryPoint.options.set('iconColor', 'black');
				}
			});
		}
	}
	$.ajax({
		url: 'https://raw.githubusercontent.com/phil4a/pizzato/master/deliv2.geojson',
		dataType: 'json',
		success: onZonesLoad,
	});
}
