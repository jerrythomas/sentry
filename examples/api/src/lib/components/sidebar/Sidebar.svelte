<script>
  // import Profile from '$lib/components/user/Profile.svelte'
  // import CurrentBook from '$lib/components/book/Current.svelte'

  import Menu from './Menu.svelte'

  // export let user
  export let menu
  export let activePage

  // $: menu = menu.forEach((item) => (item.current = item.target == activePage))
</script>

<aside
  class="bg-accent-300 bg-texture text-accent-500 p-8 h-full w-80 space-y-6"
>
  <!-- <Profile {...user} /> -->
  <slot name="profile" />
  <Menu items={menu} {activePage} />
  <!-- <CurrentBook {...current} /> -->
</aside>
