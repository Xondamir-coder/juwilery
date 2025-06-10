import '../main';
import '../utils/faq';

const handleStudioSwiper = () => {
	const buttonsNav = document.getElementById('studio-buttons');
	const dotsNav = document.querySelector('.studio__dots');
	const swiperEl = document.getElementById('studio-swiper');
	const mySwiper = swiperEl.swiper; // your Swiper instance

	// map each nav container to its button selector
	const controls = [
		{ container: buttonsNav, selector: 'button.studio__item' },
		{ container: dotsNav, selector: 'button.studio__dot' }
	];

	// activate the correct item in both navs
	function activate(index) {
		controls.forEach(({ container }) => {
			Array.from(container.children).forEach((child, i) => {
				child.classList.toggle('active', i === index);
			});
		});
	}

	// attach click handlers
	controls.forEach(({ container, selector }) => {
		container.addEventListener('click', e => {
			const btn = e.target.closest(selector);
			if (!btn) return;
			const index = parseInt(btn.dataset.index, 10);
			mySwiper.slideTo(index);
			activate(index);
		});
	});

	// update navs on slide change
	mySwiper.on('slideChange', () => {
		activate(mySwiper.activeIndex);
	});
};

handleStudioSwiper();
