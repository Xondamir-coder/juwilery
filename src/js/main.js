import { register } from 'swiper/element/bundle';
register();

const handleToggleDropdowns = () => {
	const togglers = document.querySelectorAll('[data-toggle]');
	togglers.forEach(t => {
		t.addEventListener('click', () => {
			document.getElementById(t.dataset.toggle).classList.toggle('active');
		});
	});
	document.addEventListener('click', e => {
		if (!e.target.closest('[data-toggle]')) {
			togglers.forEach(t => {
				document.getElementById(t.dataset.toggle).classList.remove('active');
			});
		}
	});
};
const setCopyrightYear = () => {
	const currentYear = new Date().getFullYear();
	const el = document.querySelectorAll('.footer__copyright');
	el.forEach(e => {
		e.textContent = e.textContent.replace('{year}', currentYear);
	});
};
const handleCatalog = () => {
	// Elements
	const openCatalogBtn = document.querySelector('.header__button');
	const inputEl = document.querySelector('.header__search-input');
	const starEl = document.querySelector('.header__search .icon');
	const formEl = document.querySelector('.header__search');
	const formBtnEl = document.querySelector('.header__search-button');
	const headerEl = document.querySelector('.header');
	const overlayEl = document.querySelector('.overlay');
	const menuEl = document.querySelector('.menu');

	let isMenuOpen = false;

	const toggleMenu = () => {
		isMenuOpen = !isMenuOpen;
		openCatalogBtn.classList.toggle('active');
		openCatalogBtn.lastElementChild.textContent = !isMenuOpen ? 'Каталог' : 'Закрыть';
		starEl.classList.toggle('active');
		headerEl.classList.toggle('active');
		menuEl.classList.toggle('active');
		overlayEl.classList.toggle('hidden');
		document.body.classList.toggle('no-scroll');
	};

	// Main menu toggle
	openCatalogBtn.addEventListener('click', toggleMenu);
	overlayEl.addEventListener('click', toggleMenu);

	// Toggle clear icon
	inputEl.addEventListener('input', e => {
		const { value } = e.target;
		formEl.classList.toggle('active', value);
	});

	// Submit query
	formEl.addEventListener('submit', e => {
		e.preventDefault();
		if (!isMenuOpen) toggleMenu();
	});

	// Click clear
	formBtnEl.addEventListener('click', () => {
		inputEl.value = '';
		formEl.classList.remove('active');
	});
};

setCopyrightYear();
handleToggleDropdowns();
handleCatalog();
