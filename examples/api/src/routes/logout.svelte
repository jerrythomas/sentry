<script>
	import { onMount } from 'svelte'
	import { sentry } from '@jerrythomas/sentry/firebase'

	onMount(() => {
		sentry.logout()
	})
</script>
