import adapter from '@sveltejs/adapter-auto'
import path from 'path'
// import WindiCSS from 'vite-plugin-windicss'
import { windi } from 'svelte-windicss-preprocess'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [windi({})],
	kit: {
		adapter: adapter(),
		target: '#svelte',
		vite: {
			// plugins: [windi()],
			resolve: {
				alias: {
					$config: path.resolve('./src/config')
				}
			}
		}
	}
}

export default config
