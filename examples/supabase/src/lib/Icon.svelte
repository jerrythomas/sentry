<script>
	export let size = 6
	export let title = ''
	export let icon
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	class="h-{size} w-{size} {$$props.class}"
	fill="none"
	viewBox="0 0 24 24"
>
	<title>{title}</title>
	<svelte:component this={icon} />
</svg>
