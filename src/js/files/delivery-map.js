const deliveryForm = document.querySelector('.info-delivery__form');
const inputAddress = document.querySelector('.info-delivery__input');
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

	deliveryForm.addEventListener('submit', function (e) {
		e.preventDefault();
	});

	//прикрепляем поиск к input
	let suggestView = new ymaps.SuggestView('info-delivery__input');
}
