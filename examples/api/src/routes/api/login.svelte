<script context="module">
	// fest25
	/**
	 * @type {import('@sveltejs/kit').Load}
	 */
	export async function load({ page, fetch, session, context }) {
		return { props: { provider: page.query.get('provider') } }
	}
</script>

<script>
	import { config, providers } from '$config'
	import { authorize } from '$lib/firebase'
	import { onMount } from 'svelte'
	// import { goto } from '$app/navigation'

	export let provider
	export let result

	onMount(async () => {
		const scopes = providers[provider].scopes
		const params = providers[provider].params
		result = await authorize(config, provider, scopes, params)
	})
</script>

{#if result}
	<!-- <div>{result?.token}</div> -->
	<img src={result.user.gravatar} alt={result.user.name} />
{/if}
