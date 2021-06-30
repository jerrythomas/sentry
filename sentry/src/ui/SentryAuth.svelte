<script>
  import AuthProvider from './AuthProvider.svelte'
  export let providers
</script>

<div>
  <div class="flex flex-col space-y-3">
    <h1>Sign in with</h1>
    {#each providers as provider}
      <AuthProvider {...provider} />
    {/each}
  </div>
</div>

<style lang="postcss">
  :global(.google) {
    background-color: #ffffff;
    color: #757575;
  }
  :global(.github) {
    background-color: #333333;
    /* color: #ffffff; */
  }
  :global(.microsoft) {
    background-color: #2f2f2f;
    /* color: #ffffff; */
  }
  :global(.facebook) {
    background-color: #3b5998;
    /* color: #ffffff; */
  }

  :global(.twitter) {
    background-color: #55acee;
    /* color: #ffffff; */
  }
  :global(.apple) {
    background-color: black;
    /* color: #ffffff; */
  }
  :global(.mail) {
    background-color: #db4437;
    /* color: #ffffff; */
  }
  :global(.phone) {
    background-color: #02bd7e;
    /* color: #ffffff; */
  }
  :global(.anonymous) {
    background-color: #55acee;
    /* color: #ffffff; */
  }
</style>
