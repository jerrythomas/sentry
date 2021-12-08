/** @type {import('@sveltejs/kit').Config} */
import { windi } from 'svelte-windicss-preprocess'
const config = {
	preprocess: [windi({})],
	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte'
	},
	vite: {
		plugins: [windi()]
	}
}

export default config
