import path from 'path'
import preprocess from 'svelte-preprocess'
import adapter from '@sveltejs/adapter-static'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		adapter: adapter({
			// default options are shown
			pages: 'build',
			assets: 'build',
			fallback: 'index.html',
		}),
		vite: {
			resolve: {
				alias: {
					$config: path.resolve('./src/config'),
				},
			},
		},
	},

	preprocess: [
		preprocess({
			postcss: true,
		}),
	],
}

export default config
