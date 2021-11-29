<script>
	export let size = '1.5em'
	export let title = ''
	export let icon
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	class="m-auto {$$props.class || ''} stroke-current flex-shrink-0 flex-grow-0"
	fill="none"
	height={size}
	width={size}
	viewBox="0 0 24 24">
	<title>{title}</title>
	<svelte:component this={icon} />
</svg>
