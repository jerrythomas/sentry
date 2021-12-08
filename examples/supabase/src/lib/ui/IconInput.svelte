<script>
	export let value = ''
	export let placeholder
	export let type = 'email'
	export let name
</script>

<div class="flex flex-row flex-grow rounded-sm border  focus-within:ring-2 {$$props.class}">
	<span
		class="w-12 p-0 flex-grow-0 flex-shrink-0 justify-center align-center flex bg-gray-200 rounded-l-sm"
	>
		<slot name="icon" />
	</span>
	<slot>
		<input {type} {name} {placeholder} {value} />
	</slot>
</div>

<style lang="postcss">
	input {
		@apply flex flex-grow w-auto border-l border-gray-300 px-2 outline-none rounded-r-sm;
	}
</style>
