<script>
	import AuthProvider from './AuthProvider.svelte'
	export let providers
</script>

<div class="space-y-3">
	<h1>Sign in with</h1>
	{#each providers as provider}
		<AuthProvider {...provider} />
	{/each}
</div>

<style lang="postcss">
	@import url('../global.css');
	div {
		display: flex;
		flex-direction: column;
	}
</style>
