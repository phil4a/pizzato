// Подключение функционала "Чертогов Фрилансера"
import { isMobile } from './functions.js';
// Подключение списка активных модулей
import { flsModules } from './modules.js';

// подсказка в карточке товара - tooltip
import tippy, { animateFill } from 'tippy.js';
import 'tippy.js/dist/tippy.css'; // optional for styling
import 'tippy.js/animations/shift-away.css';

//tooltip
tippy('.card__tip-button', {
	theme: 'pizzato',
	placement: 'bottom-end',
	allowHTML: true,
	arrow: false,
	animateFill: true,
	plugins: [animateFill],
	inertia: true,
	content: function (reference) {
		return reference.querySelector('.tip-template');
	},
});
