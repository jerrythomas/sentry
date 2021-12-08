<script>
	// import InfoIcon from './Info.svelte'
	// import WarnIcon from './Warn.svelte'
	// import FailIcon from './Fail.svelte'
	// import PassIcon from './Pass.svelte'
	// import BellIcon from './Bell.svelte'
	import Icon from './Icon.svelte'

	export let message
	export let type
	export let visible = true
	export let icon

	// let icons = {
	//   bell: BellIcon,
	// 	info: InfoIcon,
	// 	warn: WarnIcon,
	// 	fail: FailIcon,
	// 	pass: PassIcon,
	// }

	// $: color = (type === 'info')? 'blue': type === 'fail'? 'red': type==='pass'? 'green': type==='warn'? 'yellow': 'purple';
</script>

{#if visible}
	<div
		class="{type} w-96 rounded shadow flex flex-row mb-2 items-center cursor-pointer relative"
		on:click={() => (visible = false)}
	>
		{#if icon}
			<span class="absolute flex -top-3 left-1 items-center rounded-full">
				<Icon {icon} class="m-auto" />
			</span>
		{/if}
		<!-- <span
			class="absolute flex -top-3 -right-3 items-center justify-center rounded-full w-6 h-6 invisible hover:visible"
		>
			X
		</span> -->
		<p class="flex py-2 px-4 text-justify line-clamp-2">{message}</p>
	</div>
{/if}
