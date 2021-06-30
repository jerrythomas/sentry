<script>
  import Icon from './Icon.svelte'
  import { icons } from '../icons'

  export let provider
  export let label
  export let scopes = []
  export let params = []
  export let getLoginHandler

  const signIn = getLoginHandler(provider, scopes, params)

  $: title = label.toLowerCase() === provider ? 'Continue with ' + label : label
</script>

<button
  class="flex flex-row border rounded px-4 py-2 space-x-4 {provider}"
  on:click={signIn}
>
  <Icon {title} icon={icons[provider]} />
  <p class="flex flex-grow">{title}</p>
</button>
