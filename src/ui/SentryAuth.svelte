<script>
  import AuthProvider from './AuthProvider.svelte'
  export let providers
</script>

<div class="flex flex-col space-y-3">
  <h1>Sign in with</h1>
  {#each providers as provider}
    <AuthProvider {...provider} />
  {/each}
</div>

<style lang="postcss">
  @import url('../global.css');
</style>
