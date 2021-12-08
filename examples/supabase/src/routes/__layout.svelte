<script context="module">
	import { sentry } from '$config'

	// /** @type {import('@sveltejs/kit').Load} */
	// export async function load({ page, fetch, session, stuff }) {
	// 	console.log('layout => ', page.path, session, sentry.handleTraffic(page.path, session))
	// 	// return {}
	// 	return sentry.handleTraffic(page.path, session)
	// }
</script>

<script>
	import Header from '$lib/header/Header.svelte'
	import { onMount } from 'svelte'
	import '../app.css'

	onMount(async () => {
		await sentry.handleAuthChange()
	})
</script>

<Header />

<main>
	<slot />
</main>

<footer>
	<p>
		visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to learn SvelteKit
	</p>
</footer>

<style windi:preflights:global windi:safelist:global>
</style>
