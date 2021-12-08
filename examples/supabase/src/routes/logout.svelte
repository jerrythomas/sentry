<script>
	import { sentry } from '$config'
	import { onMount } from 'svelte'

	onMount(async () => {
		await sentry.handleSignOut()
	})
</script>

<p>Logging out...</p>
