import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src')
		}
	},
	build: {
		rollupOptions: {
			input: {
				main: 'index.html',
				about: 'about.html',
				contacts: 'contacts.html',
				faq: 'faq.html',
				catalog: 'catalog.html'
			}
		}
	}
});
