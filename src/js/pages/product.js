import '../main';
import '../utils/faq';

const handleTextCollapse = () => {
	const text = document.querySelector('.product__about-text');
	const btn = document.querySelector('.product__about-button');

	let textData;

	textData = text.textContent;
	text.textContent = textData.slice(0, 300) + '...';

	btn.addEventListener('click', () => {
		if (text.textContent === textData) {
			text.textContent = textData.slice(0, 300) + '...';
			btn.textContent = 'Показать больше';
		} else {
			text.textContent = textData;
			btn.textContent = 'Скрыть';
		}
	});
};
const handleSwiper = () => {
	const slider = document.querySelector('.product__slider');
	const dots = document.querySelector('.dots');
	const swiper = slider.swiper;

	dots.addEventListener('click', e => {
		const btn = e.target;
		if (!btn) return;
		[...dots.children].forEach(b => b.classList.remove('active'));
		btn.classList.toggle('active');
		swiper.slideTo(btn.dataset.index);
	});
	swiper.on('slideChange', () => {
		[...dots.children].forEach(b => b.classList.remove('active'));
		dots.children[swiper.realIndex].classList.add('active');
	});
};
const handeImageModal = () => {
	const slider = document.querySelector('.product__swiper');
	const images = document.querySelector('.product__images');

	images.addEventListener('click', e => {
		const imageSrc = e.target.closest('img')?.src;
		if (!imageSrc) return;
		slider.swiper.slideTo([...images.children].indexOf(e.target.closest('img')));
	});
};

handleTextCollapse();
handleSwiper();
handeImageModal();
