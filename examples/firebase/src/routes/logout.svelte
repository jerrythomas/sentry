<script>
  import { Icon } from '@jerrythomas/sentry'
  import { sentry } from '@jerrythomas/sentry/firebase'
  import { icons } from '$lib/icons'
</script>

<div
  class="flex flex-col flex-shrink items-center p-10 space-y-6 w-80 mt-10 rounded-xl shadow m-auto"
>
  <img src="/favicon.png" alt="Svelte Firebase Auth" />
  <button
    class="flex flex-row rounded border px-4 py-2"
    on:click={sentry.logout}
  >
    <Icon icon={icons.Logout} title="Logout" />
    <p class="ml-2">Logout</p>
  </button>
</div>
