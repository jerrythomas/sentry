<script>
	import Icon from './Icon.svelte'
	import { icons } from '../icons'
	import { sentry } from '../firebase'

	export let provider
	export let label
	export let scopes = []
	export let params = []

	const signIn = sentry.getLoginHandler(provider, scopes, params)

	$: title = label.toLowerCase() === provider ? 'Continue with ' + label : label
</script>

<button class={provider} on:click={signIn}>
	<Icon {title} icon={icons[provider]} />
	<p>{title}</p>
</button>

<style lang="postcss">
	button {
		display: flex;
		flex-direction: row;
		border: 1px solid;
		border-radius: 0.25rem;
		padding: 0.5rem 1rem;
		font-size: 1rem;
		vertical-align: middle;
	}
	button p {
		display: flex;
		flex-grow: 1;
		margin-left: 1rem;
	}
</style>
