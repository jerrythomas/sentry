<script context="module">
	/**
	 * @type {import('@sveltejs/kit').Load}
	 */
	export async function load({ page, fetch, session, context }) {
		// console.log(session, page, context)
		return { props: { activePage: page.path, user: session.user } }
	}
</script>

<script>
	import '@fontsource/montserrat-alternates'
	import '@fontsource/kalam'
	import '../app.postcss'
	import Sidebar from '$lib/components/sidebar/Sidebar.svelte'
	import Welcome from '$lib/components/Welcome.svelte'
	import { menu } from '$config'

	export let activePage = '/'
	export let user
</script>

{#if user}
	<Sidebar {menu} {activePage} />
{:else}
	<div class="w-2/3 p-4 flex bg-texture bg-accent-300 ">
		<Welcome />
	</div>
{/if}
<slot />
