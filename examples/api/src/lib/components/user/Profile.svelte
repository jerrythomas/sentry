<script>
  export let avatar
  export let name
</script>

<span class="flex flex-row w-full items-center">
  <img
    class="w-16 h-16 object-cover rounded-full border-2 border-white"
    alt={name}
    src={avatar}
  />
  <p class="flex-flex-grow p-4 font-semibold text-lg text-accent-900">
    {name}
  </p>
</span>
