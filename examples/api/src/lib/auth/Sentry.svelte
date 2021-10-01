<script>
  import Provider from './Provider.svelte'
  export let providers
  export let action
</script>

<div class="flex flex-col space-y-3">
  <h1>Sign in with</h1>
  {#each Object.keys(providers) as name}
    <Provider {name} label={providers[name].label} {action} />
  {/each}
</div>

<style lang="postcss">
  @import url('./global.css');
</style>
