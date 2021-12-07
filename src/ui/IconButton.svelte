<script>
	export let type
	export let label
</script>

<button
	{type}
	class="flex flex-row rounded-sm space-x-2 w-full items-center border {$$props.class}"
>
	<span class="w-12 p-0 justify-center align-center flex">
		<slot name="icon" />
	</span>
	<p class={$$props.class}>{label}</p>
</button>
