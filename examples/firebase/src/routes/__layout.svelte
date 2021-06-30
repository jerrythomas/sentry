<script context="module">
  import { browser } from '$app/env'
  import { routes, config } from '../config'
  import { redirect } from '@jerrythomas/sentry'

  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load({ page, fetch, session, context }) {
    return browser ? redirect(routes, session?.lastLogin, page.path) : {}
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
