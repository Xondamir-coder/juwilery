import { defineConfig } from 'vite';
import path from 'path';
import autoprefixer from 'autoprefixer';

export default defineConfig({
	css: {
		postcss: {
			plugins: [autoprefixer]
		}
	},
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
				catalog: 'catalog.html',
				product: 'product.html'
			}
		}
	}
});
