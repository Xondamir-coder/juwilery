import products from '../data/products.json';
import catalog from '../data/catalog.json';
import { register } from 'swiper/element/bundle';
import spritesUrl from '@/assets/sprites.svg';

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

	const getCatalogTemplate = c => `
			<div class="menu__row">
								<div class="menu__row-header">
									<h3 class="menu__row-header_title">${c.category}</h3>
									<button class="menu__row-header_button">
										<span>Все ${c.category.toLowerCase()}</span>
										<svg
											viewBox="0 0 24 24"
											fill="none"
											class="stroke-gold"
											width="24"
											height="24">
											<use
												href="${spritesUrl}#chevron-right-arrow"></use>
										</svg>
									</button>
								</div>
								<ul class="menu__row-list">
								${c.items
									.map(
										i => `
									<li class="menu__row-item">
										<img
											src="${i.img}"
											alt="${i.name}"
											class="menu__row-item_image" />
										<h4 class="menu__row-item_title">${i.name}</h4>
									</li>
								`
									)
									.join('')}
								</ul>
							</div>
							`;
	const getHighlightedWord = words =>
		words
			.split(' ')
			.map(w =>
				w.toLowerCase().includes(inputEl.value.toLowerCase())
					? `<span class="color-gold">${w}</span>`
					: w
			)
			.join(' ');
	const getSearchTemplate = r => `
    <div class="menu__query">
      <h3 class="menu__query-title">${r.category}</h3>
      <ul class="menu__list">
        ${r.items
			.map(
				i => `
            <li class="menu__item">
              <img
                src="${i.img}"
                alt="diamondring"
                class="menu__item-image"
              />
              <div class="menu__item-content">
                <h3 class="menu__item-name">${getHighlightedWord(i.name)}</h3>
                <p class="menu__item-text">${getHighlightedWord(i.desc)}</p>
              </div>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                class="stroke-grey-3"
                width="24"
                height="24"
              >
                <use href="${spritesUrl}#chevron-right-arrow"></use>
              </svg>
            </li>
          `
			)
			.join('')}
      </ul>
    </div>
  `;
	const toggleMenu = () => {
		// Toggle isMenuOpen var
		isMenuOpen = !isMenuOpen;

		// Change button text
		openCatalogBtn.lastElementChild.textContent = !isMenuOpen ? 'Каталог' : 'Закрыть';

		// Assign classes
		[openCatalogBtn, starEl, headerEl, menuEl].forEach(el => el.classList.toggle('active'));
		overlayEl.classList.toggle('hidden');
		window.scrollTo(0, 0);
		document.body.classList.toggle('no-scroll');

		// Initialize menu with catalogs
		if (menuEl.innerHTML === '') {
			const html = catalog.map(getCatalogTemplate).join('');
			menuEl.innerHTML = html;
		}
	};

	// Main menu toggle
	openCatalogBtn.addEventListener('click', toggleMenu);
	overlayEl.addEventListener('click', toggleMenu);

	// Toggle clear icon
	inputEl.addEventListener('input', e => {
		const { value } = e.target;
		formEl.classList.toggle('active', value);
	});

	// Click clear
	formBtnEl.addEventListener('click', () => {
		// Reset input & form
		inputEl.value = '';
		formEl.classList.remove('active');

		// Reset menu with catalogs
		if (menuEl.firstElementChild.classList.contains('menu__query')) {
			const html = catalog.map(getCatalogTemplate).join('');
			menuEl.innerHTML = html;
		}
	});

	// Submit query
	formEl.addEventListener('submit', e => {
		e.preventDefault();
		if (!isMenuOpen) toggleMenu();

		// Implement search
		const lowercasedValue = inputEl.value.toLowerCase();
		const results = products
			// 1) for each product, build a new one with only the matching items
			.map(p => {
				const matchedItems = p.items.filter(
					i =>
						i.name.toLowerCase().includes(lowercasedValue) ||
						i.desc.toLowerCase().includes(lowercasedValue)
				);
				return {
					...p,
					items: matchedItems
				};
			})
			// 2) then throw away any product with zero matches
			.filter(p => p.items.length > 0);

		// Render results
		if (results.length === 0) {
			alert('Ничего не нашлось');
		} else {
			const html = results.map(getSearchTemplate).join('');
			menuEl.innerHTML = html;
		}
	});
};

setCopyrightYear();
handleToggleDropdowns();
handleCatalog();
