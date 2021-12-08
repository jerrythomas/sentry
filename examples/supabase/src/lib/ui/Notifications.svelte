<script>
	import { onDestroy } from 'svelte'
	import { alerts } from './alert'
	import Alert from './Alert.svelte'

	let items = []

	const unsubscribe = alerts.subscribe((value) => (items = value))
	onDestroy(unsubscribe)
</script>

<div class="absolute right-6 ml-6 top-16 md:w-1/3">
	{#each items as { message, type, visible }}
		<Alert bind:visible {message} {type} />
	{/each}
</div>
