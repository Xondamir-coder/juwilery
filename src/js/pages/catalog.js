import '../main';
import styles from '@/data/filter-styles.json';
import materials from '@/data/filter-materials.json';
import categories from '@/data/filter-categories.json';
import types from '@/data/filter-types.json';
import spritesUrl from '@/assets/sprites.svg';

const data = {
	materials,
	styles,
	categories,
	types
};
const rowsData = [
	{ text: 'Категории', desc: 'Выберите категорию', tab: 'categories' },
	{ text: 'Материал', desc: 'Выберите материал', tab: 'materials' },
	{ text: 'Вставка', desc: 'Выберите тип вставки', tab: 'types' },
	{ text: 'Стиль', desc: 'Выберите стиль', tab: 'styles' }
];

const handleDesktopFilter = () => {
	const form = document.querySelector('form.directory__sidebar');
	const resetBtn = document.querySelector('#form-reset');
	const rowFilterResetBtn = document.querySelectorAll('.directory__row-reset');

	rowFilterResetBtn.forEach(btn => {
		btn.addEventListener('click', () => {
			btn.parentElement.nextElementSibling
				.querySelectorAll('input')
				.forEach(i => (i.checked = false));
		});
	});
	form.addEventListener('submit', e => {
		e.preventDefault();
		const formData = new FormData(form);
		// console.log(...formData);
	});
	resetBtn.addEventListener('click', () => {
		form.reset();
	});
};
const handleMobileFilter = () => {
	// Elements
	const filter = document.querySelector('.filter');
	const filterTop = document.querySelector('.filter__top');
	const filterRows = document.querySelector('.filter__rows');
	const backBtn = document.querySelector('.filter__back');
	const resetBtn = document.querySelector('#filter-reset');
	const applyBtn = document.querySelector('#filter-apply');

	// Local storage
	const selected = {
		categories: [],
		types: [],
		materials: [],
		styles: []
	};
	let tabType;

	// Util func
	const getFormRowTemplate = (el, i) => `
<label for='${tabType}-${i}' class='filter__form-row'>
	<input
		type='checkbox'
		name='${tabType}'
		${selected[tabType].includes(el) ? 'checked' : ''}
		id='${tabType}-${i}'
		value='${el}'
		class='filter__form-checkbox'
	/>
	<span>${el}</span>
	<span class='filter__form-amount'>(21)</span>
</label>`;
	const updateLocalStorage = () => {
		// Update local storage
		const form = document.querySelector('.filter__form');
		const formData = new FormData(form);
		const formValues = [...formData.values()];
		selected[tabType] = formValues.length ? formValues : [];
	};

	applyBtn.addEventListener('click', () => {
		updateLocalStorage();
		backBtn.click();
	});
	filterRows.addEventListener('click', e => {
		// Get clicked button
		const btn = e.target.closest('button');
		if (!btn) return;

		filter.classList.add('active');

		// Get the tab type
		tabType = btn.dataset.tab;

		// Get the data & Update UI
		const arr = [...data[tabType]];
		const children = arr.map(getFormRowTemplate).join('');
		const html = `<form class='filter__form'>${children}</form>`;
		filterTop.insertAdjacentHTML('afterend', html);

		// Disabled or Enable apply btn
		applyBtn.disabled = !selected[tabType].length;

		const form = document.querySelector('.filter__form');
		form.addEventListener('change', () => {
			const formData = new FormData(form);
			const formValues = [...formData.values()];
			applyBtn.disabled = !formValues.length;
		});
	});
	backBtn.addEventListener('click', () => {
		// updateLocalStorage();
		const form = document.querySelector('.filter__form');
		form.remove();

		// Update UI
		filter.classList.remove('active');
		Object.keys(selected).forEach(key => {
			// Activate the row class for styling
			const row = document.querySelector(
				`.filter__rows-row:has(.filter__rows-output[data-output="${key}"])`
			);
			row.classList.toggle('active', selected[key].length);
			if (!selected[key].length) {
				// Reset the output
				row.querySelector('.filter__rows-output').innerHTML = rowsData.find(
					r => r.tab === key
				).desc;
				return;
			}

			// Update the output
			document.querySelector(`.filter__rows-output[data-output="${key}"]`).innerHTML =
				selected[key].map(e => `<span>${e}</span>`).join('<div class="dot"></div>');
		});
	});
	resetBtn.addEventListener('click', () => {
		// Reset the form naturally and artificially
		const form = document.querySelector('.filter__form');

		if (form) {
			form.reset();
			form.querySelectorAll('input').forEach(i => (i.checked = false));

			// Update local storage
			Object.keys(selected).forEach(key => (selected[key] = []));

			// GO back
			backBtn.click();
		} else {
			// Update local storage
			Object.keys(selected).forEach(key => (selected[key] = []));

			// Update UI
			document
				.querySelectorAll('.filter__rows-row')
				.forEach(row => row.classList.remove('active'));
			rowsData.forEach(data => {
				const out = document.querySelector(
					`.filter__rows-output[data-output="${data.tab}"]`
				);
				out.textContent = data.desc;
			});
		}
	});
};

if (window.innerWidth > 768) handleDesktopFilter();
else handleMobileFilter();
