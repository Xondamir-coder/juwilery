import products from '../data/products.json';
import catalog from '../data/catalog.json';
import spritesUrl from '@/assets/sprites.svg';

// Initialize Lenis
const lenis = new Lenis({
	autoRaf: true
});

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

const handleToggleDropdowns = () => {
	const togglers = document.querySelectorAll('[data-dropdown]');
	togglers.forEach(t => {
		t.addEventListener('click', () => {
			document.getElementById(t.dataset.dropdown).classList.toggle('active');
		});
	});
	document.addEventListener('click', e => {
		if (!e.target.closest('[data-dropdown]')) {
			togglers.forEach(t => {
				document.getElementById(t.dataset.dropdown).classList.remove('active');
			});
		}
	});
};
const setCopyrightYear = () => {
	const currentYear = new Date().getFullYear();
	const elements = document.querySelectorAll('[data-copyright]');
	elements.forEach(e => {
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
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
		document.body.classList.toggle('no-scroll');
		document.body.classList.contains('no-scroll') ? lenis.stop() : lenis.start();

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
const handleSliders = () => {
	const sliders = document.querySelectorAll('.slider__container');
	// const bp = {
	// 	0: { slidesPerView: 1, spaceBetween: 20 },
	// 	768: { slidesPerView: 2, spaceBetween: 20 },
	// 	1024: { slidesPerView: 3, spaceBetween: 20 },
	// 	1440: { slidesPerView: 4, spaceBetween: 20 }
	// };
	sliders.forEach(slider => {
		const prevBtn = slider.previousElementSibling.querySelector(
			'.slider__button:first-of-type'
		);
		const nextBtn = slider.previousElementSibling.querySelector('.slider__button:last-of-type');
		const swiperParams = {
			grabCursor: true,
			navigation: {
				prevEl: prevBtn,
				nextEl: nextBtn
			},
			breakpoints: {
				0: {
					slidesPerView: 1.4,
					spaceBetween: 8
				},
				512: {
					slidesPerView: 2.5
				},
				768: {
					slidesPerView: 3,
					spaceBetween: 12
				},
				1024: {
					slidesPerView: 3.5,
					spaceBetween: 16
				},
				1440: {
					slidesPerView: 4,
					spaceBetween: 20
				}
			}
		};

		// now we need to assign all parameters to Swiper element
		Object.assign(slider, swiperParams);

		// and now initialize it
		slider.initialize();
	});
};
const handleBottomModals = () => {
	const modals = document.querySelectorAll('.modal');
	modals.forEach(modal => {
		const btn = document.querySelector(`[data-modal="${modal.id}"]`);
		if (!btn) return;
		modal.addEventListener('hidden.bs.modal', () => {
			btn.classList.remove('active');
		});
		modal.addEventListener('show.bs.modal', () => {
			if (modal.id.includes('search')) handleSearch();
			btn.classList.add('active');
		});
	});
};
const handleSearchForms = () => {
	const forms = document.querySelectorAll('form.search');
	forms.forEach(form => {
		const input = form.querySelector('input');
		const clearBtn = form.querySelector('button');

		form.addEventListener('submit', e => {
			e.preventDefault();
		});
		input.addEventListener('input', e => {
			form.classList.toggle('active', e.target.value);
		});
		clearBtn.addEventListener('click', () => {
			input.value = '';
			form.classList.remove('active');
		});
	});
};

setCopyrightYear();
handleSliders();
handleSearchForms();
handleToggleDropdowns();
if (window.innerWidth > 768) handleCatalog();
else handleBottomModals();
