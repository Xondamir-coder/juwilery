import products from '../data/products.json';
import catalog from '../data/catalog.json';
import { register } from 'swiper/element/bundle';
import spritesUrl from '@/assets/sprites.svg';

register();

// Helper functions
const getCatalogTemplate = c => `
			<div class="catalog">
								<div class="catalog__header">
									<h3 class="catalog__header-title">${c.category}</h3>
									<button class="catalog__header-button">
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
								<ul class="catalog__list">
								${c.items
									.map(
										i => `
									<li class="catalog__item">
										<img
											src="${i.img}"
											alt="${i.name}"
											class="catalog__item-image" />
										<h4 class="catalog__item-title">${i.name}</h4>
									</li>
								`
									)
									.join('')}
								</ul>
							</div>
							`;
const getHighlightedWord = (words, inputVal) =>
	words
		.split(' ')
		.map(w =>
			w.toLowerCase().includes(inputVal.toLowerCase())
				? `<span class="color-gold">${w}</span>`
				: w
		)
		.join(' ');
const getSearchTemplate = (r, inputVal) => `
    <div class="catalog__search">
      <h3 class="catalog__search-title">${r.category}</h3>
      <ul class="catalog__search-list">
        ${r.items
			.map(
				i => `
            <li class="catalog__search-item">
              <img
                src="${i.img}"
                alt="diamondring"
                class="catalog__search-item_image"
              />
              <div class="catalog__search-item_content">
                <h3 class="catalog__search-item_name">${getHighlightedWord(i.name, inputVal)}</h3>
                <p class="catalog__search-item_text">${getHighlightedWord(i.desc, inputVal)}</p>
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
/**
 * Searches through products by name/description and renders results.
 *
 * @param {Object[]}  products         – array of product groups
 * @param {string}    query            – the raw user query
 * @param {HTMLElement} containerEl    – where to render the results
 * @param {Function}  getSearchTemplate– (product, rawQuery) ⇒ HTML string
 * @param {string}    emptyMessage     – message to show if no results
 */
const searchAndRender = (query, containerEl, emptyMessage = 'Ничего не нашлось') => {
	const lowercased = query.toLowerCase();

	// 1) Filter products → only keep matching items
	const results = products
		.map(p => ({
			...p,
			items: p.items.filter(
				i =>
					i.name.toLowerCase().includes(lowercased) ||
					i.desc.toLowerCase().includes(lowercased)
			)
		}))
		.filter(p => p.items.length > 0);

	// 2) Render or show empty message
	if (results.length === 0) {
		alert(emptyMessage);
	} else {
		containerEl.innerHTML = results.map(r => getSearchTemplate(r, query)).join('');
	}
};

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
	const inputEl = document.querySelector('#desktop-search');
	const starEl = document.querySelector('.header__search .icon');
	const formEl = document.querySelector('.header__search');
	const formBtnEl = document.querySelector('.header__search-button');
	const headerEl = document.querySelector('.header');
	const overlayEl = document.querySelector('.overlay');
	const menuEl = document.querySelector('.menu');

	let isMenuOpen = false;

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
		if (menuEl.firstElementChild.classList.contains('catalog__search')) {
			const html = catalog.map(getCatalogTemplate).join('');
			menuEl.innerHTML = html;
		}
	});

	// Submit query
	formEl.addEventListener('submit', e => {
		e.preventDefault();
		if (!isMenuOpen) toggleMenu();
		searchAndRender(inputEl.value, menuEl, 'Ничего не нашлось');
	});
};
const handleBottomNavbar = () => {
	const buttonsList = document.querySelector('.bottombar__list');
	const items = document.querySelectorAll('[data-item]');
	const buttons = document.querySelectorAll('[data-menu]');
	const overlay = document.querySelector('.overlay');

	const handleSearch = () => {
		const containerEl = document.querySelector('.bottombar__search-container');
		const inputEl = document.querySelector('#mobile-search');
		const formEl = document.querySelector('.bottombar__search-form');
		const clearInputBtn = document.querySelector('.bottombar__search-clear');

		if (containerEl.innerHTML === '') {
			const html = catalog.map(getCatalogTemplate).join('');
			containerEl.innerHTML = html;
		}

		formEl.addEventListener('submit', e => {
			e.preventDefault();
			searchAndRender(inputEl.value, containerEl, 'Ничего не нашлось');
		});
		inputEl.addEventListener('input', e => {
			clearInputBtn.classList.toggle('active', e.target.value);
		});
		clearInputBtn.addEventListener('click', () => {
			inputEl.value = '';

			// Reset with catalogs
			if (containerEl.firstElementChild.classList.contains('catalog__search')) {
				const html = catalog.map(getCatalogTemplate).join('');
				containerEl.innerHTML = html;
			}
		});
	};
	buttonsList.addEventListener('click', e => {
		const selectedBtn = e.target.closest('.bottombar__button');
		const type = selectedBtn?.dataset.menu;
		if (type) {
			const selectedItem = document.querySelector(`[data-item="${type}"]`);

			// Hide all others
			items.forEach(i => i !== selectedItem && i.classList.add('ds-none'));
			buttons.forEach(b => b !== selectedBtn && b.classList.remove('active'));

			// Activate buttons & menu
			selectedItem?.classList.toggle('ds-none');
			selectedBtn.classList.toggle('active');

			// Toggle overlay & body scroll
			const allHidden = Array.from(items).every(i => i.classList.contains('ds-none'));
			overlay.classList.toggle('hidden', allHidden);
			document.body.classList.toggle('no-scroll', !allHidden);

			// Different stuff for search
			if (type === 'search') handleSearch();
		}
	});
	overlay.addEventListener('click', () => {
		items.forEach(i => i.classList.add('ds-none'));
		buttons.forEach(b => b.classList.remove('active'));
		overlay.classList.toggle('hidden');
		document.body.classList.toggle('no-scroll');
	});
};

setCopyrightYear();
handleToggleDropdowns();
if (window.innerWidth > 768) handleCatalog();
if (window.innerWidth < 768) handleBottomNavbar();
