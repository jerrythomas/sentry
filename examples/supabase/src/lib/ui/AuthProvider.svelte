<script>
	import Icon from './Icon.svelte'
	import { icons } from './icons'
	import IconButton from './IconButton.svelte'
	import IconInput from './IconInput.svelte'

	export let provider
	export let label
	export let authEndpoint

	$: title = label.toLowerCase() === provider ? 'Continue with ' + label : label
</script>

<form method="post" action={authEndpoint} class="flex flex-row leading-loose h-11 text-lg">
	<input type="hidden" name="provider" value={provider} />
	{#if provider === 'magic'}
		<IconInput type="email" name="email" placeholder={label}>
			<Icon icon={icons[provider]} slot="icon" />
		</IconInput>
	{:else}
		<IconButton label={title} class={provider}>
			<Icon icon={icons[provider]} slot="icon" />
		</IconButton>
	{/if}
</form>

<style lang="postcss">
	:global(.google) {
		background-color: #ffffff;
		color: #757575;
	}
	:global(.github) {
		background-color: #333333;
		color: #ffffff;
	}
	:global(.microsoft) {
		background-color: #2f2f2f;
		color: #ffffff;
	}
	:global(.facebook) {
		background-color: #3b5998;
		color: #ffffff;
	}

	:global(.twitter) {
		background-color: #55acee;
		color: #ffffff;
	}
	:global(.apple) {
		background-color: black;
		color: #ffffff;
	}
	:global(.mail) {
		background-color: #db4437;
		color: #ffffff;
	}
	:global(.phone) {
		background-color: #02bd7e;
		color: #ffffff;
	}
	:global(.anonymous) {
		background-color: #55acee;
		color: #ffffff;
	}
	:global(.magic) {
		background-color: #ffffff;
		color: #333333;
	}
</style>
