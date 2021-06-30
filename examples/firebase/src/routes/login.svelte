<script>
  import { sentry } from '@jerrythomas/sentry/firebase'
  import { SentryAuth } from '@jerrythomas/sentry'

  const providers = [
    {
      provider: 'google',
      label: 'Google',
      scopes: [],
      params: [],
      getLoginHandler: sentry.getLoginHandler,
    },
  ]
  const signIn = sentry.getLoginHandler('google')
</script>

<div
  class="flex flex-col flex-shrink items-center p-10 space-y-6 w-80 mt-10 rounded-xl shadow m-auto"
>
  <img src="/favicon.png" alt="Svelte Firebase Auth" />
  <SentryAuth {providers} />
</div>
