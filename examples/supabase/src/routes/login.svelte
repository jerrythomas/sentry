<script context="module">
	/** @type {import('@sveltejs/kit').Load} */
	export async function load({ page }) {
		return {
			props: {
				status: page.query.get('status')
			}
		}
	}
</script>

<script>
	import SentryAuth from '$lib/ui/SentryAuth.svelte'
	import { providers } from '$config/providers'
	import { sentry } from '$config'

	const messages = {
		S001: 'Magic link has been sent to your email. Please check your spam/junk mail also.',
		E001: 'Rate limit exceeded.'
	}

	const { authUrl } = sentry.routes()

	export let status

	$: info = status in messages && status.startsWith('S') ? messages[status] : null
	$: error = status in messages && status.startsWith('E') ? messages[status] : null
</script>

<div class="h-full flex flex-col flex-grow justify-center items-center ">
	<div class="relative py-4 w-full sm:max-w-sm">
		<div
			class="absolute inset-0 bg-gradient-to-br from-primary-500 to-secondary-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"
		/>
		<div
			class="relative py-10 px-8 bg-skin-base text-skin-base shadow-lg sm:rounded-3xl flex flex-col gap-8 items-center"
		>
			<img src="/sentry.svg" alt="Sentry" class="sm:w-3/5" />
			<SentryAuth {providers} {authUrl} />
		</div>
	</div>

	{#if info}
		<span class="info">{info}</span>
	{/if}
	{#if error}
		<span class="error">{error}</span>
	{/if}
</div>
