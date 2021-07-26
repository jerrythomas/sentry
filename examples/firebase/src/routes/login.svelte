<script>
  import { SentryAuth } from '@jerrythomas/sentry'

  const providers = [
    {
      provider: 'google',
      label: 'Google',
      scopes: [],
      params: [],
    },
    {
      provider: 'microsoft',
      label: 'Microsoft',
      scopes: [],
      params: [{ prompt: 'consent', domain_hint: 'organizations' }],
    },
  ]
</script>

<div
  class="flex flex-col flex-shrink items-center p-10 space-y-6 mt-10 rounded-xl shadow m-auto"
>
  <img src="/sentry.svg" alt="Svelte Firebase Auth" />
  <SentryAuth {providers} />
</div>
