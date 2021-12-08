<script>
	export let message
	export let type
	export let visible = true

	// $: color =
	// 	type === 'info'
	// 		? 'blue'
	// 		: type === 'fail'
	// 		? 'red'
	// 		: type === 'pass'
	// 		? 'green'
	// 		: type === 'warn'
	// 		? 'yellow'
	// 		: 'purple'
</script>

{#if visible}
	<div
		class="w-96 rounded border shadow flex flex-row m-4 items-center cursor-pointer relative {type}"
		on:click={() => (visible = false)}
	>
		<!-- <span class="absolute flex -top-3 left-1 items-center rounded-full bg-{color}-50">
		<Icon icon={icons[type]} class="m-auto"/>
	</span> -->

		<p class="flex py-2 px-4 text-justify">{message}</p>
	</div>
{/if}
