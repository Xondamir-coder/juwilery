import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
	build: {
		rollupOptions: {
			input: {
				main: 'index.html',
				about: 'about.html',
				contacts: 'contacts.html',
				faq: 'faq.html'
			}
		}
	}
});
