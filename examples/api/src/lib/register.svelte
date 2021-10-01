<script>
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()

  let error
  async function register() {
    error = undefined
    try {
      console.log('Calling register endpoint')
      const res = await fetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          email: 'a@b.com',
          name: 'a',
        }),
        headers: { 'Content-Type': 'application/json' },
      })

      if (res.ok) {
        const response = await res.json()
        console.log(response)
        dispatch('success')
      } else {
        error = 'An error occurred'
        console.error(error, res.body)
      }
    } catch (e) {
      error = 'An error occurred'
      console.error(e)
    }
  }
</script>

<button
  on:click={register}
  class="bg-primary-200 py-2 px-4 rounded-sm shadow-lg"
>
  Register
</button>

{#if error}
  <p>{error}</p>
{/if}
