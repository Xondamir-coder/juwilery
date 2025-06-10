const accordions = document.querySelector('.faq__accordions');

accordions.addEventListener('click', e => {
	const btn = e.target.closest('.faq__accordion-top');
	if (!btn) return;
	[...accordions.children].forEach(c => c !== btn.parentElement && c.classList.remove('active'));
	btn.parentElement.classList.toggle('active');
});
