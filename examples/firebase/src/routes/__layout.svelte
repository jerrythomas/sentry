<script context="module">
  import { browser } from '$app/env'
  import { routes, config } from '../config'
  import { whereTo } from '@jerrythomas/sentry'

  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load({ page, fetch, session, context }) {
    const lastLogin = browser
      ? localStorage.getItem('lastLogin')
      : session?.lastLogin
    const location = whereTo(routes, lastLogin, page.path)

    if (location != page.path) return { status: 302, redirect: location }
    return {}
  }
</script>

<script>
  import '../app.postcss'
  import { onMount } from 'svelte'
  import { sentry } from '@jerrythomas/sentry/firebase'

  onMount(async () => {
    sentry.init(config, routes)
    sentry.watch()
  })
</script>

<slot />
