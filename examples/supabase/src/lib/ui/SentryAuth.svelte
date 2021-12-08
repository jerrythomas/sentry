<script>
	import AuthProvider from './AuthProvider.svelte'
	export let providers
	export let authEndpoint
</script>

<div class="flex flex-col w-96 gap-2 m-auto">
	<h1>Sign in with</h1>
	{#each providers as { provider, label }}
		<AuthProvider {provider} {label} {authEndpoint} />
	{/each}
</div>
