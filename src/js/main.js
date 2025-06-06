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
	const el = document.querySelector('.footer__copyright');
	el.textContent = el.textContent.replace('{year}', currentYear);
};

setCopyrightYear();
handleToggleDropdowns();
