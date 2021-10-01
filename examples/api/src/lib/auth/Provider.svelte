<script>
  import Icon from '../components/Icon.svelte'
  import { icons } from './icons'

  export let name
  export let label
  export let action

  $: title = label.toLowerCase() === name ? 'Continue with ' + label : label
</script>

<form {action} method="get" class="flex w-full">
  <input type="hidden" name="provider" value={name} />
  <button
    type="submit"
    class="flex flex-row border rounded px-4 py-2 space-x-4 {name} w-full"
  >
    <Icon {title} icon={icons[name]} />
    <p class="flex flex-grow">{title}</p>
  </button>
</form>
