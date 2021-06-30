<script>
  import Icon from '$lib/Icon.svelte'
  import LogoutIcon from '$lib/Logout.svelte'
  import { sentry } from '@jerrythomas/sentry/firebase'
</script>

<div
  class="flex flex-col flex-shrink items-center p-10 space-y-6 w-80 mt-10 rounded-xl shadow m-auto"
>
  <img src="/favicon.png" alt="Svelte Firebase Auth" />
  <button
    class="flex flex-row rounded border px-4 py-2"
    on:click={sentry.logout}
  >
    <Icon icon={LogoutIcon} title="Logout" />
    <p class="ml-2">Logout</p>
  </button>
</div>
