<script>
  import { sentry } from '@jerrythomas/sentry/firebase'
  $: user = $sentry.user
</script>

<section
  class="m-auto w-64 mt-10 flex flex-col space-y-2 items-center p-6 rounded-xl shadow"
>
  <img src="/favicon.png" alt="Svelte Firebase Auth" />
  <h1>Firebase Auth</h1>

  <div>{user?.name}</div>
  <a
    href="/login"
    class="w-40 p-1 border rounded text-center hover:text-purple-700 bg-purple-100"
    >Log in</a
  >
  <a
    href="/logout"
    class="w-40 p-1 border rounded text-center hover:text-purple-700 bg-purple-100"
    >Log out</a
  >
</section>
