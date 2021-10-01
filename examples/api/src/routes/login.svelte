<script>
  import Sentry from '$lib/auth/Sentry.svelte'
  import { providers, routes } from '$config'
</script>

<div
  class="h-full flex flex-col flex-grow bg-primary-100 px-20  justify-center sm:py-12 sm:px-10"
>
  <div class="relative py-3 sm:max-w-xl sm:mx-auto">
    <div
      class="absolute inset-0 bg-gradient-to-tr from-accent-300 to-accent-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"
    />
    <div
      class="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-10 flex flex-col gap-5 items-center"
    >
      <img src="/sentry.svg" alt="Sentry" />
      <Sentry {providers} action={routes.login} />
    </div>
  </div>
</div>
